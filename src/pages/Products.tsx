import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products, type Product } from '../data/products'
import { BuyButton, Price, StockPill } from '../components/Stock'
import { Eyebrow, Words, delay } from '../components/motion'
import { canBuy, useStock } from '../store/stock'
import './Products.css'

function Gallery({ product, eager }: { product: Product; eager: boolean }) {
  const [active, setActive] = useState(0)
  return (
    <div className="gallery">
      <div className="gallery-main">
        {product.images.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            width="900"
            height="900"
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager && i === 0 ? 'high' : undefined}
            decoding="async"
            className={i === active ? 'is-active' : ''}
          />
        ))}
        <StockPill id={product.id} />
      </div>
      <div className="gallery-thumbs" role="tablist" aria-label={`${product.name} photos`}>
        {product.images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? 'is-active' : ''}
            onClick={() => setActive(i)}
          >
            <img src={img.src} alt="" width="120" height="120" loading="lazy" />
            <span>{img.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Qty({ value, onChange, max }: { value: number; onChange: (n: number) => void; max: number }) {
  return (
    <div className="qty" aria-label="Quantity">
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} aria-label="Decrease quantity">
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase quantity">
        +
      </button>
    </div>
  )
}

function ProductBlock({ product, index }: { product: Product; index: number }) {
  const info = useStock((s) => s.live[product.id])
  const [qty, setQty] = useState(1)
  const buyable = canBuy(info)
  const max = Math.max(1, Math.min(20, info?.stock ?? 1))

  return (
    <article className={`pblock${index % 2 ? ' pblock-flip' : ''}`} id={product.slug}>
      <div className="reveal">
        <Gallery product={product} eager={index === 0} />
      </div>
      <div className="pblock-info reveal" style={delay(0.12)}>
        <p className="pblock-cat">{product.category}</p>
        <h2>{product.name}</h2>
        <p className="pblock-tag">{product.tagline}</p>
        <div className="pblock-price">
          <Price id={product.id} />
          {buyable && <span className="pblock-vat">Plus delivery from R60</span>}
        </div>
        <p className="pblock-desc">{product.desc}</p>
        <ul className="pblock-bullets">
          {product.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="pblock-buy">
          {buyable && <Qty value={Math.min(qty, max)} onChange={setQty} max={max} />}
          <BuyButton product={product} qty={Math.min(qty, max)} />
        </div>
        <ul className="pblock-specs">
          {product.specs.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default function Products() {
  return (
    <main>
      <section className="page-hero dark">
        <div className="container">
          <Eyebrow light>Shop water filters</Eyebrow>
          <h1 className="page-title">
            <Words text="Water filters for" />
            <Words text="every tap." className="em" start={0.2} />
          </h1>
          <p className="page-lead reveal" style={delay(0.3)}>
            A faucet filter for drinking water, a shower filter for skin and hair, and reverse osmosis when you want the
            purest water possible. Delivered anywhere in South Africa.
          </p>
          <nav className="page-jump reveal" style={delay(0.4)} aria-label="Products">
            {products.map((p) => (
              <a key={p.id} href={`#${p.slug}`}>
                {p.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="container pblocks">
          {products.map((p, i) => (
            <ProductBlock product={p} index={i} key={p.id} />
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container help-band reveal">
          <div>
            <h2>Not sure which one you need?</h2>
            <p>Tell us about your home and water. We will recommend the simplest system that solves it, free.</p>
          </div>
          <Link to="/contact" className="btn btn-dark btn-lg">
            Get free advice
          </Link>
        </div>
      </section>
    </main>
  )
}
