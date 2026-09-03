import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseUnits } from 'viem'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

import { TxStatus, type TxPhase } from '../components/TxStatus'
import { WalletButton } from '../components/WalletButton'
import {
  erc20Abi,
  isDeployed,
  MAX_SLIPPAGE_BPS,
  RECUR_ADDRESS,
  recurAbi,
} from '../config/contract'
import { STOCK_TOKENS, type StockTokenMeta } from '../config/tokens'
import { formatAmount, formatBps, formatInterval } from '../lib/format'
import { useAllowance, useTokenConfig } from '../lib/usePlans'

const STEPS = ['Asset', 'Amount', 'Cadence', 'Slippage', 'Review'] as const

const INTERVALS = [
  { label: 'Daily', seconds: 86400 },
  { label: 'Weekly', seconds: 604800 },
  { label: 'Fortnightly', seconds: 1209600 },
  { label: 'Monthly', seconds: 2592000 },
]

const SLIPPAGES = [50, 100, 200, 300]

function StepRail({ current, onJump }: { current: number; onJump: (i: number) => void }) {
  return (
    <ol className="space-y-0">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="border-t border-rule last:border-b">
            <button
              type="button"
              disabled={i > current}
              onClick={() => onJump(i)}
              className="flex w-full items-baseline gap-3 py-3 text-left disabled:cursor-not-allowed"
            >
              <span
                className={`numeric text-[0.72rem] ${
                  active ? 'text-accent' : done ? 'text-ink-soft' : 'text-ink-faint'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`display text-[0.85rem] ${
                  active ? 'text-ink' : done ? 'text-ink-soft' : 'text-ink-faint'
                }`}
              >
                {label}
              </span>
              {done && <span className="ml-auto text-[0.8rem] text-positive">✓</span>}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export function CreatePlan() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const { allowance, balance, decimals, symbol, token: stableToken, refetch } = useAllowance()

  const [step, setStep] = useState(0)
  const [asset, setAsset] = useState<StockTokenMeta | undefined>(STOCK_TOKENS[0])
  const [amount, setAmount] = useState('100')
  const [intervalSeconds, setIntervalSeconds] = useState(604800)
  const [slippageBps, setSlippageBps] = useState(STOCK_TOKENS[0]?.defaultSlippageBps ?? 100)
  const [cyclesToApprove, setCyclesToApprove] = useState(12)
  const [unlimited, setUnlimited] = useState(false)

  const tokenCfg = useTokenConfig(asset?.address)

  const amountWei = useMemo(() => {
    try {
      return amount ? parseUnits(amount, decimals) : 0n
    } catch {
      return 0n
    }
  }, [amount, decimals])

  const needed = amountWei * BigInt(Math.max(1, cyclesToApprove))
  const approvalTarget = unlimited ? (2n ** 256n - 1n) : needed
  const needsApproval = allowance < amountWei || allowance < needed

  const amountValid = amountWei > 0n
  const insufficientBalance = amountValid && balance < amountWei

  // --- approve ---
  const approve = useWriteContract()
  const approveReceipt = useWaitForTransactionReceipt({ hash: approve.data })

  // --- createPlan ---
  const create = useWriteContract()
  const createReceipt = useWaitForTransactionReceipt({ hash: create.data })

  useEffect(() => {
    if (approveReceipt.isSuccess) refetch()
  }, [approveReceipt.isSuccess, refetch])

  useEffect(() => {
    if (createReceipt.isSuccess) {
      const id = setTimeout(() => navigate('/dashboard'), 1600)
      return () => clearTimeout(id)
    }
  }, [createReceipt.isSuccess, navigate])

  const approvePhase: TxPhase = approve.error
    ? 'error'
    : approveReceipt.isSuccess
      ? 'success'
      : approveReceipt.isLoading
        ? 'pending'
        : approve.isPending
          ? 'signing'
          : 'idle'

  const createPhase: TxPhase = create.error
    ? 'error'
    : createReceipt.isSuccess
      ? 'success'
      : createReceipt.isLoading
        ? 'pending'
        : create.isPending
          ? 'signing'
          : 'idle'

  const canAdvance =
    (step === 0 && Boolean(asset)) ||
    // A balance shortfall warns but does not block: the contract will happily record a plan
    // you cannot yet fund, and execution simply reverts until you top up. Blocking here
    // would also contradict the message this step shows.
    (step === 1 && amountValid) ||
    (step === 2 && intervalSeconds >= 3600) ||
    (step === 3 && slippageBps >= 0 && slippageBps <= MAX_SLIPPAGE_BPS)

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="max-w-md">
          <p className="label">New plan</p>
          <h1 className="mt-3 display text-[1.4rem]">Connect first</h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
            A plan is stored on chain against your address, so you need a wallet before you can
            create one. Nothing is signed until the final step.
          </p>
          <div className="mt-6">
            <WalletButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="border-b border-rule pb-6">
        <p className="label">New plan</p>
        <h1 className="mt-2 display text-[1.5rem] leading-none">
          Set the terms
        </h1>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-3">
          <StepRail current={step} onJump={setStep} />
        </div>

        <div className="lg:col-span-8 lg:col-start-5">
          {/* -------------------------------------------------- 1. Asset */}
          {step === 0 && (
            <section className="rise">
              <h2 className="font-serif text-[1.55rem] leading-snug">Which Stock Token?</h2>
              <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-ink-soft">
                Only assets registered by the protocol can be scheduled. That restriction exists
                because this chain hosts many counterfeit tokens reusing real tickers.
              </p>

              <div className="mt-6 space-y-2.5">
                {STOCK_TOKENS.map((t) => (
                  <button
                    key={t.address}
                    type="button"
                    data-selected={asset?.address === t.address}
                    onClick={() => {
                      setAsset(t)
                      // Each asset carries its own floor, because the fee tier its pool sits on
                      // differs. Carrying a tolerance from a 0.05% pool over to a 0.30% one is
                      // how a plan ends up reverting on every execution.
                      setSlippageBps(t.defaultSlippageBps)
                    }}
                    className="choice block w-full"
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="display text-[0.9rem]">{t.name}</span>
                      <span className="numeric text-[0.85rem] text-ink-muted">{t.symbol}</span>
                      {tokenCfg.enabled && asset?.address === t.address && (
                        <span className="label ml-auto !text-positive">Registered</span>
                      )}
                    </span>
                    <span className="numeric mt-1 block text-[0.7rem] text-ink-faint">
                      Pool tier {t.poolFee === 3000 ? '0.30%' : '0.05%'}
                    </span>
                    <span className="mt-1 block text-[0.85rem] leading-snug text-ink-muted">
                      {t.note}
                    </span>
                    <span className="numeric mt-1.5 block text-[0.7rem] text-ink-faint">
                      {t.address}
                    </span>
                  </button>
                ))}
              </div>

              {asset && !tokenCfg.isLoading && !tokenCfg.enabled && isDeployed && (
                <p className="mt-4 rounded-xs border border-caution/40 bg-caution-wash px-3.5 py-3 text-[0.88rem] text-ink-soft">
                  This token is not currently enabled in the contract, so creating a plan for it
                  would revert. The protocol owner has to register it first.
                </p>
              )}
            </section>
          )}

          {/* -------------------------------------------------- 2. Amount */}
          {step === 1 && (
            <section className="rise">
              <h2 className="font-serif text-[1.55rem] leading-snug">How much per cycle?</h2>
              <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-ink-soft">
                This exact amount is pulled from your wallet each time the plan runs. It is never
                pulled early and never more than once per interval.
              </p>

              <div className="mt-6 max-w-xs">
                <label className="label" htmlFor="amount">
                  Amount in {symbol}
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    id="amount"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="field text-[1.1rem]"
                    placeholder="100"
                  />
                  <span className="numeric text-[0.85rem] text-ink-muted">{symbol}</span>
                </div>

                <p className="numeric mt-2 text-[0.78rem] text-ink-muted">
                  Wallet balance: {formatAmount(balance, decimals, 2)} {symbol}
                </p>

                {insufficientBalance && (
                  <p className="mt-2 text-[0.85rem] text-accent">
                    That is more than your current balance. You can still create the plan, but the
                    first execution will fail until you top up.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* -------------------------------------------------- 3. Cadence */}
          {step === 2 && (
            <section className="rise">
              <h2 className="font-serif text-[1.55rem] leading-snug">How often?</h2>
              <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-ink-soft">
                The clock starts when the plan is first executed. The contract enforces a minimum
                of one hour between purchases.
              </p>

              <div className="mt-6 grid max-w-lg grid-cols-2 gap-2.5 sm:grid-cols-4">
                {INTERVALS.map((opt) => (
                  <button
                    key={opt.seconds}
                    type="button"
                    data-selected={intervalSeconds === opt.seconds}
                    onClick={() => setIntervalSeconds(opt.seconds)}
                    className="choice text-center"
                  >
                    <span className="display text-[0.85rem]">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 max-w-xs">
                <label className="label" htmlFor="custom-interval">
                  Or a custom number of hours
                </label>
                <input
                  id="custom-interval"
                  inputMode="numeric"
                  value={Math.round(intervalSeconds / 3600)}
                  onChange={(e) => {
                    const hours = Math.max(1, Number(e.target.value.replace(/\D/g, '')) || 1)
                    setIntervalSeconds(hours * 3600)
                  }}
                  className="field mt-2"
                />
                <p className="numeric mt-2 text-[0.78rem] text-ink-muted">
                  {formatInterval(intervalSeconds)}
                </p>
              </div>
            </section>
          )}

          {/* -------------------------------------------------- 4. Slippage */}
          {step === 3 && (
            <section className="rise">
              <h2 className="font-serif text-[1.55rem] leading-snug">
                What is the worst price you would accept?
              </h2>
              <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-ink-soft">
                Each purchase is floored against a Chainlink price read in the same transaction.
                If the pool cannot beat that floor, the execution reverts instead of filling badly
                That is also what limits how much a sandwich attack could take.
              </p>

              <div className="mt-6 grid max-w-lg grid-cols-2 gap-2.5 sm:grid-cols-4">
                {SLIPPAGES.map((bps) => (
                  <button
                    key={bps}
                    type="button"
                    data-selected={slippageBps === bps}
                    onClick={() => setSlippageBps(bps)}
                    className="choice text-center"
                  >
                    <span className="numeric text-[1rem]">{formatBps(bps)}</span>
                  </button>
                ))}
              </div>

              {asset && slippageBps < asset.minSlippageBps && (
                <p className="mt-4 max-w-lg rounded-xs border border-caution/40 bg-caution-wash px-3.5 py-3 text-[0.88rem] leading-relaxed text-ink-soft">
                  Too tight for {asset.symbol}. Its pool sits on the{' '}
                  {asset.poolFee === 3000 ? '0.30%' : '0.05%'} tier, so the fee and spread alone
                  would breach this floor and most executions would simply revert. Allow at least{' '}
                  {formatBps(asset.minSlippageBps)}.
                </p>
              )}
              {slippageBps > 500 && (
                <p className="mt-4 max-w-lg rounded-xs border border-accent/40 bg-accent-wash px-3.5 py-3 text-[0.88rem] leading-relaxed text-ink-soft">
                  A tolerance this wide is the amount you are authorising a bad fill to cost you.
                  Wider is not safer. It is the ceiling on what an attacker can take.
                </p>
              )}
            </section>
          )}

          {/* -------------------------------------------------- 5. Review */}
          {step === 4 && (
            <section className="rise">
              <h2 className="font-serif text-[1.55rem] leading-snug">Review</h2>

              <dl className="mt-6 panel divide-y divide-rule">
                {[
                  ['Asset', `${asset?.name} · ${asset?.symbol}`],
                  ['Amount per cycle', `${amount} ${symbol}`],
                  ['Cadence', formatInterval(intervalSeconds)],
                  ['Max slippage', formatBps(slippageBps)],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-3">
                    <dt className="label">{k}</dt>
                    <dd className="numeric text-[0.95rem]">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Approval */}
              <div className="mt-8">
                <h3 className="display text-[0.95rem]">
                  {needsApproval ? 'Step 1 · Approve' : 'Allowance in place'}
                </h3>

                {needsApproval ? (
                  <>
                    <p className="mt-2 max-w-lg text-[0.9rem] leading-relaxed text-ink-soft">
                      The Recur contract can only move {symbol} you have explicitly allowed. Approving a batch
                      of cycles means you are not signing a transaction every time.
                    </p>

                    <div className="mt-4 flex flex-wrap items-end gap-4">
                      <div className="w-40">
                        <label className="label" htmlFor="cycles">
                          Cycles to cover
                        </label>
                        <input
                          id="cycles"
                          inputMode="numeric"
                          disabled={unlimited}
                          value={cyclesToApprove}
                          onChange={(e) =>
                            setCyclesToApprove(
                              Math.max(1, Number(e.target.value.replace(/\D/g, '')) || 1),
                            )
                          }
                          className="field mt-2 disabled:opacity-40"
                        />
                      </div>
                      <label className="flex items-center gap-2 pb-2.5 text-[0.88rem] text-ink-soft">
                        <input
                          type="checkbox"
                          checked={unlimited}
                          onChange={(e) => setUnlimited(e.target.checked)}
                          className="accent-accent"
                        />
                        Unlimited
                      </label>
                    </div>

                    <p className="numeric mt-3 text-[0.78rem] text-ink-muted">
                      {unlimited
                        ? 'Approving an unlimited allowance. Revocable at any time.'
                        : `Approving ${formatAmount(needed, decimals, 2)} ${symbol}, enough for ${cyclesToApprove} cycles.`}
                    </p>

                    <button
                      type="button"
                      className="btn btn-ghost mt-4"
                      disabled={approve.isPending || approveReceipt.isLoading || !stableToken}
                      onClick={() =>
                        approve.writeContract({
                          address: stableToken!,
                          abi: erc20Abi,
                          functionName: 'approve',
                          args: [RECUR_ADDRESS!, approvalTarget],
                        })
                      }
                    >
                      Approve {symbol}
                    </button>

                    <TxStatus
                      phase={approvePhase}
                      hash={approve.data}
                      error={approve.error?.message}
                      action={`Approving ${symbol}`}
                    />
                  </>
                ) : (
                  <p className="numeric mt-2 text-[0.85rem] text-ink-muted">
                    {formatAmount(allowance, decimals, 2)} {symbol} approved.
                  </p>
                )}
              </div>

              {/* Create */}
              <div className="mt-8 border-t border-rule pt-6">
                <h3 className="display text-[0.95rem]">Step 2 · Create the plan</h3>
                <p className="mt-2 max-w-lg text-[0.9rem] leading-relaxed text-ink-soft">
                  This records the schedule on chain. The first purchase becomes available
                  immediately.
                </p>

                <button
                  type="button"
                  className="btn btn-primary mt-4"
                  disabled={
                    needsApproval ||
                    !asset ||
                    !amountValid ||
                    create.isPending ||
                    createReceipt.isLoading ||
                    !isDeployed
                  }
                  onClick={() =>
                    create.writeContract({
                      address: RECUR_ADDRESS!,
                      abi: recurAbi,
                      functionName: 'createPlan',
                      args: [asset!.address, amountWei, BigInt(intervalSeconds), slippageBps],
                    })
                  }
                >
                  Create plan
                </button>

                <TxStatus
                  phase={createPhase}
                  hash={create.data}
                  error={create.error?.message}
                  action="Creating plan"
                />
              </div>
            </section>
          )}

          {/* -------------------------------------------------- navigation */}
          {step < 4 && (
            <div className="mt-10 flex items-center gap-3 border-t border-rule pt-6">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!canAdvance}
                onClick={() => setStep((s) => Math.min(4, s + 1))}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
