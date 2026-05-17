 import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <img src="/logo.png" alt="Nerofy Labs" />
        <span className="nav-logo-text">Nerofy Labs</span>
      </Link>
      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/#why">About</Link>
        <Link to="/contact" className="nav-cta">Get in Touch</Link>
      </div>
    </nav>
  )
}