---
description: >-
  A scheduler for recurring Stock Token purchases that never holds your money.
---

# What Roxy is

## In one paragraph

Roxy lets you schedule a recurring purchase of a Robinhood Chain Stock Token. You approve a stablecoin once and record the terms on chain. When a plan comes due, anyone can trigger it. The contract pulls exactly one cycle from your wallet, swaps it on Uniswap, then sends the tokens straight to you.

Your money is never held by the protocol. It moves from your wallet to the pool to you inside a single transaction. If any step fails, the whole transaction reverts and nothing moved.

## Roxy and Recur

The product is named Roxy. The contract is named `Recur`. They are the same software. The contract was written, deployed and verified before the product was renamed, and a deployed contract cannot be renamed.

This matters when you approve an allowance. Your wallet and the block explorer will name the counterparty Recur, not Roxy. That is expected.

{% hint style="warning" %}
There is no Roxy token. Any address presented as one today is fake.
{% endhint %}

## What it is not

It is not a custodian, an exchange, or a yield product. It does not hold balances, it does not lend, and it has no deposit function.

It is also not a guarantee that a trade will happen at a chosen moment. Nobody is obliged to execute your plan. See [Execution and keepers](../using-roxy/execution.md).
