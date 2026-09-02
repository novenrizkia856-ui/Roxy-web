import { Link, useParams } from 'react-router-dom'

import { ProgressRing } from '../components/ProgressRing'
import { explorerAddress, explorerTx } from '../config/chains'
import { findToken } from '../config/tokens'
import {
  effectivePrice,
  formatAmount,
  formatBps,
  formatCountdown,
  formatDateTime,
  formatInterval,
  shortAddress,
} from '../lib/format'
import { totals, useExecutions } from '../lib/useExecutions'
import { useNow } from '../lib/useNow'
import { cycleProgress, secondsUntilDue, usePlan, useStablecoin, useTokenConfig } from '../lib/usePlans'

export function PlanDetail() {
  const { planId } = useParams()
  const id = planId !== undefined && /^\d+$/.test(planId) ? BigInt(planId) : undefined

  const { plan, isLoading } = usePlan(id)
  const { symbol: stableSymbol, decimals: stableDecimals } = useStablecoin()
  const { data: executions, isLoading: execLoading, isError } = useExecutions(id)
  const cfg = useTokenConfig(plan?.stockToken)
  const now = useNow()

  if (id === undefined) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="text-ink-soft">That is not a valid plan id.</p>
        <Link to="/dashboard" className="btn btn-ghost mt-5">
          Back to plans
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="numeric text-[0.85rem] text-ink-muted">Reading plan {planId}…</p>
      </div>
    )
  }

  if (!plan || plan.owner === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <h1 className="font-display text-[1.6rem]">No plan {planId}</h1>
        <p className="mt-2 text-[0.95rem] text-ink-soft">
          Nothing has been recorded under that id.
        </p>
        <Link to="/dashboard" className="btn btn-ghost mt-5">
          Back to plans
        </Link>
      </div>
    )
  }

  const meta = findToken(plan.stockToken)
  const remaining = secondsUntilDue(plan, now)
  const due = plan.active && remaining === 0
  const { invested, received, count } = totals(executions)
  const stockDecimals = cfg.stockDecimals

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <Link to="/dashboard" className="label hover:!text-ink">
        ← All plans
      </Link>

      {/* Header: asymmetric, the dial sitting against the title rather than above it */}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-7">
        <div className="flex items-center gap-5">
          <ProgressRing progress={cycleProgress(plan, now)} due={due} size={56} strokeWidth={3} />
          <div>
            <p className="label">Plan {plan.id.toString()}</p>
            <h1 className="mt-1.5 font-display text-[2.1rem] leading-none tracking-[-0.015em]">
              {meta?.name ?? 'Stock Token'}{' '}
              <span className="numeric text-[1.2rem] text-ink-muted">
                {meta?.symbol ?? shortAddress(plan.stockToken)}
              </span>
            </h1>
          </div>
        </div>

        <div className="text-right">
          <p className="label">{plan.active ? 'Next purchase' : 'Status'}</p>
          <p
            className={`numeric text-[1.7rem] leading-none ${
              !plan.active ? 'text-ink-faint' : due ? 'text-accent' : ''
            }`}
          >
            {plan.active ? formatCountdown(remaining) : 'Cancelled'}
          </p>
        </div>
      </div>

      {/* Terms */}
      <dl className="grid grid-cols-2 border-b border-rule sm:grid-cols-4">
        {[
          ['Per cycle', `${formatAmount(plan.amountPerCycle, stableDecimals, 2)} ${stableSymbol}`],
          ['Cadence', formatInterval(Number(plan.interval))],
          ['Max slippage', formatBps(plan.maxSlippageBps)],
          [
            'Last executed',
            plan.lastExecuted === 0n ? 'Never' : formatDateTime(Number(plan.lastExecuted)),
          ],
        ].map(([k, v], i) => (
          <div
            key={k}
            className={`px-4 py-5 sm:px-5 ${i < 3 ? 'sm:border-r sm:border-rule' : ''} ${
              i % 2 === 0 ? 'border-r border-rule' : ''
            } ${i < 2 ? 'border-b border-rule sm:border-b-0' : ''}`}
          >
            <dt className="label">{k}</dt>
            <dd className="numeric mt-1 text-[1rem]">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Totals */}
      <div className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="font-display text-[1.5rem] leading-tight">Position</h2>
          <p className="mt-2 max-w-xs text-[0.9rem] leading-relaxed text-ink-soft">
            Totalled from on-chain execution events, net of the protocol fee.
          </p>
        </div>

        <dl className="grid grid-cols-3 lg:col-span-7 lg:col-start-6">
          <div>
            <dt className="label">Invested</dt>
            <dd className="numeric mt-1.5 text-[1.4rem] leading-none">
              {executions ? formatAmount(invested, stableDecimals, 2) : '—'}
            </dd>
            <dd className="numeric mt-1 text-[0.72rem] text-ink-faint">{stableSymbol}</dd>
          </div>
          <div>
            <dt className="label">Received</dt>
            <dd className="numeric mt-1.5 text-[1.4rem] leading-none">
              {executions ? formatAmount(received, stockDecimals, 4) : '—'}
            </dd>
            <dd className="numeric mt-1 text-[0.72rem] text-ink-faint">
              {meta?.symbol ?? 'tokens'}
            </dd>
          </div>
          <div>
            <dt className="label">Average price</dt>
            <dd className="numeric mt-1.5 text-[1.4rem] leading-none">
              {executions && received > 0n
                ? effectivePrice(invested, stableDecimals, received, stockDecimals)
                : '—'}
            </dd>
            <dd className="numeric mt-1 text-[0.72rem] text-ink-faint">per token</dd>
          </div>
        </dl>
      </div>

      {/* History */}
      <section className="border-t border-rule pt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[1.5rem] leading-tight">Execution history</h2>
          <span className="label">{count} total</span>
        </div>

        {isError ? (
          <p className="mt-5 max-w-lg text-[0.9rem] leading-relaxed text-ink-muted">
            History could not be loaded — this RPC limits log queries. The plan itself is
            unaffected; you can read the full event history on the explorer.
          </p>
        ) : execLoading ? (
          <p className="numeric mt-5 text-[0.85rem] text-ink-muted">Reading events…</p>
        ) : !executions?.length ? (
          <p className="mt-5 max-w-lg text-[0.9rem] leading-relaxed text-ink-soft">
            Nothing yet. The first purchase happens the moment someone executes this plan — you
            can do it yourself, or wait for a keeper to pick it up.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <thead>
                <tr className="border-y border-rule">
                  <th className="label py-2.5 pr-4 font-medium">Date</th>
                  <th className="label py-2.5 pr-4 font-medium">Paid</th>
                  <th className="label py-2.5 pr-4 font-medium">Received</th>
                  <th className="label py-2.5 pr-4 font-medium">Price</th>
                  <th className="label py-2.5 pr-4 font-medium">Executed by</th>
                  <th className="label py-2.5 font-medium">Tx</th>
                </tr>
              </thead>
              <tbody>
                {executions.map((e) => (
                  <tr key={e.txHash} className="border-b border-rule">
                    <td className="numeric py-3 pr-4 text-[0.82rem] text-ink-soft">
                      {e.timestamp ? formatDateTime(e.timestamp) : `block ${e.blockNumber}`}
                    </td>
                    <td className="numeric py-3 pr-4 text-[0.88rem]">
                      {formatAmount(e.amountIn, stableDecimals, 2)}
                    </td>
                    <td className="numeric py-3 pr-4 text-[0.88rem]">
                      {formatAmount(e.amountOut - e.protocolFee, stockDecimals, 6)}
                    </td>
                    {/* Divided by what the owner actually received, net of the protocol fee -
                        the same basis as the Received column beside it and as the average
                        above. Dividing by the gross swap output would quote a better price
                        than anyone got, and would not reconcile with the average. */}
                    <td className="numeric py-3 pr-4 text-[0.88rem]">
                      {effectivePrice(
                        e.amountIn,
                        stableDecimals,
                        e.amountOut - e.protocolFee,
                        stockDecimals,
                      )}
                    </td>
                    <td className="numeric py-3 pr-4 text-[0.82rem]">
                      <a
                        href={explorerAddress(e.executor)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-ink-muted underline decoration-rule-strong underline-offset-2 hover:text-accent"
                      >
                        {shortAddress(e.executor)}
                      </a>
                    </td>
                    <td className="numeric py-3 text-[0.82rem]">
                      <a
                        href={explorerTx(e.txHash)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-ink-muted underline decoration-rule-strong underline-offset-2 hover:text-accent"
                      >
                        {shortAddress(e.txHash)} ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
