---
description: What the contract guarantees, what it does not, and where the trust sits.
---

# Security model

## No custody

There is no deposit function, no balance to withdraw, and no sweep or rescue function. The contract's own token balances are zero before and after every transaction.

This is asserted as an invariant, not just a unit test, and it is checked again by a test that runs against the live deployment.

## What the owner can do

The owner is a 2 of 3 multisig. It can pause the protocol, adjust the fee within the hard cap, change the treasury address, curate the token registry, and move the staleness bound within fixed limits.

It **cannot** withdraw funds, cancel or alter your plan, or raise the fee beyond the cap. Ownership transfer is two step.

## The indirect path to user funds

{% hint style="warning" %}
This is a known and accepted finding, recorded as C-1 in the audit notes. It is the single reason the owner must be a multisig.
{% endhint %}

The owner chooses the price feed each asset is valued against, and your slippage floor is derived from that feed. An owner who substituted a feed reporting an inflated price would drive the floor toward zero, and a single cycle of yours could then fill at a bad price.

The exposure is bounded. It is at most one cycle, and only while your plan and allowance are both live. It is also why a smaller allowance is worth the extra clicks.

## Dependencies you are also trusting

| Dependency | What you are trusting it for |
| --- | --- |
| Stock Tokens | Upgradeable and issued by Robinhood. The issuer can pause transfers and burn balances. |
| Chainlink | The price the floor is derived from. |
| Uniswap | The pool the swap routes through. Thin liquidity means worse fills. |
| The chain | A single sequencer Arbitrum Orbit L2. |

## No independent audit

The contract has been reviewed by its authors and is covered by 90 offline tests, fork tests against the real router and feeds, and tests against the live deployment. None of that is the same as an independent audit, and it has not had one.
