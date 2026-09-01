import { useMemo } from 'react'
import type { Address } from 'viem'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { erc20Abi, isDeployed, RECUR_ADDRESS, recurAbi } from '../config/contract'

export interface Plan {
  id: bigint
  owner: Address
  stockToken: Address
  amountPerCycle: bigint
  interval: bigint
  lastExecuted: bigint
  maxSlippageBps: number
  active: boolean
}

const enabled = isDeployed && Boolean(RECUR_ADDRESS)
const base = { address: RECUR_ADDRESS, abi: recurAbi } as const

/** The stablecoin the deployment is funded in, read from the contract rather than configured
 *  separately - the contract is the single source of truth. */
export function useStablecoin() {
  const { data: token } = useReadContract({
    ...base,
    functionName: 'stablecoin',
    query: { enabled },
  })

  const address = token as Address | undefined

  const { data } = useReadContracts({
    contracts: address
      ? [
          { address, abi: erc20Abi, functionName: 'symbol' },
          { address, abi: erc20Abi, functionName: 'decimals' },
        ]
      : [],
    query: { enabled: Boolean(address) },
  })

  return {
    address,
    symbol: (data?.[0]?.result as string | undefined) ?? 'USDG',
    decimals: (data?.[1]?.result as number | undefined) ?? 6,
  }
}

/** Current allowance the connected wallet has granted Recur. */
export function useAllowance() {
  const { address: account } = useAccount()
  const { address: token, decimals, symbol } = useStablecoin()

  const { data, refetch, isLoading } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: 'allowance',
    args: account && RECUR_ADDRESS ? [account, RECUR_ADDRESS] : undefined,
    query: { enabled: Boolean(token && account && RECUR_ADDRESS) },
  })

  const { data: balance } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: account ? [account] : undefined,
    query: { enabled: Boolean(token && account) },
  })

  return {
    allowance: (data as bigint | undefined) ?? 0n,
    balance: (balance as bigint | undefined) ?? 0n,
    decimals,
    symbol,
    token,
    refetch,
    isLoading,
  }
}

/** Every plan belonging to the connected wallet, resolved from ids to full structs. */
export function useUserPlans() {
  const { address: account } = useAccount()

  const {
    data: ids,
    isLoading: idsLoading,
    refetch: refetchIds,
  } = useReadContract({
    ...base,
    functionName: 'getUserPlans',
    args: account ? [account] : undefined,
    query: { enabled: enabled && Boolean(account) },
  })

  // Memoised on `ids` so the array identity is stable between renders; otherwise the
  // `plans` memo below recomputes every render and the contract reads never settle.
  const planIds = useMemo(() => (ids as bigint[] | undefined) ?? [], [ids])

  const {
    data: planData,
    isLoading: plansLoading,
    refetch: refetchPlans,
  } = useReadContracts({
    contracts: planIds.map((id) => ({ ...base, functionName: 'getPlan', args: [id] })),
    query: { enabled: planIds.length > 0 },
  })

  const plans = useMemo<Plan[]>(() => {
    if (!planData) return []
    return planData
      .map((entry, i) => {
        const p = entry.result as
          | {
              owner: Address
              stockToken: Address
              amountPerCycle: bigint
              interval: bigint
              lastExecuted: bigint
              maxSlippageBps: number
              active: boolean
            }
          | undefined
        if (!p) return undefined
        return { id: planIds[i], ...p }
      })
      .filter((p): p is Plan => Boolean(p))
  }, [planData, planIds])

  return {
    plans,
    isLoading: idsLoading || plansLoading,
    refetch: () => {
      void refetchIds()
      void refetchPlans()
    },
  }
}

/** A single plan by id, for the detail view. */
export function usePlan(planId?: bigint) {
  const { data, isLoading, refetch } = useReadContract({
    ...base,
    functionName: 'getPlan',
    args: planId !== undefined ? [planId] : undefined,
    query: { enabled: enabled && planId !== undefined },
  })

  const plan = data
    ? ({ id: planId!, ...(data as Omit<Plan, 'id'>) } as Plan)
    : undefined

  return { plan, isLoading, refetch }
}

/** Whether a Stock Token is actually registered and enabled on-chain. */
export function useTokenConfig(token?: Address) {
  const { data, isLoading } = useReadContract({
    ...base,
    functionName: 'tokenConfigs',
    args: token ? [token] : undefined,
    query: { enabled: enabled && Boolean(token) },
  })

  // tokenConfigs returns (feed, poolFee, stockDecimals, feedDecimals, enabled)
  const tuple = data as [Address, number, number, number, boolean] | undefined

  return {
    feed: tuple?.[0],
    poolFee: tuple?.[1],
    stockDecimals: tuple?.[2] ?? 18,
    enabled: tuple?.[4] ?? false,
    isLoading,
  }
}

/** Seconds until a plan is next executable. Zero means it is due now. */
export function secondsUntilDue(plan: Plan, now: number): number {
  if (plan.lastExecuted === 0n) return 0
  const due = Number(plan.lastExecuted + plan.interval)
  return Math.max(0, due - now)
}

/** Fraction of the current interval that has elapsed, clamped to 0..1. */
export function cycleProgress(plan: Plan, now: number): number {
  if (plan.lastExecuted === 0n) return 1
  const interval = Number(plan.interval)
  if (interval <= 0) return 1
  const elapsed = now - Number(plan.lastExecuted)
  return Math.min(1, Math.max(0, elapsed / interval))
}
