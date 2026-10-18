import { useEffect } from 'react'
import { SITE, seoFor } from '../seo'

function setMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

/** Keeps the title and meta tags right when navigating inside the app.
    The first load already has them baked in by the prerender step. */
export default function Seo({ path }: { path: string }) {
  useEffect(() => {
    const s = seoFor(path)
    document.title = s.title
    setMeta('meta[name="description"]', 'content', s.description)
    setMeta('meta[property="og:title"]', 'content', s.title)
    setMeta('meta[property="og:description"]', 'content', s.description)
    setMeta('meta[property="og:url"]', 'content', SITE + (path === '404' ? '/' : path))
    setMeta('link[rel="canonical"]', 'href', SITE + (path === '404' ? '/' : path))
  }, [path])
  return null
}
