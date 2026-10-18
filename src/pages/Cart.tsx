import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart, SHIPPING_OPTIONS, subtotal, orderTotal, formatRand, type ShippingMethod } from '../store/cart'
import { useStock } from '../store/stock'
import Field from '../components/Field'
import './Forms.css'

type Customer = { firstName: string; lastName: string; email: string; phone: string; address: string }
type Errors = Partial<Record<keyof Customer | 'terms', string>>

const EMPTY: Customer = { firstName: '', lastName: '', email: '', phone: '', address: '' }

function normPhone(raw: string) {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('27') && d.length === 11) d = '0' + d.slice(2)
  return /^0\d{9}$/.test(d) ? d : null
}

function validate(c: Customer, shipping: ShippingMethod, terms: boolean): Errors {
  const e: Errors = {}
  if (!c.firstName.trim()) e.firstName = 'Required'
  if (!c.lastName.trim()) e.lastName = 'Required'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email.trim())) e.email = 'Enter a valid email so we can send your receipt'
  if (!normPhone(c.phone)) e.phone = 'Enter a valid SA cell number, e.g. 082 123 4567'
  if (c.address.trim().length < 5)
    e.address = shipping === 'door' ? 'Enter your full delivery address' : 'Enter your suburb or preferred PUDO locker'
  if (!terms) e.terms = 'Please accept the terms to continue'
  return e
}

