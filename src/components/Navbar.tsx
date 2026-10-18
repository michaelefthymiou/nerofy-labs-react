import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart, countItems } from '../store/cart'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  const count = useCart((s) => countItems(s.items))

  useEffect(() => setOpen(false), [location.pathname, location.hash])

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 12)
      setHidden(y > 320 && y > lastY + 4)
      if (y < lastY - 4 || y < 320) setHidden(false)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${hidden && !open ? ' is-hidden' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="Nerofy Labs home">
          <img src="/img/logo-ink.png" alt="" width="86" height="46" />
          <span>Nerofy Labs</span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          {LINKS.map((l) => (
            <NavLink key={l.label} to={l.to} end={l.to === '/'} className="nav-link">
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <Link to="/contact" className="btn btn-dark btn-sm nav-cta">
            Get in touch
          </Link>
          <Link to="/cart" className="nav-cart" aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.5 4.5h2.2l2.3 10.1a1.6 1.6 0 0 0 1.6 1.2h7.6a1.6 1.6 0 0 0 1.5-1.2L20.5 8H6.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="19.5" r="1.5" fill="currentColor" />
              <circle cx="17.5" cy="19.5" r="1.5" fill="currentColor" />
            </svg>
            {count > 0 && <span className="nav-cart-badge">{count}</span>}
          </Link>
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-drawer"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="nav-drawer" className="nav-drawer" aria-hidden={!open}>
        <nav aria-label="Mobile">
          {[...LINKS, { to: '/contact', label: 'Contact' }, { to: '/cart', label: `Cart${count ? ` (${count})` : ''}` }].map((l, i) => (
            <Link key={l.label} to={l.to} className="nav-drawer-link" style={{ ['--i' as string]: i }} tabIndex={open ? 0 : -1}>
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="nav-drawer-foot">
          <a href="mailto:info@nerofylabs.com">info@nerofylabs.com</a>
        </p>
      </div>
    </header>
  )
}
