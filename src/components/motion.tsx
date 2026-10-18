import { Fragment, type CSSProperties, type ElementType, type ReactNode } from 'react'

/** Delay helper for staggered reveals, e.g. style={delay(0.2)} */
export const delay = (s: number) => ({ '--d': `${s}s` }) as CSSProperties

/** Splits a line into words that rise in one after another. */
export function Words({
  text,
  as: Tag = 'span',
  className = '',
  start = 0,
}: {
  text: string
  as?: ElementType
  className?: string
  start?: number
}) {
  const words = text.split(' ')
  return (
    <Tag className={`words reveal ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word" aria-hidden="true">
            <span style={delay(start + i * 0.06)}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`eyebrow reveal${light ? ' eyebrow-light' : ''}`}>{children}</p>
}
