/**
 * The path money takes during one execution.
 *
 * @dev Built from ruled boxes rather than an SVG so it reflows: a row on a desktop, a column on
 *      a phone. A fixed viewBox diagram would either overflow at 375px or shrink its labels
 *      past reading size.
 *
 *      It replaces a paragraph that used to describe the same sequence in words. The point it
 *      has to land is that the middle box never keeps anything, so that box is the one marked.
 */

const STEPS = [
  { label: 'Your wallet', note: 'Stablecoin', tone: 'plain' },
  { label: 'Roxy', note: 'Holds nothing', tone: 'accent' },
  { label: 'Uniswap', note: 'Swap', tone: 'plain' },
  { label: 'Your wallet', note: 'Stock Token', tone: 'plain' },
] as const

const CONNECTORS = ['pull', 'swap', 'deliver']

export function ExecutionFlow() {
  return (
    <figure className="panel overflow-hidden">
      <figcaption className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <span className="label">One transaction</span>
        <span className="label !text-ink-faint">All or nothing</span>
      </figcaption>

      <div className="flex flex-col items-stretch gap-0 p-4 sm:flex-row sm:items-center">
        {STEPS.map((step, i) => (
          <div key={i} className="contents">
            <div
              className={`flex-1 rounded-xs border px-3 py-3 text-center ${
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

            {i < CONNECTORS.length && (
              <div className="flex items-center justify-center py-1.5 sm:px-2 sm:py-0">
                <span className="label !text-[0.6rem] !text-ink-faint">
                  <span className="sm:hidden">↓ </span>
                  {CONNECTORS[i]}
                  <span className="hidden sm:inline"> →</span>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="border-t border-rule px-4 py-2.5 text-[0.82rem] leading-relaxed text-ink-muted">
        If any step fails, none of it happened.
      </p>
    </figure>
  )
}
