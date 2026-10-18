import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products } from '../data/products'
import { Eyebrow, Words, delay } from '../components/motion'
import Field from '../components/Field'
import './Forms.css'

type Form = { name: string; email: string; phone: string; interest: string; message: string; company: string }
type Errors = Partial<Record<keyof Form, string>>

const INTERESTS = [...products.map((p) => p.name), 'Whole home reverse osmosis', 'Not sure, need advice']

function validate(f: Form): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'Please tell us your name.'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) e.email = 'Please enter a valid email address.'
  if (f.message.trim().length < 5) e.message = 'Please add a short message.'
  return e
}

export default function Contact() {
  const [params] = useSearchParams()
  const preset = products.find((p) => p.id === params.get('product'))
  const [form, setForm] = useState<Form>({
    name: '',
    email: '',
    phone: '',
    interest: preset?.name ?? '',
    message: preset && preset.price !== null ? `Please let me know when the ${preset.name} is back in stock.` : '',
    company: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`c-${Object.keys(found)[0]}`)?.focus()
      return
    }
    setState('sending')
    try {
      const res = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setState('sent')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }

  return (
    <main>
      <section className="page-hero dark">
        <div className="container">
          <Eyebrow light>Contact</Eyebrow>
          <h1 className="page-title">
            <Words text="Let’s sort out" />
            <Words text="your water." className="em" start={0.2} />
          </h1>
          <p className="page-lead reveal" style={delay(0.3)}>
            Questions about a filter, an order, or a reverse osmosis installation in Johannesburg? Send a message and we
            reply within one working day.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <aside className="contact-side reveal">
            <h2>Talk to an engineer</h2>
            <p>
              Every message is answered by the person who chooses the products, so you get a straight answer about what
              your home actually needs.
            </p>
            <dl className="contact-details">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:info@nerofylabs.com">info@nerofylabs.com</a>
                </dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>Johannesburg, Gauteng</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>Anywhere in South Africa via PUDO</dd>
              </div>
              <div>
                <dt>Installations</dt>
                <dd>Gauteng, by appointment</dd>
              </div>
            </dl>
          </aside>

          <div className="card form-card reveal" style={delay(0.1)}>
            {state === 'sent' ? (
              <div className="form-done" role="status">
                <span className="form-done-icon" aria-hidden="true">✓</span>
                <h2>Message sent</h2>
                <p>Thanks {form.name.split(' ')[0]}. We will get back to you at {form.email} within one working day.</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="field-row">
                  <Field id="c-name" label="Your name" error={errors.name}>
                    <input id="c-name" value={form.name} onChange={set('name')} autoComplete="name" />
                  </Field>
                  <Field id="c-phone" label="Phone (optional)">
                    <input id="c-phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                  </Field>
                </div>
                <Field id="c-email" label="Email" error={errors.email}>
                  <input id="c-email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                </Field>
                <Field id="c-interest" label="I am interested in">
                  <select id="c-interest" value={form.interest} onChange={set('interest')}>
                    <option value="">Choose one</option>
                    {INTERESTS.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </Field>
                <Field id="c-message" label="Message" error={errors.message}>
                  <textarea id="c-message" rows={5} value={form.message} onChange={set('message')} />
                </Field>
                <input
                  className="hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.company}
                  onChange={set('company')}
                  name="company"
                />
                {state === 'error' && (
                  <p className="form-alert" role="alert">
                    {serverError}
                  </p>
                )}
                <button type="submit" className="btn btn-dark btn-lg btn-full" disabled={state === 'sending'}>
                  {state === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
