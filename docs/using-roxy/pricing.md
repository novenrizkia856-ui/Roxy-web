---
description: How the floor price is derived and where the fee goes.
---

# Pricing, slippage and fees

## The floor comes from the oracle

Every execution reads a Chainlink feed in the same transaction as the swap. Your minimum output is derived from that reference price, reduced by your slippage limit.

```text
usdValue     = amountIn * stablePrice / 10^stableDecimals
expectedOut  = usdValue * 10^stockDecimals / stockPrice
minAmountOut = expectedOut * (10000 - maxSlippageBps) / 10000
```

The floor is anchored to the oracle rather than to the pool. Moving the pool therefore cannot widen your tolerance. That is what bounds a sandwich attack.

## Staleness

The Robinhood equity feeds publish on a 24 hour heartbeat and freeze deliberately during corporate actions. The contract accepts an answer up to 26 hours old by default.

A tighter bound would look safer and would in fact break the protocol, reverting every night and all weekend.

## The fee

| Component | Amount |
| --- | --- |
| Protocol fee | 0.50 percent of the output, taken in the Stock Token. |
| Hard cap | 0.75 percent. The owner cannot exceed it. |
| Keeper tip | 20 percent of the fee, paid to whoever called execute. |
| Treasury | The remaining 80 percent, sent to a 2 of 3 multisig. |

On a 100 unit cycle the whole fee is half a unit, of which the caller keeps a tenth of a unit. That has to beat their gas cost or nobody will run keepers.

## Choosing a slippage limit

Below roughly 0.75 percent the pool fee and spread alone breach the floor, so most executions simply revert. A measured round trip on the live pool cost about 0.15 percent above the pool fee.

Wider is not safer. Your limit is the ceiling on what a bad fill can cost you.

Each asset carries its own floor, because the pool tier it routes through differs. See [Registered assets](../reference/networks.md#registered-assets).
