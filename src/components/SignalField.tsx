import { LatticeField } from './LatticeField'
import { useProtocolStats } from '../lib/useProtocolStats'

/** Compact money for the caption strip. */
function compact(value: bigint, decimals: number): string {
  const n = Number(value) / 10 ** decimals
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toFixed(0)
}

/**
 * The lattice, with the figures it is drawn from.
 *
 * @dev The visual is bound to the protocol rather than decorating around it: the raised, accented
 *      columns are the assets actually registered on chain. Read the strip underneath and the
 *      field stops being wallpaper and starts being a reading.
 */
export function SignalField() {
  const s = useProtocolStats()

  return (
    <figure className="panel overflow-hidden">
      <figcaption className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <span className="label">Asset field</span>
        <span className="label !text-ink-faint">Lit columns are registered assets</span>
      </figcaption>

      <div className="h-[260px] sm:h-[300px]">
        <LatticeField lit={s.assetsEnabled ?? 0} columns={30} />
      </div>

      <dl className="grid grid-cols-3 border-t border-rule">
        <div className="border-r border-rule px-4 py-3">
          <dt className="label">Registered</dt>
          <dd className="numeric mt-0.5 text-[1.1rem] text-accent">
            {s.assetsEnabled ?? '...'}
          </dd>
        </div>
        <div className="border-r border-rule px-4 py-3">
          <dt className="label">Offered</dt>
          <dd className="numeric mt-0.5 text-[1.1rem]">{s.assetsOffered}</dd>
        </div>
        <div className="px-4 py-3">
          <dt className="label">Liquidity</dt>
          <dd className="numeric mt-0.5 text-[1.1rem]">
            {s.liquidity !== undefined ? compact(s.liquidity, s.decimals) : '...'}
          </dd>
        </div>
      </dl>
    </figure>
  )
}
