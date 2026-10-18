import { CATALOG, SHIPPING, getStock } from '../lib/store.mjs'
import { payfastConfig, signRequest } from '../lib/payfast.mjs'

/* ===================================================================
   Builds and signs the PayFast payment server-side.
   The browser only sends product ids and quantities. Prices and stock
   come from the Google Sheet (or the defaults), never from the browser.
   =================================================================== */

const clean = (v, max) =>
  String(v ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, max)

/* PayFast wants a 10-digit SA number like 0821234567 */
function normalisePhone(raw) {
  let d = String(raw ?? '').replace(/\D/g, '')
  if (d.startsWith('27') && d.length === 11) d = '0' + d.slice(2)
  return /^0\d{9}$/.test(d) ? d : null
}

const bad = (error, status = 400) => Response.json({ error }, { status })

export default async (req) => {
  if (req.method !== 'POST') return bad('Method not allowed', 405)

  let body
  try {
    body = await req.json()
  } catch {
    return bad('Invalid request.')
  }

  const { items = [], shipping = 'locker', customer = {} } = body

  if (!Array.isArray(items) || items.length === 0) return bad('Your cart is empty.')
  if (!SHIPPING[shipping]) return bad('Please choose a delivery option.')

  const { products } = await getStock({ maxAgeMs: 10_000 })

  let goods = 0
  const lines = []
  const codes = []
  for (const item of items) {
    const meta = CATALOG[item?.id]
    const live = products[item?.id]
    if (!meta || !live || live.price === null) {
      return bad(`${meta?.name ?? 'That product'} is not available to buy online.`)
    }
    const qty = Number.parseInt(item?.qty, 10)
    if (!Number.isFinite(qty) || qty < 1 || qty > 20) return bad('Quantities must be between 1 and 20.')
    if (live.stock < qty) {
      return bad(
        live.stock === 0
          ? `Sorry, the ${meta.name} has just sold out.`
          : `Only ${live.stock} ${meta.name} left. Please lower the quantity.`,
        409,
      )
    }
    goods += live.price * qty
    lines.push(`${qty} x ${meta.name}`)
    codes.push(`${item.id}:${qty}`)
  }

  const firstName = clean(customer.firstName, 100)
  const lastName = clean(customer.lastName, 100)
  const email = clean(customer.email, 100)
  const phone = normalisePhone(customer.phone)
  const address = clean(customer.address, 250)

  if (!firstName || !lastName) return bad('Please enter your first and last name.')
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad('Please enter a valid email address.')
  if (!phone) return bad('Please enter a valid South African cell number, e.g. 082 123 4567.')
  if (address.length < 5) {
    return bad(shipping === 'door' ? 'Please enter your delivery address.' : 'Please tell us your area or preferred PUDO locker.')
  }

  const cfg = payfastConfig()
  if (!cfg.merchantId || !cfg.merchantKey) {
    return bad('Online payments are not switched on yet. Please contact us to order.', 503)
  }

  const deliveryFee = SHIPPING[shipping].price
  const total = goods + deliveryFee
  const origin = new URL(req.url).origin
  const reference = `NL-${Date.now().toString(36).toUpperCase()}`

  const fields = {
    merchant_id: cfg.merchantId,
    merchant_key: cfg.merchantKey,
    return_url: `${origin}/checkout/success?ref=${reference}`,
    cancel_url: `${origin}/cart`,
    notify_url: `${origin}/.netlify/functions/payfast-notify`,
    name_first: firstName,
    name_last: lastName,
    email_address: email,
    cell_number: phone,
    m_payment_id: reference,
    amount: total.toFixed(2),
    item_name: `Nerofy Labs order ${reference}`,
    item_description: clean(`${lines.join(', ')} + ${SHIPPING[shipping].label}`, 255),
    custom_int1: String(deliveryFee),
    custom_str1: SHIPPING[shipping].label,
    custom_str2: address,
    custom_str3: clean(codes.join('|'), 255),
    custom_str4: clean(lines.join(', '), 255),
    custom_str5: phone,
  }

  fields.signature = signRequest(fields, cfg.passphrase)

  return Response.json({
    process_url: cfg.urls.process,
    fields,
    reference,
    total,
    sandbox: !cfg.isLive,
  })
}
