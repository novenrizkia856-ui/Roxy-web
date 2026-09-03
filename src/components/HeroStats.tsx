import { useReadContract } from 'wagmi'

import { isDeployed, RECUR_ADDRESS, recurAbi } from '../config/contract'
import { formatAmount } from '../lib/format'
import { totals, useExecutions } from '../lib/useExecutions'
import { useStablecoin } from '../lib/usePlans'

/**
 * The counter strip pinned to the bottom of the hero.
 *
 * @dev Every figure is read from the chain. A strip of invented numbers would be the easiest
 *      thing in the world to write and the fastest way to lose a reader who checks one of them.
 *      Where a value is genuinely zero it says zero - a protocol that has not run yet saying so
 *      is more persuasive than a fabricated count.
 */
export function HeroStats() {
  const { data: executions } = useExecutions()
  const { symbol, decimals } = useStablecoin()

  const { data: nextPlanId } = useReadContract({
    address: RECUR_ADDRESS,
    abi: recurAbi,
    functionName: 'nextPlanId',
    query: { enabled: isDeployed },
  })

  const { data: feeBps } = useReadContract({
    address: RECUR_ADDRESS,
    abi: recurAbi,
    functionName: 'feeBps',
    query: { enabled: isDeployed },
  })

  const { invested } = totals(executions)

  const stats: { k: string; v: string }[] = [
    { k: 'Plans', v: nextPlanId !== undefined ? String(nextPlanId) : '—' },
    { k: 'Executions', v: executions ? String(executions.length) : '—' },
    {
      k: `Invested (${symbol})`,
      v: executions ? formatAmount(invested, decimals, 2) : '—',
    },
    { k: 'Fee', v: feeBps !== undefined ? `${Number(feeBps) / 100}%` : '—' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-rule px-5 py-3 sm:px-8">
      <span className="flex items-center gap-2.5">
        <span
          className="pip"
          data-on={isDeployed ? 'true' : 'false'}
          style={{ '--pulse': '2.3s' } as React.CSSProperties}
          aria-hidden
        />
        <span className="label">{isDeployed ? 'System.Active' : 'Unconfigured'}</span>
      </span>

      {stats.map((s) => (
        <span key={s.k} className="flex items-baseline gap-2">
          <span className="numeric text-[0.95rem] text-ink">{s.v}</span>
          <span className="label !text-ink-faint">{s.k}</span>
        </span>
      ))}

      <span className="ml-auto hidden items-center gap-2 lg:flex">
        <span className="label !text-ink-faint">Live</span>
        <span className="cursor label !text-accent" aria-hidden>
          █
        </span>
      </span>
    </div>
  )
}
