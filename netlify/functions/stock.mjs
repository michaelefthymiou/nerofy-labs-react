import { getStock } from '../lib/store.mjs'

/* Public, read-only: price and stock for each product.
   The site calls this on load so the shop always reflects the sheet. */
export default async () => {
  const { products, source } = await getStock()
  return Response.json(
    { products, source },
    { headers: { 'Cache-Control': 'public, max-age=30' } },
  )
}
