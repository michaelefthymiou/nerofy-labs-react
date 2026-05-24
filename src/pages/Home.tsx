 import './Home.css'

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid"></div>
        <div className="hero-beam"></div>
        <div className="hero-beam-2"></div>
        <div className="hero-beam-3"></div>
        <div className="hero-hline"></div>
        <div className="hero-corner"></div>
        <div className="hero-corner-br"></div>
        <div className="hero-box-accent"></div>

        <svg className="hero-molecules" viewBox="0 0 500 700" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMid slice">
  {/* nodes */}
  <circle cx="80" cy="120" r="10" fill="rgba(106,180,204,0.9)"/>
  <circle cx="200" cy="80" r="8" fill="rgba(255,255,255,0.7)"/>
  <circle cx="340" cy="160" r="12" fill="rgba(106,180,204,0.85)"/>
  <circle cx="440" cy="60" r="9" fill="rgba(255,255,255,0.65)"/>
  <circle cx="160" cy="300" r="10" fill="rgba(106,180,204,0.8)"/>
  <circle cx="300" cy="260" r="13" fill="rgba(255,255,255,0.6)"/>
  <circle cx="420" cy="320" r="8" fill="rgba(106,180,204,0.75)"/>
  <circle cx="100" cy="480" r="11" fill="rgba(106,180,204,0.7)"/>
  <circle cx="250" cy="440" r="8" fill="rgba(255,255,255,0.55)"/>
  <circle cx="380" cy="500" r="12" fill="rgba(106,180,204,0.75)"/>
  <circle cx="470" cy="200" r="7" fill="rgba(255,255,255,0.5)"/>
  <circle cx="490" cy="400" r="9" fill="rgba(106,180,204,0.65)"/>
  {/* glow rings behind nodes */}
  <circle cx="80" cy="120" r="22" fill="rgba(106,180,204,0.15)"/>
  <circle cx="340" cy="160" r="26" fill="rgba(106,180,204,0.12)"/>
  <circle cx="300" cy="260" r="28" fill="rgba(255,255,255,0.08)"/>
  <circle cx="100" cy="480" r="24" fill="rgba(106,180,204,0.1)"/>
  <circle cx="380" cy="500" r="26" fill="rgba(106,180,204,0.1)"/>
  {/* sticks */}
  <line x1="80" y1="120" x2="200" y2="80" stroke="rgba(106,180,204,0.35)" strokeWidth="1.5"/>
  <line x1="200" y1="80" x2="340" y2="160" stroke="rgba(106,180,204,0.35)" strokeWidth="1.5"/>
  <line x1="340" y1="160" x2="440" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
  <line x1="160" y1="300" x2="300" y2="260" stroke="rgba(106,180,204,0.3)" strokeWidth="1.5"/>
  <line x1="300" y1="260" x2="420" y2="320" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
  <line x1="100" y1="480" x2="250" y2="440" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
  <line x1="250" y1="440" x2="380" y2="500" stroke="rgba(106,180,204,0.3)" strokeWidth="1.5"/>
  <line x1="420" y1="320" x2="470" y2="200" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>
  <line x1="440" y1="60" x2="490" y2="400" stroke="rgba(106,180,204,0.15)" strokeWidth="1.5"/>
