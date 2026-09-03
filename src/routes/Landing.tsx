import { Link } from 'react-router-dom'
import { ProgressRing } from '../components/ProgressRing'

/** A still specimen of a plan row, used on the landing page to show the real thing. */
function Specimen() {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <span className="label">Plan 004</span>
        <span className="flex items-center gap-2">
          <span className="pip" data-on="true" aria-hidden />
          <span className="label !text-positive">Active</span>
        </span>
      </div>

      <div className="flex items-center gap-4 px-4 py-4">
        <ProgressRing progress={0.72} label="72% through the current interval" />
        <div className="min-w-0">
          <p className="display text-[0.95rem] leading-tight">NVIDIA</p>
          <p className="numeric text-[0.75rem] text-ink-muted">NVDA · every 7 days</p>
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

/** Section marker: a name and its place in the sequence, so the page reads as an instrument
 *  panel rather than a scroll. */
function Marker({ name, index, of }: { name: string; index: number; of: number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-rule pb-3">
      <span className="marker">{name}</span>
      <span className="numeric text-[0.65rem] text-ink-faint">
        {String(index).padStart(2, '0')} / {String(of).padStart(2, '0')}
      </span>
    </div>
  )
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-rule pt-4">
      <div className="flex items-baseline gap-3">
        <span className="numeric text-[0.72rem] text-accent">{n}</span>
        <h3 className="display text-[0.95rem]">{title}</h3>
      </div>
      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">{children}</p>
    </div>
  )
}

export function Landing() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* ---- Hero: asymmetric, 7 columns of type against 5 of data ---- */}
      <section className="grid grid-cols-1 gap-12 pt-14 pb-20 lg:grid-cols-12 lg:gap-10 lg:pt-20">
        <div className="rise lg:col-span-7">
          <span className="marker">Non-custodial scheduler</span>

          {/* Machine voice: the claim, set in mono and tracked wide so it reads as a headline
              rather than as code. */}
          <h1 className="display mt-6 text-[1.75rem] text-balance sm:text-[2.3rem]">
            Buy the same amount,
            <br />
            on the same day,
            <br />
            <span className="text-accent">without being there.</span>
          </h1>

          {/* Human voice: every sentence of prose stays in the serif. */}
          <p className="prose-serif mt-7 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">
            Roxy schedules recurring purchases of Stock Tokens. You approve your stablecoin once
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

          <p className="prose-serif mt-7 max-w-xl text-[0.85rem] leading-relaxed text-ink-faint">
            Roxy is the interface. The contract it drives is named{' '}
            <span className="text-ink-muted">Recur</span> — that is the name your wallet and the
            block explorer will show you.{' '}
            <Link
              to="/legal"
              className="underline decoration-rule-strong underline-offset-2 hover:text-accent"
            >
              Why the two names
            </Link>
            .
          </p>
        </div>

        <div className="rise lg:col-span-5 lg:pt-12" style={{ animationDelay: '90ms' }}>
          <Specimen />
          <p className="mt-3 text-[0.8rem] leading-relaxed text-ink-faint">
            An illustration, not live data.
          </p>
        </div>
      </section>

      {/* ---- Key figures: a ruled instrument row, columns intentionally unequal ---- */}
      <section className="grid grid-cols-2 border-y border-rule sm:grid-cols-4">
        {[
          { k: 'Protocol fee', v: '0.50%', n: 'Capped at 0.75% in code' },
          { k: 'Shortest interval', v: '1 hour', n: 'You choose the cadence' },
          { k: 'Held by Roxy', v: '0.00', n: 'Between transactions, always' },
          { k: 'Cancel anytime', v: 'Yours', n: 'Only you can end your plan' },
        ].map((item, i) => (
          <div
            key={item.k}
            className={`px-4 py-6 sm:px-5 ${i < 3 ? 'sm:border-r sm:border-rule' : ''} ${
              i % 2 === 0 ? 'border-r border-rule sm:border-r' : ''
            } ${i < 2 ? 'border-b border-rule sm:border-b-0' : ''}`}
          >
            <p className="label">{item.k}</p>
            <p className="numeric mt-2 text-[1.5rem] leading-none">{item.v}</p>
            <p className="mt-2 text-[0.82rem] leading-snug text-ink-muted">{item.n}</p>
          </div>
        ))}
      </section>

      {/* ---- How it works: staggered, not a three-up card grid ---- */}
      <section className="py-20">
        <Marker name="Process" index={1} of={2} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="display text-[1.25rem]">Three steps, then it runs itself</h2>
            <p className="prose-serif mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft">
              There is no subscription and no account. The schedule lives in a contract you can
              read, and you can revoke it at any moment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
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
        <Marker name="Custody" index={2} of={2} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <blockquote className="prose-serif border-l-2 border-accent pl-5 text-[1.4rem] leading-snug">
              Every purchase is one transaction: pull, swap, deliver. If any part fails, none of
              it happened.
            </blockquote>
          </div>

          <div className="prose-serif space-y-5 text-[0.95rem] leading-relaxed text-ink-soft lg:col-span-6 lg:col-start-7">
            <p>
              Roxy holds no deposits. There is no balance to withdraw, because there is never a
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
