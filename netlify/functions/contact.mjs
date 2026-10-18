import { postToSheet } from '../lib/store.mjs'

const clean = (v, max) => String(v ?? '').trim().slice(0, max)

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  /* Honeypot: real people never fill this hidden field. */
  if (clean(body.company, 100)) return Response.json({ ok: true })

  const enquiry = {
    type: 'enquiry',
    name: clean(body.name, 120),
    email: clean(body.email, 120),
    phone: clean(body.phone, 30),
    interest: clean(body.interest, 80),
    message: clean(body.message, 3000),
  }

  if (!enquiry.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(enquiry.email) || !enquiry.message) {
    return Response.json(
      { error: 'Please add your name, a valid email and a message.' },
      { status: 400 },
    )
  }

  try {
    const result = await postToSheet(enquiry)
    if (!result.ok) throw new Error(result.error || 'sheet error')
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[contact] failed', err, enquiry)
    return Response.json(
      { error: 'Our form is having trouble. Please email info@nerofylabs.com instead.' },
      { status: 502 },
    )
  }
}
