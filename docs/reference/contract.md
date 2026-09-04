---
description: Functions, events and errors, for reading or calling the contract directly.
---

# Contract reference

## Functions you call

```solidity
createPlan(address stockToken,
           uint256 amountPerCycle,
           uint256 interval,
           uint16  maxSlippageBps) returns (uint256 planId)

execute(uint256 planId) returns (uint256 amountOut)

cancel(uint256 planId)
```

`cancel` is restricted to the plan owner. It is deliberately not available to the contract owner.

## Views

| View | Returns |
| --- | --- |
| `getPlan(planId)` | The full plan struct. |
| `getUserPlans(address)` | Every plan id belonging to an address. |
| `isDue(planId)` | Whether the interval has elapsed. |
| `nextExecutionAt(planId)` | The timestamp the plan becomes executable. |
| `quoteMinAmountOut(planId)` | The floor the next execution would enforce. |
| `tokenConfigs(token)` | Feed, pool tier, decimals and whether the asset is enabled. |

## Events

```solidity
PlanCreated(planId, owner, stockToken, amountPerCycle, interval, maxSlippageBps)
PlanExecuted(planId, executor, amountIn, amountOut, protocolFee, keeperTip)
PlanCancelled(planId, owner)
TokenConfigUpdated(stockToken, feed, poolFee, enabled)
FeeUpdated(oldBps, newBps)
```

## Exiting without this interface

The contract is verified, so the explorer exposes a write tab. If this site is ever unavailable you can call `cancel` there directly, and revoke the allowance from your wallet.

Noncustodial only means something if you can leave without asking anyone.
