import { useMemo } from 'react'
import type { Address } from 'viem'
import { useReadContract, useReadContracts } from 'wagmi'

import { isDeployed, RECUR_ADDRESS, recurAbi } from '../config/contract'
import { STOCK_TOKENS } from '../config/tokens'
import { totals, useExecutions } from './useExecutions'
import { useStablecoin } from './usePlans'

/**
 * Headline figures for the protocol, every one of them read from the chain.
 *
 * @dev Plans, executions and invested count what has actually happened, and on a protocol that
 *      has just launched they are honestly zero. Inventing them to avoid a zero would be the
 *      easiest thing in the world and the fastest way to lose anyone who checks.
 *
 *      This used to also sum the stablecoin side of every registered asset's Uniswap pool and
 *      report it as "tracked liquidity". That was Uniswap's liquidity, not Roxy's, and quoting
 *      seven figures of it as a Roxy statistic overstated the protocol. It is gone, along with
 *      the eighteen extra RPC reads it cost on every page load.
 */
export function useProtocolStats() {
  const { decimals, symbol } = useStablecoin()
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

  const { invested } = totals(executions)

  return {
    /** Assets the owner has registered and that can be scheduled today. */
    assetsEnabled: configs ? enabled.length : undefined,
    /** Assets this interface offers, registered or not. */
    assetsOffered: STOCK_TOKENS.length,
    plans: nextPlanId as bigint | undefined,
    executions: executions?.length,
    invested: executions ? invested : undefined,
    feeBps: feeBps as bigint | undefined,
    decimals,
    symbol,
  }
}
