import type { CSSProperties } from 'react'

/**
 * The path money takes during one execution.
 *
 * @dev Built from ruled boxes rather than an SVG so it reflows: a row on a desktop, a column on
 *      a phone. A fixed viewBox diagram would either overflow at 375px or shrink its labels
 *      past reading size.
 *
 *      A pulse runs the connectors in sequence, staggered so it reads as one payment moving
 *      through rather than three lights blinking. The sequence is the whole point of the
 *      diagram, and a static picture cannot show a sequence.
 *
 *      The middle box is marked because that is the claim: the contract is on the path and
 *      still keeps nothing.
 */

const STEPS = [
  { label: 'Your wallet', note: 'Stablecoin', tone: 'plain' },
  { label: 'Roxy', note: 'Holds nothing', tone: 'accent' },
  { label: 'Uniswap', note: 'Swap', tone: 'plain' },
  { label: 'Your wallet', note: 'Stock Token', tone: 'plain' },
] as const

const CONNECTORS = ['pull', 'swap', 'deliver']

function Connector({ label, index }: { label: string; index: number }) {
  return (
    <div className="flex items-center justify-center py-2 sm:w-16 sm:shrink-0 sm:py-0">
      <div className="flex w-full flex-col items-center gap-1.5">
        <span className="label !text-[0.6rem] !text-ink-faint">{label}</span>
        {/* The track the pulse runs along. Horizontal on a desktop, vertical on a phone. */}
        <div className="relative h-px w-full overflow-hidden bg-rule max-sm:h-6 max-sm:w-px">
          <span
            className="travel absolute inset-0 bg-accent max-sm:hidden"
            style={{ '--travel-delay': `${index * 0.42}s` } as CSSProperties}
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}

export function ExecutionFlow() {
  return (
    <figure className="panel overflow-hidden">
      <figcaption className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <span className="label">One transaction</span>
        <span className="label !text-ink-faint">All or nothing</span>
      </figcaption>

      <div className="flex flex-col items-stretch p-4 sm:flex-row sm:items-center">
        {STEPS.map((step, i) => (
          <div key={i} className="contents">
            <div
              className={`flex-1 rounded-xs border px-3 py-3 text-center transition-colors duration-300 ${
                step.tone === 'accent'
                  ? 'border-accent bg-accent-wash'
                  : 'border-rule bg-ground-sunken'
              }`}
            >
              <p
                className={`display text-[0.78rem] ${
                  step.tone === 'accent' ? 'text-accent' : 'text-ink'
                }`}
              >
                {step.label}
              </p>
              <p className="numeric mt-1 text-[0.68rem] text-ink-muted">{step.note}</p>
            </div>

            {i < CONNECTORS.length && <Connector label={CONNECTORS[i]} index={i} />}
          </div>
        ))}
      </div>

      <p className="border-t border-rule px-4 py-2.5 text-[0.82rem] leading-relaxed text-ink-muted">
        If any step fails, none of it happened.
      </p>
    </figure>
  )
}
