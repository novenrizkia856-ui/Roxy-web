import type { CSSProperties } from 'react'

import { isDeployed } from '../config/contract'
import { LIQUIDITY } from '../config/display'
import { formatAmount } from '../lib/format'
import { useProtocolStats } from '../lib/useProtocolStats'

/**
 * The counter strip pinned to the bottom of the hero.
 *
 * @dev Assets, plans, executions, invested and fee are read from the chain, including the ones
 *      that are currently zero. Plans and executions count what has happened, and a protocol
 *      that has just launched honestly has none of it.
 *
 *      Liquidity is the exception. It is a supplied figure, held in config/display, not a
 *      contract call - see the note there.
 */
export function HeroStats() {
  const s = useProtocolStats()

  const pending = '...'

  const stats: { k: string; v: string; strong?: boolean }[] = [
    { k: 'Tracked liquidity', v: `${LIQUIDITY} ${s.symbol}`, strong: true },
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
