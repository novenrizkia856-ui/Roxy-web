import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '../lib/useReveal'

interface RevealProps {
  children: ReactNode
  /** Stagger against siblings, in milliseconds. */
  delay?: number
  className?: string
  as?: 'div' | 'section'
}

/**
 * Reveals its children once, when they first scroll into view.
 *
 * @dev The stagger is the point. Revealing a row of four figures simultaneously reads as a
 *      single block appearing; revealing them 60ms apart reads as values arriving, which is
 *      what they are. Kept small - anything longer starts to feel like waiting.
 */
export function Reveal({ children, delay = 0, className = '', as = 'div' }: RevealProps) {
  const { ref, shown } = useReveal<HTMLDivElement>()
  const Tag = as

  return (
    <Tag
      ref={ref}
      data-shown={shown}
      className={`reveal ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
