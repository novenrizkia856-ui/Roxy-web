import { Link } from 'react-router-dom'

import { BalanceTrace } from '../components/BalanceTrace'
import { CopyField } from '../components/CopyField'
import { ExecutionFlow } from '../components/ExecutionFlow'
import { HeroProduct } from '../components/HeroProduct'
import { HeroStats } from '../components/HeroStats'
import { LiveFeed } from '../components/LiveFeed'
import { Reveal } from '../components/Reveal'
import { SignalField } from '../components/SignalField'

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

              {/* The one address in the hero is the token, because a visitor who sees "CA" on a
                  page like this is looking for a token. The placeholder carries the whole
                  message until there is an address to put here. The contract address lives in
                  the footer, on every page. */}
              <div className="mt-7 max-w-xl">
                <CopyField label="Token / Roxy" placeholder="Coming soon" />
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

            <div className="lg:col-span-5 lg:pt-6">
              <HeroProduct />
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

        {/* ---- Signal: the field on the left is drawn from the registry, the feed on the
             right from the event log. Both are readings, neither is decoration. ---- */}
        <section className="py-20">
          <Marker name="Signal" index={1} of={3} />

          <div className="mt-8 flex items-baseline justify-between gap-6">
            <h2 className="display max-w-md text-[1.25rem]">Purchases that do not wait for you</h2>
            <p className="prose-serif hidden max-w-sm text-[0.9rem] leading-relaxed text-ink-soft lg:block">
              Read from the chain, not a mock. If the feed is empty, nothing has run yet.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <SignalField />
            </Reveal>

            <Reveal delay={90} className="lg:col-span-5">
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
