// import type { Metadata } from "next";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "CAM — Celo Agent Marketplace",
//   description: "Discover, evaluate, and hire AI agents on Celo. Powered by CAM Score — the trust metric for the agent economy.",
//   openGraph: {
//     title: "CAM — Celo Agent Marketplace",
//     description: "Trust-scored AI agents on Celo",
//   },
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "./globals.css";
import Web3Provider from "@/components/Web3Provider";

export const metadata: Metadata = {
  title: "CAM — Celo Agent Marketplace",
  description: "Discover, evaluate, and hire AI agents on Celo.",
  openGraph: {
    title: "CAM — Celo Agent Marketplace",
    description: "Trust-scored AI agents on Celo",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}