</svg>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line"></div>
            <span>Engineered Water Purification — Made Simple</span>
          </div>
          <h1 className="hero-title">Water,<br /><em>Perfected.</em></h1>
          <p className="hero-subtitle">At the Source.</p>
          <p className="hero-desc">
            From your tap to your shower to your entire home — <strong>Nerofy Labs designs, supplies and installs</strong> precision water filtration systems that remove contaminants, protect your skin and hair, and deliver clean, pure water where it matters.
          </p>
          <div className="hero-actions">
            <a href="/products" className="btn-primary">Explore Systems</a>
            <a href="/contact" className="btn-secondary">Book a Consultation</a>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">4</span>
            <span className="hero-stat-label">System Types</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">100%</span>
            <span className="hero-stat-label">Professionally Installed</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">RO</span>
            <span className="hero-stat-label">Reverse Osmosis Grade</span>
          </div>
        </div>
      </section>

      <div className="light-divider"></div>

      {/* PRODUCTS STRIP */}
      <section className="section" id="products">
        <div className="section-header">
          <div className="section-eyebrow">
            <div className="section-eyebrow-line"></div>
            <span>Our Systems</span>
          </div>
          <h2 className="section-title">Filtration for <em>every need</em></h2>
          <p className="section-sub">Each system is specified, supplied and installed to suit your home — no guesswork, no DIY.</p>
        </div>
        <div className="products-grid">
          {[
            { num: '01', name: 'Tap Filters', desc: 'Activated carbon attachment for your kitchen tap. Removes chlorine, sediment and organic compounds — clean drinking water, instantly.' },
            { num: '02', name: 'Shower Filters', desc: 'Inline shower filter reducing chlorine and heavy metals. Visibly softer water — healthier skin and less hair dryness from day one.' },
            { num: '03', name: 'Undersink RO', desc: 'Multi-stage reverse osmosis installed under your kitchen sink. Removes up to 99% of dissolved solids, fluoride and nitrates.' },
            { num: '04', name: 'Whole-Home RO', desc: 'Point-of-entry system connected to your main water line. Every tap, shower and appliance in your home runs on purified water.' },
          ].map((product) => (
            <div className="product-card" key={product.num}>
              <div className="product-card-corner"></div>
              <p className="product-num">{product.num}</p>
              <p className="product-name">{product.name}</p>
              <p className="product-desc">{product.desc}</p>
              <span className="product-arrow">↗</span>
            </div>
          ))}
        </div>
      </section>

      <div className="light-divider"></div>

      {/* WATER STRIP */}
      <div className="water-strip">
        <div className="water-strip-box1"></div>
        <div className="water-strip-box2"></div>
        <div className="water-glow"></div>
        <div className="water-content">
          <div className="water-text">
            <div className="water-label">
              <div className="water-label-line"></div>
              <span>Why It Matters</span>
            </div>
            <h3 className="water-headline">Municipal water isn't<br /><em>as clean as it looks.</em></h3>
            <p className="water-body">South African tap water contains chlorine, sediment, trihalomethanes and trace heavy metals. Activated carbon and reverse osmosis together remove what standard treatment leaves behind.</p>
          </div>
          <div className="water-stats">
            <div className="water-stat">
              <div className="water-stat-ring">
                <span className="water-stat-num">99%</span>
              </div>
              <span className="water-stat-unit">Contaminants<br />Removed by RO</span>
            </div>
            <div className="water-stat">
              <div className="water-stat-ring">
                <span className="water-stat-num">0.0001<span className="water-stat-num-small">mm</span></span>
              </div>
              <span className="water-stat-unit">RO Membrane<br />Pore Size</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHY SECTION */}
      <section className="why-section" id="why">
        <div className="why-bg-box"></div>
        <div className="why-bg-box2"></div>
        <div className="why-grid">
          <div className="orbit-wrap">
            <div className="orbit-glow"></div>
            <div className="orbit-ring orbit-ring-1"></div>
            <div className="orbit-ring orbit-ring-2"></div>
            <div className="orbit-dot-wrap"><div className="orbit-dot"></div></div>
            <div className="orbit-ring orbit-ring-3"></div>
            <div className="orbit-dot-wrap-2"><div className="orbit-dot-2"></div></div>
            <div className="orbit-center">
              <img src="/silver.png" alt="Nerofy Labs" />
            </div>
          </div>
          <div className="why-content">
            <div className="section-eyebrow" style={{ marginBottom: '22px' }}>
              <div className="section-eyebrow-line"></div>
              <span>Why Nerofy</span>
            </div>
            <h2 className="section-title" style={{ marginBottom: '32px' }}>Engineered,<br /><em>not guessed.</em></h2>
            <p className="why-intro">
              Nerofy Labs doesn't just sell filters — we <strong>assess, specify, supply and install</strong> the right system for your water, your home and your budget. Every installation is done personally.
            </p>
            <div className="why-points">
              {[
                { num: '01', title: 'Supply & Install', desc: 'Every system is professionally installed by us. No third-party plumbers, no loose ends.' },
                { num: '02', title: 'Right-sized Solutions', desc: 'From a single tap filter to a whole-home system — we specify what your household actually needs.' },
                { num: '03', title: 'Proven Technology', desc: 'Activated carbon and reverse osmosis — the gold standard in residential water purification.' },
                { num: '04', title: 'Ongoing Support', desc: 'Filter replacements, maintenance and system checks — we stay involved after installation.' },
              ].map((point) => (
                <div className="why-point" key={point.num}>
                  <span className="why-point-num">{point.num}</span>
                  <div>
                    <p className="why-point-title">{point.title}</p>
                    <p className="why-point-desc">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="light-divider"></div>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box-tl"></div>
        <div className="cta-box-br"></div>
        <div className="cta-beam"></div>
        <div className="cta-glow"></div>
        <div className="cta-inner">
          <div className="cta-eyebrow">
            <div className="cta-eyebrow-line"></div>
            <span>Get Started</span>
            <div className="cta-eyebrow-line"></div>
          </div>
          <h2 className="cta-title">Ready for <em>clean water?</em></h2>
          <p className="cta-sub">Book a free consultation and we'll recommend the right system for your home.</p>
          <div className="cta-btn-wrap">
            <a href="/contact" className="btn-primary">Book a Consultation</a>
          </div>
          <p className="cta-email">Or reach us directly at <a href="mailto:info@nerofylabs.com">info@nerofylabs.com</a></p>
        </div>
      </section>

      {/* FOOTER */}
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