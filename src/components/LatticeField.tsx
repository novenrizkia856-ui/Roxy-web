import { useEffect, useRef } from 'react'

/**
 * An animated lattice, drawn on a 2D canvas.
 *
 * @dev No library. three.js would have cost roughly 150KB gzipped on top of an already heavy
 *      wallet bundle, for a visual that carries no information. This is about two kilobytes and
 *      draws the same idea: a plane of points in perspective, undulating, denting toward the
 *      pointer.
 *
 *      It is bound to something real rather than being ambience. `lit` is the number of assets
 *      the protocol has actually registered, and that many columns of the field are raised and
 *      drawn in the accent. A quiet field means a quiet protocol, which is the honest picture
 *      on a launch day.
 *
 *      One rAF loop writes straight to the canvas. Nothing here re-renders React, and the loop
 *      stops entirely when the element scrolls out of view or the visitor asks for less motion.
 */
interface LatticeFieldProps {
  /** How many of the columns are "live". Drawn raised and in the accent. */
  lit?: number
  /** Total columns in the field. */
  columns?: number
  className?: string
}

export function LatticeField({ lit = 0, columns = 30, className = '' }: LatticeFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  // Held in a ref so a change in the figure does not tear down and restart the animation loop.
  const litRef = useRef(lit)
  useEffect(() => {
    litRef.current = lit
  }, [lit])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    const ROWS = 16
    const pointer = { x: 0.5, y: 0.5, active: false }
    let raf = 0
    let running = true
    let width = 0
    let height = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      width = r.width
      height = r.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const styles = getComputedStyle(document.documentElement)
    const accent = styles.getPropertyValue('--color-accent').trim() || '#d9573a'

    const draw = (t: number) => {
      if (!running) return
      ctx.clearRect(0, 0, width, height)

      const time = reduced ? 0 : t / 1000
      const litCount = litRef.current

      for (let row = 0; row < ROWS; row++) {
        // Rows recede: spacing tightens and the plane rises toward a horizon.
        const depth = row / (ROWS - 1)
        const perspective = 0.35 + depth * 0.65
        const y = height * (0.18 + Math.pow(depth, 1.6) * 0.78)

        for (let col = 0; col < columns; col++) {
          const u = col / (columns - 1)
          // Narrow the plane as it recedes, which is what sells the perspective.
          const spread = 0.5 + perspective * 0.5
          const x = width * (0.5 + (u - 0.5) * spread)

          // The travelling wave, plus a dent that follows the pointer.
          const wave = Math.sin(u * 7 + time * 1.1 + depth * 2.4) * 3.2 * perspective
          let bump = 0
          if (pointer.active) {
            const dx = x / width - pointer.x
            const dy = y / height - pointer.y
            const d = Math.hypot(dx, dy)
            bump = Math.max(0, 1 - d * 3.4) * -14 * perspective
          }

          const isLit = col < litCount
          const size = (isLit ? 1.7 : 1.15) * perspective
          const alpha = (isLit ? 0.85 : 0.4) * (0.25 + perspective * 0.75)

          ctx.beginPath()
          ctx.arc(x, y + wave + bump, Math.max(0.4, size), 0, Math.PI * 2)
          ctx.fillStyle = isLit ? accent : '#ede9e1'
          ctx.globalAlpha = alpha
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = (e.clientX - r.left) / r.width
      pointer.y = (e.clientY - r.top) / r.height
      pointer.active = true
    }
    const onPointerLeave = () => {
      pointer.active = false
    }

    // Stop the loop when the field is off screen. A canvas animating behind the fold is pure
    // battery cost on a phone.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!running) {
            running = true
            raf = requestAnimationFrame(draw)
          }
        } else {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )

    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw(0)
    })

    resize()
    ro.observe(canvas)
    io.observe(canvas)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)
    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [columns])

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden />
}
