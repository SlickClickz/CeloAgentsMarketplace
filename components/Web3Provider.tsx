// "use client";

// import { WagmiProvider, createConfig, http } from "wagmi";
// import { celo } from "wagmi/chains";
// import { defineChain } from "viem";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { injected } from "wagmi/connectors";

// const celoSepolia = defineChain({
//   id: 11142220,
//   name: "Celo Sepolia",
//   nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://forno.celo-sepolia.celo-testnet.org"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "Blockscout",
//       url: "https://celo-sepolia.blockscout.com",
//     },
//   },
//   testnet: true,
// });

// const config = createConfig({
//   chains: [celo, celoSepolia],
//   connectors: [
//     injected(), // MetaMask, Rabby, Coinbase Wallet, any injected
//   ],
//   transports: {
//     [celo.id]: http("https://forno.celo.org"),
//     [celoSepolia.id]: http("https://forno.celo-sepolia.celo-testnet.org"),
//   },
//   ssr: true,
// });

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: { staleTime: 1000 * 60 * 5 },
//   },
// });

// export default function Web3Provider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         {children}
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }

"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { celo, celoSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";

const config = createConfig({
  chains: [celo, celoSepolia],
  connectors: [injected()],
  transports: {
    [celo.id]: http("https://forno.celo.org"),
    [celoSepolia.id]: http("https://forno.celo-sepolia.celo-testnet.org"),
  },
  ssr: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 },
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}