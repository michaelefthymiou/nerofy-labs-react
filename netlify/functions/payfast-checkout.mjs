import crypto from 'node:crypto'

/* ===================================================================
   PayFast checkout — builds and signs the payment request server-side.

   The browser NEVER sees the merchant key or passphrase, and never
   supplies prices. It sends product ids and quantities; this function
   looks the prices up from the trusted table below and computes the
   total itself. That means a tampered request can't buy a R299 filter
   for R1.

   Environment variables (set in Netlify → Site settings → Environment):
     PAYFAST_MODE          "sandbox" (default) or "live"
     PAYFAST_MERCHANT_ID   your numeric merchant id
     PAYFAST_MERCHANT_KEY  your merchant key
     PAYFAST_PASSPHRASE    your passphrase, if you set one
   =================================================================== */

/* Keep in sync with src/data/products.ts */
const CATALOG = {
  'tap-filter': { name: 'Countertop Faucet Filter', price: 299 },
  'shower-filter': { name: '15-Stage Shower Filter', price: 299 },
}

/* Keep in sync with SHIPPING_OPTIONS in src/store/cart.ts */
const SHIPPING = {
  locker: { label: 'PUDO locker collection', price: 60 },
  door: { label: 'Door delivery', price: 99 },
}

const SANDBOX = {
  process: 'https://sandbox.payfast.co.za/eng/process',
  merchant_id: '10000100',
  merchant_key: '46f0cd694581a',
}

const LIVE_PROCESS = 'https://www.payfast.co.za/eng/process'

/* PayFast signs fields in this exact order — not alphabetically.
   Changing the order produces a valid-looking but rejected signature. */
const FIELD_ORDER = [
  'merchant_id',
  'merchant_key',
  'return_url',
  'cancel_url',
  'notify_url',
  'name_first',
  'name_last',
  'email_address',
  'cell_number',
  'm_payment_id',
  'amount',
  'item_name',
  'item_description',
  'custom_int1',
  'custom_int2',
  'custom_int3',
  'custom_int4',
  'custom_int5',
  'custom_str1',
  'custom_str2',
  'custom_str3',
  'custom_str4',
  'custom_str5',
  'email_confirmation',
  'confirmation_address',
  'payment_method',
]

/* PHP's urlencode(), which is what PayFast hashes against.
   encodeURIComponent leaves ! ' ( ) * ~ alone and encodes spaces
   as %20 — PayFast expects those encoded, and spaces as '+'. */
function phpUrlencode(value) {
  return encodeURIComponent(String(value))
    .replace(/%20/g, '+')
    .replace(
      /[!'()*~]/g,
      (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase(),
    )
}

function signature(fields, passphrase) {
  const parts = []
  for (const key of FIELD_ORDER) {
    const value = fields[key]
    if (value === undefined || value === null || value === '') continue
    parts.push(`${key}=${phpUrlencode(String(value).trim())}`)
  }
  if (passphrase) parts.push(`passphrase=${phpUrlencode(passphrase.trim())}`)
  return crypto.createHash('md5').update(parts.join('&')).digest('hex')
}

const clean = (value, max) => String(value ?? '').trim().slice(0, max)

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { items = [], shipping = 'locker', customer = {} } = body

  /* ---- validate the cart ---- */
  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'Your cart is empty.' }, { status: 400 })
  }
  if (!SHIPPING[shipping]) {
    return Response.json({ error: 'Unknown delivery option.' }, { status: 400 })
  }

  let goods = 0
  const lines = []
  for (const item of items) {
    const product = CATALOG[item?.id]
    if (!product) {
      return Response.json(
        { error: `"${item?.id}" is not available for online purchase.` },
        { status: 400 },
      )
    }
    const qty = Number.parseInt(item?.qty, 10)
    if (!Number.isFinite(qty) || qty < 1 || qty > 20) {
      return Response.json(
        { error: 'Quantities must be between 1 and 20.' },
        { status: 400 },
      )
    }
    goods += product.price * qty
    lines.push(`${qty} x ${product.name}`)
  }

  /* ---- validate the customer ---- */
  const firstName = clean(customer.firstName, 100)
  const lastName = clean(customer.lastName, 100)
  const email = clean(customer.email, 100)
  const phone = clean(customer.phone, 20).replace(/[^\d+]/g, '')
  const address = clean(customer.address, 240)

  if (!firstName || !lastName) {
    return Response.json({ error: 'Please enter your name.' }, { status: 400 })
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }
  if (shipping === 'door' && address.length < 10) {
    return Response.json(
      { error: 'Please enter a delivery address.' },
      { status: 400 },
    )
  }

  /* ---- build the payment request ---- */
  const mode = (process.env.PAYFAST_MODE || 'sandbox').toLowerCase()
  const isLive = mode === 'live'

  const merchantId = process.env.PAYFAST_MERCHANT_ID || (isLive ? '' : SANDBOX.merchant_id)
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY || (isLive ? '' : SANDBOX.merchant_key)
  const passphrase = process.env.PAYFAST_PASSPHRASE || ''

  if (!merchantId || !merchantKey) {
    return Response.json(
      { error: 'Payments are not configured yet. Please contact us to order.' },
      { status: 500 },
    )
  }

  const total = goods + SHIPPING[shipping].price
  const origin = new URL(req.url).origin
  const reference = `NL-${Date.now().toString(36).toUpperCase()}`

  const fields = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${origin}/checkout/success`,
    cancel_url: `${origin}/cart`,
    notify_url: `${origin}/.netlify/functions/payfast-notify`,
    name_first: firstName,
    name_last: lastName,
    email_address: email,
    cell_number: phone,
    m_payment_id: reference,
    amount: total.toFixed(2),
    item_name: `Nerofy Labs order ${reference}`,
    item_description: `${lines.join(', ')} — ${SHIPPING[shipping].label}`,
    custom_str1: SHIPPING[shipping].label,
    custom_str2: address,
    custom_str3: lines.join(' | '),
    email_confirmation: '1',
    confirmation_address: email,
  }

  fields.signature = signature(fields, passphrase)

  return Response.json({
    process_url: isLive ? LIVE_PROCESS : SANDBOX.process,
    fields,
    reference,
    total,
    sandbox: !isLive,
  })
}
