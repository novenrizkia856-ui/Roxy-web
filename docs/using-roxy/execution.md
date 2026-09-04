---
description: Who runs your plan, why they bother, and what happens if nobody does.
---

# Execution and keepers

## Anyone can execute

`execute` is open to any address. There is no privileged keeper and no server behind the protocol. Whoever calls it pays the gas and receives a share of the fee as a tip.

The caller cannot redirect your tokens. The plan owner is written once, at creation, and there is no path that changes it.

## Nobody is obliged to run it

{% hint style="warning" %}
A plan that has come due sits waiting until someone calls it. If no keeper is watching, it may execute late or not at all.
{% endhint %}

The tip exists to make running a keeper worthwhile. On a new chain there may not be one yet. You can always execute your own plan from the interface or straight from the block explorer.

## When execution refuses

These are all intended, not faults.

| Error | Meaning |
| --- | --- |
| `PlanNotDue` | The interval has not elapsed yet. |
| `PlanNotActive` | The plan was cancelled. |
| `StalePrice` | The oracle answer is older than the staleness bound, or is not positive. |
| `SlippageExceeded` | The pool could not meet the floor derived from the oracle. |
| `ContractPaused` | The owner has paused the protocol. |
