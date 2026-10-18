import { Link } from 'react-router-dom'
import { useState } from 'react'
import { availability, canBuy, useStock } from '../store/stock'
import { useCart, formatRand } from '../store/cart'
import type { Product } from '../data/products'

export function StockPill({ id }: { id: string }) {
  const info = useStock((s) => s.live[id])
  const a = availability(info)
  const text =
    a === 'in-stock' ? 'In stock' : a === 'low' ? `Only ${info.stock} left` : a === 'out' ? 'Out of stock' : 'Quote on request'
  return (
    <span className={`stock stock-${a}`}>
      <span className="stock-dot" />
      {text}
    </span>
  )
}

export function Price({ id }: { id: string }) {
  const info = useStock((s) => s.live[id])
  if (!info || info.price === null) return <span className="price price-quote">Priced per installation</span>
  return <span className="price">{formatRand(info.price)}</span>
}

/** Add to cart when available, otherwise a route to the contact form. */
export function BuyButton({ product, qty = 1, full = false }: { product: Product; qty?: number; full?: boolean }) {
  const info = useStock((s) => s.live[product.id])
  const addItem = useCart((s) => s.addItem)
  const [added, setAdded] = useState(false)

  if (!canBuy(info)) {
    const label = availability(info) === 'out' ? 'Out of stock, get in touch' : 'Get a quote'
    return (
      <Link to={`/contact?product=${product.id}`} className={`btn btn-outline${full ? ' btn-full' : ''}`}>
        {label}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={`btn btn-primary${full ? ' btn-full' : ''}${added ? ' is-added' : ''}`}
      onClick={() => {
        addItem({ id: product.id, name: product.name, price: info.price as number, image: product.images[0].src }, qty)
        setAdded(true)
        window.setTimeout(() => setAdded(false), 1800)
      }}
    >
      {added ? 'Added to cart ✓' : 'Add to cart'}
    </button>
  )
}
