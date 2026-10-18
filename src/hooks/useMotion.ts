import { useEffect, type RefObject } from 'react'

/** Watches every .reveal element and adds .is-in when it scrolls into view.
    Re-runs when `key` changes (route changes). */
export function useRevealAll(key: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}

/** Writes scroll progress (0 to 1) through an element into the CSS variable --p.
    Calls onStep with a whole-number step when `steps` is given. No React re-renders. */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  opts: { steps?: number; onStep?: (step: number) => void; mode?: 'through' | 'enter' } = {},
) {
  const { steps, onStep, mode = 'through' } = opts
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    let last = -1
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const raw =
        mode === 'enter'
          ? (vh - r.top) / (vh + r.height)
          : (vh * 0.75 - r.top) / Math.max(r.height - vh * 0.25, 1)
      const p = Math.min(1, Math.max(0, raw))
      el.style.setProperty('--p', p.toFixed(4))
      if (steps && onStep) {
        const step = Math.min(steps - 1, Math.floor(p * steps))
        if (step !== last) {
          last = step
          onStep(step)
        }
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref, steps, onStep, mode])
}
