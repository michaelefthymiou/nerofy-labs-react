export type Product = {
  id: string
  num: string
  category: string
  name: string
  /** Single-line name used in the cart and on PayFast's payment page. */
  shortName: string
  desc: string
  specs: string[]
  images: string[]
  labels: string[]
  /** Price in rands. null means enquiry-only (no cart button). */
  price: number | null
}

export const products: Product[] = [
  {
    id: 'tap-filter',
    num: '01',
    category: 'Tap Filtration',
    name: 'Countertop\nFaucet Filter',
    shortName: 'Countertop Faucet Filter',
    desc: 'Ultrafiltration countertop faucet filter with an eco-friendly ceramic 0.5-micron filtration cartridge. Attaches directly to your existing tap with no plumbing required — delivering clean, filtered drinking water on demand.',
    specs: ['0.5 Micron Ceramic', 'Ultrafiltration', 'Countertop', 'Eco-Friendly Cartridge', 'No Plumbing Needed'],
    images: ['/tap1.png', '/tap2.png'],
    labels: ['Front View', 'Detail'],
    price: 299,
  },
  {
    id: 'shower-filter',
    num: '02',
    category: 'Shower Filtration',
    name: '15-Stage\nShower Filter',
    shortName: '15-Stage Shower Filter',
    desc: 'A 15-stage shower head filter that combines antibacterial balls, calcium sulfite balls and KDF media to soften your water, reduce chlorine and heavy metals, and noticeably improve skin moisture and hair health from the very first use.',
    specs: ['15-Stage Filtration', 'KDF Media', 'Antibacterial Balls', 'Calcium Sulfite', 'Softens Water', 'Reduces Hair Loss', 'Reduces Acne'],
    images: ['/shower.png', '/shower2.png'],
    labels: ['Full Unit', 'Detail'],
    price: 299,
  },
  {
    id: 'undersink-ro',
    num: '03',
    category: 'Reverse Osmosis',
    name: '5-Stage Undersink\nRO System',
    shortName: '5-Stage Undersink RO System',
    desc: 'A 5-stage undersink reverse osmosis and ultrafiltration water purification system. The PP + UDF + CTO + UF + T33 filter cartridge sequence removes sediment, chlorine, dissolved solids, bacteria and improves taste — delivering up to 99% contaminant-free water direct from your kitchen tap.',
    specs: ['5-Stage RO + UF', 'PP Sediment', 'UDF Carbon', 'CTO Block', 'Ultrafiltration', 'T33 Post Carbon', '99% Removal'],
    images: ['/ro1.png', '/ro2.png'],
    labels: ['Full System', 'Detail'],
    price: null,
  },
]
