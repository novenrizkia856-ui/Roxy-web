/**
 * Development-only browser wallet, for driving the real UI against a local chain.
 *
 * The write paths in this app - approve, createPlan, cancel - can only be exercised through a
 * wallet, which normally means a human with a browser extension. That left the whole signing
 * flow untested. This supplies an EIP-1193 provider that forwards straight to the local node
 * and lets an automated run click through the same buttons a person would.
 *
 * It is safe because it cannot sign anything: it holds no key. Every transaction is sent with
 * `eth_sendTransaction` from an account the node itself has unlocked, which is something only a
 * development node like Anvil ever does. Pointed at a real network it would simply fail.
 *
 * Double-guarded: the dev-server build AND an explicit opt-in flag. It is impossible to reach
 * in a production bundle, because `import.meta.env.DEV` is statically false there and the whole
 * module is dropped.
 *
 * Enable with, in .env:
 *   VITE_DEV_WALLET=true
 */

interface Eip1193Request {
  method: string
  params?: unknown[]
}

const enabled = import.meta.env.DEV && import.meta.env.VITE_DEV_WALLET === 'true'

if (enabled) {
  const rpcUrl = import.meta.env.VITE_RPC_URL as string
  let id = 0
  const listeners = new Map<string, Set<(...args: unknown[]) => void>>()

  async function rpc(method: string, params: unknown[] = []): Promise<unknown> {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }),
    })
    const json = await res.json()
    if (json.error) {
      // Shape the failure the way a wallet does, so the app's error handling sees what it
      // would see in production rather than a bare fetch rejection.
      const err = new Error(json.error.message ?? 'RPC error') as Error & { code?: number }
      err.code = json.error.code ?? -32603
      throw err
    }
    return json.result
  }

  let accounts: string[] = []

  const provider = {
    isMetaMask: true, // some connectors gate on this; the provider is otherwise honest
    isDevWallet: true,

    async request({ method, params = [] }: Eip1193Request): Promise<unknown> {
      switch (method) {
        case 'eth_requestAccounts':
        case 'eth_accounts': {
          if (accounts.length === 0) {
            accounts = (await rpc('eth_accounts')) as string[]
          }
          return accounts
        }

        // The node is whatever chain it is; there is nothing to switch to or add.
        case 'wallet_switchEthereumChain':
        case 'wallet_addEthereumChain':
          return null

        case 'wallet_requestPermissions':
          return [{ parentCapability: 'eth_accounts' }]

        default:
          return rpc(method, params as unknown[])
      }
    },

    on(event: string, handler: (...args: unknown[]) => void) {
      if (!listeners.has(event)) listeners.set(event, new Set())
      listeners.get(event)!.add(handler)
      return provider
    },

    removeListener(event: string, handler: (...args: unknown[]) => void) {
      listeners.get(event)?.delete(handler)
      return provider
    },
  }

  // Expose both ways a connector might find a wallet: the legacy global, and the EIP-6963
  // announcement wagmi v2 actually prefers.
  ;(globalThis as unknown as { ethereum?: unknown }).ethereum = provider

  const detail = Object.freeze({
    info: {
      uuid: '9f8b1c34-0000-4000-8000-anvildevwallet'.slice(0, 36),
      name: 'Anvil Dev Wallet',
      rdns: 'dev.local.anvil',
      icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZDk1NzNhIi8+PC9zdmc+',
    },
    provider,
  })

  const announce = () => window.dispatchEvent(new CustomEvent('eip6963:announceProvider', { detail }))

  window.addEventListener('eip6963:requestProvider', announce)
  announce()

  console.info('[devWallet] active — forwarding to', rpcUrl)
}

export {}
