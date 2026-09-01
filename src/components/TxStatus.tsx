import { explorerTx } from '../config/chains'

export type TxPhase = 'idle' | 'signing' | 'pending' | 'success' | 'error'

interface TxStatusProps {
  phase: TxPhase
  hash?: `0x${string}`
  error?: string
  /** What this transaction is doing, e.g. "Approving USDG". */
  action: string
}

const COPY: Record<Exclude<TxPhase, 'idle'>, string> = {
  signing: 'Waiting for you to sign in your wallet…',
  pending: 'Submitted. Waiting for confirmation…',
  success: 'Confirmed.',
  error: 'Failed.',
}

/**
 * Inline transaction state.
 *
 * Deliberately inline rather than a toast: a toast disappears, and the explorer link is the one
 * thing a user may want minutes later. Errors are shown verbatim but truncated, because wallet
 * revert strings are long and the useful part is at the front.
 */
export function TxStatus({ phase, hash, error, action }: TxStatusProps) {
  if (phase === 'idle') return null

  const tone =
    phase === 'error'
      ? 'border-accent/40 bg-accent-wash'
      : phase === 'success'
        ? 'border-positive/30 bg-positive-wash'
        : 'border-rule bg-paper-sunken'

  return (
    <div className={`mt-4 rounded-xs border px-3.5 py-3 ${tone}`} role="status" aria-live="polite">
      <div className="flex items-baseline justify-between gap-3">
        <span className="label !text-ink-soft">{action}</span>
        {phase === 'pending' && (
          <span aria-hidden className="label !text-ink-faint">
            working
          </span>
        )}
      </div>

      <p className="mt-1 text-[0.9rem] leading-snug text-ink-soft">{COPY[phase]}</p>

      {error && phase === 'error' && (
        <p className="numeric mt-1.5 text-[0.75rem] leading-snug break-words text-accent-deep">
          {error.length > 220 ? `${error.slice(0, 220)}…` : error}
        </p>
      )}

      {hash && (
        <a
          href={explorerTx(hash)}
          target="_blank"
          rel="noreferrer noopener"
          className="numeric mt-2 inline-block text-[0.75rem] text-ink-muted underline decoration-rule-strong underline-offset-2 hover:text-accent"
        >
          View on explorer ↗
        </a>
      )}
    </div>
  )
}
