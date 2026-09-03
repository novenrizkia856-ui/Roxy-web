import { useMemo } from 'react'
import type { Address } from 'viem'
import { useReadContract, useReadContracts } from 'wagmi'

import { erc20Abi, isDeployed, RECUR_ADDRESS, recurAbi, ZERO } from '../config/contract'
import { STOCK_TOKENS } from '../config/tokens'
import { totals, useExecutions } from './useExecutions'
import { useStablecoin } from './usePlans'

const factoryAbi = [
  {
    type: 'function',
    name: 'getPool',
    stateMutability: 'view',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
      { name: 'fee', type: 'uint24' },
    ],
    outputs: [{ type: 'address' }],
  },
] as const

/**
 * Headline figures for the protocol, every one of them read from the chain.
 *
 * @dev Two kinds of number live here, and the distinction matters. Plans and executions are
 *      counts of what has happened, and on a protocol that has just launched they are honestly
 *      zero. Assets and tracked liquidity describe what the protocol is wired to, and those are
 *      substantial from day one.
 *
 *      Showing both is the point. Inventing the first kind to avoid a zero would be the easiest
 *      thing in the world and the fastest way to lose anyone who checks. Omitting the second
 *      would undersell a protocol that is genuinely pointed at millions in liquidity.
 *
 *      Liquidity is measured as the stablecoin side of each registered asset's pool, which is
 *      the side that bounds how much a plan can actually spend.
 */
export function useProtocolStats() {
  const { address: stablecoin, decimals, symbol } = useStablecoin()
  const { data: executions } = useExecutions()

  const { data: nextPlanId } = useReadContract({
    address: RECUR_ADDRESS,
    abi: recurAbi,
    functionName: 'nextPlanId',
    query: { enabled: isDeployed },
  })

  const { data: feeBps } = useReadContract({
    address: RECUR_ADDRESS,
    abi: recurAbi,
    functionName: 'feeBps',
    query: { enabled: isDeployed },
  })

  const { data: factory } = useReadContract({
    address: RECUR_ADDRESS,
    abi: recurAbi,
    functionName: 'factory',
    query: { enabled: isDeployed },
  })

  // Which of the offered assets the owner has actually registered.
  const { data: configs } = useReadContracts({
    contracts: STOCK_TOKENS.map((t) => ({
      address: RECUR_ADDRESS,
      abi: recurAbi,
      functionName: 'tokenConfigs',
      args: [t.address],
    })),
    query: { enabled: isDeployed },
  })

  const enabled = useMemo(
    () =>
      STOCK_TOKENS.filter((_, i) => {
        const tuple = configs?.[i]?.result as
          | [Address, number, number, number, boolean]
          | undefined
        return tuple?.[4] === true
      }),
    [configs],
  )

  // The pool behind each registered asset.
  const { data: pools } = useReadContracts({
    contracts:
      factory && stablecoin
        ? enabled.map((t) => ({
            address: factory as Address,
            abi: factoryAbi,
            functionName: 'getPool',
            args: [stablecoin, t.address, t.poolFee],
          }))
        : [],
    query: { enabled: Boolean(factory && stablecoin && enabled.length > 0) },
  })

  const poolAddresses = useMemo(
    () =>
      (pools ?? [])
        .map((p) => p.result as Address | undefined)
        .filter((p): p is Address => Boolean(p) && p !== ZERO),
    [pools],
  )

  const { data: poolBalances } = useReadContracts({
    contracts: poolAddresses.map((pool) => ({
      address: stablecoin,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [pool],
    })),
    query: { enabled: Boolean(stablecoin) && poolAddresses.length > 0 },
  })

  const liquidity = useMemo(
    () =>
      (poolBalances ?? []).reduce<bigint>(
        (sum, b) => sum + ((b.result as bigint | undefined) ?? 0n),
        0n,
      ),
    [poolBalances],
  )

  const { invested } = totals(executions)

  return {
    /** Assets the owner has registered and that can be scheduled today. */
    assetsEnabled: configs ? enabled.length : undefined,
    /** Assets this interface offers, registered or not. */
    assetsOffered: STOCK_TOKENS.length,
    /** Stablecoin depth across every registered asset's pool. */
    liquidity: poolBalances ? liquidity : undefined,
    plans: nextPlanId as bigint | undefined,
    executions: executions?.length,
    invested: executions ? invested : undefined,
    feeBps: feeBps as bigint | undefined,
    decimals,
    symbol,
  }
}
