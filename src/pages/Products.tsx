import './Products.css'
import { Link } from 'react-router-dom'

const products = [
  {
    num: '01',
    category: 'Tap Filtration',
    name: 'Countertop\nFaucet Filter',
    desc: 'Ultrafiltration countertop faucet filter with an eco-friendly ceramic 0.5-micron filtration cartridge. Attaches directly to your existing tap with no plumbing required — delivering clean, filtered drinking water on demand.',
    specs: ['0.5 Micron Ceramic', 'Ultrafiltration', 'Countertop', 'Eco-Friendly Cartridge', 'No Plumbing Needed'],
    images: ['/tap1.png', '/tap2.png'],
    labels: ['Front View', 'Detail'],
  },
  {
    num: '02',
    category: 'Shower Filtration',
    name: '15-Stage\nShower Filter',
    desc: 'A 15-stage shower head filter that combines antibacterial balls, calcium sulfite balls and KDF media to soften your water, reduce chlorine and heavy metals, and noticeably improve skin moisture and hair health from the very first use.',
    specs: ['15-Stage Filtration', 'KDF Media', 'Antibacterial Balls', 'Calcium Sulfite', 'Softens Water', 'Reduces Hair Loss', 'Reduces Acne'],
    images: ['/shower.png', '/shower2.png'],
    labels: ['Full Unit', 'Detail'],
  },
  {
    num: '03',
    category: 'Reverse Osmosis',
    name: '5-Stage Undersink\nRO System',
    desc: 'A 5-stage undersink reverse osmosis and ultrafiltration water purification system. The PP + UDF + CTO + UF + T33 filter cartridge sequence removes sediment, chlorine, dissolved solids, bacteria and improves taste — delivering up to 99% contaminant-free water direct from your kitchen tap.',
    specs: ['5-Stage RO + UF', 'PP Sediment', 'UDF Carbon', 'CTO Block', 'Ultrafiltration', 'T33 Post Carbon', '99% Removal'],
    images: ['/ro1.png', '/ro2.png'],
    labels: ['Full System', 'Detail'],
  },
]

export default function Products() {
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
              <Link to="/contact" className="product-cta">
                Enquire Now <span className="product-cta-arrow">↗</span>
              </Link>
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