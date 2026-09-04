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
 * @dev The button is rendered whether or not there is a value yet, so the field looks the same
 *      the day an address is filled in as it does today, and nothing about the box shifts.
 *
 *      Pressing it with nothing to copy flashes "Soon" rather than "Copied". Reporting a copy
 *      that did not happen would send someone to their clipboard for an address that is not
 *      there, which is worse than a button that admits it is waiting.
 */
export function CopyField({ label, value, placeholder, href }: CopyFieldProps) {
  const [flash, setFlash] = useState<'copied' | 'empty' | null>(null)

  useEffect(() => {
    if (!flash) return
    const id = setTimeout(() => setFlash(null), 1600)
    return () => clearTimeout(id)
  }, [flash])

  async function copy() {
    if (!value) {
      setFlash('empty')
      return
    }
    try {
      await navigator.clipboard.writeText(value)
      setFlash('copied')
    } catch {
      // Clipboard can be blocked by permissions or an insecure context. The value stays
      // selectable either way, so this does not need an error state.
      setFlash(null)
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

      <button
        type="button"
        onClick={copy}
        className="label shrink-0 border-l border-rule-strong px-3 transition-colors hover:!text-accent"
        aria-label={value ? `Copy ${label}` : `${label} is not available yet`}
      >
        {flash === 'copied' ? 'Copied' : flash === 'empty' ? 'Soon' : 'Copy'}
      </button>
    </div>
  )
}
