import { defineChain } from 'viem'

/**
 * Robinhood Chain, defined from environment so the same build can target mainnet or a local
 * fork without a code change.
 *
 * Verified during Phase 0 (see recur-contracts/docs/PHASE0_NETWORK_NOTES.md):
 *   - mainnet chainId 4663  (0x1237), RPC https://rpc.mainnet.chain.robinhood.com
 *   - testnet chainId 46630 (0xb626), RPC https://rpc.testnet.chain.robinhood.com
 *
 * It is an Arbitrum Orbit L2 and pays gas in ETH.
 */

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID ?? 4663)

// Fall back to the public mainnet RPC when the env var is absent, so a deploy that has not had
// its environment variables filled in still boots instead of throwing before React mounts (a
// missing value used to blank the screen). Set VITE_RPC_URL to override.
export const RPC_URL = import.meta.env.VITE_RPC_URL ?? 'https://rpc.mainnet.chain.robinhood.com'

export const EXPLORER_URL = (
  import.meta.env.VITE_BLOCK_EXPLORER_URL ?? 'https://robinhoodchain.blockscout.com'
).replace(/\/$/, '')

export const robinhoodChain = defineChain({
  id: CHAIN_ID,
  name: CHAIN_ID === 4663 ? 'Robinhood Chain' : 'Robinhood Chain Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: EXPLORER_URL },
  },
  testnet: CHAIN_ID !== 4663,
})

export function explorerTx(hash: string): string {
  return `${EXPLORER_URL}/tx/${hash}`
}

export function explorerAddress(address: string): string {
  return `${EXPLORER_URL}/address/${address}`
}
