export type Product = {
  id: string
  slug: string
  category: string
  name: string
  tagline: string
  desc: string
  bullets: string[]
  specs: string[]
  images: { src: string; alt: string; label: string }[]
  /** Fallback price in rands; the Google Sheet overrides it. null = enquiry only */
  price: number | null
  /** Fallback stock; the Google Sheet overrides it. */
  stock: number
}

export const products: Product[] = [
  {
    id: 'tap-filter',
    slug: 'faucet-filter',
    category: 'Tap filtration',
    name: 'Countertop Faucet Filter',
    tagline: 'Clean drinking water straight from your kitchen tap.',
    desc: 'An ultrafiltration faucet filter with a 0.5 micron ceramic cartridge. It clips onto your existing kitchen tap in minutes, no plumber and no tools needed, and gives you clean, great tasting drinking water on demand.',
    bullets: [
      '0.5 micron ceramic ultrafiltration cartridge',
      'Reduces chlorine taste, sediment and rust particles',
      'Fits standard kitchen taps, no plumbing required',
      'Switch between filtered and normal flow',
    ],
    specs: ['0.5 micron ceramic', 'Ultrafiltration', 'No plumbing', 'Eco cartridge'],
    images: [
      { src: '/img/tap1.webp', alt: 'Countertop faucet water filter fitted to a kitchen tap', label: 'Fitted' },
      { src: '/img/tap2.webp', alt: 'Ceramic faucet filter cartridge close up', label: 'Cartridge' },
    ],
    price: 299,
    stock: 50,
  },
  {
    id: 'shower-filter',
    slug: 'shower-filter',
    category: 'Shower filtration',
    name: '15-Stage Shower Filter',
    tagline: 'Softer feeling water for your skin and hair.',
    desc: 'A 15 stage inline shower filter combining KDF media, calcium sulfite and antibacterial ceramic balls. It reduces chlorine and heavy metals in your shower water, which can leave skin and hair feeling dry.',
    bullets: [
      '15 filtration stages including KDF and calcium sulfite',
      'Reduces chlorine and heavy metals in shower water',
      'Can help with dry skin and dry hair',
      'Screws in between your shower arm and shower head',
    ],
    specs: ['15 stages', 'KDF media', 'Calcium sulfite', 'Fits standard arms'],
    images: [
      { src: '/img/shower.webp', alt: '15 stage shower filter showing its filtration layers', label: 'Stages' },
      { src: '/img/shower2.webp', alt: 'Shower filter installation diagram', label: 'Installation' },
    ],
    price: 299,
    stock: 0,
  },
  {
    id: 'undersink-ro',
    slug: 'undersink-ro',
    category: 'Reverse osmosis',
    name: '5-Stage Undersink RO System',
    tagline: 'The highest purity drinking water, installed under your sink.',
    desc: 'A 5 stage undersink reverse osmosis and ultrafiltration system. The PP, UDF, CTO, UF and T33 cartridge sequence removes sediment, chlorine, dissolved solids and bacteria, giving you up to 99% pure water from a dedicated tap. Supplied and installed by us.',
    bullets: [
      'PP sediment, UDF carbon, CTO block, UF and T33 post carbon',
      'Removes up to 99% of dissolved solids',
      'Dedicated drinking water tap',
      'Professionally installed and commissioned',
    ],
    specs: ['5 stages', 'Reverse osmosis', 'Up to 99% TDS removal', 'Installed'],
    images: [
      { src: '/img/ro1.webp', alt: '5 stage undersink reverse osmosis water purification system', label: 'System' },
      { src: '/img/ro2.webp', alt: 'Reverse osmosis filter cartridges detail', label: 'Cartridges' },
    ],
    price: null,
    stock: 0,
  },
]

export const productById = (id: string) => products.find((p) => p.id === id)
