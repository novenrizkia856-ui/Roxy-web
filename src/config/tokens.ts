import type { Address } from 'viem'
import { CHAIN_ID } from './chains'

/**
 * Stock Tokens this interface offers, per network.
 *
 * These are *candidates* only. Whether a token can actually be used is decided on-chain by
 * `Recur.tokenConfigs(token).enabled`, and the UI checks that before letting a plan be created.
 * Listing an address here does not make it usable.
 *
 * Addresses were verified on the live chain during Phase 0. Do not add a mainnet entry by
 * searching the explorer for a ticker: Robinhood Chain hosts many impostor tokens reusing the
 * same names and symbols (nine "USDG", six "NVDA"). A genuine Stock Token implements
 * `uiMultiplier()` and `oraclePaused()`; the clones revert on both.
 */
export interface StockTokenMeta {
  address: Address
  symbol: string
  /** Company name as shown in the interface. */
  name: string
  /** Short line of context, used on the selection step. */
  note: string
}

const MAINNET_TOKENS: StockTokenMeta[] = [
  {
    address: '0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC',
    symbol: 'NVDA',
    name: 'NVIDIA',
    note: 'Verified genuine. The deepest Stock Token pool on the chain.',
  },
]

/**
 * Testnet uses the mock stack from `DeployTestnet.s.sol`, because Robinhood Chain testnet has
 * no Uniswap, no Chainlink and no Stock Tokens of its own. The mock stablecoin has an open
 * `mint`, so testers can fund themselves without the faucet.
 */
const TESTNET_TOKENS: StockTokenMeta[] = [
  {
    address: '0x4C08e81856179567a046245C548c36C9BFD797cb',
    symbol: 'mNVDA',
    name: 'Mock NVIDIA',
    note: 'Test double priced at $219. Not a real Stock Token.',
  },
]

export const STOCK_TOKENS: StockTokenMeta[] = CHAIN_ID === 4663 ? MAINNET_TOKENS : TESTNET_TOKENS

/** True when this build is pointed at the mock testnet stack rather than real assets. */
export const IS_TESTNET = CHAIN_ID !== 4663

export function findToken(address?: string): StockTokenMeta | undefined {
  if (!address) return undefined
  return STOCK_TOKENS.find((t) => t.address.toLowerCase() === address.toLowerCase())
}
