import type { ReactNode } from 'react'

import { C, Fields, Note, Pre } from './elements'

export interface DocSection {
  id: string
  heading: string
  body: ReactNode
}

export interface DocPage {
  slug: string
  title: string
  /** One line, shown under the title and in the sidebar tooltip. */
  summary: string
  group: string
  sections: DocSection[]
}

export const DOC_PAGES: DocPage[] = [
  // ---------------------------------------------------------------------------------------
  {
    slug: 'overview',
    title: 'What Roxy is',
    summary: 'A scheduler for recurring Stock Token purchases that never holds your money.',
    group: 'Introduction',
    sections: [
      {
        id: 'summary',
        heading: 'In one paragraph',
        body: (
          <>
            <p>
              Roxy lets you schedule a recurring purchase of a Robinhood Chain Stock Token. You
              approve a stablecoin once and record the terms on chain. When a plan comes due,
              anyone can trigger it. The contract pulls exactly one cycle from your wallet, swaps
              it on Uniswap, then sends the tokens straight to you.
            </p>
            <p className="mt-4">
              Your money is never held by the protocol. It moves from your wallet to the pool to
              you inside a single transaction. If any step fails, the whole transaction reverts
              and nothing moved.
            </p>
          </>
        ),
      },
      {
        id: 'names',
        heading: 'Roxy and Recur',
        body: (
          <>
            <p>
              The product is named Roxy. The contract is named <C>Recur</C>. They are the same
              software. The contract was written, deployed and verified before the product was
              renamed, and a deployed contract cannot be renamed.
            </p>
            <p className="mt-4">
              This matters when you approve an allowance. Your wallet and the block explorer will
              name the counterparty Recur, not Roxy. That is expected.
            </p>
            <Note tone="warn">
              There is no Roxy token. Any address presented as one today is fake.
            </Note>
          </>
        ),
      },
      {
        id: 'suitable',
        heading: 'What it is not',
        body: (
          <>
            <p>
              It is not a custodian, an exchange, or a yield product. It does not hold balances,
              it does not lend, and it has no deposit function.
            </p>
            <p className="mt-4">
              It is also not a guarantee that a trade will happen at a chosen moment. Nobody is
              obliged to execute your plan. See <C>Execution</C>.
            </p>
          </>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------------------
  {
    slug: 'how-it-works',
    title: 'How it works',
    summary: 'The full lifecycle of a plan, from approval to delivery.',
    group: 'Introduction',
    sections: [
      {
        id: 'lifecycle',
        heading: 'Lifecycle',
        body: (
          <>
            <Pre>{`approve(stablecoin)      you, once
createPlan(...)          you, once
execute(planId)          anyone, every interval
cancel(planId)           you, whenever`}</Pre>
            <p className="mt-4">
              Only the first two need you. After that the plan runs on its own, as long as
              somebody calls <C>execute</C>.
            </p>
          </>
        ),
      },
      {
        id: 'inside-execute',
        heading: 'What happens inside execute',
        body: (
          <>
            <p>The order is fixed, and it is the reason the protocol never holds anything.</p>
            <Fields
              rows={[
                ['1. Check', 'The plan must be active and the interval must have elapsed.'],
                ['2. Price', 'Read the Chainlink feed. Reject a stale or non positive answer. Derive a minimum output from it and your slippage limit.'],
                ['3. Record', 'Write the new lastExecuted before any external call.'],
                ['4. Pull', 'Take exactly one cycle from your wallet using your allowance.'],
                ['5. Swap', 'Approve the router for that exact amount, then swap with the minimum enforced.'],
                ['6. Deliver', 'Send your tokens to you, the fee to the treasury, the tip to the caller.'],
              ]}
            />
            <p className="mt-4">
              The contract holds no balance before or after. That property is enforced by an
              invariant test that runs thousands of random sequences.
            </p>
          </>
        ),
      },
      {
        id: 'first-cycle',
        heading: 'The first cycle',
        body: (
          <p>
            A new plan is immediately due. The first purchase can happen as soon as somebody
            calls it, rather than one interval later.
          </p>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------------------
  {
    slug: 'creating-a-plan',
    title: 'Creating a plan',
    summary: 'The four decisions a plan records, and how to choose them.',
    group: 'Using Roxy',
    sections: [
      {
        id: 'decisions',
        heading: 'Four decisions',
        body: (
          <Fields
            rows={[
              ['Asset', 'Which Stock Token to buy. Only assets registered by the protocol can be scheduled.'],
              ['Amount per cycle', 'Exactly this much stablecoin is pulled each time. Never more.'],
              ['Interval', 'How long between purchases. The contract enforces a minimum of one hour.'],
              ['Max slippage', 'The worst price you will accept, measured against the oracle. Capped at 30 percent.'],
            ]}
          />
        ),
      },
      {
        id: 'allowance',
        heading: 'Choosing an allowance',
        body: (
          <>
            <p>
              Roxy can only move stablecoin you have explicitly allowed. The interface asks how
              many cycles to cover and defaults to twelve, rather than silently requesting an
              unlimited allowance.
            </p>
            <p className="mt-4">
              Unlimited is available and is one click, but a smaller allowance is a smaller
              exposure. When it runs out the plan simply stops until you approve more.
            </p>
          </>
        ),
      },
      {
        id: 'registered',
        heading: 'Why the asset list is short',
        body: (
          <>
            <p>
              Robinhood Chain hosts many counterfeit tokens reusing real tickers. A search for
              NVDA returns several, only one of which is genuine.
            </p>
            <p className="mt-4">
              So the protocol keeps a curated registry. A plan for an unregistered token reverts
              with <C>TokenNotEnabled</C>. The trade off is that listing a new asset requires an
              owner transaction.
            </p>
          </>
        ),
      },
      {
        id: 'unfunded',
        heading: 'Creating a plan you cannot yet fund',
        body: (
          <p>
            This is allowed. The plan is recorded and simply fails to execute until your balance
            covers a cycle. Nothing is lost by creating it early.
          </p>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------------------
  {
    slug: 'execution',
    title: 'Execution and keepers',
    summary: 'Who runs your plan, why they bother, and what happens if nobody does.',
    group: 'Using Roxy',
    sections: [
      {
        id: 'permissionless',
        heading: 'Anyone can execute',
        body: (
          <>
            <p>
              <C>execute</C> is open to any address. There is no privileged keeper and no server
              behind the protocol. Whoever calls it pays the gas and receives a share of the fee
              as a tip.
            </p>
            <p className="mt-4">
              The caller cannot redirect your tokens. The plan owner is written once, at
              creation, and there is no path that changes it.
            </p>
          </>
        ),
      },
      {
        id: 'no-keeper',
        heading: 'Nobody is obliged to run it',
        body: (
          <>
            <Note tone="warn">
              A plan that has come due sits waiting until someone calls it. If no keeper is
              watching, it may execute late or not at all.
            </Note>
            <p className="mt-4">
              The tip exists to make running a keeper worthwhile. On a new chain there may not be
              one yet. You can always execute your own plan from the interface or straight from
              the block explorer.
            </p>
          </>
        ),
      },
      {
        id: 'when-it-reverts',
        heading: 'When execution refuses',
        body: (
          <>
            <p>These are all intended, not faults.</p>
            <Fields
              rows={[
                ['PlanNotDue', 'The interval has not elapsed yet.'],
                ['PlanNotActive', 'The plan was cancelled.'],
                ['StalePrice', 'The oracle answer is older than the staleness bound, or is not positive.'],
                ['SlippageExceeded', 'The pool could not meet the floor derived from the oracle.'],
                ['ContractPaused', 'The owner has paused the protocol.'],
              ]}
            />
          </>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------------------
  {
    slug: 'pricing',
    title: 'Pricing, slippage and fees',
    summary: 'How the floor price is derived and where the fee goes.',
    group: 'Using Roxy',
    sections: [
      {
        id: 'oracle',
        heading: 'The floor comes from the oracle',
        body: (
          <>
            <p>
              Every execution reads a Chainlink feed in the same transaction as the swap. Your
              minimum output is derived from that reference price, reduced by your slippage
              limit.
            </p>
            <Pre>{`usdValue     = amountIn * stablePrice / 10^stableDecimals
expectedOut  = usdValue * 10^stockDecimals / stockPrice
minAmountOut = expectedOut * (10000 - maxSlippageBps) / 10000`}</Pre>
            <p className="mt-4">
              The floor is anchored to the oracle rather than to the pool. Moving the pool
              therefore cannot widen your tolerance. That is what bounds a sandwich attack.
            </p>
          </>
        ),
      },
      {
        id: 'staleness',
        heading: 'Staleness',
        body: (
          <>
            <p>
              The Robinhood equity feeds publish on a 24 hour heartbeat and freeze deliberately
              during corporate actions. The contract accepts an answer up to 26 hours old by
              default.
            </p>
            <p className="mt-4">
              A tighter bound would look safer and would in fact break the protocol, reverting
              every night and all weekend.
            </p>
          </>
        ),
      },
      {
        id: 'fee',
        heading: 'The fee',
        body: (
          <>
            <Fields
              rows={[
                ['Protocol fee', '0.50 percent of the output, taken in the Stock Token.'],
                ['Hard cap', '0.75 percent. The owner cannot exceed it.'],
                ['Keeper tip', '20 percent of the fee, paid to whoever called execute.'],
                ['Treasury', 'The remaining 80 percent, sent to a 2 of 3 multisig.'],
              ]}
            />
            <p className="mt-4">
              On a 100 unit cycle the whole fee is half a unit, of which the caller keeps a
              tenth of a unit. That has to beat their gas cost or nobody will run keepers.
            </p>
          </>
        ),
      },
      {
        id: 'choosing-slippage',
        heading: 'Choosing a slippage limit',
        body: (
          <>
            <p>
              Below roughly 0.75 percent the pool fee and spread alone breach the floor, so most
              executions simply revert. A measured round trip on the live pool cost about 0.15
              percent above the pool fee.
            </p>
            <p className="mt-4">
              Wider is not safer. Your limit is the ceiling on what a bad fill can cost you.
            </p>
          </>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------------------
  {
    slug: 'security',
    title: 'Security model',
    summary: 'What the contract guarantees, what it does not, and where the trust sits.',
    group: 'Reference',
    sections: [
      {
        id: 'custody',
        heading: 'No custody',
        body: (
          <>
            <p>
              There is no deposit function, no balance to withdraw, and no sweep or rescue
              function. The contract's own token balances are zero before and after every
              transaction.
            </p>
            <p className="mt-4">
              This is asserted as an invariant, not just a unit test, and it is checked again by
              a test that runs against the live deployment.
            </p>
          </>
        ),
      },
      {
        id: 'admin',
        heading: 'What the owner can do',
        body: (
          <>
            <p>
              The owner is a 2 of 3 multisig. It can pause the protocol, adjust the fee within
              the hard cap, change the treasury address, curate the token registry, and move the
              staleness bound within fixed limits.
            </p>
            <p className="mt-4">
              It <strong>cannot</strong> withdraw funds, cancel or alter your plan, or raise the
              fee beyond the cap. Ownership transfer is two step.
            </p>
          </>
        ),
      },
      {
        id: 'c1',
        heading: 'The indirect path to user funds',
        body: (
          <>
            <Note tone="warn">
              This is a known and accepted finding, recorded as C-1 in the audit notes. It is the
              single reason the owner must be a multisig.
            </Note>
            <p className="mt-4">
              The owner chooses the price feed each asset is valued against, and your slippage
              floor is derived from that feed. An owner who substituted a feed reporting an
              inflated price would drive the floor toward zero, and a single cycle of yours could
              then fill at a bad price.
            </p>
            <p className="mt-4">
              The exposure is bounded. It is at most one cycle, and only while your plan and
              allowance are both live. It is also why a smaller allowance is worth the extra
              clicks.
            </p>
          </>
        ),
      },
      {
        id: 'third-party',
        heading: 'Dependencies you are also trusting',
        body: (
          <Fields
            rows={[
              ['Stock Tokens', 'Upgradeable and issued by Robinhood. The issuer can pause transfers and burn balances.'],
              ['Chainlink', 'The price the floor is derived from.'],
              ['Uniswap', 'The pool the swap routes through. Thin liquidity means worse fills.'],
              ['The chain', 'A single sequencer Arbitrum Orbit L2.'],
            ]}
          />
        ),
      },
      {
        id: 'audit',
        heading: 'No independent audit',
        body: (
          <p>
            The contract has been reviewed by its authors and is covered by 90 offline tests,
            fork tests against the real router and feeds, and tests against the live deployment.
            None of that is the same as an independent audit, and it has not had one.
          </p>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------------------
  {
    slug: 'contract',
    title: 'Contract reference',
    summary: 'Functions, events and errors, for reading or calling the contract directly.',
    group: 'Reference',
    sections: [
      {
        id: 'user-functions',
        heading: 'Functions you call',
        body: (
          <>
            <Pre>{`createPlan(address stockToken,
           uint256 amountPerCycle,
           uint256 interval,
           uint16  maxSlippageBps) returns (uint256 planId)

execute(uint256 planId) returns (uint256 amountOut)

cancel(uint256 planId)`}</Pre>
            <p className="mt-4">
              <C>cancel</C> is restricted to the plan owner. It is deliberately not available to
              the contract owner.
            </p>
          </>
        ),
      },
      {
        id: 'views',
        heading: 'Views',
        body: (
          <Fields
            rows={[
              ['getPlan(planId)', 'The full plan struct.'],
              ['getUserPlans(address)', 'Every plan id belonging to an address.'],
              ['isDue(planId)', 'Whether the interval has elapsed.'],
              ['nextExecutionAt(planId)', 'The timestamp the plan becomes executable.'],
              ['quoteMinAmountOut(planId)', 'The floor the next execution would enforce.'],
              ['tokenConfigs(token)', 'Feed, pool tier, decimals and whether the asset is enabled.'],
            ]}
          />
        ),
      },
      {
        id: 'events',
        heading: 'Events',
        body: (
          <Pre>{`PlanCreated(planId, owner, stockToken, amountPerCycle, interval, maxSlippageBps)
PlanExecuted(planId, executor, amountIn, amountOut, protocolFee, keeperTip)
PlanCancelled(planId, owner)
TokenConfigUpdated(stockToken, feed, poolFee, enabled)
FeeUpdated(oldBps, newBps)`}</Pre>
        ),
      },
      {
        id: 'exit',
        heading: 'Exiting without this interface',
        body: (
          <>
            <p>
              The contract is verified, so the explorer exposes a write tab. If this site is ever
              unavailable you can call <C>cancel</C> there directly, and revoke the allowance from
              your wallet.
            </p>
            <p className="mt-4">
              Noncustodial only means something if you can leave without asking anyone.
            </p>
          </>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------------------
  {
    slug: 'networks',
    title: 'Networks and addresses',
    summary: 'Where the protocol is deployed and which assets are registered.',
    group: 'Reference',
    sections: [
      {
        id: 'mainnet',
        heading: 'Robinhood Chain mainnet',
        body: (
          <Fields
            rows={[
              ['Chain id', '4663'],
              ['RPC', 'https://rpc.mainnet.chain.robinhood.com'],
              ['Explorer', 'https://robinhoodchain.blockscout.com'],
              ['Recur', '0xE59a22e8536294f352f74df6B97b7eec5df9Abd2'],
              ['Treasury', '0xcBEFcb8A4E931A91b4C3Dd99fAfA7DA45017c861'],
              ['Stablecoin', 'USDG, 0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168'],
            ]}
          />
        ),
      },
      {
        id: 'assets',
        heading: 'Registered assets',
        body: (
          <>
            <Fields
              rows={[
                ['NVDA', '0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC, pool tier 0.05 percent'],
              ]}
            />
            <p className="mt-4">
              More assets require both a liquid pool and an owner transaction to register. A feed
              exists for many more tickers, but a thin pool makes a plan worse than no plan.
            </p>
          </>
        ),
      },
      {
        id: 'verifying',
        heading: 'Verifying an address yourself',
        body: (
          <>
            <p>
              A genuine Robinhood Stock Token implements <C>uiMultiplier()</C> and{' '}
              <C>oraclePaused()</C>. The counterfeits revert on both. That check is what
              distinguishes the real NVDA from the several imitations on this chain.
            </p>
            <Pre>{`cast call <token> "uiMultiplier()(uint256)" --rpc-url <rpc>`}</Pre>
          </>
        ),
      },
    ],
  },
]

export const DOC_GROUPS = [...new Set(DOC_PAGES.map((p) => p.group))]

export function findDoc(slug?: string): DocPage | undefined {
  return DOC_PAGES.find((p) => p.slug === slug)
}
