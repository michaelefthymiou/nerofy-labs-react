/* Writes a real HTML file for every page, with its own title, meta tags
   and structured data, so Google sees full content without running JS. */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const { render, seoFor, SITE } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)
const template = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8')

const ROUTES = ['/', '/products', '/contact', '/cart', '/checkout/success', '/returns', '/privacy', '/terms']
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

for (const route of ROUTES) {
  const seo = seoFor(route)
  const url = SITE + (route === '/' ? '/' : route)
  const head = [
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    seo.noindex ? '<meta name="robots" content="noindex, nofollow" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Nerofy Labs" />',
    '<meta property="og:locale" content="en_ZA" />',
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/og-image.jpg" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    route === '/products' ? '<link rel="preload" as="image" href="/img/tap1.webp" fetchpriority="high" />' : '',
    ...(seo.jsonLd || []).map(
      (d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`,
    ),
  ]
    .filter(Boolean)
    .join('\n    ')

  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`)
    .replace('<!--seo-->', head)
    .replace('<!--app-->', render(route))

  const out = route === '/' ? path.join(root, 'dist/index.html') : path.join(root, 'dist', route.slice(1), 'index.html')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
  console.log('prerendered', route)
}
