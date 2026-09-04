---
description: >-
  A noncustodial scheduler for recurring Stock Token purchases on Robinhood
  Chain.
---

# Roxy

Roxy schedules a recurring purchase of a Robinhood Chain Stock Token. You approve a stablecoin once and record the terms on chain. When a plan comes due, anyone can trigger it, and the contract moves your money from your wallet through the pool and back to you inside a single transaction.

Nothing is deposited. There is no balance to withdraw, because there is never a balance.

## Start here

| Page | What it covers |
| --- | --- |
| [What Roxy is](introduction/overview.md) | The idea in one paragraph, and the two names. |
| [How it works](introduction/how-it-works.md) | The lifecycle of a plan, step by step. |
| [Creating a plan](using-roxy/creating-a-plan.md) | The four decisions, and how to choose them. |
| [Security model](reference/security.md) | What is guaranteed, what is not, and where the trust sits. |
| [Networks and addresses](reference/networks.md) | Every address, and how to verify one yourself. |

{% hint style="warning" %}
There is no Roxy token. Any address presented as one today is fake.
{% endhint %}

## The contract is named Recur

The product is Roxy. The contract is `Recur`. They are the same software: the contract was deployed and verified before the product was renamed, and a deployed contract cannot be renamed. Your wallet and the block explorer will name the counterparty Recur. That is expected. See [Roxy and Recur](introduction/overview.md#roxy-and-recur).
