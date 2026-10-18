import crypto from 'node:crypto'

/* PayFast's public sandbox merchant. The passphrase is required:
   leaving it out was the cause of the old 400 error. */
export const SANDBOX = {
  process: 'https://sandbox.payfast.co.za/eng/process',
  validate: 'https://sandbox.payfast.co.za/eng/query/validate',
  merchant_id: '10000100',
  merchant_key: '46f0cd694581a',
  passphrase: 'jt7NOE43FZPn',
}

export const LIVE = {
  process: 'https://www.payfast.co.za/eng/process',
  validate: 'https://www.payfast.co.za/eng/query/validate',
}

export function payfastConfig() {
  const isLive = (process.env.PAYFAST_MODE || 'sandbox').trim().toLowerCase() === 'live'
  const envId = (process.env.PAYFAST_MERCHANT_ID || '').trim()
  const envKey = (process.env.PAYFAST_MERCHANT_KEY || '').trim()
  const envPass = (process.env.PAYFAST_PASSPHRASE || '').trim()

  if (isLive) {
    return { isLive, merchantId: envId, merchantKey: envKey, passphrase: envPass, urls: LIVE }
  }
  /* Sandbox: use your own sandbox account if you've set one, else the public one. */
  if (envId && envKey) {
    return { isLive, merchantId: envId, merchantKey: envKey, passphrase: envPass, urls: SANDBOX }
  }
  return {
    isLive,
    merchantId: SANDBOX.merchant_id,
    merchantKey: SANDBOX.merchant_key,
    passphrase: SANDBOX.passphrase,
    urls: SANDBOX,
  }
}

/* PHP urlencode(), which is what PayFast hashes against. */
export function phpUrlencode(value) {
  return encodeURIComponent(String(value))
    .replace(/%20/g, '+')
    .replace(/[!'()*~]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
}

/* Fields must be signed in PayFast's documented order, not alphabetically. */
export const FIELD_ORDER = [
  'merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url',
  'name_first', 'name_last', 'email_address', 'cell_number',
  'm_payment_id', 'amount', 'item_name', 'item_description',
  'custom_int1', 'custom_int2', 'custom_int3', 'custom_int4', 'custom_int5',
  'custom_str1', 'custom_str2', 'custom_str3', 'custom_str4', 'custom_str5',
  'email_confirmation', 'confirmation_address', 'payment_method',
]

export function signPairs(pairs, passphrase) {
  const parts = pairs
    .filter(([k, v]) => k !== 'signature' && v !== undefined && v !== null && String(v) !== '')
    .map(([k, v]) => `${k}=${phpUrlencode(String(v).trim())}`)
  if (passphrase) parts.push(`passphrase=${phpUrlencode(passphrase)}`)
  return crypto.createHash('md5').update(parts.join('&')).digest('hex')
}

export function signRequest(fields, passphrase) {
  return signPairs(FIELD_ORDER.map((k) => [k, fields[k]]), passphrase)
}
