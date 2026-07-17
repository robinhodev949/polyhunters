"use client";

import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { robinhoodTestnet, robinhoodMainnet } from '@/lib/robinhoodChain';
import { injected } from 'wagmi/connectors';

// Configure wagmi config for injected wallets (MetaMask, Phantom EVM, Rabby, etc.)
const config = createConfig({
  chains: [robinhoodTestnet, robinhoodMainnet],
  connectors: [injected()],
  transports: {
    [robinhoodTestnet.id]: http(),
    [robinhoodMainnet.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = useMemo(() => new QueryClient(), []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
