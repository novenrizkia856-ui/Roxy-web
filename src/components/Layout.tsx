import { NavLink, Outlet, Link } from 'react-router-dom'
import { isDeployed } from '../config/contract'
import { WalletButton } from './WalletButton'

/** The wordmark's dial glyph, echoing the progress rings used throughout the app. */
function Mark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="shrink-0">
      <circle cx="9" cy="9" r="7.5" fill="none" stroke="var(--color-rule-strong)" strokeWidth="1.5" />
      <path
        d="M9 1.5 A7.5 7.5 0 0 1 16.5 9"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="9" r="1.6" fill="var(--color-accent)" />
    </svg>
  )
}

function navClass({ isActive }: { isActive: boolean }) {
  return [
    'label !text-[0.7rem] transition-colors',
    isActive ? '!text-accent' : 'hover:!text-ink',
  ].join(' ')
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      {!isDeployed && (
        <div className="border-b border-caution/30 bg-caution-wash px-5 py-2 text-center">
          <p className="text-[0.85rem] text-ink-soft">
            <span className="label !text-caution">Not configured</span>{' '}
            <span className="ml-2">
              No contract address is set, so the app is in read-only mode. Set{' '}
              <code className="numeric text-[0.78rem]">VITE_RECUR_CONTRACT_ADDRESS</code>.
            </span>
          </p>
        </div>
      )}

      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-baseline gap-2.5" aria-label="Recur, home">
            <span className="translate-y-[3px]">
              <Mark />
            </span>
            <span className="font-display text-[1.35rem] leading-none font-medium tracking-tight">
              Recur
            </span>
          </Link>

          <nav className="ml-auto flex items-center gap-5 sm:gap-7">
            <NavLink to="/dashboard" className={navClass}>
              Plans
            </NavLink>
            <NavLink to="/create" className={navClass}>
              New plan
            </NavLink>
            <div className="ml-1">
              <WalletButton />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-24 border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-8">
          <p className="max-w-md text-[0.85rem] leading-relaxed text-ink-muted">
            Recur is non-custodial. Your funds stay in your wallet and pass through the contract
            only during a single transaction. Nothing here is investment advice.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/legal" className="label hover:!text-ink">
              Legal
            </Link>
            <span className="label !text-ink-faint">Robinhood Chain</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
