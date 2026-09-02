import { Link } from 'react-router-dom'

function Clause({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule py-7">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <h2 className="display text-[0.95rem] leading-snug lg:col-span-4">{title}</h2>
        <div className="space-y-3 text-[0.95rem] leading-relaxed text-ink-soft lg:col-span-7 lg:col-start-6">
          {children}
        </div>
      </div>
    </section>
  )
}

export function Legal() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="border-b border-rule pb-7">
        <p className="label">Disclosures</p>
        <h1 className="mt-2 max-w-2xl font-serif text-[2.1rem] leading-[1.12]">
          What you are agreeing to, in plain terms.
        </h1>
      </div>

      <Clause title="Recur is non-custodial">
        <p>
          Recur never takes deposits. Your stablecoin stays in your wallet until an execution
          happens, and during that single transaction it is pulled, swapped and delivered to you.
          The contract has no function that could withdraw or sweep user funds, and no
          administrator can move them.
        </p>
        <p>
          The corollary is that there is nothing to recover from Recur if something goes wrong.
          There is no support desk, no reversal, and no insurance.
        </p>
      </Clause>

      <Clause title="An active plan is a standing permission">
        <p>
          Creating a plan requires approving the contract to spend your stablecoin. While that
          approval and the plan are both live, <strong>anyone</strong> can trigger your purchase
          once the interval has elapsed — that is how the protocol runs without a central keeper,
          and the caller earns a small share of the fee for doing it.
        </p>
        <p>
          You control this in two ways: cancel the plan, or revoke the token approval in your
          wallet. Either stops further purchases immediately.
        </p>
      </Clause>

      <Clause title="Price risk and slippage">
        <p>
          Each execution is floored against a Chainlink reference price read in the same
          transaction. If the pool cannot meet that floor, the transaction reverts and nothing
          moves. The slippage tolerance you choose is the maximum loss you are authorising
          relative to that reference — including to an attacker who deliberately moves the pool
          around your trade.
        </p>
        <p>
          Executions can also simply stop. If the price feed goes stale, if the issuer pauses the
          oracle during a corporate action, or if pool liquidity dries up, plans will fail to
          execute until conditions recover. This is intended behaviour, not a fault.
        </p>
      </Clause>

      <Clause title="Stock Tokens are issued by a third party">
        <p>
          Stock Tokens are issued and administered by Robinhood, not by Recur. They are
          upgradeable contracts: the issuer can change their behaviour, pause transfers, and burn
          balances. Corporate actions such as splits and dividends are handled by a multiplier the
          issuer controls.
        </p>
        <p>
          <strong>
            Issuance and eligibility are restricted by jurisdiction at the issuer level.
          </strong>{' '}
          Whether you may hold these instruments is determined by the issuer and by the law where
          you live — not by this interface, which does not check and cannot advise. Satisfy
          yourself that you are eligible before you use it.
        </p>
      </Clause>

      <Clause title="This is not investment advice">
        <p>
          Nothing in this interface is a recommendation to buy or sell anything. Dollar-cost
          averaging is a scheduling method, not a strategy that protects against loss — a plan
          that buys steadily into a falling asset loses steadily. You can lose money.
        </p>
      </Clause>

      <Clause title="The contract has not been independently audited">
        <p>
          Recur has been reviewed by its own authors and is covered by an automated test suite,
          including tests that run against the live chain. That is not the same as an independent
          audit, and it has not had one. Smart contracts can contain faults that testing does not
          surface.
        </p>
        <p>Use amounts you can afford to lose entirely.</p>
      </Clause>

      <Clause title="No warranty">
        <p>
          This interface and the contract behind it are provided as-is, without warranty of any
          kind. You are responsible for the transactions you sign. Always confirm what your
          wallet is showing you before approving.
        </p>
      </Clause>

      <div className="border-t border-rule pt-8">
        <Link to="/" className="btn btn-ghost">
          Back to the start
        </Link>
      </div>
    </div>
  )
}
