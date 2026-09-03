import { useEffect, useState } from 'react'

interface CopyFieldProps {
  label: string
  value: string
  /** Optional link, e.g. to the block explorer. */
  href?: string
}

/**
 * A boxed, monospace value with a copy button.
 *
 * @dev Used in the hero for the contract address. Putting it there rather than only in the
 *      footer is deliberate: the product is called Roxy and the contract is called Recur, so the
 *      address is the one thing that lets a visitor resolve that mismatch for themselves without
 *      hunting for it.
 */
export function CopyField({ label, value, href }: CopyFieldProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard can be blocked (insecure context, permissions). Selecting the text is the
      // fallback - the value stays readable either way, so this is not worth an error state.
      setCopied(false)
    }
  }

  return (
    <div className="flex items-stretch border border-rule-strong">
      <span className="label flex shrink-0 items-center border-r border-rule-strong px-3">
        {label}
      </span>

      <span className="min-w-0 flex-1 overflow-x-auto px-3 py-2.5">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="numeric text-[0.78rem] whitespace-nowrap text-ink-soft hover:text-accent"
          >
            {value}
          </a>
        ) : (
          <span className="numeric text-[0.78rem] whitespace-nowrap text-ink-soft">{value}</span>
        )}
      </span>

      <button
        type="button"
        onClick={copy}
        className="label shrink-0 border-l border-rule-strong px-3 transition-colors hover:!text-accent"
        aria-label={`Copy ${label}`}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
