import { useEffect, useRef, useState } from 'react'

/**
 * Reveals an element the first time it scrolls into view.
 *
 * @dev Three rules, in order of importance:
 *
 *      1. **Content is never gated on the animation succeeding.** A scroll reveal that fails
 *         leaves the page permanently blank, which is far worse than no animation at all. So
 *         anything already on screen at mount is shown straight away without waiting for an
 *         observer, and a backstop timer reveals everything else regardless. The observer is a
 *         refinement on top of that, not the mechanism content depends on.
 *      2. **One-way.** Once revealed it stays revealed. Content that fades out again when you
 *         scroll up is a distraction in an interface people come to read numbers in.
 *      3. **`prefers-reduced-motion` wins.** Nothing is ever hidden from someone who asked for
 *         less movement.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number
  rootMargin?: string
}) {
  const ref = useRef<T | null>(null)

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const noObserver = typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined'

  const [shown, setShown] = useState(prefersReduced || noObserver)

  const threshold = options?.threshold ?? 0.1
  const rootMargin = options?.rootMargin ?? '0px 0px -6% 0px'

  useEffect(() => {
    if (shown) return
    const el = ref.current
    if (!el) return

    // Already on screen (or above it) at mount: reveal now. Waiting for an observer here would
    // briefly blank content the visitor is already looking at.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true)
      return
    }

    let io: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setShown(true)
              io?.disconnect()
            }
          }
        },
        { threshold, rootMargin },
      )
      io.observe(el)
    }

    // Backstop. If the observer never reports - an environment that throttles it, a browser
    // quirk, an element that never quite crosses the threshold - the content still appears.
    const failsafe = window.setTimeout(() => {
      setShown(true)
      io?.disconnect()
    }, 2500)

    return () => {
      io?.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [shown, threshold, rootMargin])

  return { ref, shown }
}
