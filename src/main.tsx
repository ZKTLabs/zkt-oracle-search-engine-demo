import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { arbitrum, base, mainnet, optimism, polygon, zora } from 'wagmi/chains'

import App from './App'

import '@rainbow-me/rainbowkit/styles.css'
import './assets/styles/index.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'

const config = getDefaultConfig({
  appName: 'zkt-swap-hook',
  projectId: 'zkt-swap-hook',
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
  ssr: false, // If your dApp uses server side rendering (SSR)
})

const queryClient = new QueryClient()

const root = createRoot(document.getElementById('root')!)
root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)
