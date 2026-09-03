import { Link } from 'react-router-dom'

import { BalanceTrace } from '../components/BalanceTrace'
import { CopyField } from '../components/CopyField'
import { ExecutionFlow } from '../components/ExecutionFlow'
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
              <span className="marker">Noncustodial scheduler</span>

              {/* Set heavy and large: at headline size a lighter monospace reads as a caption
                  rather than as a statement. */}
              <h1 className="display-hero mt-6 max-w-[15ch] text-[1.9rem] sm:text-[2.4rem] lg:max-w-[16ch] lg:text-[3.15rem]">
                Buy the same amount, on the same day,{' '}
                <span className="text-accent">without being there.</span>
              </h1>

              {/* Human voice: every sentence of prose stays in the serif. */}
              <p className="prose-serif mt-7 max-w-lg text-[1.05rem] leading-relaxed text-ink-soft">
                Pick a stock. Pick an amount. Pick how often. Roxy buys it on schedule, and your
                money never sits in the contract.
              </p>

              {/* Two addresses, and they must never be confused for each other. A visitor who
                  sees "CA" on a page like this assumes "token to buy", so each field states what
                  it is and each caption states what it is not. */}
              <div className="mt-7 max-w-xl space-y-4">
                {isDeployed && RECUR_ADDRESS && (
                  <div>
                    <CopyField
                      label="Contract / Recur"
                      value={RECUR_ADDRESS}
                      href={explorerAddress(RECUR_ADDRESS)}
                    />
                    <p className="prose-serif mt-2 text-[0.8rem] leading-relaxed text-ink-faint">
                      The protocol contract. It is not a token. Never send funds to it. It is
                      named Recur, not Roxy, so that is the name your wallet will show you.{' '}
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

                <div>
                  <CopyField label="Token / Roxy" placeholder="Coming soon" />
                  <p className="prose-serif mt-2 text-[0.8rem] leading-relaxed text-ink-faint">
                    No Roxy token exists yet. Any address claiming to be one is fake. This field
                    will show the real address when there is one.
                  </p>
                </div>
              </div>

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
                Every execution the contract has made, read from its own event log. Not a
                mock. If this list is empty, nothing has run yet, and it says so.
              </p>
            </Reveal>

            <Reveal delay={90} className="lg:col-span-7 lg:col-start-6">
              <LiveFeed />
            </Reveal>
          </div>
        </section>

        {/* ---- Process: the diagram does the explaining, the steps are labels ---- */}
        <section className="border-t border-rule py-20">
          <Marker name="Process" index={2} of={3} />

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="display text-[1.25rem]">Three steps, then it runs itself</h2>
              <p className="prose-serif mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft">
                No subscription. No account. Revoke it whenever you like.
              </p>
            </div>

            <Reveal delay={80} className="lg:col-span-7 lg:col-start-6">
              <ExecutionFlow />
            </Reveal>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            <Step n="01" delay={0} title="Approve once">
              One ERC20 approval, for as many cycles as you choose.
            </Step>
            <Step n="02" delay={70} title="Set the terms">
              Asset, amount, how often, and the worst price you accept.
            </Step>
            <Step n="03" delay={140} title="It executes">
              Anyone can trigger it. They earn a tip for the gas.
            </Step>
            <Step n="04" delay={210} title="Or it doesn't">
              Stale price or a bad fill, and nothing happens at all.
            </Step>
          </div>
        </section>

        {/* ---- Custody: the claim is drawn rather than argued at length ---- */}
        <section className="border-t border-rule py-20">
          <Marker name="Custody" index={3} of={3} />

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <blockquote className="prose-serif border-l-2 border-accent pl-5 text-[1.35rem] leading-snug">
                Roxy holds no deposits. There is no balance to withdraw, because there is never a
                balance.
              </blockquote>

              <p className="prose-serif mt-6 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft">
                What you accept instead is a standing allowance, and a purchase a stranger can
                trigger. Your slippage limit is what bounds that.{' '}
                <Link
                  to="/docs/security"
                  className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
                >
                  Read the security model
                </Link>
                .
              </p>
            </Reveal>

            <Reveal delay={90} className="lg:col-span-7 lg:col-start-6">
              <BalanceTrace />
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  )
}
