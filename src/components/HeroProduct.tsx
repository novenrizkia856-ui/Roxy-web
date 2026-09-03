import { useCallback, useRef, useState, type CSSProperties, type PointerEvent } from 'react'

import { ProgressRing } from './ProgressRing'
import { formatCountdown } from '../lib/format'
import { useNow } from '../lib/useNow'

/**
 * The product surface, shown at size in the hero.
 *
 * @dev The page is selling a scheduler, so the thing that should dominate the first screen is
 *      the scheduler, not a paragraph about one. Three decisions follow from that:
 *
 *      1. The countdown is a real clock. It is anchored to a fixed instant and ticks every
 *         second, so the panel is never the same twice and never looks like a screenshot.
 *      2. It answers the pointer. A spotlight tracks the cursor through CSS custom properties
 *         and the panel tilts a degree or so toward it, which is enough to read as a surface
 *         rather than an image. Both are written straight to the node, so moving the mouse does
 *         not re-render React sixty times a second.
 *      3. It carries a schedule strip, because a list of figures does not show rhythm and a
 *         scheduler is entirely about rhythm.
 *
 *      The figures are an illustration and the caption underneath says so. What is real is the
 *      passage of time.
 */

/** The demo plan buys weekly. Anchored so the countdown always reads part way through a cycle. */
const INTERVAL = 7 * 24 * 60 * 60
const CYCLES_DONE = 12

export function HeroProduct() {
  const now = useNow()
  const ref = useRef<HTMLDivElement | null>(null)
  const [pointerInside, setPointerInside] = useState(false)

  // Anchor the cycle to the clock so the countdown is genuinely counting, not a fixed string.
  const elapsed = now % INTERVAL
  const remaining = INTERVAL - elapsed
  const progress = elapsed / INTERVAL

  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height

    el.style.setProperty('--spot-x', `${x * 100}%`)
    el.style.setProperty('--spot-y', `${y * 100}%`)
    // A degree and a half. Any more and it stops reading as a panel and starts reading as a toy.
    el.style.setProperty('--tilt-x', `${(0.5 - y) * 3}deg`)
    el.style.setProperty('--tilt-y', `${(x - 0.5) * 3}deg`)
  }, [])

  const onPointerEnter = useCallback(() => {
    ref.current?.style.setProperty('--spot-opacity', '1')
    setPointerInside(true)
  }, [])

  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--spot-opacity', '0')
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
    setPointerInside(false)
  }, [])

  return (
    <div>
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        className="panel spotlight relative overflow-hidden transition-[border-color,transform] duration-300 ease-out hover:border-rule-strong"
        style={
          {
            transform: 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
            transformStyle: 'preserve-3d',
          } as CSSProperties
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
          <span className="label">Plan 004</span>
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span
                className="pip"
                data-on="true"
                style={{ '--pulse': '1.7s' } as CSSProperties}
                aria-hidden
              />
              <span className="label !text-positive">Active</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="label !text-ink-faint">Live</span>
              <span className="cursor label !text-accent" aria-hidden>
                █
              </span>
            </span>
          </span>
        </div>

        {/* Asset and the countdown, which is the number the product exists to produce */}
        <div className="flex items-start gap-5 px-5 pt-6 pb-5">
          <ProgressRing progress={progress} size={62} strokeWidth={3} />
          <div className="min-w-0 flex-1">
            <p className="display text-[1.15rem] leading-none">NVIDIA</p>
            <p className="numeric mt-1.5 text-[0.75rem] text-ink-muted">NVDA · every 7 days</p>

            <p className="label mt-6">Next purchase</p>
            <p className="numeric mt-1 text-[2rem] leading-none text-ink tabular-nums">
              {formatCountdown(remaining)}
            </p>
          </div>
        </div>

        {/* Schedule strip. A column of figures cannot show rhythm; this can. */}
        <div className="border-t border-rule px-5 py-4">
          <div className="flex items-baseline justify-between">
            <span className="label">Schedule</span>
            <span className="numeric text-[0.65rem] text-ink-faint">
              {CYCLES_DONE} executed
            </span>
          </div>

          <div className="mt-3 flex items-end gap-[3px]" aria-hidden>
            {Array.from({ length: 26 }).map((_, i) => {
              const done = i < CYCLES_DONE
              const isNext = i === CYCLES_DONE
              return (
                <span
                  key={i}
                  className="flex-1 rounded-[1px] transition-colors duration-300"
                  style={{
                    height: isNext ? 22 : done ? 14 : 8,
                    background: isNext
                      ? 'var(--color-accent)'
                      : done
                        ? 'var(--color-ink-soft)'
                        : 'var(--color-rule)',
                    opacity: isNext && pointerInside ? 1 : isNext ? 0.9 : 1,
                  }}
                />
              )
            })}
          </div>

          <div className="mt-2 flex justify-between">
            <span className="numeric text-[0.62rem] text-ink-faint">started</span>
            <span className="numeric text-[0.62rem] text-accent">next</span>
          </div>
        </div>

        {/* Position */}
        <dl className="grid grid-cols-3 border-t border-rule">
          <div className="border-r border-rule px-4 py-3">
            <dt className="label">Per cycle</dt>
            <dd className="numeric mt-0.5 text-[0.95rem]">250.00</dd>
          </div>
          <div className="border-r border-rule px-4 py-3">
            <dt className="label">Invested</dt>
            <dd className="numeric mt-0.5 text-[0.95rem]">3,000.00</dd>
          </div>
          <div className="px-4 py-3">
            <dt className="label">Slippage</dt>
            <dd className="numeric mt-0.5 text-[0.95rem]">1.00%</dd>
          </div>
        </dl>
      </div>

      <p className="mt-3 text-[0.8rem] leading-relaxed text-ink-faint">
        An illustration. The clock is real, the figures are not.
      </p>
    </div>
  )
}
