import crypto from 'node:crypto'

/* ===================================================================
   PayFast ITN (Instant Transaction Notification) receiver.

   PayFast POSTs here server-to-server after a payment. This endpoint
   must return 200 quickly or PayFast will retry.

   It performs the two checks PayFast requires before you may treat a
   payment as real:
     1. Recompute the signature over the posted fields.
     2. Post the data back to PayFast, which replies VALID or INVALID.

   Right now a verified payment is only logged — you can read it in
   Netlify → Functions → payfast-notify. Wire up an order email or a
   database here when you're ready.
   =================================================================== */

const VALIDATE_URL = {
  sandbox: 'https://sandbox.payfast.co.za/eng/query/validate',
  live: 'https://www.payfast.co.za/eng/query/validate',
}

function phpUrlencode(value) {
  return encodeURIComponent(String(value))
    .replace(/%20/g, '+')
    .replace(
      /[!'()*~]/g,
      (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase(),
    )
}

/* For ITN the signature covers the posted fields in the order received,
   excluding the signature field itself. */
function itnSignature(pairs, passphrase) {
  const parts = pairs
    .filter(([key]) => key !== 'signature')
    .map(([key, value]) => `${key}=${phpUrlencode(String(value).trim())}`)
  if (passphrase) parts.push(`passphrase=${phpUrlencode(passphrase.trim())}`)
  return crypto.createHash('md5').update(parts.join('&')).digest('hex')
}

export default async (req) => {
  /* Always 200 — PayFast retries on anything else, and a retry storm
     is worse than a dropped notification we can find in the logs. */
  const ok = () => new Response('', { status: 200 })

  if (req.method !== 'POST') return ok()

  try {
    const raw = await req.text()
    const params = new URLSearchParams(raw)
    const pairs = [...params.entries()]
    const data = Object.fromEntries(pairs)

    const isLive = (process.env.PAYFAST_MODE || 'sandbox').toLowerCase() === 'live'
    const passphrase = process.env.PAYFAST_PASSPHRASE || ''

    /* Check 1 — signature */
    const expected = itnSignature(pairs, passphrase)
    if (expected !== data.signature) {
      console.warn('[payfast-notify] REJECTED: signature mismatch', {
        reference: data.m_payment_id,
      })
      return ok()
    }

    /* Check 2 — ask PayFast to confirm it sent this */
    const verify = await fetch(VALIDATE_URL[isLive ? 'live' : 'sandbox'], {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: raw,
    })
    const verdict = (await verify.text()).trim()
    if (!verdict.startsWith('VALID')) {
      console.warn('[payfast-notify] REJECTED: PayFast returned', verdict, {
        reference: data.m_payment_id,
      })
      return ok()
    }

    if (data.payment_status === 'COMPLETE') {
      console.log('[payfast-notify] PAID', {
        reference: data.m_payment_id,
        payfastId: data.pf_payment_id,
        amount: data.amount_gross,
        name: `${data.name_first ?? ''} ${data.name_last ?? ''}`.trim(),
        email: data.email_address,
        delivery: data.custom_str1,
        address: data.custom_str2,
        items: data.custom_str3,
      })
    } else {
      console.log('[payfast-notify] status', data.payment_status, {
        reference: data.m_payment_id,
      })
    }
  } catch (err) {
    console.error('[payfast-notify] error', err)
  }

  return ok()
}
