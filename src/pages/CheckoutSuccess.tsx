import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cart'
import './Contact.css'
import './Cart.css'

export default function CheckoutSuccess() {
  const clear = useCart((s) => s.clear)

  /* PayFast sends the buyer back here after a successful payment, so the
     cart has served its purpose. The authoritative record of the payment
     is the ITN callback, not this page — a customer could reach this URL
     directly, so nothing here should be treated as proof of payment. */
  useEffect(() => {
    clear()
  }, [clear])

  return (
    <>
      <div className="page-header">
        <div className="page-header-grid"></div>
        <div className="page-header-beam"></div>
        <div className="page-header-content">
          <div className="page-header-eyebrow">
            <div className="page-header-eyebrow-line"></div>
            <span>Order Received</span>
          </div>
          <h1 className="page-header-title">
            Thank you for <em>your order</em>
          </h1>
          <p className="page-header-sub">
            Your payment has been submitted to PayFast. You'll receive a
            confirmation email shortly, and we'll be in touch with your
            delivery details.
          </p>
        </div>
      </div>

      <div className="light-divider"></div>

      <section className="cart-section cart-empty">
        <p>
          Any questions about your order? Get in touch and quote your PayFast
          reference.
        </p>
        <Link to="/contact" className="form-submit">
          Contact Us <span className="form-submit-arrow">↗</span>
        </Link>
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
