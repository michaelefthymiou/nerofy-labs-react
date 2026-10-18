import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Seo from './components/Seo'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import { useCart } from './store/cart'
import { useStock } from './store/stock'
import { useRevealAll } from './hooks/useMotion'
import { SEO } from './seo'
import './index.css'

export default function App() {
  const location = useLocation()
  const path = location.pathname.replace(/(.)\/+$/, '$1')
  useRevealAll(path)

  useEffect(() => {
    useCart.persist.rehydrate()
    useStock.getState().load()
  }, [])

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1))
      const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
      return () => window.clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <>
      <Seo path={SEO[path] ? path : '404'} />
      <a href="#content" className="skip">Skip to content</a>
      <Navbar />
      <div id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/returns" element={<Legal page="returns" />} />
          <Route path="/terms" element={<Legal page="terms" />} />
          <Route path="/privacy" element={<Legal page="privacy" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}
