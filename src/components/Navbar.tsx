import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

/* Links shown inside the mobile drawer, in order.
   The cart link gets added here in step 4. */
const MOBILE_LINKS = [
  { to: '/products', label: 'Products' },
  { to: '/products', label: 'Shop' },
  { to: '/#why', label: 'About' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close the drawer whenever the route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  // Stop the page scrolling behind the open drawer
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <img src="/logo.png" alt="Nerofy Labs" />
        <span className="nav-logo-text">Nerofy Labs</span>
      </Link>

      <div className="nav-right">
        <div className="nav-links">
          <Link to="/products">Products</Link>
          <Link to="/#why">About</Link>
          <Link to="/contact" className="nav-cta">Get in Touch</Link>
        </div>

        <div className="nav-actions">
          {/* Cart button slots in here in step 4 */}
          <button
            type="button"
            className={`nav-burger${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="nav-drawer"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={`nav-backdrop${menuOpen ? ' is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        id="nav-drawer"
        className={`nav-drawer${menuOpen ? ' is-open' : ''}`}
        hidden={!menuOpen}
      >
        {MOBILE_LINKS.map((link) => (
          <Link key={link.label} to={link.to} className="nav-drawer-link">
            {link.label}
          </Link>
        ))}
        <Link to="/contact" className="nav-drawer-cta">
          Get in Touch
        </Link>
      </div>
    </nav>
  )
}
