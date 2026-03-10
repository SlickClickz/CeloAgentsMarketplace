// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { api, Network } from "@/lib/api";
// import Navbar from "@/components/Navbar";
// import CAMScoreBar from "@/components/CAMScoreBar";

// export default function Leaderboard() {
//   const [network, setNetwork] = useState<Network>("mainnet");
//   const [agents, setAgents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     setLoading(true);
//     setAgents([]);

//     api
//       .leaderboard(network, 50)
//       .then((results) => {
//         // Already sorted by CAM score from backend
//         // Already filtered to correct network
//         setAgents(results);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [network]);

//   return (
//     <div style={{ minHeight: "100vh" }}>
//       <Navbar network={network} onNetworkChange={setNetwork} />

//       <div
//         style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem" }}
//       >
//         <div className="fade-up">
//           <div
//             style={{
//               fontSize: "0.65rem",
//               letterSpacing: "0.15em",
//               color: "var(--green)",
//               marginBottom: "0.75rem",
//             }}
//           >
//             ◈ RANKINGS
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "baseline",
//               gap: "1rem",
//               marginBottom: "2rem",
//             }}
//           >
//             <h1
//               style={{
//                 fontFamily: "var(--font-display)",
//                 fontWeight: 800,
//                 fontSize: "2.5rem",
//                 letterSpacing: "-0.03em",
//               }}
//             >
//               Top Agents
//             </h1>
//             <span
//               style={{
//                 fontSize: "0.75rem",
//                 color: "var(--text-dim)",
//                 fontFamily: "var(--font-mono)",
//               }}
//             >
//               {network === "mainnet" ? "Celo Mainnet" : "Celo Sepolia Testnet"}
//             </span>
//           </div>
//         </div>

//         {loading ? (
//           <div
//             style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}
//           >
//             LOADING {network.toUpperCase()} AGENTS...
//           </div>
//         ) : agents.length === 0 ? (
//           <div
//             style={{
//               color: "var(--text-dim)",
//               fontSize: "0.75rem",
//               textAlign: "center",
//               padding: "4rem 0",
//             }}
//           >
//             <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>◈</div>
//             No scored agents found on {network}.
//             {network === "testnet" && (
//               <div style={{ marginTop: "0.5rem" }}>
//                 <button
//                   onClick={() => setNetwork("mainnet")}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     color: "var(--green)",
//                     cursor: "pointer",
//                     fontFamily: "var(--font-mono)",
//                     fontSize: "0.75rem",
//                   }}
//                 >
//                   Switch to mainnet →
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div
//             style={{
//               border: "1px solid var(--border)",
//               borderRadius: "6px",
//               overflow: "hidden",
//             }}
//           >
//             {/* Header */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "48px 1fr 140px 80px 80px 80px",
//                 gap: "1rem",
//                 padding: "0.75rem 1.25rem",
//                 borderBottom: "1px solid var(--border)",
//                 fontSize: "0.6rem",
//                 letterSpacing: "0.1em",
//                 color: "var(--text-dim)",
//                 background: "var(--bg-card)",
//               }}
//             >
//               <span>#</span>
//               <span>AGENT</span>
//               <span>CAM SCORE</span>
//               <span>IDENTITY</span>
//               <span>REP</span>
//               <span>FLAGS</span>
//             </div>

//             {/* Rows */}
//             {agents.map((agent, i) => (
//               <div
//                 key={`${agent.agentId}-${network}`}
//                 onClick={() =>
//                   router.push(
//                     `/agent/${agent.agentId}?network=${network}`
//                   )
//                 }
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "48px 1fr 140px 80px 80px 80px",
//                   gap: "1rem",
//                   padding: "1rem 1.25rem",
//                   borderBottom:
//                     i < agents.length - 1
//                       ? "1px solid var(--border)"
//                       : "none",
//                   cursor: "pointer",
//                   transition: "background 0.15s",
//                   alignItems: "center",
//                   opacity: 0,
//                   animation: `fadeUp 0.3s ease ${i * 0.03}s forwards`,
//                 }}
//                 onMouseEnter={(e) =>
//                   ((e.currentTarget as HTMLElement).style.background =
//                     "var(--bg-card)")
//                 }
//                 onMouseLeave={(e) =>
//                   ((e.currentTarget as HTMLElement).style.background =
//                     "transparent")
//                 }
//               >
//                 {/* Rank */}
//                 <span
//                   style={{
//                     fontFamily: "var(--font-display)",
//                     fontWeight: 700,
//                     fontSize: "1rem",
//                     color:
//                       i === 0
//                         ? "var(--gold)"
//                         : i === 1
//                         ? "#aaa"
//                         : i === 2
//                         ? "#cd7f32"
//                         : "var(--text-dim)",
//                   }}
//                 >
//                   {i + 1}
//                 </span>

//                 {/* Name + ID */}

// <div>
//   <div
//     style={{
//       fontFamily: "var(--font-display)",
//       fontWeight: 600,
//       fontSize: "0.9rem",
//       marginBottom: "0.15rem",
//     }}
//   >
//     {agent.name}
//   </div>
//   <div
//     style={{
//       fontSize: "0.6rem",
//       color: "var(--text-dim)",
//       display: "flex",
//       gap: "0.5rem",
//       alignItems: "center",
//     }}
//   >
//     <span>#{agent.agentId}</span>
//     <span
//       style={{
//         padding: "1px 5px",
//         borderRadius: "2px",
//         background: network === "mainnet"
//           ? "rgba(0,255,136,0.08)"
//           : "rgba(255,165,0,0.08)",
//         color: network === "mainnet" ? "var(--green)" : "#ffaa00",
//         border: `1px solid ${
//           network === "mainnet"
//             ? "rgba(0,255,136,0.2)"
//             : "rgba(255,165,0,0.2)"
//         }`,
//         letterSpacing: "0.06em",
//         fontWeight: 600,
//       }}
//     >
//       {network === "mainnet" ? "MAINNET" : "TESTNET"}
//     </span>
//   </div>
// </div>

