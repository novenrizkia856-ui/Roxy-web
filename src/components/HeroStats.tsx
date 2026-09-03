import type { CSSProperties } from 'react'

import { isDeployed } from '../config/contract'
import { formatAmount } from '../lib/format'
import { useProtocolStats } from '../lib/useProtocolStats'

/** Compact money, so a seven figure number does not push the strip into two rows. */
function compact(value: bigint, decimals: number): string {
  const n = Number(value) / 10 ** decimals
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toFixed(2)
}

/**
 * The counter strip pinned to the bottom of the hero.
 *
 * @dev Every figure is read from the chain, including the ones that are currently zero. There
 *      are two kinds here on purpose. Plans and executions count what has happened, and a
 *      protocol that has just launched honestly has none. Assets and liquidity describe what it
 *      is wired to, and those are large from the first day.
 *
 *      Showing the zeros beside the large numbers is more convincing than hiding them. Anyone
 *      who cares enough to be persuaded by this strip is exactly the person who will check it.
 */
export function HeroStats() {
  const s = useProtocolStats()

  const pending = '...'

  const stats: { k: string; v: string; strong?: boolean }[] = [
    {
      k: 'Tracked liquidity',
      v: s.liquidity !== undefined ? `${compact(s.liquidity, s.decimals)} ${s.symbol}` : pending,
      strong: true,
    },
    {
      k: 'Assets',
      v: s.assetsEnabled !== undefined ? `${s.assetsEnabled} / ${s.assetsOffered}` : pending,
    },
    { k: 'Plans', v: s.plans !== undefined ? String(s.plans) : pending },
    { k: 'Executions', v: s.executions !== undefined ? String(s.executions) : pending },
    {
      k: `Invested`,
      v: s.invested !== undefined ? formatAmount(s.invested, s.decimals, 2) : pending,
    },
    { k: 'Fee', v: s.feeBps !== undefined ? `${Number(s.feeBps) / 100}%` : pending },
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-rule px-5 py-3 sm:px-8">
      <span className="flex items-center gap-2.5">
        <span
          className="pip"
          data-on={isDeployed ? 'true' : 'false'}
          style={{ '--pulse': '2.3s' } as CSSProperties}
          aria-hidden
        />
        <span className="label">{isDeployed ? 'System.Active' : 'Unconfigured'}</span>
      </span>

      {stats.map((stat) => (
        <span key={stat.k} className="flex items-baseline gap-2">
          <span
            className={`numeric text-[0.95rem] ${stat.strong ? 'text-accent' : 'text-ink'}`}
          >
            {stat.v}
          </span>
          <span className="label !text-ink-faint">{stat.k}</span>
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
