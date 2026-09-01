import { useEffect, useState } from 'react'

/**
 * Current unix time in seconds, ticking once a second.
 *
 * Countdowns are derived from the plan's on-chain `lastExecuted + interval` against this clock,
 * never stored separately, so the interface cannot drift out of step with the contract.
 */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
