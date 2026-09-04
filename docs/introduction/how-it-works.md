---
description: The full lifecycle of a plan, from approval to delivery.
---

# How it works

## Lifecycle

```text
approve()     you, once
createPlan()  you, once
execute()     anyone, each interval
cancel()      you, whenever
```

Only the first two need you. After that the plan runs on its own, as long as somebody calls `execute`.

## What happens inside execute

The order is fixed, and it is the reason the protocol never holds anything.

| Step | What it does |
| --- | --- |
| 1. Check | The plan must be active and the interval must have elapsed. |
| 2. Price | Read the Chainlink feed. Reject a stale or non positive answer. Derive a minimum output from it and your slippage limit. |
| 3. Record | Write the new `lastExecuted` before any external call. |
| 4. Pull | Take exactly one cycle from your wallet using your allowance. |
| 5. Swap | Approve the router for that exact amount, then swap with the minimum enforced. |
| 6. Deliver | Send your tokens to you, the fee to the treasury, the tip to the caller. |

The contract holds no balance before or after. That property is enforced by an invariant test that runs thousands of random sequences.

## The first cycle

A new plan is immediately due. The first purchase can happen as soon as somebody calls it, rather than one interval later.
