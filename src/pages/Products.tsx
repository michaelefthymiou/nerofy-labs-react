import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { useCart, formatRand } from '../store/cart'
import './Products.css'

export default function Products() {
  const addItem = useCart((s) => s.addItem)
  const [justAdded, setJustAdded] = useState<string | null>(null)

  function handleAdd(id: string, name: string, price: number, image: string) {
    addItem({ id, name, price, image })
    setJustAdded(id)
    window.setTimeout(
      () => setJustAdded((current) => (current === id ? null : current)),
      1800,
    )
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-grid"></div>
        <div className="page-header-beam"></div>
        <div className="page-header-corner"></div>
        <div className="page-header-corner-br"></div>
        <div className="page-header-content">
          <div className="page-header-eyebrow">
            <div className="page-header-eyebrow-line"></div>
            <span>Our Systems</span>
          </div>
          <h1 className="page-header-title">Filtration for<br /><em>every need</em></h1>
          <p className="page-header-sub">Three systems. Each specified, supplied and professionally installed by us — for clean water at every point in your home.</p>
        </div>
      </div>

      <div className="light-divider"></div>

      <section className="products-section">
        {products.map((product, index) => (
          <div className={`product-block ${index % 2 === 1 ? 'product-block-reverse' : ''}`} key={product.num}>
            <div className="product-images">
              <div className="product-images-inner">
                {product.images.map((img, i) => (
                  <div className={`product-img-wrap ${i === 0 ? 'product-img-first' : ''}`} key={i}>
                    <img src={img} alt={`${product.name} view ${i + 1}`} />
                    <span className="img-label">{product.labels[i]}</span>
                    <div className="product-img-num">0{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="product-info">
              <div className="product-info-corner"></div>
              <div className="product-info-corner-bl"></div>
              <p className="product-num-label">System {product.num} — {product.category}</p>
              <h2 className="product-name">{product.name.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}</h2>
              <div className="product-divider"></div>
              <p className="product-desc-text">{product.desc}</p>
              <div className="product-specs">
                {product.specs.map((spec, i) => (
                  <span className={`spec-pill ${i === 0 ? 'spec-pill-accent' : ''}`} key={i}>{spec}</span>
                ))}
              </div>
              {product.price === null ? (
                <Link to="/contact" className="product-cta">
                  Enquire Now <span className="product-cta-arrow">↗</span>
                </Link>
              ) : (
                <div className="product-buy">
                  <span className="product-price">
                    {formatRand(product.price)}
                  </span>
                  <button
                    type="button"
                    className="product-cta"
                    onClick={() =>
                      handleAdd(
                        product.id,
                        product.shortName,
                        product.price as number,
                        product.images[0],
                      )
                    }
                  >
                    {justAdded === product.id ? 'Added ✓' : 'Add to Cart'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      <div className="light-divider"></div>

      <div className="cta-strip">
        <div className="cta-strip-beam"></div>
        <div className="cta-strip-glow"></div>
        <div className="cta-strip-box-tl"></div>
        <div className="cta-strip-box-br"></div>
        <div className="cta-strip-content">
          <div className="cta-strip-eyebrow">
            <div className="cta-strip-eyebrow-line"></div>
            <span>Not Sure Which System?</span>
            <div className="cta-strip-eyebrow-line"></div>
          </div>
          <h2 className="cta-strip-title">We'll recommend<br /><em>the right one.</em></h2>
          <p className="cta-strip-sub">Book a free consultation and we'll assess your home and water needs before recommending a system.</p>
          <Link to="/contact" className="btn-primary">Book a Free Consultation</Link>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-logo">
          <img src="/logo.png" alt="Nerofy Labs" />
          <span>Nerofy Labs</span>
        </div>
        <span className="footer-copy">© 2026 Nerofy Labs. All rights reserved.</span>
      </footer>
    </>
  )
}