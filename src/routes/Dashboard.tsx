import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

import { ProgressRing } from '../components/ProgressRing'
import { TxStatus, type TxPhase } from '../components/TxStatus'
import { WalletButton } from '../components/WalletButton'
import { RECUR_ADDRESS, recurAbi, isDeployed } from '../config/contract'
import { findToken } from '../config/tokens'
import { formatAmount, formatBps, formatCountdown, formatInterval } from '../lib/format'
import { totals, useExecutions } from '../lib/useExecutions'
import { useNow } from '../lib/useNow'
import { cycleProgress, secondsUntilDue, useStablecoin, useUserPlans, type Plan } from '../lib/usePlans'

function PlanRow({
  plan,
  stableSymbol,
  stableDecimals,
  onCancelled,
}: {
  plan: Plan
  stableSymbol: string
  stableDecimals: number
  onCancelled: () => void
}) {
  const now = useNow()
  const remaining = secondsUntilDue(plan, now)
  const progress = cycleProgress(plan, now)
  const due = plan.active && remaining === 0
  const meta = findToken(plan.stockToken)

  const { data: executions } = useExecutions(plan.id)
  const { invested } = totals(executions)

  const { writeContract, data: hash, isPending, reset, error } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const phase: TxPhase = error
    ? 'error'
    : isSuccess
      ? 'success'
      : confirming
        ? 'pending'
        : isPending
          ? 'signing'
          : 'idle'

  // Refresh the list once a cancellation confirms.
  useEffect(() => {
    if (!isSuccess) return
    onCancelled()
    const id = setTimeout(reset, 4000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  return (
    <article className="panel">
      <div className="flex flex-wrap items-center gap-4 px-4 py-4 sm:px-5">
        <ProgressRing progress={progress} due={due} />

        <div className="min-w-0">
          <h3 className="font-display text-[1.15rem] leading-tight">
            <Link to={`/plan/${plan.id}`} className="hover:text-accent">
              {meta?.name ?? 'Stock Token'}{' '}
              <span className="numeric text-[0.95rem] text-ink-muted">
                {meta?.symbol ?? `${plan.stockToken.slice(0, 8)}…`}
              </span>
            </Link>
          </h3>
          <p className="numeric text-[0.78rem] text-ink-muted">
            {formatInterval(Number(plan.interval))} · plan {plan.id.toString()}
          </p>
        </div>

        <div className="ml-auto text-right">
          <p className="label">{plan.active ? 'Next buy' : 'Status'}</p>
          <p
            className={`numeric text-[1.15rem] leading-tight ${due ? 'text-accent' : ''} ${
              !plan.active ? 'text-ink-faint' : ''
            }`}
          >
            {plan.active ? formatCountdown(remaining) : 'Cancelled'}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 border-t border-rule sm:grid-cols-4">
        <div className="border-r border-b border-rule px-4 py-3 sm:border-b-0 sm:px-5">
          <dt className="label">Per cycle</dt>
          <dd className="numeric mt-0.5 text-[0.95rem]">
            {formatAmount(plan.amountPerCycle, stableDecimals, 2)}{' '}
            <span className="text-[0.75rem] text-ink-muted">{stableSymbol}</span>
          </dd>
        </div>
        <div className="border-b border-rule px-4 py-3 sm:border-r sm:border-b-0 sm:px-5">
          <dt className="label">Invested so far</dt>
          <dd className="numeric mt-0.5 text-[0.95rem]">
            {executions ? formatAmount(invested, stableDecimals, 2) : '—'}
          </dd>
        </div>
        <div className="border-r border-rule px-4 py-3 sm:px-5">
          <dt className="label">Max slippage</dt>
          <dd className="numeric mt-0.5 text-[0.95rem]">{formatBps(plan.maxSlippageBps)}</dd>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-3 sm:px-5">
          <div>
            <dt className="label">Executions</dt>
            <dd className="numeric mt-0.5 text-[0.95rem]">{executions?.length ?? '—'}</dd>
          </div>
          {plan.active && (
            <button
              type="button"
              className="btn btn-quiet !text-[0.68rem]"
              disabled={isPending || confirming}
              onClick={() =>
                writeContract({
                  address: RECUR_ADDRESS!,
                  abi: recurAbi,
                  functionName: 'cancel',
                  args: [plan.id],
                })
              }
            >
              {confirming ? 'Cancelling…' : 'Cancel'}
            </button>
          )}
        </div>
      </dl>

      {phase !== 'idle' && (
        <div className="px-4 pb-4 sm:px-5">
          <TxStatus
            phase={phase}
            hash={hash}
            error={error?.message}
            action={`Cancelling plan ${plan.id}`}
          />
        </div>
      )}
    </article>
  )
}

export function Dashboard() {
  const { isConnected } = useAccount()
  const { plans, isLoading, refetch } = useUserPlans()
  const { symbol, decimals } = useStablecoin()

  const active = plans.filter((p) => p.active)
  const inactive = plans.filter((p) => !p.active)

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
        <div>
          <p className="label">Your plans</p>
          <h1 className="mt-2 font-display text-[2.2rem] leading-none tracking-[-0.015em]">
            Schedule
          </h1>
        </div>
        <Link to="/create" className="btn btn-primary">
          New plan
        </Link>
      </div>

      {!isDeployed ? (
        <p className="mt-10 text-[0.95rem] text-ink-soft">
          No contract is configured for this build, so there is nothing to read yet.
        </p>
      ) : !isConnected ? (
        <div className="mt-14 max-w-md">
          <h2 className="font-display text-[1.5rem] leading-snug">Connect to see your plans</h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
            Plans are stored on-chain against your address. Connecting only reads them — nothing
            is signed until you create or cancel one.
          </p>
          <div className="mt-6">
            <WalletButton />
          </div>
        </div>
      ) : isLoading ? (
        <p className="numeric mt-10 text-[0.85rem] text-ink-muted">Reading plans…</p>
      ) : plans.length === 0 ? (
        <div className="mt-14 max-w-md">
          <h2 className="font-display text-[1.5rem] leading-snug">No plans yet</h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
            A plan is four decisions: which token, how much per cycle, how often, and the worst
            price you would accept.
          </p>
          <Link to="/create" className="btn btn-primary mt-6">
            Create your first plan
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {active.map((plan) => (
            <PlanRow
              key={plan.id.toString()}
              plan={plan}
              stableSymbol={symbol}
              stableDecimals={decimals}
              onCancelled={refetch}
            />
          ))}

          {inactive.length > 0 && (
            <>
              <p className="label pt-8">Cancelled</p>
              <div className="space-y-4 opacity-60">
                {inactive.map((plan) => (
                  <PlanRow
                    key={plan.id.toString()}
                    plan={plan}
                    stableSymbol={symbol}
                    stableDecimals={decimals}
                    onCancelled={refetch}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
