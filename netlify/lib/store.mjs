/* ===================================================================
   Shared catalogue + Google Sheet access for the Netlify functions.

   The Google Sheet is the source of truth for price and stock once
   GOOGLE_SCRIPT_URL is set. Until then (or if Google is unreachable)
   the defaults below are used, so the shop never breaks.
   =================================================================== */

export const CATALOG = {
  'tap-filter': { name: 'Countertop Faucet Filter', price: 299, stock: 50 },
  'shower-filter': { name: '15-Stage Shower Filter', price: 299, stock: 0 },
  'undersink-ro': { name: '5-Stage Undersink RO System', price: null, stock: 0 },
}

/* Keep in sync with SHIPPING_OPTIONS in src/store/cart.ts */
export const SHIPPING = {
  locker: { label: 'PUDO locker collection', price: 60 },
  door: { label: 'Door delivery', price: 99 },
}

const SCRIPT_URL = () => (process.env.GOOGLE_SCRIPT_URL || '').trim()
const SECRET = () => (process.env.ORDER_SECRET || '').trim()

export const sheetConfigured = () => Boolean(SCRIPT_URL())

let cache = { at: 0, data: null }

function defaults() {
  const out = {}
  for (const [id, p] of Object.entries(CATALOG)) out[id] = { price: p.price, stock: p.stock }
  return out
}

/** Returns { products: { id: { price, stock } }, source } */
export async function getStock({ maxAgeMs = 30_000 } = {}) {
  if (!sheetConfigured()) return { products: defaults(), source: 'default' }
  if (cache.data && Date.now() - cache.at < maxAgeMs) return cache.data

  try {
    const res = await fetch(SCRIPT_URL(), { signal: AbortSignal.timeout(7000) })
    const json = await res.json()
    const products = defaults()
    for (const row of json.products || []) {
      const id = String(row.id || '').trim()
      if (!products[id]) continue
      const price = row.price === '' || row.price === null ? null : Number(row.price)
      const stock = Math.max(0, Math.floor(Number(row.stock) || 0))
      products[id] = { price: Number.isFinite(price) ? price : null, stock }
    }
    cache = { at: Date.now(), data: { products, source: 'sheet' } }
    return cache.data
  } catch (err) {
    console.error('[store] could not read Google Sheet, using defaults', err)
    return cache.data || { products: defaults(), source: 'default' }
  }
}

/** Sends an order or enquiry to the Google Apps Script web app. */
export async function postToSheet(payload) {
  if (!sheetConfigured()) {
    console.warn('[store] GOOGLE_SCRIPT_URL not set, nothing sent', payload.type)
    return { ok: false, error: 'not-configured' }
  }
  const res = await fetch(SCRIPT_URL(), {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...payload, secret: SECRET() }),
    redirect: 'follow',
    signal: AbortSignal.timeout(9000),
  })
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { ok: false, error: 'bad-response', detail: text.slice(0, 300) }
  }
}