function redirectToPayFast(url: string, fields: Record<string, string>) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = url
  form.style.display = 'none'
  for (const [name, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') continue
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = String(value)
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
}

export default function Cart() {
  const { items, shipping, setQty, removeItem, setShipping } = useCart()
  const live = useStock((s) => s.live)
  const [customer, setCustomer] = useState<Customer>(EMPTY)
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  /* Keep quantities within live stock */
  useEffect(() => {
    for (const item of items) {
      const stock = live[item.id]?.stock
      if (stock !== undefined && stock > 0 && item.qty > stock) setQty(item.id, stock)
    }
  }, [items, live, setQty])

  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer((c) => ({ ...c, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const soldOut = items.filter((i) => (live[i.id]?.stock ?? 1) <= 0 || live[i.id]?.price === null)

  async function checkout(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    const found = validate(customer, shipping, terms)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      document.getElementById(first === 'terms' ? 'terms' : `k-${first}`)?.focus()
      return
    }
    if (soldOut.length) {
      setServerError(`Please remove ${soldOut.map((i) => i.name).join(', ')}. It has sold out.`)
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/.netlify/functions/payfast-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((i) => ({ id: i.id, qty: i.qty })), shipping, customer }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setServerError(data?.error ?? 'Something went wrong. Please try again.')
        setBusy(false)
        return
      }
      redirectToPayFast(data.process_url, data.fields)
    } catch {
      setServerError('Could not reach the payment service. Check your connection and try again.')
      setBusy(false)
    }
  }

  if (items.length === 0) {
    return (
      <main>
        <section className="page-hero page-hero-sm dark">
          <div className="container">
            <h1 className="page-title">Your cart is empty.</h1>
            <p className="page-lead">Our faucet filter is a good place to start.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop water filters
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const goods = subtotal(items)
  const total = orderTotal(items, shipping)

  return (
    <main>
      <section className="page-hero page-hero-sm dark">
        <div className="container">
          <h1 className="page-title">Checkout</h1>
          <ol className="checkout-steps">
            <li className="is-on">Cart and details</li>
            <li>Pay securely with PayFast</li>
            <li>Delivery</li>
          </ol>
        </div>
      </section>

      <section className="section section-tight">
        <form className="container checkout-grid" onSubmit={checkout} noValidate>
          <div className="checkout-main">
            <div className="card">
              <h2 className="card-title">Your order</h2>
              <ul className="cart-items">
                {items.map((item) => {
                  const stock = live[item.id]?.stock ?? 20
                  const out = stock <= 0
                  return (
                    <li className={`cart-item${out ? ' is-out' : ''}`} key={item.id}>
                      <img src={item.image} alt="" width="88" height="88" />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p>{out ? 'Sold out, please remove' : `${formatRand(item.price)} each`}</p>
                        <button type="button" className="text-btn" onClick={() => removeItem(item.id)}>
                          Remove
                        </button>
                      </div>
                      <div className="qty qty-sm">
                        <button type="button" aria-label={`Fewer ${item.name}`} onClick={() => setQty(item.id, item.qty - 1)}>
                          −
                        </button>
                        <span aria-live="polite">{item.qty}</span>
                        <button
                          type="button"
                          aria-label={`More ${item.name}`}
                          disabled={item.qty >= Math.min(20, stock)}
                          onClick={() => setQty(item.id, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <strong className="cart-item-total">{formatRand(item.price * item.qty)}</strong>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="card">
              <h2 className="card-title">Delivery</h2>
              <div className="ship-options" role="radiogroup" aria-label="Delivery method">
                {(Object.keys(SHIPPING_OPTIONS) as ShippingMethod[]).map((key) => (
                  <label key={key} className={`ship-option${shipping === key ? ' is-on' : ''}`}>
                    <input type="radio" name="shipping" checked={shipping === key} onChange={() => setShipping(key)} />
                    <span className="ship-radio" aria-hidden="true" />
                    <span className="ship-text">
                      <strong>{SHIPPING_OPTIONS[key].label}</strong>
                      <span>{SHIPPING_OPTIONS[key].blurb}</span>
                    </span>
                    <strong className="ship-price">{formatRand(SHIPPING_OPTIONS[key].price)}</strong>
                  </label>
                ))}
              </div>
              <Field
                id="k-address"
                label={shipping === 'door' ? 'Delivery address' : 'Your suburb or preferred PUDO locker'}
                error={errors.address}
                hint={
                  shipping === 'door'
                    ? 'Street address, suburb, city and postal code'
                    : 'e.g. "PUDO locker at Engen Bedfordview" or just "Edenvale". We will confirm the locker with you.'
                }
              >
                <textarea id="k-address" rows={3} value={customer.address} onChange={set('address')} autoComplete="street-address" />
              </Field>
            </div>

            <div className="card">
              <h2 className="card-title">Your details</h2>
              <div className="field-row">
                <Field id="k-firstName" label="First name" error={errors.firstName}>
                  <input id="k-firstName" value={customer.firstName} onChange={set('firstName')} autoComplete="given-name" />
                </Field>
                <Field id="k-lastName" label="Last name" error={errors.lastName}>
                  <input id="k-lastName" value={customer.lastName} onChange={set('lastName')} autoComplete="family-name" />
                </Field>
              </div>
              <div className="field-row">
                <Field id="k-email" label="Email" error={errors.email}>
                  <input id="k-email" type="email" value={customer.email} onChange={set('email')} autoComplete="email" />
                </Field>
                <Field id="k-phone" label="Cell number" error={errors.phone} hint="For delivery updates">
                  <input id="k-phone" type="tel" value={customer.phone} onChange={set('phone')} autoComplete="tel" placeholder="082 123 4567" />
                </Field>
              </div>
            </div>
          </div>

          <aside className="checkout-summary card">
            <h2 className="card-title">Summary</h2>
            <div className="sum-line">
              <span>Subtotal</span>
              <span>{formatRand(goods)}</span>
            </div>
            <div className="sum-line">
              <span>{SHIPPING_OPTIONS[shipping].label}</span>
              <span>{formatRand(SHIPPING_OPTIONS[shipping].price)}</span>
            </div>
            <div className="sum-line sum-total">
              <span>Total</span>
              <span>{formatRand(total)}</span>
            </div>

            <label className={`check${errors.terms ? ' has-error' : ''}`}>
              <input
                id="terms"
                type="checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked)
                  if (errors.terms) setErrors((x) => ({ ...x, terms: undefined }))
                }}
              />
              <span>
                I accept the <Link to="/terms" target="_blank">terms of sale</Link> and{' '}
                <Link to="/returns" target="_blank">returns policy</Link>.
              </span>
            </label>
            {errors.terms && <p className="field-error">{errors.terms}</p>}

            {(serverError || Object.keys(errors).some((k) => errors[k as keyof Errors])) && (
              <p className="form-alert" role="alert">
                {serverError ?? 'Please fix the highlighted fields.'}
              </p>
            )}

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={busy}>
              {busy ? 'Connecting to PayFast…' : `Pay ${formatRand(total)} securely`}
            </button>
            <p className="secure-note">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              Card, instant EFT and more through PayFast. We never see your card details.
            </p>
            <Link to="/products" className="text-btn">
              ← Continue shopping
            </Link>
          </aside>
        </form>
      </section>
    </main>
  )
}
