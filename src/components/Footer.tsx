import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/img/logo-silver.webp" alt="Nerofy Labs logo" width="120" height="81" loading="lazy" />
          <p className="footer-name">Nerofy Labs</p>
          <p>
            Water filters and water purification systems for South African homes. Faucet filters, shower filters and
            reverse osmosis, engineered in Johannesburg and delivered nationwide.
          </p>
        </div>
        <div>
          <p className="footer-head">Shop</p>
          <Link to="/products#faucet-filter">Faucet water filter</Link>
          <Link to="/products#shower-filter">Shower filter</Link>
          <Link to="/products#undersink-ro">Undersink reverse osmosis</Link>
          <Link to="/contact">Whole home systems</Link>
        </div>
        <div>
          <p className="footer-head">Company</p>
          <Link to="/#how-it-works">How filtration works</Link>
          <Link to="/#faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <a href="mailto:info@nerofylabs.com">info@nerofylabs.com</a>
        </div>
        <div>
          <p className="footer-head">Policies</p>
          <Link to="/returns">Returns and warranty</Link>
          <Link to="/terms">Terms of sale</Link>
          <Link to="/privacy">Privacy (POPIA)</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {2026} Nerofy Labs (Pty) Ltd. Reg. 2026/325187/07. Johannesburg, Gauteng.</span>
        <span className="footer-pay">Secure payments by PayFast</span>
      </div>
    </footer>
  )
}
