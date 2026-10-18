import { payfastConfig, signPairs } from '../lib/payfast.mjs'
import { postToSheet } from '../lib/store.mjs'

/* ===================================================================
   PayFast ITN: PayFast calls this server-to-server after payment.
   1. Check the signature.  2. Ask PayFast to confirm it.
   3. On COMPLETE: log the order in the Google Sheet, take it off
      stock, and email you + the customer (done by the Apps Script).
   Always answer 200, otherwise PayFast keeps retrying.
   =================================================================== */

export default async (req) => {
  const ok = () => new Response('', { status: 200 })
  if (req.method !== 'POST') return ok()

  try {
    const raw = await req.text()
    const pairs = [...new URLSearchParams(raw).entries()]
    const data = Object.fromEntries(pairs)
    const cfg = payfastConfig()

    if (signPairs(pairs, cfg.passphrase) !== data.signature) {
      console.warn('[payfast-notify] REJECTED signature mismatch', data.m_payment_id)
      return ok()
    }

    const verify = await fetch(cfg.urls.validate, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: raw,
      signal: AbortSignal.timeout(8000),
    })
    const verdict = (await verify.text()).trim()
    if (!verdict.startsWith('VALID')) {
      console.warn('[payfast-notify] REJECTED by PayFast:', verdict, data.m_payment_id)
      return ok()
    }

    if (data.payment_status !== 'COMPLETE') {
      console.log('[payfast-notify] status', data.payment_status, data.m_payment_id)
      return ok()
    }

    const items = String(data.custom_str3 || '')
      .split('|')
      .map((s) => s.split(':'))
      .filter(([id, q]) => id && q)
      .map(([id, q]) => ({ id, qty: Number(q) }))

    const order = {
      type: 'order',
      sandbox: !cfg.isLive,
      reference: data.m_payment_id,
      payfastId: data.pf_payment_id,
      status: data.payment_status,
      name: `${data.name_first ?? ''} ${data.name_last ?? ''}`.trim(),
      email: data.email_address,
      phone: data.custom_str5 || '',
      delivery: data.custom_str1,
      deliveryFee: Number(data.custom_int1 || 0),
      address: data.custom_str2,
      itemsText: data.custom_str4,
      items,
      amount: Number(data.amount_gross),
      fee: Number(data.amount_fee || 0),
      net: Number(data.amount_net || 0),
    }

    console.log('[payfast-notify] PAID', order)
    const result = await postToSheet(order)
    if (!result.ok) console.error('[payfast-notify] ORDER NOT LOGGED, handle manually', result, order)
  } catch (err) {
    console.error('[payfast-notify] error', err)
  }

  return ok()
}
