# Roxy — web

Front end for a non-custodial DCA scheduler for Robinhood Chain Stock Tokens. Vite + React +
wagmi, built to a **fully static** `dist/`.

## Naming: Roxy and Recur

**The product is Roxy. The contract is [Recur](../recur-contracts).** Same software, two names:
the contract was written, deployed and verified before the product was renamed, and a deployed
contract cannot be renamed afterwards.

This split is deliberate in the code as well:

- **User-facing text says Roxy.** Headings, prose, the wordmark, the page title, the name the
  wallet shows when connecting.
- **Code identifiers say Recur**, because they refer to the contract, which really is called
  that: `RECUR_ADDRESS`, `recurAbi`, `VITE_RECUR_CONTRACT_ADDRESS`, `abi/recur.json`.

The mismatch is **stated to the user rather than hidden**, in three places: the system bar
(`CONTRACT.RECUR`), the footer of every page (with the address and an explorer link), and the
first clause of the Legal page. This is a trust requirement, not a cosmetic one — someone who
checks the address before approving an allowance will find a contract that does not carry the
product's name, and a front end that glossed over that would be indistinguishable from one
impersonating a real protocol.

## Status

| | |
|---|---|
| Build | ✅ `npm run build` produces a static `dist/` — no Node runtime needed to serve it |
| Typecheck | ✅ clean |
| Screens | Landing · Docs · Dashboard · Create plan · Plan detail · Legal |
| Contract wired | ✅ mainnet, 0xE59a22e8536294f352f74df6B97b7eec5df9Abd2 |
| Hosted | ✅ useroxy.app |

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

The interface is built around one idea: **a financial terminal that still sets its prose in a
serif.** Two voices, and the split is the whole system.

- **The machine voice is monospace** — headlines, figures, labels, controls, all-caps and widely
  tracked. This is the part that reads as an instrument: schedules, countdowns, addresses,
  amounts, anything the contract decides.
- **The human voice is a serif** — every sentence of running prose, and the stepper's questions,
  because those are addressed to a person. This is what stops the page becoming a console
  readout.

Everything else follows from that:

- **Warm near-black, not `#000`.** `#0e0d0b` ground with `#ede9e1` type. The warmth is what keeps
  it from reading as generic dark mode — it is the earlier paper palette inverted rather than
  replaced.
- **One accent.** The same oxblood red, opened to `#d9573a` so it holds on a dark ground. Marks
  the primary action and figures that carry meaning; never decoration, never a gradient. Still
  nothing like the cyan or violet that dark web3 interfaces default to.
- **A survey grid, not a texture.** Two layers — a 22px dot lattice and a 132px ruled square —
  both barely above the ground, so the page reads as drawn on graph paper.
- **Technical annotation.** A system bar states network, status and a live UTC clock; sections
  carry an index (`01 / 02`); status pips replace prose for binary state. The clock is not
  ornament: every plan is a deadline and every countdown is measured against a wall clock, so
  the interface says which clock it is answering with.
- **Rules, not shadows.** No `box-shadow` anywhere. Hairlines at 13% and 30% opacity carry the
  layout. Radii cap at 2px; nothing is a pill and nothing is `rounded-2xl`.
- **Asymmetric grids.** 7/5 in the hero, 4/7 in the explainer, 3/8 in the stepper. No section is
  an even three-up card grid.
- **Numbers are drawn.** Progress toward the next execution is a dial, read at a glance, rather
  than a percentage the reader has to interpret.
- **Motion is brief.** One 380ms rise on entry, and `prefers-reduced-motion` is honoured.

There is no light mode. The dark palette is a single deliberate commitment; the tokens are named
by role (`ground`, `ink`, `rule`, `accent`) so a light variant would only need new values.

### On the reference

This direction was developed after studying `app.genoromus.com` at the client's request. What
was taken is structural vocabulary — a dark ground with a survey grid, mono-dominant all-caps
display type, section indices, status pips, hairline rules, sharp corners. What was **not**
taken is its expression: no source code, markup, assets or copy were copied, and its cyan
palette and sans-serif secondary face were deliberately not adopted.

The serif is the deliberate divergence. That reference pairs its monospace with a neutral sans;
pairing it with a text serif is something a terminal aesthetic does not do, and it is what keeps
Recur reading as a financial instrument rather than a developer console.

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
  docs/              documentation content as data, plus its presentational elements
  routes/            Landing, Docs, Dashboard, CreatePlan, PlanDetail, Legal
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

## Local development against a throwaway chain

The write paths — approve, `createPlan`, `cancel` — can only be exercised through a wallet, so
they are easy to leave untested. This setup runs the whole flow against a local chain without a
browser extension.

**1. Start a local node and deploy the mock stack:**

```bash
anvil --chain-id 31337 --port 8545 --block-time 2
```

Then, in the contracts repo:

```bash
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 forge script script/DeployTestnet.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

That key is Anvil's well-known first dev account. The script writes
`deployments/local-<chainid>.json`, so a local run cannot overwrite the record of what is live
on the public testnet. The deployment mints 1,000,000 mUSDG to the deployer.

**2. Point `.env` at it**, using the addresses the script printed:

```
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545
VITE_RECUR_CONTRACT_ADDRESS=<recur>
VITE_STOCK_TOKEN_ADDRESS=<mNVDA>
VITE_DEV_WALLET=true
```

`VITE_STOCK_TOKEN_ADDRESS` overrides the built-in candidate list, because a throwaway chain gets
fresh addresses on every deploy. `VITE_DEV_WALLET` enables `src/lib/devWallet.ts`.

**3. `npm run dev`** and the app connects on its own.

### About the dev wallet

`src/lib/devWallet.ts` installs an EIP-1193 provider that forwards to the local node and
announces itself over EIP-6963, so wagmi discovers it like any extension.

It holds **no private key and cannot sign anything.** Transactions go out as
`eth_sendTransaction` from an account the node itself has unlocked — something only a
development node does. Pointed at a real network it would simply fail.

It is double-guarded by `import.meta.env.DEV` *and* an explicit `VITE_DEV_WALLET=true`. Because
`DEV` is statically false in a production build, Vite drops the module entirely: after
`npm run build`, none of its markers (`isDevWallet`, `Anvil Dev Wallet`, `dev.local.anvil`)
appear anywhere in `dist/`. Worth re-checking with `grep -r isDevWallet dist/` if the build
setup ever changes.

## Deploying to Vercel

The build is static, so the framework preset "Vite" works with no extra configuration.

1. Point Vercel at this directory.
2. Set the `VITE_*` variables from `.env.example` in the project's Environment Variables.
   **Do not commit `.env`.** Everything prefixed `VITE_` is inlined into the client bundle and
   is therefore public — never put a secret in one.
3. Deploy. Build command `npm run build`, output directory `dist`.

Client-side routing is handled by `react-router-dom`; if deep links 404 on your host, add a
rewrite of all paths to `/index.html`.
