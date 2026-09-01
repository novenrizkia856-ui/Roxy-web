# Recur — web

Front end for [Recur](../recur-contracts), a non-custodial DCA scheduler for Robinhood Chain
Stock Tokens. Vite + React + wagmi, built to a **fully static** `dist/`.

## Status

| | |
|---|---|
| Build | ✅ `npm run build` produces a static `dist/` — no Node runtime needed to serve it |
| Typecheck | ✅ clean |
| Screens | Landing · Dashboard · Create plan · Plan detail · Legal (+ wallet connect) |
| Contract wired | ⏳ needs `VITE_RECUR_CONTRACT_ADDRESS`; runs read-only and says so until then |
| Deployed | ❌ not yet |

## Quick start

```bash
cp .env.example .env
```

Then:

```bash
npm install && npm run dev
```

Build and preview the real static output:

```bash
npm run build && npm run preview
```

## Design

The brief asked for something that reads as a considered financial instrument rather than a
generic dashboard, so the interface is built around a specific idea: **a printed brokerage
statement crossed with a modern product page.**

What that means concretely, and what it rules out:

- **Paper, not white.** `#f6f4ef`, with near-black `#1c1a17` type rather than `#000`.
- **One accent, used sparingly.** An oxblood red taken from the red ink of a ledger. It marks
  the primary action and figures that carry meaning — never decoration, and never a gradient.
  Chosen partly because the default web3 indigo/violet is exactly the look being avoided.
- **Two typefaces.** Newsreader, a text serif, for prose and headings; IBM Plex Mono for every
  figure, label and control. All numerals are tabular, so columns align and a live countdown
  does not make the layout twitch.
- **Rules, not shadows.** There is no `box-shadow` anywhere. Panels are separated by hairlines,
  the way a document is ruled. Radii are 2–3px; nothing is a pill and nothing is `rounded-2xl`.
- **Asymmetric grids.** 7/5 in the hero, 4/7 in the explainer, 3/8 in the stepper. No section is
  an even three-up card grid.
- **Numbers are drawn, not just printed.** Progress toward the next execution is a small dial,
  read at a glance, rather than a percentage the reader has to interpret.
- **Motion is brief.** One 380ms rise on entry, and `prefers-reduced-motion` is honoured.

There is no dark mode. The paper palette is a deliberate single commitment rather than an
oversight.

## Structure

```
src/
  config/
    chains.ts        Robinhood Chain definition, from env
    contract.ts      Recur address + ABI, ERC-20 surface, protocol constants
    tokens.ts        Stock Token candidates (validated on-chain before use)
    wagmi.ts         wagmi + RainbowKit setup
    abi/recur.json   generated - see below
  lib/
    format.ts        amounts, intervals, countdowns, effective price
    usePlans.ts      plan reads, allowance, token config
    useExecutions.ts execution history from PlanExecuted logs
    useNow.ts        ticking clock for countdowns
  components/        Layout, WalletButton, ProgressRing, TxStatus
  routes/            Landing, Dashboard, CreatePlan, PlanDetail, Legal
  styles/index.css   design tokens + component classes
```

### Regenerating the ABI

The ABI is generated, never hand-edited. After any contract change:

```bash
cd ../recur-contracts && forge inspect Recur abi --json > ../recur-web/src/config/abi/recur.json
```

## Notable implementation choices

- **Countdowns are derived, never stored.** Every countdown is computed from the plan's on-chain
  `lastExecuted + interval` against the wall clock, so the UI cannot drift from the contract.
- **The stablecoin is read from the contract**, not configured separately — `Recur.stablecoin()`
  is the single source of truth for which token and how many decimals.
- **Token candidates are verified before use.** `src/config/tokens.ts` is only a list of
  addresses to offer; whether one can actually be used is decided by
  `Recur.tokenConfigs(token).enabled`, checked live. This matters because Robinhood Chain hosts
  many counterfeit tokens reusing real tickers.
- **Approval is a deliberate choice, not a silent max.** The review step asks how many cycles to
  cover and defaults to 12, with unlimited as an explicit opt-in rather than the default.
- **History comes from events.** There is no on-chain execution array — storing one would cost
  every user gas forever to serve a UI — so `PlanExecuted` logs are read instead. If the RPC
  refuses the log range, the page says history is unavailable and still renders the plan.
- **Missing configuration degrades, it does not crash.** With no contract address the app runs
  read-only and shows a banner explaining what to set.

## Deviations from the original brief

Both were forced by current package versions and are recorded rather than hidden.

1. **RainbowKit instead of ConnectKit.** ConnectKit 1.9.2 peer-requires React 17/18 and this
   project is on React 19; RainbowKit supports `react >=18`. The brief allowed either. Only the
   trigger button is ours (built on RainbowKit's headless API) so the wallet flow does not look
   like a different product bolted on. `wagmi` is pinned to 2.x because RainbowKit has no
   wagmi-3 release yet.
2. **No `tailwind.config.ts`.** Tailwind v4 moved theme configuration into CSS, so the design
   tokens the brief asked for live in the `@theme` block of `src/styles/index.css`. The
   requirement — custom tokens rather than the stock palette — is met; only the file differs.

## Deploying to Vercel

The build is static, so the framework preset "Vite" works with no extra configuration.

1. Point Vercel at this directory.
2. Set the `VITE_*` variables from `.env.example` in the project's Environment Variables.
   **Do not commit `.env`.** Everything prefixed `VITE_` is inlined into the client bundle and
   is therefore public — never put a secret in one.
3. Deploy. Build command `npm run build`, output directory `dist`.

Client-side routing is handled by `react-router-dom`; if deep links 404 on your host, add a
rewrite of all paths to `/index.html`.
