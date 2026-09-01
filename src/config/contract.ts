import type { Abi, Address } from 'viem'
import recurAbiJson from './abi/recur.json'

/**
 * The Recur deployment this build talks to.
 *
 * The ABI is generated straight from the contracts repo and is not hand-maintained:
 *
 *   cd ../recur-contracts && forge inspect Recur abi --json > ../recur-web/src/config/abi/recur.json
 *
 * The address comes from recur-contracts/deployments/<network>.json.
 */
export const recurAbi = recurAbiJson as Abi

export const ZERO = '0x0000000000000000000000000000000000000000' as const

export const RECUR_ADDRESS = import.meta.env.VITE_RECUR_CONTRACT_ADDRESS as Address | undefined

/** True once a real deployment address has been configured. The whole app degrades to a
 *  read-only explanatory mode when this is false, rather than throwing. */
export const isDeployed = Boolean(
  RECUR_ADDRESS && /^0x[0-9a-fA-F]{40}$/.test(RECUR_ADDRESS) && RECUR_ADDRESS !== ZERO,
)

/** Minimal ERC-20 surface: everything the approve step and balance display need. */
export const erc20Abi = [
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
] as const satisfies Abi

/** Protocol constants mirrored from the contract, for client-side validation only.
 *  The contract enforces all of these itself; these exist to give immediate feedback. */
export const MIN_INTERVAL_SECONDS = 3600 // 1 hour
export const MAX_SLIPPAGE_BPS = 3000 // 30%

/** Below roughly 0.75% the live pool's fee-plus-spread eats the whole tolerance and executions
 *  start failing. Measured on a real fork run; see recur-contracts/AUDIT.md section 6. */
export const RECOMMENDED_MIN_SLIPPAGE_BPS = 75
export const DEFAULT_SLIPPAGE_BPS = 100
