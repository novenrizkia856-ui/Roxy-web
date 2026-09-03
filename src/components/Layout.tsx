import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { CHAIN_ID, explorerAddress } from '../config/chains'
import { isDeployed, RECUR_ADDRESS } from '../config/contract'
import { IS_TESTNET } from '../config/tokens'
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

/**
 * UTC clock in the system bar.
 *
 * Not ornament. Every plan is a deadline, every countdown on these pages is measured against a
 * wall clock, and "when is it due" is the product's only real question - so the interface states
 * which clock it is answering with.
 */
function Clock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="numeric text-[0.65rem] text-ink-muted">
      {t.toISOString().slice(11, 19)} UTC
    </span>
  )
}

function navClass({ isActive }: { isActive: boolean }) {
  return [
    'label !text-[0.6875rem] transition-colors',
    isActive ? '!text-accent' : 'hover:!text-ink',
  ].join(' ')
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* System bar: what network, what contract, what state, what time. The interface says
          where it stands before it says anything else - and that includes admitting that the
          contract it drives does not carry this product's name. */}
      <div className="border-b border-rule">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-2 sm:px-8">
          <span className="label !text-ink-faint">//</span>
          <span className="label">Roxy</span>
          <span className="label !text-ink-faint hidden sm:inline">
            Contract.Recur · {CHAIN_ID}
          </span>
          {IS_TESTNET && <span className="label !text-caution">Testnet</span>}
          <div className="ml-auto flex items-center gap-3">
            <span className="pip" data-on={isDeployed ? 'true' : 'false'} aria-hidden />
            <span className="label hidden sm:inline">
              {isDeployed ? 'System.Active' : 'Unconfigured'}
            </span>
            <Clock />
          </div>
        </div>
      </div>

      {!isDeployed && (
        <div className="border-b border-caution/25 bg-caution-wash px-5 py-2 text-center">
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
        {/* On a phone the wordmark and the wallet share the first row, and the links get a row
            of their own underneath. Squeezing four targets onto one 375px row makes all of them
            hard to hit. */}
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Roxy, home">
            <Mark />
            <span className="display text-[1.15rem] leading-none tracking-[0.18em]">Roxy</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-6 sm:flex">
            <NavLink to="/dashboard" className={navClass}>
              Plans
            </NavLink>
            <NavLink to="/create" className={navClass}>
              New plan
            </NavLink>
            <NavLink to="/docs/overview" className={navClass}>
              Docs
            </NavLink>
          </nav>

          <div className="ml-auto sm:ml-4">
            <WalletButton />
          </div>
        </div>

        <nav className="flex items-stretch border-t border-rule sm:hidden">
          {[
            { to: '/dashboard', label: 'Plans' },
            { to: '/create', label: 'New plan' },
            { to: '/docs/overview', label: 'Docs' },
          ].map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'label flex-1 py-3 text-center transition-colors',
                  i < 2 ? 'border-r border-rule' : '',
                  isActive ? '!text-accent' : 'hover:!text-ink',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-24 border-t border-rule">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          {/* Stated on every page, deliberately. Someone who checks the address they are about
              to approve will find a contract called Recur, not Roxy. If this interface did not
              say so plainly, that mismatch would look exactly like a spoofed front end. */}
          <div className="border-b border-rule pb-5">
            <p className="label">Contract identity</p>
            <p className="prose-serif mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ink-soft">
              Roxy is the interface. The contract it drives is named{' '}
              <strong className="text-ink">Recur</strong>. That is the name you will see on
              the block explorer and in your wallet. Same software, two names.
            </p>
            {isDeployed && RECUR_ADDRESS && (
              <a
                href={explorerAddress(RECUR_ADDRESS)}
                target="_blank"
                rel="noreferrer noopener"
                className="numeric mt-2 inline-block text-[0.78rem] text-ink-muted underline decoration-rule-strong underline-offset-2 hover:text-accent"
              >
                {RECUR_ADDRESS} ↗
              </a>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-md text-[0.85rem] leading-relaxed text-ink-muted">
              Roxy is noncustodial. Your funds stay in your wallet. They pass through the
              contract only during a single transaction. Nothing here is investment advice.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/legal" className="label hover:!text-ink">
                Legal
              </Link>
              <span className="label !text-ink-faint">Robinhood Chain</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
