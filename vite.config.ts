import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Pure static output. No SSR, no edge functions, no server-side API routes - `npm run build`
// produces a dist/ folder that any static host (Vercel included) can serve as-is.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    // Wallet SDKs are large; raise the warning threshold rather than chasing it with manual
    // chunking that would not actually reduce what the user downloads.
    chunkSizeWarningLimit: 1200,
  },
})
