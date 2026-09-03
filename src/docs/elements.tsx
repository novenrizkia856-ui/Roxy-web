import type { ReactNode } from 'react'

/** Inline code. */
export function C({ children }: { children: ReactNode }) {
  return <code className="numeric rounded-xs bg-ground-sunken px-1.5 py-0.5 text-[0.85em] text-ink">{children}</code>
}

/** A block of code or a command. */
export function Pre({ children }: { children: ReactNode }) {
  return (
    <pre className="numeric mt-4 overflow-x-auto rounded-xs border border-rule bg-ground-sunken px-4 py-3 text-[0.78rem] leading-relaxed text-ink-soft">
      {children}
    </pre>
  )
}

/** A short definition list, used for parameters and fields. */
export function Fields({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="mt-4 divide-y divide-rule border-y border-rule">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="numeric text-[0.82rem] text-ink">{k}</dt>
          <dd className="text-[0.9rem] leading-relaxed text-ink-soft sm:col-span-2">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

/** A call out. `tone` picks the accent. */
export function Note({ tone = 'info', children }: { tone?: 'info' | 'warn'; children: ReactNode }) {
  const cls =
    tone === 'warn'
      ? 'border-caution/40 bg-caution-wash'
      : 'border-rule bg-ground-sunken'
  return (
    <div className={`mt-4 rounded-xs border px-4 py-3 text-[0.9rem] leading-relaxed text-ink-soft ${cls}`}>
      {children}
    </div>
  )
}
