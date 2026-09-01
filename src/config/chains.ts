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

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env and fill it in (or set it in the Vercel project settings).`,
    )
  }
  return value
}

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID ?? 4663)

export const RPC_URL = requireEnv('VITE_RPC_URL', import.meta.env.VITE_RPC_URL)

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
