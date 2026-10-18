/* Per-page titles, descriptions and structured data.
   Used by the <Seo> component in the browser and by scripts/prerender.mjs
   at build time, so Google sees the same thing either way. */

import { products } from './data/products'
import { faqs } from './data/faqs'

export const SITE = 'https://nerofylabs.com'

export type PageSeo = {
  title: string
  description: string
  noindex?: boolean
  jsonLd?: object[]
}

const business = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': `${SITE}/#business`,
  name: 'Nerofy Labs',
  alternateName: ['nerofylabs', 'Nerofy Labs (Pty) Ltd', 'NEROFYLABS'],
  url: SITE,
  logo: `${SITE}/apple-touch-icon.png`,
  image: `${SITE}/og-image.jpg`,
  email: 'info@nerofylabs.com',
  description:
    'Faucet water filters, shower filters and reverse osmosis water purification systems for homes in Johannesburg and across South Africa.',
  priceRange: 'R299+',
  currenciesAccepted: 'ZAR',
  paymentAccepted: 'Credit card, debit card, instant EFT (PayFast)',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Johannesburg',
    addressRegion: 'Gauteng',
    addressCountry: 'ZA',
  },
  areaServed: [
    { '@type': 'City', name: 'Johannesburg' },
    { '@type': 'State', name: 'Gauteng' },
    { '@type': 'Country', name: 'South Africa' },
  ],
}

const productLd = products
  .filter((p) => p.price !== null)
  .map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.desc,
    image: p.images.map((i) => SITE + i.src),
    brand: { '@type': 'Brand', name: 'Nerofy Labs' },
    category: p.category,
    offers: {
      '@type': 'Offer',
      url: `${SITE}/products#${p.slug}`,
      priceCurrency: 'ZAR',
      price: p.price,
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@id': `${SITE}/#business` },
    },
  }))

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export const SEO: Record<string, PageSeo> = {
  '/': {
    title: 'Water Filters & Water Purification Systems South Africa | Nerofy Labs',
    description:
      'Shop faucet water filters, shower filters and reverse osmosis systems from Nerofy Labs (nerofylabs.com). Engineered water purification for Johannesburg and South African homes. Secure checkout, fast delivery.',
    jsonLd: [business, faqLd],
  },
  '/products': {
    title: 'Faucet Filter, Shower Filter & Undersink RO System | Shop Nerofy Labs',
    description:
      'Buy a countertop faucet water filter (R299), a 15 stage shower filter or a 5 stage undersink reverse osmosis system. Water filters delivered across South Africa by Nerofy Labs.',
    jsonLd: [business, ...productLd],
  },
  '/contact': {
    title: 'Contact Nerofy Labs | Water Filtration Advice Johannesburg',
    description:
      'Get free advice on the right water filter or reverse osmosis system for your home. Contact Nerofy Labs in Johannesburg, Gauteng.',
    jsonLd: [business],
  },
  '/cart': { title: 'Your cart | Nerofy Labs', description: 'Your Nerofy Labs cart.', noindex: true },
  '/checkout/success': { title: 'Order received | Nerofy Labs', description: 'Thank you for your order.', noindex: true },
  '/returns': {
    title: 'Returns, Refunds & Warranty | Nerofy Labs',
    description: 'How returns, refunds and warranty claims work for water filters bought from Nerofy Labs.',
  },
  '/privacy': {
    title: 'Privacy Policy (POPIA) | Nerofy Labs',
    description: 'How Nerofy Labs collects, uses and protects your personal information.',
  },
  '/terms': {
    title: 'Terms of Sale | Nerofy Labs',
    description: 'The terms that apply when you buy from nerofylabs.com.',
  },
  '404': { title: 'Page not found | Nerofy Labs', description: 'This page does not exist.', noindex: true },
}

export const seoFor = (path: string) => SEO[path] ?? SEO['404']
