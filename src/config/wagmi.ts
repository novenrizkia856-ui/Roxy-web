import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { robinhoodChain, RPC_URL } from './chains'

/**
 * WalletConnect project id. Free from https://cloud.reown.com.
 *
 * Without one, WalletConnect-based wallets are unavailable but injected wallets (MetaMask and
 * friends) still work, so the app stays usable rather than failing to start.
 */
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? ''

export const wagmiConfig = getDefaultConfig({
  appName: 'Recur',
  appDescription: 'Scheduled, non-custodial purchases of Robinhood Chain Stock Tokens.',
  projectId: walletConnectProjectId || 'recur-local-development',
  chains: [robinhoodChain],
  transports: {
    [robinhoodChain.id]: http(RPC_URL),
  },
  ssr: false,
})

export const hasWalletConnect = Boolean(walletConnectProjectId)
