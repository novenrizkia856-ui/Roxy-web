---
description: The four decisions a plan records, and how to choose them.
---

# Creating a plan

## Four decisions

| Decision | What it means |
| --- | --- |
| Asset | Which Stock Token to buy. Only assets registered by the protocol can be scheduled. |
| Amount per cycle | Exactly this much stablecoin is pulled each time. Never more. |
| Interval | How long between purchases. The contract enforces a minimum of one hour. |
| Max slippage | The worst price you will accept, measured against the oracle. Capped at 30 percent. |

## Choosing an allowance

Roxy can only move stablecoin you have explicitly allowed. The interface asks how many cycles to cover and defaults to twelve, rather than silently requesting an unlimited allowance.

Unlimited is available and is one click, but a smaller allowance is a smaller exposure. When it runs out the plan simply stops until you approve more.

## Why the asset list is short

Robinhood Chain hosts many counterfeit tokens reusing real tickers. A search for NVDA returns several, only one of which is genuine.

So the protocol keeps a curated registry. A plan for an unregistered token reverts with `TokenNotEnabled`. The trade off is that listing a new asset requires an owner transaction.

## Creating a plan you cannot yet fund

This is allowed. The plan is recorded and simply fails to execute until your balance covers a cycle. Nothing is lost by creating it early.
