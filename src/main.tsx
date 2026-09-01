import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'

import '@rainbow-me/rainbowkit/styles.css'
import './styles/index.css'

import { App } from './App'
import { wagmiConfig } from './config/wagmi'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Plan state only changes when a transaction lands, so aggressive polling would just
      // burn requests against a rate-limited public RPC. Views refetch after their own writes.
      staleTime: 15_000,
      retry: 1,
    },
  },
})

// Pull RainbowKit's modal into the same palette as the rest of the interface, so the wallet
// flow does not look like a different product bolted on.
const theme = lightTheme({
  accentColor: '#a8341f',
  accentColorForeground: '#fdfcf8',
  borderRadius: 'small',
  fontStack: 'system',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme} modalSize="compact">
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
