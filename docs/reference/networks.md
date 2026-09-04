---
description: Where the protocol is deployed and which assets are registered.
---

# Networks and addresses

## Robinhood Chain mainnet

| Field | Value |
| --- | --- |
| Chain id | `4663` |
| RPC | `https://rpc.mainnet.chain.robinhood.com` |
| Explorer | `https://robinhoodchain.blockscout.com` |
| Recur | `0xE59a22e8536294f352f74df6B97b7eec5df9Abd2` |
| Treasury | `0xcBEFcb8A4E931A91b4C3Dd99fAfA7DA45017c861` |
| Stablecoin | USDG, `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168` |

## Registered assets

Nine assets are registered. The pool tier is the Uniswap fee tier each swap routes through, and it was measured against the live pools rather than assumed: registering an asset on the wrong tier passes validation and then reverts on every execution.

### Deep pools, 0.05 percent tier

| Asset | Address | Measured cost above oracle |
| --- | --- | --- |
| NVDA, NVIDIA | `0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC` | about 0.13 percent |
| QQQ, Invesco QQQ | `0xD5f3879160bc7c32ebb4dC785F8a4F505888de68` | about 0.19 percent |
| GOOGL, Alphabet Class A | `0x2e0847E8910a9732eB3fb1bb4b70a580ADAD4FE3` | within 0.01 percent |
| AAPL, Apple | `0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9` | currently prices slightly below oracle |
| SPY, SPDR S&P 500 | `0x117cc2133c37B721F49dE2A7a74833232B3B4C0C` | about 0.25 percent |

### Only liquid on the 0.30 percent tier

These cost more to execute, so they need a wider slippage limit.

| Asset | Address | Measured cost above oracle |
| --- | --- | --- |
| MSFT, Microsoft | `0xe93237C50D904957Cf27E7B1133b510C669c2e74` | about 0.23 percent |
| AMZN, Amazon | `0x12f190a9F9d7D37a250758b26824B97CE941bF54` | about 0.38 percent |
| META, Meta Platforms | `0xc0D6457C16Cc70d6790Dd43521C899C87ce02f35` | about 0.62 percent |
| TSLA, Tesla | `0x322F0929c4625eD5bAd873c95208D54E1c003b2d` | about 0.73 percent |

Further assets require both a liquid pool and an owner transaction to register. A feed exists for many more tickers, but a thin pool makes a plan worse than no plan.

## Verifying an address yourself

A genuine Robinhood Stock Token implements `uiMultiplier()` and `oraclePaused()`. The counterfeits revert on both. That check is what distinguishes the real NVDA from the several imitations on this chain.

```bash
cast call <token> "uiMultiplier()(uint256)" --rpc-url <rpc>
```
