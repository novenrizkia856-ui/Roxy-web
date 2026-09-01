import { formatUnits } from 'viem'

/** Truncates rather than rounds up, so a displayed balance is never larger than the real one. */
export function formatAmount(value: bigint, decimals: number, maxFractionDigits = 4): string {
  const raw = formatUnits(value, decimals)
  const [whole, fraction = ''] = raw.split('.')
  const grouped = BigInt(whole).toLocaleString('en-US')
  if (maxFractionDigits === 0) return grouped
  const trimmed = fraction.slice(0, maxFractionDigits).replace(/0+$/, '')
  return trimmed ? `${grouped}.${trimmed}` : grouped
}

export function shortAddress(address?: string): string {
  if (!address) return '—'
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

const MINUTE = 60
const HOUR = 3600
const DAY = 86400
const WEEK = 604800

/** "Every 7 days", "Every 12 hours" - the human reading of a plan's interval. */
export function formatInterval(seconds: number): string {
  if (seconds % WEEK === 0) {
    const n = seconds / WEEK
    return n === 1 ? 'Every week' : `Every ${n} weeks`
  }
  if (seconds % DAY === 0) {
    const n = seconds / DAY
    return n === 1 ? 'Every day' : `Every ${n} days`
  }
  if (seconds % HOUR === 0) {
    const n = seconds / HOUR
    return n === 1 ? 'Every hour' : `Every ${n} hours`
  }
  const n = Math.round(seconds / MINUTE)
  return `Every ${n} minutes`
}

/** Compact countdown: "2d 04h", "04h 12m", "12m 30s", or "due now". */
export function formatCountdown(secondsRemaining: number): string {
  if (secondsRemaining <= 0) return 'due now'

  const d = Math.floor(secondsRemaining / DAY)
  const h = Math.floor((secondsRemaining % DAY) / HOUR)
  const m = Math.floor((secondsRemaining % HOUR) / MINUTE)
  const s = Math.floor(secondsRemaining % MINUTE)

  const pad = (n: number) => String(n).padStart(2, '0')
  if (d > 0) return `${d}d ${pad(h)}h`
  if (h > 0) return `${pad(h)}h ${pad(m)}m`
  return `${pad(m)}m ${pad(s)}s`
}

export function formatDateTime(timestampSeconds: number): string {
  if (!timestampSeconds) return '—'
  return new Date(timestampSeconds * 1000).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatBps(bps: number): string {
  return `${(bps / 100).toFixed(bps % 100 === 0 ? 0 : 2)}%`
}

/** Effective price paid, in stablecoin per whole stock token. */
export function effectivePrice(
  amountIn: bigint,
  stableDecimals: number,
  amountOut: bigint,
  stockDecimals: number,
): string {
  if (amountOut === 0n) return '—'
  const inScaled = Number(formatUnits(amountIn, stableDecimals))
  const outScaled = Number(formatUnits(amountOut, stockDecimals))
  if (!outScaled) return '—'
  return (inScaled / outScaled).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
