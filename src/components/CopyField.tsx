import { useEffect, useState } from 'react'

interface CopyFieldProps {
  label: string
  /** Leave undefined for a value that does not exist yet. */
  value?: string
  /** Shown in place of the value when there is none. */
  placeholder?: string
  href?: string
}

/**
 * A boxed monospace value with a copy button.
 *
 * @dev Two of these sit in the hero: the protocol contract, and the project token. They must
 *      never be confusable. A visitor who reads "CA" on a DeFi page tends to assume "token to
 *      buy", so the labels name what each address actually is, and the caption under each one
 *      says what it is not.
 *
 *      With no `value` the field renders a placeholder and drops the copy button, so there is
 *      nothing to copy by mistake.
 */
export function CopyField({ label, value, placeholder, href }: CopyFieldProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])

  async function copy() {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard can be blocked by permissions or an insecure context. The value stays
      // selectable either way, so this does not need an error state.
      setCopied(false)
    }
  }

  return (
    <div className="flex items-stretch border border-rule-strong">
      <span className="label flex shrink-0 items-center border-r border-rule-strong px-3">
        {label}
      </span>

      <span className="min-w-0 flex-1 overflow-x-auto px-3 py-2.5">
        {!value ? (
          <span className="numeric text-[0.78rem] whitespace-nowrap text-ink-faint">
            {placeholder ?? 'Coming soon'}
          </span>
        ) : href ? (
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

      {value && (
        <button
          type="button"
          onClick={copy}
          className="label shrink-0 border-l border-rule-strong px-3 transition-colors hover:!text-accent"
          aria-label={`Copy ${label}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      )}
    </div>
  )
}
