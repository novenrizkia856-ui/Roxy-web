import { Link } from 'react-router-dom'
import { ProgressRing } from '../components/ProgressRing'

/** A still specimen of a plan row, used on the landing page to show the real thing. */
function Specimen() {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-baseline justify-between border-b border-rule px-4 py-2.5">
        <span className="label">Plan 004</span>
        <span className="label !text-positive">Active</span>
      </div>

      <div className="flex items-center gap-4 px-4 py-4">
        <ProgressRing progress={0.72} label="72% through the current interval" />
        <div className="min-w-0">
          <p className="font-display text-[1.05rem] leading-tight">
            NVIDIA <span className="text-ink-faint">·</span>{' '}
            <span className="numeric text-[0.95rem]">NVDA</span>
          </p>
          <p className="numeric text-[0.78rem] text-ink-muted">Every 7 days</p>
        </div>
        <div className="ml-auto text-right">
          <p className="label">Next buy</p>
          <p className="numeric text-[1.05rem] leading-tight">1d 22h</p>
        </div>
      </div>

      <dl className="grid grid-cols-3 border-t border-rule">
        <div className="border-r border-rule px-4 py-3">
          <dt className="label">Per cycle</dt>
          <dd className="numeric mt-0.5 text-[0.95rem]">250.00</dd>
        </div>
        <div className="border-r border-rule px-4 py-3">
          <dt className="label">Invested</dt>
          <dd className="numeric mt-0.5 text-[0.95rem]">3,000.00</dd>
        </div>
        <div className="px-4 py-3">
          <dt className="label">Slippage</dt>
          <dd className="numeric mt-0.5 text-[0.95rem]">1.00%</dd>
        </div>
      </dl>
    </div>
  )
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-rule pt-5">
      <span className="numeric text-[0.8rem] font-medium text-accent">{n}</span>
      <h3 className="mt-2 font-display text-[1.3rem] leading-snug">{title}</h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{children}</p>
    </div>
  )
}

export function Landing() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* ---- Hero: deliberately asymmetric, 7 columns of type against 5 of data ---- */}
      <section className="grid grid-cols-1 gap-12 pt-16 pb-20 lg:grid-cols-12 lg:gap-10 lg:pt-24">
        <div className="rise lg:col-span-7">
          <p className="label">Robinhood Chain · Non-custodial</p>

          <h1 className="mt-5 font-display text-[2.7rem] leading-[1.08] font-normal tracking-[-0.02em] text-balance sm:text-[3.4rem]">
            Buy the same amount,
            <br />
            on the same day,
            <span className="text-accent"> without being there.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">
            Recur schedules recurring purchases of Stock Tokens. You approve your stablecoin once
            and set the terms. When a plan comes due, anyone can trigger it — and they are paid a
            small tip for the gas. Your money never sits in the contract.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/create" className="btn btn-primary">
              Create a plan
            </Link>
            <Link to="/dashboard" className="btn btn-ghost">
              View my plans
            </Link>
          </div>
        </div>

        <div className="rise lg:col-span-5 lg:pt-12" style={{ animationDelay: '90ms' }}>
          <Specimen />
          <p className="mt-3 text-[0.8rem] leading-relaxed text-ink-faint">
            An illustration, not live data.
          </p>
        </div>
      </section>

      {/* ---- Key figures: a ruled statement row, columns intentionally unequal ---- */}
      <section className="grid grid-cols-2 border-y border-rule sm:grid-cols-4">
        {[
          { k: 'Protocol fee', v: '0.50%', n: 'Capped at 0.75% in code' },
          { k: 'Shortest interval', v: '1 hour', n: 'You choose the cadence' },
          { k: 'Held by Recur', v: '0.00', n: 'Between transactions, always' },
          { k: 'Cancel anytime', v: 'Yours', n: 'Only you can end your plan' },
        ].map((item, i) => (
          <div
            key={item.k}
            className={`px-4 py-6 sm:px-5 ${i < 3 ? 'sm:border-r sm:border-rule' : ''} ${
              i % 2 === 0 ? 'border-r border-rule sm:border-r' : ''
            } ${i < 2 ? 'border-b border-rule sm:border-b-0' : ''}`}
          >
            <p className="label">{item.k}</p>
            <p className="numeric mt-1.5 text-[1.5rem] leading-none">{item.v}</p>
            <p className="mt-2 text-[0.82rem] leading-snug text-ink-muted">{item.n}</p>
          </div>
        ))}
      </section>

      {/* ---- How it works: staggered, not a three-up card grid ---- */}
      <section className="py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-display text-[2rem] leading-tight tracking-[-0.015em]">
              Three steps, then it runs itself.
            </h2>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft">
              There is no subscription and no account. The schedule lives in a contract you can
              read, and you can revoke it at any moment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            <Step n="01" title="Approve once">
              Give the contract permission to spend your stablecoin. This is a normal ERC-20
              approval and you can revoke it whenever you like.
            </Step>
            <Step n="02" title="Set the terms">
              Choose the asset, the amount per cycle, how often, and the most slippage you will
              accept. All four are stored on-chain against your address.
            </Step>
            <Step n="03" title="It executes">
              When the interval elapses, anyone may call the plan. The contract pulls exactly one
              cycle, swaps it on Uniswap, and sends the tokens to you.
            </Step>
            <Step n="04" title="Or it doesn't">
              If the price feed is stale or the pool has moved past your slippage, the whole
              transaction reverts. Nothing half-happens.
            </Step>
          </div>
        </div>
      </section>

      {/* ---- Custody: the claim that matters most, given its own space ---- */}
      <section className="border-t border-rule py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label">What non-custodial actually means here</p>
            <blockquote className="mt-5 border-l-2 border-accent pl-5 font-display text-[1.5rem] leading-snug tracking-[-0.01em]">
              Every purchase is one transaction: pull, swap, deliver. If any part fails, none of
              it happened.
            </blockquote>
          </div>

          <div className="space-y-5 text-[0.95rem] leading-relaxed text-ink-soft lg:col-span-6 lg:col-start-7">
            <p>
              Recur holds no deposits. There is no balance to withdraw, because there is never a
              balance — the contract has no function that could sweep one, and its token balance
              returning to zero after every transaction is enforced by an automated test that runs
              thousands of random sequences.
            </p>
            <p>
              The trade-off you are accepting is different: an active plan means a standing
              allowance, and a purchase that can be triggered by a stranger at a moment you did
              not pick. The slippage limit you set is what bounds that, and it is checked against
              a Chainlink price read in the same transaction — not the pool's own price, which an
              attacker could move.
            </p>
            <p>
              <Link
                to="/legal"
                className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
              >
                Read the full disclosures
              </Link>{' '}
              before you create a plan.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
