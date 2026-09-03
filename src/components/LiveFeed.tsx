import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import { explorerTx } from '../config/chains'
import { isDeployed } from '../config/contract'
import { formatAmount, formatDateTime, shortAddress } from '../lib/format'
import { useExecutions } from '../lib/useExecutions'
import { useStablecoin } from '../lib/usePlans'

/**
 * Every purchase the protocol has made, newest first, read from `PlanExecuted` logs.
 *
 * @dev Real data rather than an illustration, deliberately. A scheduler's whole claim is that it
 *      keeps running when nobody is watching, and the only honest way to show that is to show
 *      what it has actually done - including, at the start, nothing at all. The empty state says
 *      so plainly instead of hiding the section.
 *
 *      Rows use a fixed narrow leading column, a flexible middle and a right-aligned figure, so
 *      amounts form a straight column no matter how long the names beside them are.
 */
export function LiveFeed() {
  const { data: executions, isLoading, isError } = useExecutions()
  const { symbol, decimals } = useStablecoin()

  const recent = executions?.slice(0, 6) ?? []

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <span className="flex items-center gap-2.5">
          <span className="pip" data-on={recent.length > 0 ? 'true' : 'false'} aria-hidden />
          <span className="label">Execution feed</span>
        </span>
        <span className="label !text-ink-faint">
          {executions ? `${executions.length} total` : '—'}
        </span>
      </div>

      {!isDeployed || isError ? (
        <p className="px-4 py-6 text-[0.88rem] leading-relaxed text-ink-muted">
          The feed is unavailable — this RPC limits log queries. Plans themselves are unaffected.
        </p>
      ) : isLoading ? (
        <ul>
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex items-center gap-3 border-b border-rule px-4 py-3 last:border-0">
              <span className="shimmer h-2 w-2 rounded-full" />
              <span className="shimmer h-3 w-32" />
              <span className="shimmer ml-auto h-3 w-16" />
            </li>
          ))}
        </ul>
      ) : recent.length === 0 ? (
        <div className="px-4 py-6">
          <p className="prose-serif text-[0.9rem] leading-relaxed text-ink-soft">
            Nothing has executed yet. The first plan to come due will appear here — and anyone
            can be the one to trigger it.
          </p>
          <Link to="/create" className="btn btn-ghost mt-4">
            Create the first plan
          </Link>
        </div>
      ) : (
        <ul>
          {recent.map((e, i) => (
              <li
                key={e.txHash}
                className="reveal flex items-center gap-3 border-b border-rule px-4 py-3 last:border-0"
                data-shown="true"
                style={{ '--reveal-delay': `${i * 50}ms` } as CSSProperties}
              >
                <span className="pip" data-on="true" style={{ '--pulse': `${1.2 + i * 0.2}s` } as CSSProperties} aria-hidden />

                <span className="min-w-0">
                  {/* The event carries only the plan id, not the asset - resolving a symbol
                      here would mean an extra read per row for no real gain. */}
                  <span className="numeric block text-[0.82rem] text-ink">
                    Plan {e.planId.toString()}
                  </span>
                  <span className="numeric block text-[0.7rem] text-ink-faint">
                    {e.timestamp ? formatDateTime(e.timestamp) : `block ${e.blockNumber}`} ·{' '}
                    {shortAddress(e.executor)}
                  </span>
                </span>

                <span className="ml-auto text-right">
                  <a
                    href={explorerTx(e.txHash)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="numeric block text-[0.85rem] text-ink-soft hover:text-accent"
                  >
                    {formatAmount(e.amountIn, decimals, 2)}{' '}
                    <span className="text-[0.7rem] text-ink-faint">{symbol}</span>
                  </a>
                </span>
              </li>
          ))}
        </ul>
      )}
    </div>
  )
}
