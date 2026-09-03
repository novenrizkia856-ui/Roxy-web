import type { CSSProperties } from 'react'

/**
 * The contract's own token balance over time.
 *
 * @dev The custody claim is hard to feel from a sentence. Drawn, it is obvious: the line sits on
 *      zero, and the only departures are the instants a purchase passes through.
 *
 *      The trace plots itself on rather than fading in, because watching a line be drawn along
 *      the baseline is what makes "it stays at zero" land. Each spike then pings once, marking
 *      the moment a purchase went through, staggered so they read as separate events.
 *
 *      An SVG here rather than boxes, because the shape is the argument.
 */

const SPIKES = [112, 294, 476]

export function BalanceTrace() {
  const path = [
    'M0,72',
    'L104,72 L112,26 L120,72',
    'L286,72 L294,26 L302,72',
    'L468,72 L476,26 L484,72',
    'L600,72',
  ].join(' ')

  return (
    <figure className="panel overflow-hidden">
      <figcaption className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <span className="label">Balance held by the contract</span>
        <span className="flex items-center gap-2">
          <span
            className="pip"
            data-on="true"
            style={{ '--pulse': '2.9s' } as CSSProperties}
            aria-hidden
          />
          <span className="label !text-positive">Zero</span>
        </span>
      </figcaption>

      <div className="px-4 py-5">
        <svg
          viewBox="0 0 600 96"
          className="w-full"
          role="img"
          aria-label="The contract's token balance stays at zero, rising only for the instant each purchase passes through."
        >
          <line
            x1="0"
            y1="72"
            x2="600"
            y2="72"
            stroke="var(--color-rule-strong)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />

          <path
            d={path}
            className="draw"
            style={{ '--draw-length': 1400 } as CSSProperties}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {SPIKES.map((x, i) => (
            <g key={x}>
              {/* The expanding ring marks the instant, the dot marks the place. */}
              <circle
                cx={x}
                cy="26"
                r="3"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                className="ping"
                style={{ '--ping-delay': `${0.9 + i * 0.8}s` } as CSSProperties}
              />
              <circle cx={x} cy="26" r="3" fill="var(--color-accent)" />
            </g>
          ))}

          <text x="0" y="90" className="numeric" fontSize="11" fill="var(--color-ink-faint)">
            0
          </text>
          <text
            x="600"
            y="90"
            textAnchor="end"
            className="numeric"
            fontSize="11"
            fill="var(--color-ink-faint)"
          >
            time
          </text>
        </svg>
      </div>

      <p className="border-t border-rule px-4 py-2.5 text-[0.82rem] leading-relaxed text-ink-muted">
        Each spike is one purchase passing through. There is no function that could leave anything
        behind.
      </p>
    </figure>
  )
}
