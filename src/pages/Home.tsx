import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Molecule from '../components/Molecule'
import { Words, Eyebrow, delay } from '../components/motion'
import { BuyButton, Price, StockPill } from '../components/Stock'
import { useScrollProgress } from '../hooks/useMotion'
import { products } from '../data/products'
import { faqs } from '../data/faqs'
import './Home.css'

const CONTAMINANTS = [
  {
    name: 'Chlorine',
    formula: 'Cl₂',
    text: 'Added at the treatment works to disinfect the water. Safe, but it is what you taste and smell, and it dries out skin and hair in the shower.',
  },
  {
    name: 'Sediment and rust',
    formula: 'Fe₂O₃',
    text: 'Picked up from old municipal pipes and burst main repairs. It is why your water sometimes runs brown after an outage.',
  },
  {
    name: 'Trace metals',
    formula: 'Pb',
    text: 'Lead, copper and other metals can leach from ageing plumbing between the reservoir and your tap.',
  },
  {
    name: 'Dissolved solids',
    formula: 'TDS',
    text: 'Salts, nitrates and minerals dissolved in the water. Only reverse osmosis reliably takes these out.',
  },
]

const STAGES = [
  { n: '01', name: 'Sediment', size: '5 micron', text: 'A spun polypropylene layer catches sand, rust and grit.' },
  { n: '02', name: 'Activated carbon', size: 'Adsorption', text: 'Carbon grabs chlorine and organic compounds, fixing taste and smell.' },
  { n: '03', name: 'Ultrafiltration', size: '0.01 to 0.5 micron', text: 'Fine ceramic or hollow fibre traps bacteria and microscopic particles.' },
  { n: '04', name: 'Reverse osmosis', size: '0.0001 micron', text: 'A membrane lets water molecules through and rejects up to 99% of dissolved solids.' },
]

const STATS = [
  { value: 0.5, decimals: 1, unit: 'micron', label: 'Ceramic faucet filtration' },
  { value: 15, decimals: 0, unit: 'stages', label: 'In our shower filter' },
  { value: 99, decimals: 0, unit: '%', label: 'Dissolved solids removed by RO' },
  { value: 60, decimals: 0, unit: 'R', label: 'PUDO locker delivery', prefix: true },
]

