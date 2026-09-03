import type { Address } from 'viem'
import { CHAIN_ID } from './chains'

/**
 * Stock Tokens this interface offers, per network.
 *
 * These are *candidates* only. Whether a token can actually be used is decided on chain by
 * `Recur.tokenConfigs(token).enabled`, and the UI checks that before letting a plan be created.
 * Listing an address here does not make it usable.
 *
 * Every mainnet address below was verified on chain by calling `uiMultiplier()`. Genuine
 * Robinhood Stock Tokens implement it; the many counterfeits reusing these tickers revert. Never
 * add an entry by searching the explorer for a symbol.
 */
export interface StockTokenMeta {
  address: Address
  symbol: string
  /** Company name as shown in the interface. */
  name: string
  /** Short line of context, used on the selection step. */
  note: string
  /**
   * The Uniswap fee tier that actually holds depth for this pair against the stablecoin.
   *
   * Measured, not assumed. It differs per asset, and getting it wrong is not caught by the
   * contract: `setTokenConfig` only checks that a pool exists at that tier, not that it holds
   * anything. TSLA has a deployed but empty 500 pool, so registering 500 for it would pass
   * validation and then fail every single execution.
   */
  poolFee: 500 | 3000
  /**
   * The lowest slippage that reliably clears this pool, in basis points.
   *
   * Derived from a live quote against the oracle. Below this the pool fee and spread alone
   * breach the floor and executions simply revert.
   */
  minSlippageBps: number
  /** What the stepper preselects for this asset. */
  defaultSlippageBps: number
}

const MAINNET_TOKENS: StockTokenMeta[] = [
  // --- deep pools on the 0.05% tier ---
  {
    address: '0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC',
    symbol: 'NVDA',
    name: 'NVIDIA',
    note: 'The deepest pool on the chain. Executes about 0.13% above oracle.',
    poolFee: 500,
    minSlippageBps: 75,
    defaultSlippageBps: 100,
  },
  {
    address: '0xD5f3879160bc7c32ebb4dC785F8a4F505888de68',
    symbol: 'QQQ',
    name: 'Invesco QQQ',
    note: 'Deep pool. Executes about 0.19% above oracle.',
    poolFee: 500,
    minSlippageBps: 75,
    defaultSlippageBps: 100,
  },
  {
    address: '0x2e0847E8910a9732eB3fb1bb4b70a580ADAD4FE3',
    symbol: 'GOOGL',
    name: 'Alphabet Class A',
    note: 'Tracks the oracle closely. Executes within 0.01%.',
    poolFee: 500,
    minSlippageBps: 75,
    defaultSlippageBps: 100,
  },
  {
    address: '0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9',
    symbol: 'AAPL',
    name: 'Apple',
    note: 'Currently prices slightly below oracle.',
    poolFee: 500,
    minSlippageBps: 75,
    defaultSlippageBps: 100,
  },
  {
    address: '0x117cc2133c37B721F49dE2A7a74833232B3B4C0C',
    symbol: 'SPY',
    name: 'SPDR S&P 500',
    note: 'Thinner pool. Executes about 0.25% above oracle.',
    poolFee: 500,
    minSlippageBps: 75,
    defaultSlippageBps: 100,
  },

  // --- only liquid on the 0.30% tier, so they cost more to execute ---
  {
    address: '0xe93237C50D904957Cf27E7B1133b510C669c2e74',
    symbol: 'MSFT',
    name: 'Microsoft',
    note: 'Routes through the 0.30% pool. Executes about 0.23% above oracle.',
    poolFee: 3000,
    minSlippageBps: 125,
    defaultSlippageBps: 200,
  },
  {
    address: '0x12f190a9F9d7D37a250758b26824B97CE941bF54',
    symbol: 'AMZN',
    name: 'Amazon',
    note: 'Routes through the 0.30% pool. Executes about 0.38% above oracle.',
    poolFee: 3000,
    minSlippageBps: 125,
    defaultSlippageBps: 200,
  },
  {
    address: '0xc0D6457C16Cc70d6790Dd43521C899C87ce02f35',
    symbol: 'META',
    name: 'Meta Platforms',
    note: 'Thinnest pool listed. Executes about 0.62% above oracle.',
    poolFee: 3000,
    minSlippageBps: 150,
    defaultSlippageBps: 200,
  },
  {
    address: '0x322F0929c4625eD5bAd873c95208D54E1c003b2d',
    symbol: 'TSLA',
    name: 'Tesla',
    note: 'Most expensive to execute. About 0.73% above oracle before any price move.',
    poolFee: 3000,
    minSlippageBps: 150,
    defaultSlippageBps: 200,
  },
]

/**
 * Testnet uses the mock stack from `DeployTestnet.s.sol`, because Robinhood Chain testnet has
 * no Uniswap, no Chainlink and no Stock Tokens of its own.
 */
const TESTNET_TOKENS: StockTokenMeta[] = [
  {
    address: '0x4C08e81856179567a046245C548c36C9BFD797cb',
    symbol: 'mNVDA',
    name: 'Mock NVIDIA',
    note: 'Test double priced at $219. Not a real Stock Token.',
    poolFee: 500,
    minSlippageBps: 50,
    defaultSlippageBps: 100,
  },
]

/**
 * Local development override. A throwaway chain gets fresh addresses on every deploy, so they
 * cannot be hardcoded here. Ignored unless set, so it cannot affect a real build.
 */
const ENV_STOCK_TOKEN = import.meta.env.VITE_STOCK_TOKEN_ADDRESS as Address | undefined

const LOCAL_TOKENS: StockTokenMeta[] = ENV_STOCK_TOKEN
  ? [
      {
        address: ENV_STOCK_TOKEN,
        symbol: 'mNVDA',
        name: 'Mock NVIDIA',
        note: 'Local development stack. Not a real Stock Token.',
        poolFee: 500,
        minSlippageBps: 50,
        defaultSlippageBps: 100,
      },
    ]
  : []

export const STOCK_TOKENS: StockTokenMeta[] = ENV_STOCK_TOKEN
  ? LOCAL_TOKENS
  : CHAIN_ID === 4663
    ? MAINNET_TOKENS
    : TESTNET_TOKENS

/** True when this build is pointed at a mock stack rather than real assets. */
export const IS_TESTNET = CHAIN_ID !== 4663

export function findToken(address?: string): StockTokenMeta | undefined {
  if (!address) return undefined
  return STOCK_TOKENS.find((t) => t.address.toLowerCase() === address.toLowerCase())
}
