import { ConnectButton } from '@rainbow-me/rainbowkit'
import { shortAddress } from '../lib/format'

/**
 * Wallet control built on RainbowKit's headless API rather than its packaged button.
 *
 * The default button carries RainbowKit's own visual language - rounded pill, its palette, its
 * typography - which would be the one obviously borrowed element in the interface. The modal
 * still does the work; only the trigger is ours.
 */
export function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, openChainModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        if (!ready) {
          return <div aria-hidden className="h-9 w-32" />
        }

        if (!connected) {
          return (
            <button type="button" onClick={openConnectModal} className="btn btn-primary">
              Connect wallet
            </button>
          )
        }

        if (chain.unsupported) {
          return (
            <button type="button" onClick={openChainModal} className="btn btn-ghost">
              <span className="text-accent">Wrong network</span>
            </button>
          )
        }

        return (
          <button
            type="button"
            onClick={openAccountModal}
            className="btn btn-ghost group"
            title="Account details"
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-positive"
            />
            <span className="numeric">{shortAddress(account.address)}</span>
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}
