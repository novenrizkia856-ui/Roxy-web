import { useQuery } from '@tanstack/react-query'
import { parseAbiItem, type Address, type Log } from 'viem'
import { usePublicClient } from 'wagmi'
import { isDeployed, RECUR_ADDRESS } from '../config/contract'

export const planExecutedEvent = parseAbiItem(
  'event PlanExecuted(uint256 indexed planId, address indexed executor, uint256 amountIn, uint256 amountOut, uint256 protocolFee, uint256 keeperTip)',
)

export interface Execution {
  planId: bigint
  executor: Address
  amountIn: bigint
  amountOut: bigint
  protocolFee: bigint
  keeperTip: bigint
  blockNumber: bigint
  txHash: `0x${string}`
  /** Filled in lazily from the block; undefined until resolved. */
  timestamp?: number
}

type ExecLog = Log<bigint, number, false, typeof planExecutedEvent>

/**
 * Execution history, read from `PlanExecuted` logs.
 *
 * There is no on-chain array of executions - storing one would cost every user gas forever to
 * benefit a UI - so history is reconstructed from events, which is what they are for.
 *
 * Public RPCs commonly cap `eth_getLogs` ranges. A failure here degrades to "history
 * unavailable" rather than breaking the page, because the plan itself still reads fine.
 */
export function useExecutions(planId?: bigint) {
  const client = usePublicClient()

  return useQuery({
    queryKey: ['executions', RECUR_ADDRESS, planId?.toString() ?? 'all'],
    enabled: Boolean(client) && isDeployed,
    staleTime: 30_000,
    retry: 0,
    queryFn: async (): Promise<Execution[]> => {
      if (!client || !RECUR_ADDRESS) return []

      const logs = (await client.getLogs({
        address: RECUR_ADDRESS,
        event: planExecutedEvent,
        args: planId !== undefined ? { planId } : undefined,
        fromBlock: 0n,
        toBlock: 'latest',
      })) as ExecLog[]

      const executions: Execution[] = logs.map((log) => ({
        planId: log.args.planId!,
        executor: log.args.executor!,
        amountIn: log.args.amountIn!,
        amountOut: log.args.amountOut!,
        protocolFee: log.args.protocolFee!,
        keeperTip: log.args.keeperTip!,
        blockNumber: log.blockNumber!,
        txHash: log.transactionHash!,
      }))

      // Timestamps come from the blocks. Only resolve the most recent handful, so a long
      // history does not turn into hundreds of RPC calls.
      const recent = executions.slice(-25)
      const uniqueBlocks = [...new Set(recent.map((e) => e.blockNumber))]
      const times = new Map<bigint, number>()

      await Promise.all(
        uniqueBlocks.map(async (blockNumber) => {
          try {
            const block = await client.getBlock({ blockNumber })
            times.set(blockNumber, Number(block.timestamp))
          } catch {
            /* leave the timestamp undefined; the row still renders */
          }
        }),
      )

      for (const e of executions) e.timestamp = times.get(e.blockNumber)

      return executions.reverse() // newest first
    },
  })
}

/** Totals across a set of executions. */
export function totals(executions: Execution[] | undefined) {
  if (!executions?.length) return { invested: 0n, received: 0n, count: 0 }
  return executions.reduce(
    (acc, e) => ({
      invested: acc.invested + e.amountIn,
      received: acc.received + e.amountOut - e.protocolFee,
      count: acc.count + 1,
    }),
    { invested: 0n, received: 0n, count: 0 },
  )
}
