/**
 * The contract's own token balance over time.
 *
 * @dev The custody claim is hard to feel from a sentence. Drawn, it is obvious: the line sits on
 *      zero, and the only departures are the instants a purchase passes through. Each spike
 *      returns to the baseline within the same transaction it left it.
 *
 *      An SVG here rather than boxes, because the shape is the argument. It scales with the
 *      column, and the labels are set large enough to survive at 375px.
 */
export function BalanceTrace() {
  // Three executions. Narrow spikes, each landing back on the baseline immediately.
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
        <span className="label !text-positive">Zero</span>
      </figcaption>

      <div className="px-4 py-5">
        <svg
          viewBox="0 0 600 96"
          className="w-full"
          role="img"
          aria-label="The contract's token balance stays at zero, rising only for the instant each purchase passes through."
        >
          {/* Baseline */}
          <line
            x1="0"
            y1="72"
            x2="600"
            y2="72"
            stroke="var(--color-rule-strong)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          {/* The trace */}
          <path
            d={path}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Marks where each purchase happened */}
          {[112, 294, 476].map((x) => (
            <circle key={x} cx={x} cy="26" r="3" fill="var(--color-accent)" />
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
