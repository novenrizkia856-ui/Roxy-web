import { Link } from 'react-router-dom'

import { CopyField } from '../components/CopyField'
import { HeroStats } from '../components/HeroStats'
import { LiveFeed } from '../components/LiveFeed'
import { ProgressRing } from '../components/ProgressRing'
import { Reveal } from '../components/Reveal'
import { explorerAddress } from '../config/chains'
import { isDeployed, RECUR_ADDRESS } from '../config/contract'

/** A still specimen of a plan row, used on the landing page to show the real thing. */
function Specimen() {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <span className="label">Plan 004</span>
        <span className="flex items-center gap-2">
          <span
            className="pip"
            data-on="true"
            style={{ '--pulse': '1.7s' } as React.CSSProperties}
            aria-hidden
          />
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

function Step({
  n,
  title,
  delay = 0,
  children,
}: {
  n: string
  title: string
  delay?: number
  children: React.ReactNode
}) {
  return (
    <Reveal delay={delay} className="border-t border-rule pt-4">
      <div className="flex items-baseline gap-3">
        <span className="numeric text-[0.72rem] text-accent">{n}</span>
        <h3 className="display text-[0.95rem]">{title}</h3>
      </div>
      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">{children}</p>
    </Reveal>
  )
}

/** Shared page measure, so every section rules to the same width. */
const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8'

export function Landing() {
  return (
    <div>
      {/* ---- Hero: fills the first screen, counter strip pinned to its foot ---- */}
      <section className="flex min-h-[calc(100dvh-7.5rem)] flex-col">
        <div className={`${CONTAINER} railed flex flex-1 items-center`}>
          <div className="grid w-full grid-cols-1 gap-12 py-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <span className="marker">Non-custodial scheduler</span>

              {/* Set heavy and large: at headline size a lighter monospace reads as a caption
                  rather than as a statement. */}
              {/* No manual line breaks: they fight the natural wrap and produce a ragged extra
                  line. A measure is set instead and the text is allowed to break where it fits. */}
              <h1 className="display-hero mt-6 max-w-[15ch] text-[1.9rem] sm:text-[2.4rem] lg:max-w-[16ch] lg:text-[3.15rem]">
                Buy the same amount, on the same day,{' '}
                <span className="text-accent">without being there.</span>
              </h1>

              {/* Human voice: every sentence of prose stays in the serif. */}
              <p className="prose-serif mt-7 max-w-xl text-[1.02rem] leading-relaxed text-ink-soft">
                Roxy schedules recurring purchases of Stock Tokens. You approve your stablecoin
                once and set the terms. When a plan comes due, anyone can trigger it — and they
                are paid a small tip for the gas. Your money never sits in the contract.
              </p>

              {isDeployed && RECUR_ADDRESS && (
                <div className="mt-7 max-w-xl">
                  <CopyField
                    label="CA"
                    value={RECUR_ADDRESS}
                    href={explorerAddress(RECUR_ADDRESS)}
                  />
                  <p className="prose-serif mt-2.5 text-[0.8rem] leading-relaxed text-ink-faint">
                    The contract is named <span className="text-ink-muted">Recur</span>, not Roxy
                    — that is the name your wallet will show.{' '}
                    <Link
                      to="/legal"
                      className="underline decoration-rule-strong underline-offset-2 hover:text-accent"
                    >
                      Why the two names
                    </Link>
                    .
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/create" className="btn btn-primary">
                  Create a plan
                </Link>
                <Link to="/dashboard" className="btn btn-ghost">
                  View my plans
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 lg:pt-10">
              <Specimen />
              <p className="mt-3 text-[0.8rem] leading-relaxed text-ink-faint">
                An illustration, not live data.
              </p>
            </div>
          </div>
        </div>

        {/* Full-bleed, pinned to the bottom of the first screen. Every figure is read from the
            chain - see HeroStats. */}
        <HeroStats />
      </section>

      <div className={CONTAINER}>
        {/* ---- Key figures: a ruled instrument row, columns intentionally unequal ---- */}
        <section className="grid grid-cols-2 border-b border-rule sm:grid-cols-4">
          {[
            { k: 'Protocol fee', v: '0.50%', n: 'Capped at 0.75% in code' },
            { k: 'Shortest interval', v: '1 hour', n: 'You choose the cadence' },
            { k: 'Held by Roxy', v: '0.00', n: 'Between transactions, always' },
            { k: 'Cancel anytime', v: 'Yours', n: 'Only you can end your plan' },
          ].map((item, i) => (
            <Reveal
              key={item.k}
              delay={i * 70}
              className={`px-4 py-6 sm:px-5 ${i < 3 ? 'sm:border-r sm:border-rule' : ''} ${
                i % 2 === 0 ? 'border-r border-rule sm:border-r' : ''
              } ${i < 2 ? 'border-b border-rule sm:border-b-0' : ''}`}
            >
              <p className="label">{item.k}</p>
              <p className="numeric mt-2 text-[1.5rem] leading-none">{item.v}</p>
              <p className="mt-2 text-[0.82rem] leading-snug text-ink-muted">{item.n}</p>
            </Reveal>
          ))}
        </section>

        {/* ---- Signal: what the protocol has actually done, not a mock ---- */}
        <section className="py-20">
          <Marker name="Signal" index={1} of={3} />

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <h2 className="display text-[1.25rem]">Purchases that do not wait for you</h2>
              <p className="prose-serif mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft">
                Every execution the contract has ever made, read straight from its own event log.
                Not a mock-up — if this list is empty, nothing has run yet, and it says so.
              </p>
            </Reveal>

            <Reveal delay={90} className="lg:col-span-7 lg:col-start-6">
              <LiveFeed />
            </Reveal>
          </div>
        </section>

        {/* ---- How it works: staggered, not a three-up card grid ---- */}
        <section className="border-t border-rule py-20">
          <Marker name="Process" index={2} of={3} />

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="display text-[1.25rem]">Three steps, then it runs itself</h2>
              <p className="prose-serif mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft">
                There is no subscription and no account. The schedule lives in a contract you can
                read, and you can revoke it at any moment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
              <Step n="01" delay={0} title="Approve once">
                Give the contract permission to spend your stablecoin. This is a normal ERC-20
                approval and you can revoke it whenever you like.
              </Step>
              <Step n="02" delay={70} title="Set the terms">
                Choose the asset, the amount per cycle, how often, and the most slippage you will
                accept. All four are stored on-chain against your address.
              </Step>
              <Step n="03" delay={140} title="It executes">
                When the interval elapses, anyone may call the plan. The contract pulls exactly
                one cycle, swaps it on Uniswap, and sends the tokens to you.
              </Step>
              <Step n="04" delay={210} title="Or it doesn't">
                If the price feed is stale or the pool has moved past your slippage, the whole
                transaction reverts. Nothing half-happens.
              </Step>
            </div>
          </div>
        </section>

        {/* ---- Custody: the claim that matters most, given its own space ---- */}
        <section className="border-t border-rule py-20">
          <Marker name="Custody" index={3} of={3} />

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <blockquote className="prose-serif border-l-2 border-accent pl-5 text-[1.4rem] leading-snug">
                Every purchase is one transaction: pull, swap, deliver. If any part fails, none of
                it happened.
              </blockquote>
            </Reveal>

            <div className="prose-serif space-y-5 text-[0.95rem] leading-relaxed text-ink-soft lg:col-span-6 lg:col-start-7">
              <p>
                Roxy holds no deposits. There is no balance to withdraw, because there is never a
                balance — the contract has no function that could sweep one, and its token
                balance returning to zero after every transaction is enforced by an automated
                test that runs thousands of random sequences.
              </p>
              <p>
                The trade-off you are accepting is different: an active plan means a standing
                allowance, and a purchase that can be triggered by a stranger at a moment you did
                not pick. The slippage limit you set is what bounds that, and it is checked
                against a Chainlink price read in the same transaction — not the pool's own
                price, which an attacker could move.
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
    </div>
  )
}
