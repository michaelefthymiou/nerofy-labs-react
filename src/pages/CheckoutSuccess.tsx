import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../store/cart'

export default function CheckoutSuccess() {
  const clear = useCart((s) => s.clear)
  const [params] = useSearchParams()
  const ref = params.get('ref')

  /* The real proof of payment is PayFast's server notification, not this page. */
  useEffect(() => {
    clear()
  }, [clear])

  return (
    <main>
      <section className="page-hero dark success">
        <div className="container">
          <span className="success-icon" aria-hidden="true">✓</span>
          <h1 className="page-title">Thank you for your order.</h1>
          <p className="page-lead">
            {ref ? `Your order reference is ${ref}. ` : ''}A confirmation email is on its way. We will let you know as soon as your
            parcel is sent.
          </p>
          <div className="hero-actions">
            <Link to="/" className="btn btn-primary btn-lg">
              Back to home
            </Link>
            <Link to="/contact" className="btn btn-ghost btn-lg">
              Questions? Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
