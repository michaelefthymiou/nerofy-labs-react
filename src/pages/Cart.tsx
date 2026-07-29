import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useCart,
  SHIPPING_OPTIONS,
  subtotal,
  orderTotal,
  formatRand,
  type ShippingMethod,
} from '../store/cart'
/* Contact.css owns .page-header, .light-divider, .footer and the form
   controls this page reuses. CSS is global once imported, but it has to
   be imported by a module that's actually loaded — otherwise landing
   directly on /cart would render unstyled. */
import './Contact.css'
import './Cart.css'

type Customer = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
}

const EMPTY: Customer = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
}

/** Posts the signed field set to PayFast as a real form submission. */
function redirectToPayFast(processUrl: string, fields: Record<string, string>) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = processUrl
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
  const items = useCart((s) => s.items)
  const shipping = useCart((s) => s.shipping)
  const setQty = useCart((s) => s.setQty)
  const removeItem = useCart((s) => s.removeItem)
  const setShipping = useCart((s) => s.setShipping)

  const [customer, setCustomer] = useState<Customer>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const update =
    (field: keyof Customer) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setCustomer((c) => ({ ...c, [field]: e.target.value }))

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)

    try {
      const res = await fetch('/.netlify/functions/payfast-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
          shipping,
          customer,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error ?? 'Something went wrong. Please try again.')
        setBusy(false)
        return
      }

      redirectToPayFast(data.process_url, data.fields)
    } catch {
      setError(
        'Could not reach the payment service. Check your connection and try again.',
      )
      setBusy(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <div className="page-header">
          <div className="page-header-grid"></div>
          <div className="page-header-beam"></div>
          <div className="page-header-content">
            <div className="page-header-eyebrow">
              <div className="page-header-eyebrow-line"></div>
              <span>Your Cart</span>
            </div>
            <h1 className="page-header-title">
              Nothing here <em>yet</em>
            </h1>
          </div>
        </div>

        <div className="light-divider"></div>

        <section className="cart-section cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/products" className="form-submit">
            Browse Systems <span className="form-submit-arrow">↗</span>
          </Link>
        </section>
      </>
    )
  }

  const goods = subtotal(items)
  const total = orderTotal(items, shipping)

  return (
    <>
      <div className="page-header">
        <div className="page-header-grid"></div>
        <div className="page-header-beam"></div>
        <div className="page-header-content">
          <div className="page-header-eyebrow">
            <div className="page-header-eyebrow-line"></div>
            <span>Your Cart</span>
          </div>
          <h1 className="page-header-title">
            Review your <em>order</em>
          </h1>
        </div>
      </div>

      <div className="light-divider"></div>

      <section className="cart-section">
        <div className="cart-grid">
          {/* ---------------- items + details ---------------- */}
          <div className="cart-main">
            <ul className="cart-items">
              {items.map((item) => (
                <li className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-info">
                    <h2>{item.name}</h2>
                    <p className="cart-item-price">
                      {formatRand(item.price)} each
                    </p>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="cart-qty">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => setQty(item.id, item.qty - 1)}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.qty}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => setQty(item.id, Math.min(item.qty + 1, 20))}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    {formatRand(item.price * item.qty)}
                  </div>
                </li>
              ))}
            </ul>

            <form className="cart-form" onSubmit={handleCheckout}>
              <h2 className="cart-block-title">Delivery</h2>

              <div className="cart-shipping">
                {(Object.keys(SHIPPING_OPTIONS) as ShippingMethod[]).map(
                  (key) => (
                    <label
                      key={key}
                      className={`cart-ship-option${
                        shipping === key ? ' is-selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={key}
                        checked={shipping === key}
                        onChange={() => setShipping(key)}
                      />
                      <span className="cart-ship-label">
                        {SHIPPING_OPTIONS[key].label}
                      </span>
                      <span className="cart-ship-blurb">
                        {SHIPPING_OPTIONS[key].blurb}
                      </span>
                      <span className="cart-ship-price">
                        {formatRand(SHIPPING_OPTIONS[key].price)}
                      </span>
                    </label>
                  ),
                )}
              </div>

              <h2 className="cart-block-title">Your details</h2>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    className="form-input"
                    value={customer.firstName}
                    onChange={update('firstName')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    className="form-input"
                    value={customer.lastName}
                    onChange={update('lastName')}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={customer.email}
                    onChange={update('email')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    value={customer.phone}
                    onChange={update('phone')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  {shipping === 'door'
                    ? 'Delivery Address'
                    : 'Preferred PUDO Locker / Area'}
                </label>
                <textarea
                  id="address"
                  className="form-input form-textarea"
                  value={customer.address}
                  onChange={update('address')}
                  required={shipping === 'door'}
                  placeholder={
                    shipping === 'door'
                      ? 'Street, suburb, city, postal code'
                      : 'e.g. PUDO locker at Engen Rivonia, or just your suburb'
                  }
                />
              </div>

              {error && (
                <p className="cart-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="form-submit" disabled={busy}>
                {busy ? 'Preparing…' : `Pay ${formatRand(total)}`}
                <span className="form-submit-arrow">↗</span>
              </button>

              <p className="cart-secure">
                You'll be redirected to PayFast to complete payment securely.
                We never see your card details.
              </p>
            </form>
          </div>

          {/* ---------------- summary ---------------- */}
          <aside className="cart-summary">
            <h2 className="cart-block-title">Summary</h2>

            <div className="cart-line">
              <span>Subtotal</span>
              <span>{formatRand(goods)}</span>
            </div>
            <div className="cart-line">
              <span>{SHIPPING_OPTIONS[shipping].label}</span>
              <span>{formatRand(SHIPPING_OPTIONS[shipping].price)}</span>
            </div>
            <div className="cart-line cart-line-total">
              <span>Total</span>
              <span>{formatRand(total)}</span>
            </div>

            <Link to="/products" className="cart-continue">
              ← Continue shopping
            </Link>
          </aside>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">
          <img src="/logo.png" alt="Nerofy Labs" />
          <span>Nerofy Labs</span>
        </div>
        <span className="footer-copy">
          © 2026 Nerofy Labs. All rights reserved.
        </span>
      </footer>
    </>
  )
}