//                 {/* Score bar */}
//                 <div>
//                   <CAMScoreBar
//                     total={agent.camScore}
//                     breakdown={agent.breakdown}
//                     size="sm"
//                   />
//                 </div>

//                 {/* Identity */}
//                 <span
//                   style={{
//                     fontSize: "0.8rem",
//                     color: "#00aaff",
//                     fontWeight: 500,
//                   }}
//                 >
//                   {agent.breakdown.identity}
//                 </span>

//                 {/* Reputation */}
//                 <span
//                   style={{
//                     fontSize: "0.8rem",
//                     color: "var(--green)",
//                     fontWeight: 500,
//                   }}
//                 >
//                   {agent.breakdown.reputation}
//                 </span>

//                 {/* Flags */}
//                 <span
//                   style={{
//                     fontSize: "0.65rem",
//                     color:
//                       agent.flags.filter(
//                         (f: any) => f.severity === "critical"
//                       ).length > 0
//                         ? "var(--red)"
//                         : "var(--green)",
//                   }}
//                 >
//                   {agent.flags.filter(
//                     (f: any) => f.severity === "critical"
//                   ).length > 0
//                     ? `⚠ ${
//                         agent.flags.filter(
//                           (f: any) => f.severity === "critical"
//                         ).length
//                       }`
//                     : "✓ CLEAN"}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, Network } from "@/lib/api";
import Navbar from "@/components/Navbar";
import CAMScoreBar from "@/components/CAMScoreBar";

export default function Leaderboard() {
  const [network, setNetwork] = useState<Network>("mainnet");
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setAgents([]);

    api
      .leaderboard(network, 50)
      .then((results) => {
        setAgents(results);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [network]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar network={network} onNetworkChange={setNetwork} />

      {/* Hero Section */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 2rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--green)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
              ◈ GLOBAL RANKINGS
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 800, margin: 0 }}>
              Agent Leaderboard
            </h1>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "10rem 0", textAlign: "center", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            FETCHING AGENT DATA...
          </div>
        ) : (
          <div style={{ 
            background: "rgba(255, 255, 255, 0.02)", 
            border: "1px solid var(--border)", 
            borderRadius: "12px", 
            overflow: "hidden",
            backdropFilter: "blur(10px)"
          }}>
            {/* Sticky Table Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 180px 100px 100px 100px",
              gap: "1.5rem",
              padding: "1rem 1.5rem",
              background: "rgba(255, 255, 255, 0.03)",
              borderBottom: "1px solid var(--border)",
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "var(--text-dim)",
              letterSpacing: "0.1em",
              position: "sticky",
              top: 0,
              zIndex: 10
            }}>
              <span>RANK</span>
              <span>AGENT ENTITY</span>
              <span>CAM SCORE (CREDIBILITY)</span>
              <span>IDENTITY</span>
              <span>REPUTATION</span>
              {/* <span style={{ textAlign: "right" }}>STATUS</span> */}
            </div>

            {/* Agent Rows */}
            {agents.map((agent, i) => {
              const isTopThree = i < 3;
              const rankColor = i === 0 ? "var(--gold)" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "var(--text-dim)";

              return (
                <div
                  key={agent.agentId}
                  onClick={() => router.push(`/agent/${agent.agentId}?network=${network}`)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 180px 100px 100px 100px",
                    gap: "1.5rem",
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    cursor: "pointer",
                    alignItems: "center",
                    transition: "all 0.2s",
                    background: isTopThree ? `linear-gradient(90deg, ${rankColor}05 0%, transparent 100%)` : "transparent"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = isTopThree ? `linear-gradient(90deg, ${rankColor}05 0%, transparent 100%)` : "transparent"}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: rankColor, fontSize: "1.1rem" }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>{agent.name}</div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                      ID: {agent.agentId}
                    </div>
                  </div>

                  <div>
                    <CAMScoreBar total={agent.camScore} breakdown={agent.breakdown} size="sm" />
                  </div>

                  <span style={{ color: "#00aaff", fontWeight: 600, fontSize: "0.85rem" }}>{agent.breakdown.identity}</span>
                  <span style={{ color: "var(--green)", fontWeight: 600, fontSize: "0.85rem" }}>{agent.breakdown.reputation}</span>

                  {/* <div style={{ textAlign: "right" }}>
                    <span style={{
                      fontSize: "0.6rem",
                      padding: "3px 8px",
                      borderRadius: "100px",
                      background: agent.flags.length > 0 ? "rgba(255, 85, 85, 0.1)" : "rgba(0, 255, 136, 0.1)",
                      color: agent.flags.length > 0 ? "var(--red)" : "var(--green)",
                      border: `1px solid ${agent.flags.length > 0 ? "var(--red)44" : "var(--green)44"}`,
                      fontWeight: 700
                    }}>
                      {agent.flags.length > 0 ? `⚠ ${agent.flags.length} FLAGS` : "VERIFIED"}
                    </span>
                  </div> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
     
    </div>
  );
}