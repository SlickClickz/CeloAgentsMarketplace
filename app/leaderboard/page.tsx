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
//   const [showPartnerForm, setShowPartnerForm] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     setLoading(true);
//     setAgents([]);

//     api
//       .leaderboard(network, 50)
//       .then((results) => {
//         setAgents(results);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [network]);

//   return (
//     <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
//       <Navbar network={network} onNetworkChange={setNetwork} />

//       {/* Hero Section */}
//       <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 2rem 2rem" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
//           <div>
//             <div style={{ fontSize: "0.7rem", color: "var(--green)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
//               ◈ GLOBAL RANKINGS
//             </div>
//             <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 800, margin: 0 }}>
//               Agent Leaderboard
//             </h1>
//           </div>
//         </div>

//         {loading ? (
//           <div style={{ padding: "10rem 0", textAlign: "center", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
//             FETCHING AGENT DATA...
//           </div>
//         ) : (
//           <div style={{ 
//             background: "rgba(255, 255, 255, 0.02)", 
//             border: "1px solid var(--border)", 
//             borderRadius: "12px", 
//             overflow: "hidden",
//             backdropFilter: "blur(10px)"
//           }}>
//             {/* Sticky Table Header */}
//             <div style={{
//               display: "grid",
//               gridTemplateColumns: "60px 1fr 180px 100px 100px 100px",
//               gap: "1.5rem",
//               padding: "1rem 1.5rem",
//               background: "rgba(255, 255, 255, 0.03)",
//               borderBottom: "1px solid var(--border)",
//               fontSize: "0.65rem",
//               fontWeight: 700,
//               color: "var(--text-dim)",
//               letterSpacing: "0.1em",
//               position: "sticky",
//               top: 0,
//               zIndex: 10
//             }}>
//               <span>RANK</span>
//               <span>AGENT ENTITY</span>
//               <span>CAM SCORE (CREDIBILITY)</span>
//               <span>IDENTITY</span>
//               <span>REPUTATION</span>
//               {/* <span style={{ textAlign: "right" }}>STATUS</span> */}
//             </div>

//             {/* Agent Rows */}
//             {agents.map((agent, i) => {
//               const isTopThree = i < 3;
//               const rankColor = i === 0 ? "var(--gold)" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "var(--text-dim)";

//               return (
//                 <div
//                   key={agent.agentId}
//                   onClick={() => router.push(`/agent/${agent.agentId}?network=${network}`)}
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "60px 1fr 180px 100px 100px 100px",
//                     gap: "1.5rem",
//                     padding: "1.25rem 1.5rem",
//                     borderBottom: "1px solid rgba(255,255,255,0.03)",
//                     cursor: "pointer",
//                     alignItems: "center",
//                     transition: "all 0.2s",
//                     background: isTopThree ? `linear-gradient(90deg, ${rankColor}05 0%, transparent 100%)` : "transparent"
//                   }}
//                   onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
//                   onMouseLeave={(e) => e.currentTarget.style.background = isTopThree ? `linear-gradient(90deg, ${rankColor}05 0%, transparent 100%)` : "transparent"}
//                 >
//                   <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: rankColor, fontSize: "1.1rem" }}>
//                     {String(i + 1).padStart(2, '0')}
//                   </span>

//                   <div>
//                     <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>{agent.name}</div>
//                     <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
//                       ID: {agent.agentId}
//                     </div>
//                   </div>

//                   <div>
//                     <CAMScoreBar total={agent.camScore} breakdown={agent.breakdown} size="sm" />
//                   </div>

//                   <span style={{ color: "#00aaff", fontWeight: 600, fontSize: "0.85rem" }}>{agent.breakdown.identity}</span>
//                   <span style={{ color: "var(--green)", fontWeight: 600, fontSize: "0.85rem" }}>{agent.breakdown.reputation}</span>

//                   {/* <div style={{ textAlign: "right" }}>
//                     <span style={{
//                       fontSize: "0.6rem",
//                       padding: "3px 8px",
//                       borderRadius: "100px",
//                       background: agent.flags.length > 0 ? "rgba(255, 85, 85, 0.1)" : "rgba(0, 255, 136, 0.1)",
//                       color: agent.flags.length > 0 ? "var(--red)" : "var(--green)",
//                       border: `1px solid ${agent.flags.length > 0 ? "var(--red)44" : "var(--green)44"}`,
//                       fontWeight: 700
//                     }}>
//                       {agent.flags.length > 0 ? `⚠ ${agent.flags.length} FLAGS` : "VERIFIED"}
//                     </span>
//                   </div> */}
//                 </div>
//               );
//             })}
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
      {/* FIXED: Swapped static padding for clamp() and added box-sizing to prevent horizontal overflow */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem clamp(1rem, 5vw, 2rem) 2rem", boxSizing: "border-box", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--green)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
              ◈ GLOBAL RANKINGS
            </div>
            {/* FIXED: Used clamp for font size so the title scales down on smaller screens */}
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 800, margin: 0 }}>
              Agent Leaderboard
            </h1>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "10rem 0", textAlign: "center", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            FETCHING AGENT DATA...
          </div>
        ) : (
          /* FIXED: Added overflowX: "auto" to allow horizontal scrolling on small screens */
          <div style={{ 
            background: "rgba(255, 255, 255, 0.02)", 
            border: "1px solid var(--border)", 
            borderRadius: "12px", 
            overflowX: "auto", 
            WebkitOverflowScrolling: "touch",
            backdropFilter: "blur(10px)",
            width: "100%"
          }}>
            {/* FIXED: Added an inner container with minWidth to hold the grid structure intact */}
            <div style={{ minWidth: "750px" }}>
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
          </div>
        )}
      </div>
    </div>
  );
}