function Counter({ value, decimals, unit, prefix }: { value: number; decimals: number; unit: string; prefix?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setShown(0)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / 1400)
        setShown(value * (1 - Math.pow(1 - k, 3)))
        if (k < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [value])
  const num = shown.toFixed(decimals)
  return (
    <span ref={ref} className="stat-value">
      {prefix ? unit : ''}
      {num}
      {!prefix && <small>{unit === '%' ? '%' : ` ${unit}`}</small>}
    </span>
  )
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const stagesRef = useRef<HTMLElement>(null)
  const [stage, setStage] = useState(0)
  const onStep = useCallback((s: number) => setStage(s), [])
  useScrollProgress(stagesRef, { steps: STAGES.length, onStep })

  /* Hero: scroll parallax and pointer tilt for the molecule */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const p = Math.min(1, window.scrollY / Math.max(hero.offsetHeight, 1))
        hero.style.setProperty('--hp', p.toFixed(4))
      })
    }
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect()
      hero.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
      hero.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    hero.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('scroll', onScroll)
      hero.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="hero dark" ref={heroRef}>
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-caustics" />
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="bubble" style={{ ['--b' as string]: i }} />
          ))}
        </div>

        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>
              <span className="hero-kicker reveal">Water filters and purification systems · South Africa</span>
              <span className="hero-title">
                <Words text="Pure water," className="hero-line" />
                <Words text="engineered." className="hero-line hero-line-em" start={0.18} />
              </span>
            </h1>
            <p className="hero-lead reveal" style={delay(0.35)}>
              Faucet filters, shower filters and reverse osmosis systems for South African homes. Selected by a chemical
              engineer who designs water and process plants for a living, and delivered to your door.
            </p>
            <div className="hero-actions reveal" style={delay(0.5)}>
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop water filters
              </Link>
              <Link to="/contact" className="btn btn-ghost btn-lg">
                Free advice
              </Link>
            </div>
            <ul className="hero-trust reveal" style={delay(0.65)}>
              <li>Secure PayFast checkout</li>
              <li>Nationwide PUDO delivery</li>
              <li>Fits in minutes, no plumber</li>
            </ul>
          </div>
          <div className="hero-visual reveal" style={delay(0.2)}>
            <Molecule />
          </div>
        </div>

        <a href="#water" className="hero-scroll" aria-label="Scroll down">
          <span />
        </a>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              Faucet water filters <i>✦</i> Shower filters <i>✦</i> Reverse osmosis <i>✦</i> Water purification <i>✦</i>{' '}
              Johannesburg <i>✦</i> Delivered across South Africa <i>✦</i>{' '}
            </span>
          ))}
        </div>
      </div>

      {/* ================= WHAT'S IN YOUR WATER ================= */}
      <section className="section" id="water">
        <div className="container">
          <div className="section-head">
            <Eyebrow>What is in your tap water</Eyebrow>
            <Words as="h2" text="Treated at the plant. Not at your tap." className="section-title" />
            <p className="section-intro reveal" style={delay(0.2)}>
              South African municipal water leaves the treatment works meeting the SANS 241 drinking water standard. Then it
              travels kilometres of pipe to reach you. Here is what a filter deals with.
            </p>
          </div>
          <div className="contaminants">
            {CONTAMINANTS.map((c, i) => (
              <article className="contaminant reveal" style={delay(i * 0.1)} key={c.name}>
                <span className="contaminant-formula">{c.formula}</span>
                <h3>{c.name}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="section section-alt" id="shop">
        <div className="container">
          <div className="section-head section-head-split">
            <div>
              <Eyebrow>The range</Eyebrow>
              <Words as="h2" text="Filtration for every tap in your home." className="section-title" />
            </div>
            <Link to="/products" className="link-arrow reveal">
              See all details
            </Link>
          </div>
          <div className="product-grid">
            {products.map((p, i) => (
              <article className="product-card reveal" style={delay(i * 0.12)} key={p.id}>
                <Link to={`/products#${p.slug}`} className="product-card-media">
                  <img src={p.images[0].src} alt={p.images[0].alt} width="600" height="600" loading="lazy" decoding="async" />
                  <StockPill id={p.id} />
                </Link>
                <div className="product-card-body">
                  <p className="product-card-cat">{p.category}</p>
                  <h3>
                    <Link to={`/products#${p.slug}`}>{p.name}</Link>
                  </h3>
                  <p className="product-card-tag">{p.tagline}</p>
                  <div className="product-card-foot">
                    <Price id={p.id} />
                    <BuyButton product={p} full />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (scroll driven) ================= */}
      <section className="stages dark" id="how-it-works" ref={stagesRef} data-stage={stage}>
        <div className="container stages-grid">
          <div className="stages-sticky">
            <div className="cartridge" aria-hidden="true">
              <div className="cartridge-shell">
                {STAGES.map((s, i) => (
                  <div key={s.n} className={`cartridge-layer layer-${i}${stage >= i ? ' is-on' : ''}`} />
                ))}
                <div className="cartridge-water" />
                {Array.from({ length: 22 }).map((_, i) => (
                  <span key={i} className="particle" style={{ ['--k' as string]: i }} />
                ))}
              </div>
              <div className="cartridge-drop" />
            </div>
          </div>
          <div className="stages-copy">
            <Eyebrow light>How filtration works</Eyebrow>
            <Words as="h2" text="Four barriers between you and your pipes." className="section-title" />
            <p className="section-intro reveal">
              Every system we sell is built from these stages. Scroll to send the water through.
            </p>
            <ol className="stage-list">
              {STAGES.map((s, i) => (
                <li key={s.n} className={`stage${stage === i ? ' is-active' : ''}${stage > i ? ' is-done' : ''}`}>
                  <span className="stage-n">{s.n}</span>
                  <div>
                    <h3>
                      {s.name} <small>{s.size}</small>
                    </h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="stats">
        <div className="container stats-grid">
          {STATS.map((s, i) => (
            <div className="stat reveal" style={delay(i * 0.1)} key={s.label}>
              <Counter value={s.value} decimals={s.decimals} unit={s.unit} prefix={s.prefix} />
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY NEROFY ================= */}
      <section className="section" id="about">
        <div className="container why-grid">
          <div className="why-visual reveal">
            <div className="why-card">
              <img src="/img/logo-silver.webp" alt="Nerofy Labs" width="240" height="162" loading="lazy" />
              <p>
                Process engineering
                <br />
                <strong>for your kitchen</strong>
              </p>
            </div>
          </div>
          <div>
            <Eyebrow>Why Nerofy Labs</Eyebrow>
            <Words as="h2" text="Engineered, not guessed." className="section-title" />
            <p className="section-intro reveal" style={delay(0.15)}>
              Nerofy Labs was started by a chemical engineer who spends his days designing water and process plants for
              the mining industry. The same thinking goes into choosing what we sell: we pick filters on what they
              actually remove, not on marketing claims.
            </p>
            <ul className="why-list">
              {[
                ['Honest advice', 'Most homes only need a faucet filter. We will tell you when that is enough and when RO is worth it.'],
                ['Proven media', 'Ceramic ultrafiltration, KDF, activated carbon and reverse osmosis. Nothing gimmicky.'],
                ['Real support', 'A local email that a real person answers, plus help with cartridge replacements.'],
              ].map(([t, d], i) => (
                <li className="reveal" style={delay(0.2 + i * 0.1)} key={t}>
                  <span className="why-tick" aria-hidden="true" />
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="section section-alt" id="faq">
        <div className="container faq-grid">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <Words as="h2" text="Water filter FAQ." className="section-title" />
            <p className="section-intro reveal">
              Still unsure? <Link to="/contact">Send us a message</Link> and we will help you pick.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <details className="faq reveal" style={delay(i * 0.06)} key={f.q}>
                <summary>
                  <h3>{f.q}</h3>
                  <span className="faq-icon" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta dark">
        <div className="cta-glow" aria-hidden="true" />
        <div className="container cta-inner">
          <Words as="h2" text="Better water starts at R299." className="cta-title" />
          <p className="reveal" style={delay(0.2)}>
            Order a faucet filter today, or get free advice on reverse osmosis and whole home systems.
          </p>
          <div className="hero-actions reveal" style={delay(0.3)}>
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop now
            </Link>
            <Link to="/contact" className="btn btn-ghost btn-lg">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
