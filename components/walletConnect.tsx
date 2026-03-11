// "use client";

// import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { truncateAddress } from "@/lib/utils";

// export default function WalletConnect({
//   targetChainId,
//   onConnected,
// }: {
//   targetChainId: number;
//   onConnected: (address: string) => void;
// }) {
//   const { address, isConnected } = useAccount();
//   const { connect, connectors, isPending } = useConnect();
//   const { disconnect } = useDisconnect();

//   if (isConnected && address) {
//     onConnected(address);
//     return (
//       <div 
//         style={{ 
//           padding: "1rem 1.25rem", 
//           background: "rgba(0, 255, 136, 0.03)", 
//           border: "1px solid rgba(0, 255, 136, 0.2)", 
//           borderRadius: "8px", 
//           fontSize: "0.8rem", 
//           color: "var(--green)", 
//           display: "flex", 
//           justifyContent: "space-between", 
//           alignItems: "center",
//           backdropFilter: "blur(4px)"
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
//           <div style={{ width: 8, height: 8, background: "var(--green)", borderRadius: "50%", boxShadow: "0 0 8px var(--green)" }} />
//           <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
//             {truncateAddress(address)}
//           </span>
//         </div>
//         <button
//           onClick={() => disconnect()}
//           style={{ 
//             background: "rgba(255, 255, 255, 0.05)", 
//             border: "none", 
//             padding: "4px 10px",
//             borderRadius: "4px",
//             color: "rgba(255,255,255,0.4)", 
//             fontFamily: "var(--font-mono)", 
//             fontSize: "0.65rem", 
//             cursor: "pointer",
//             transition: "all 0.2s"
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")}
//           onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
//         >
//           DISCONNECT
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
//       {connectors.map((connector) => (
//         <button
//           key={connector.uid}
//           onClick={() => connect({ connector, chainId: targetChainId })}
//           disabled={isPending}
//           style={{
//             padding: "1rem 1.25rem",
//             background: "rgba(255, 255, 255, 0.03)",
//             border: "1px solid rgba(255, 255, 255, 0.08)",
//             borderRadius: "8px",
//             color: "var(--text)",
//             fontFamily: "var(--font-mono)",
//             fontSize: "0.8rem",
//             cursor: isPending ? "not-allowed" : "pointer",
//             textAlign: "left",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//             width: "100%",
//             opacity: isPending ? 0.6 : 1,
//           }}
//           onMouseEnter={(e) => {
//             if (!isPending) {
//               e.currentTarget.style.borderColor = "var(--green)";
//               e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
//               e.currentTarget.style.transform = "translateX(4px)";
//             }
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
//             e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
//             e.currentTarget.style.transform = "translateX(0)";
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//             <span style={{ fontSize: "1.1rem", filter: "grayscale(1)" }}>🔌</span>
//             <span style={{ fontWeight: 600, letterSpacing: "0.02em" }}>
//               {isPending ? "INITIALIZING..." : connector.name.toUpperCase()}
//             </span>
//           </div>
//           <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", opacity: 0.5 }}>→</span>
//         </button>
//       ))}
//     </div>
//   );
// }