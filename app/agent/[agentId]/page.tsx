// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import { api, AgentProfile, ScoreHistory, Network } from "@/lib/api";
// import Navbar from "@/components/Navbar";
// import CAMScoreBar from "@/components/CAMScoreBar";
// import SkillBadge from "@/components/SkillBadge";
// import ScoreChart from "@/components/ScoreChart";
// import {
//   truncateAddress,
//   timeAgo,
//   verificationLevelLabel,
// } from "@/lib/utils";

// export default function AgentProfilePage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const agentId = params.agentId as string;
//   const [network, setNetwork] = useState<Network>(
//     (searchParams.get("network") as Network) ?? "mainnet"
//   );

//   const [agent, setAgent] = useState<AgentProfile | null>(null);
//   const [history, setHistory] = useState<ScoreHistory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     Promise.all([
//       api.agent.get(agentId, network),
//       api.agent.history(agentId, network),
//     ])
//       .then(([a, h]) => {
//         setAgent(a);
//         setHistory(h);
//       })
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [agentId, network]);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     try {
//       await api.agent.refreshScore(agentId, network);
//       const updated = await api.agent.get(agentId, network);
//       setAgent(updated);
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   return (
//     <div style={{ minHeight: "100vh" }}>
//       <Navbar network={network} onNetworkChange={setNetwork} />

//       <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
//         {/* Back */}
//         <button
//           onClick={() => router.back()}
//           style={{
//             background: "none",
//             border: "none",
//             color: "var(--text-dim)",
//             fontFamily: "var(--font-mono)",
//             fontSize: "0.7rem",
//             cursor: "pointer",
//             marginBottom: "1.5rem",
//             padding: 0,
//             letterSpacing: "0.06em",
//           }}
//         >
//           ← BACK
//         </button>

//         {loading && (
//           <div style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
//             LOADING...
//           </div>
//         )}

//         {error && (
//           <div
//             style={{
//               padding: "1rem",
//               background: "rgba(255,68,68,0.05)",
//               border: "1px solid rgba(255,68,68,0.2)",
//               borderRadius: "4px",
//               color: "var(--red)",
//               fontSize: "0.75rem",
//             }}
//           >
//             {error}
//           </div>
//         )}

//         {agent && (
//           <div className="fade-up">
//             {/* Header */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "flex-start",
//                 marginBottom: "2rem",
//                 gap: "2rem",
//               }}
//             >
//               <div>
//                 <div
//                   style={{
//                     fontSize: "0.6rem",
//                     letterSpacing: "0.12em",
//                     color: "var(--text-dim)",
//                     marginBottom: "0.25rem",
//                   }}
//                 >
//                   AGENT #{agentId} ·{" "}
//                   {network.toUpperCase()}
//                 </div>
//                 <h1
//                   style={{
//                     fontFamily: "var(--font-display)",
//                     fontWeight: 800,
//                     fontSize: "2rem",
//                     letterSpacing: "-0.02em",
//                     color: "var(--text)",
//                     marginBottom: "0.5rem",
//                   }}
//                 >
//                   {agent.name}
//                 </h1>
//                 <div
//                   style={{
//                     fontSize: "0.7rem",
//                     color: "var(--text-dim)",
//                     fontFamily: "var(--font-mono)",
//                   }}
//                 >
//                   {truncateAddress(agent.walletAddress)} ·{" "}
//                   {timeAgo(agent.registrationTimestamp)}
//                 </div>
//               </div>
//               {/* Actions */}
// <div style={{ display: "flex", gap: "0.5rem" }}>
//   <button
//     onClick={handleRefresh}
//     disabled={refreshing}
//     style={{
//       padding: "8px 16px",
//       background: "transparent",
//       border: "1px solid var(--border)",
//       borderRadius: "4px",
//       color: "var(--text-dim)",
//       fontFamily: "var(--font-mono)",
//       fontSize: "0.65rem",
//       cursor: "pointer",
//       letterSpacing: "0.06em",
//     }}
//   >
//     {refreshing ? "REFRESHING..." : "↺ REFRESH SCORE"}
//   </button>
//     <a
//     href={agent.blockExplorerUrl}
//     target="_blank"
//     rel="noopener noreferrer"
//     style={{
//       padding: "8px 16px",
//       background: "transparent",
//       border: "1px solid var(--border)",
//       borderRadius: "4px",
//       color: "var(--text-dim)",
//       fontFamily: "var(--font-mono)",
//       fontSize: "0.65rem",
//       textDecoration: "none",
//       letterSpacing: "0.06em",
//     }}
//   >
//     CELOSCAN ↗
//   </a>

//   {/* Hire button — always show, disable if no endpoint */}
//   <button
//     onClick={() => {
//       if (agent.x402Endpoint) {
//         router.push(`/hire/${agentId}?network=${network}`);
//       }
//     }}
//     title={
//       agent.x402Endpoint
//         ? `Hire via ${agent.x402Endpoint}`
//         : "This agent has no x402 endpoint registered"
//     }
//     style={{
//       padding: "8px 20px",
//       background: agent.x402Endpoint ? "var(--green)" : "transparent",
//       border: `1px solid ${agent.x402Endpoint ? "var(--green)" : "var(--border)"}`,
//       borderRadius: "4px",
//       color: agent.x402Endpoint ? "#000" : "var(--text-dim)",
//       fontFamily: "var(--font-mono)",
//       fontWeight: agent.x402Endpoint ? 600 : 400,
//       fontSize: "0.7rem",
//       cursor: agent.x402Endpoint ? "pointer" : "not-allowed",
//       letterSpacing: "0.06em",
//       opacity: agent.x402Endpoint ? 1 : 0.4,
//     }}
//   >
//     {agent.x402Endpoint ? "HIRE AGENT →" : "NO ENDPOINT"}
//   </button>
// </div>
//             </div>

//             {/* Main grid */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "1rem",
//                 marginBottom: "1rem",
//               }}
//             >
//               {/* CAM Score */}
//               <div
//                 style={{
//                   padding: "1.5rem",
//                   background: "var(--bg-card)",
//                   border: "1px solid var(--border)",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "0.6rem",
//                     letterSpacing: "0.12em",
//                     color: "var(--text-dim)",
//                     marginBottom: "1rem",
//                   }}
//                 >
//                   CAM SCORE
//                 </div>
//                 <CAMScoreBar
//                   total={agent.camScore.total}
//                   breakdown={agent.camScore.breakdown}
//                   size="lg"
//                 />
//                 {/* Flags */}
//                 {agent.camScore.flags.length > 0 && (
//                   <div
//                     style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}
//                   >
//                     {agent.camScore.flags.map((flag, i) => (
//                       <div
//                         key={i}
//                         style={{
//                           fontSize: "0.65rem",
//                           padding: "4px 8px",
//                           borderRadius: "3px",
//                           background:
//                             flag.severity === "critical"
//                               ? "rgba(255,68,68,0.05)"
//                               : flag.severity === "warning"
//                               ? "rgba(255,215,0,0.05)"
//                               : "rgba(0,255,136,0.05)",
//                           color:
//                             flag.severity === "critical"
//                               ? "var(--red)"
//                               : flag.severity === "warning"
//                               ? "var(--gold)"
//                               : "var(--green)",
//                           border: `1px solid ${
//                             flag.severity === "critical"
//                               ? "rgba(255,68,68,0.2)"
//                               : flag.severity === "warning"
//                               ? "rgba(255,215,0,0.2)"
//                               : "rgba(0,255,136,0.2)"
//                           }`,
//                         }}
//                       >
//                         {flag.message}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* SelfClaw */}
//               <div
//                 style={{
//                   padding: "1.5rem",
//                   background: "var(--bg-card)",
//                   border: "1px solid var(--border)",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "0.6rem",
//                     letterSpacing: "0.12em",
//                     color: "var(--text-dim)",
//                     marginBottom: "1rem",
//                   }}
//                 >
//                   SELFCLAW VERIFICATION
//                 </div>
//                 {agent.selfclaw ? (
//                   <div>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "0.5rem",
//                         marginBottom: "1rem",
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontSize: "1.25rem",
//                           color: agent.selfclaw.verified
//                             ? "var(--green)"
//                             : "var(--red)",
//                         }}
//                       >
//                         {agent.selfclaw.verified ? "✓" : "✗"}
//                       </span>
//                       <div>
//                         <div
//                           style={{
//                             color: agent.selfclaw.verified
//                               ? "var(--green)"
//                               : "var(--red)",
//                             fontWeight: 600,
//                             fontSize: "0.8rem",
//                           }}
//                         >
//                           {agent.selfclaw.verified
//                             ? "VERIFIED"
//                             : "UNVERIFIED"}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: "0.65rem",
//                             color: "var(--text-dim)",
//                           }}
//                         >
//                           {verificationLevelLabel(
//                             agent.selfclaw.verificationLevel
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Badges */}
//                     {agent.selfclaw.reputation?.badges?.length ? (
//                       <div
//                         style={{
//                           display: "flex",
//                           flexWrap: "wrap",
//                           gap: "0.35rem",
//                           marginBottom: "1rem",
//                         }}
//                       >
//                         {agent.selfclaw.reputation.badges.map((b, i) => (
//                           <span
//                             key={i}
//                             style={{
//                               fontSize: "0.6rem",
//                               padding: "2px 8px",
//                               background: "var(--green-dim)",
//                               color: "var(--green)",
//                               borderRadius: "2px",
//                               border: "1px solid var(--green-mid)",
//                             }}
//                           >
//                             {b}
//                           </span>
//                         ))}
//                       </div>
//                     ) : null}

//                     {/* Reputation stats */}
//                     {agent.selfclaw.reputation && (
//                       <div
//                         style={{
//                           display: "grid",
//                           gridTemplateColumns: "1fr 1fr 1fr",
//                           gap: "0.5rem",
//                         }}
//                       >
//                         {[
//                           {
//                             label: "SCORE",
//                             value: agent.selfclaw.reputation.score,
//                           },
//                           {
//                             label: "VALIDATED",
//                             value: agent.selfclaw.reputation.validated,
//                           },
//                           {
//                             label: "SLASHED",
//                             value: agent.selfclaw.reputation.slashed,
//                           },
//                         ].map((item) => (
//                           <div
//                             key={item.label}
//                             style={{
//                               padding: "0.5rem",
//                               background: "var(--bg)",
//                               border: "1px solid var(--border)",
//                               borderRadius: "4px",
//                               textAlign: "center",
//                             }}
//                           >
//                             <div
//                               style={{
//                                 fontSize: "1rem",
//                                 fontWeight: 600,
//                                 color:
//                                   item.label === "SLASHED"
//                                     ? "var(--red)"
//                                     : "var(--green)",
//                               }}
//                             >
//                               {item.value}
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: "0.55rem",
//                                 color: "var(--text-dim)",
//                                 letterSpacing: "0.08em",
//                               }}
//                             >
//                               {item.label}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div
//                     style={{
//                       color: "var(--text-dim)",
//                       fontSize: "0.75rem",
//                     }}
//                   >
//                     Not registered on SelfClaw
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Platform + Skills */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "1rem",
//                 marginBottom: "1rem",
//               }}
//             >
//               {/* 8004scan */}
//               <div
//                 style={{
//                   padding: "1.5rem",
//                   background: "var(--bg-card)",
//                   border: "1px solid var(--border)",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "0.6rem",
//                     letterSpacing: "0.12em",
//                     color: "var(--text-dim)",
//                     marginBottom: "1rem",
//                   }}
//                 >
//                   8004SCAN PLATFORM
//                 </div>
//                 {agent.platform ? (
//                   <div>
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "1fr 1fr",
//                         gap: "0.5rem",
//                         marginBottom: "1rem",
//                       }}
//                     >
//                       {[
//                         {
//                           label: "PLATFORM SCORE",
//                           value: `${agent.platform.totalScore}/100`,
//                         },
//                         {
//                           label: "STARS",
//                           value: `⭐ ${agent.platform.starCount}`,
//                         },
//                         {
//                           label: "FEEDBACKS",
//                           value: agent.platform.totalFeedbacks,
//                         },
//                         {
//                           label: "REGISTERED",
//                           value: timeAgo(agent.platform.createdAt),
//                         },
//                       ].map((item) => (
//                         <div
//                           key={item.label}
//                           style={{
//                             padding: "0.5rem",
//                             background: "var(--bg)",
//                             border: "1px solid var(--border)",
//                             borderRadius: "4px",
//                           }}
//                         >
//                           <div
//                             style={{
//                               fontSize: "0.55rem",
//                               color: "var(--text-dim)",
//                               letterSpacing: "0.08em",
//                               marginBottom: "0.25rem",
//                             }}
//                           >
//                             {item.label}
//                           </div>
//                           <div
//                             style={{
//                               fontSize: "0.85rem",
//                               color: "var(--text)",
//                               fontWeight: 500,
//                             }}
//                           >
//                             {item.value}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Protocols */}
//                     {agent.platform.supportedProtocols.length > 0 && (
//                       <div>
//                         <div
//                           style={{
//                             fontSize: "0.55rem",
//                             color: "var(--text-dim)",
//                             letterSpacing: "0.08em",
//                             marginBottom: "0.5rem",
//                           }}
//                         >
//                           PROTOCOLS
//                         </div>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: "0.35rem",
//                           }}
//                         >
//                           {agent.platform.supportedProtocols.map((p) => (
//                             <span
//                               key={p}
//                               style={{
//                                 fontSize: "0.65rem",
//                                 padding: "2px 8px",
//                                 background: "rgba(0,170,255,0.05)",
//                                 color: "#00aaff",
//                                 border: "1px solid rgba(0,170,255,0.2)",
//                                 borderRadius: "2px",
//                               }}
//                             >
//                               {p}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div
//                     style={{
//                       color: "var(--text-dim)",
//                       fontSize: "0.75rem",
//                     }}
//                   >
//                     Not found on 8004scan
//                   </div>
//                 )}
//               </div>

//               {/* Skills */}
//               <div
//                 style={{
//                   padding: "1.5rem",
//                   background: "var(--bg-card)",
//                   border: "1px solid var(--border)",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: "1rem",
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: "0.6rem",
//                       letterSpacing: "0.12em",
//                       color: "var(--text-dim)",
//                     }}
//                   >
//                     SKILLS
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "0.6rem",
//                       color: "var(--text-dim)",
//                       display: "flex",
//                       gap: "0.75rem",
//                     }}
//                   >
//                     <span style={{ color: "var(--green)" }}>
//                       {agent.skillSources.skillMd} skill.md
//                     </span>
//                     <span style={{ color: "var(--gold)" }}>
//                       {agent.skillSources.selfclaw} selfclaw
//                     </span>
//                     <span style={{ color: "#888" }}>
//                       {agent.skillSources.protocol} inferred
//                     </span>
//                   </div>
//                 </div>

//                 {agent.skills.length > 0 ? (
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: "0.5rem",
//                     }}
//                   >
//                     {agent.skills.map((skill, i) => (
//                       <div
//                         key={i}
//                         style={{
//                           padding: "0.5rem 0.75rem",
//                           background: "var(--bg)",
//                           border: "1px solid var(--border)",
//                           borderRadius: "4px",
//                         }}
//                       >
//                         <SkillBadge skill={skill} showSource={true} />
//                         {skill.description && (
//                           <div
//                             style={{
//                               fontSize: "0.65rem",
//                               color: "var(--text-dim)",
//                               marginTop: "0.25rem",
//                               paddingLeft: "0.25rem",
//                             }}
//                           >
//                             {skill.description.slice(0, 100)}
//                             {skill.description.length > 100 ? "..." : ""}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div
//                     style={{
//                       color: "var(--text-dim)",
//                       fontSize: "0.75rem",
//                     }}
//                   >
//                     No skills indexed yet
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Score history */}
//             <div
//               style={{
//                 padding: "1.5rem",
//                 background: "var(--bg-card)",
//                 border: "1px solid var(--border)",
//                 borderRadius: "6px",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "0.6rem",
//                   letterSpacing: "0.12em",
//                   color: "var(--text-dim)",
//                   marginBottom: "1rem",
//                 }}
//               >
//                 SCORE HISTORY
//               </div>
//               <ScoreChart history={history} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { api, AgentProfile, ScoreHistory, Network } from "@/lib/api";
import Navbar from "@/components/Navbar";
import CAMScoreBar from "@/components/CAMScoreBar";
import SkillBadge from "@/components/SkillBadge";
import ScoreChart from "@/components/ScoreChart";
import {
  truncateAddress,
  timeAgo,
  verificationLevelLabel,
} from "@/lib/utils";

export default function AgentProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  
  const [network, setNetwork] = useState<Network>(
    (searchParams.get("network") as Network) ?? "mainnet"
  );

  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [history, setHistory] = useState<ScoreHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      api.agent.get(agentId, network),
      api.agent.history(agentId, network),
    ])
      .then(([a, h]) => {
        if (isMounted) {
          setAgent(a);
          setHistory(h);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [agentId, network]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await api.agent.refreshScore(agentId, network);
      const updated = await api.agent.get(agentId, network);
      setAgent(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <Navbar network={network} onNetworkChange={setNetwork} />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-dim)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            cursor: "pointer",
            marginBottom: "1.5rem",
            padding: 0,
            letterSpacing: "0.06em",
          }}
        >
          ← BACK
        </button>

        {loading && (
          <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
            INITIALIZING DATA...
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "1rem",
              background: "rgba(255,68,68,0.05)",
              border: "1px solid rgba(255,68,68,0.2)",
              borderRadius: "4px",
              color: "var(--red)",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
            }}
          >
            ERROR: {error}
          </div>
        )}

        {agent && (
          <div className="fade-up">
            {/* Header Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "2rem",
                gap: "2rem",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "2rem"
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    color: "var(--text-dim)",
                    marginBottom: "0.25rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  AGENT_ID_{agentId} // {network.toUpperCase()}
                </div>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "2.5rem",
                    letterSpacing: "-0.03em",
                    color: "var(--text)",
                    margin: 0,
                  }}
                >
                  {agent.name}
                </h1>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-dim)",
                    fontFamily: "var(--font-mono)",
                    marginTop: "0.5rem"
                  }}
                >
                  {truncateAddress(agent.walletAddress)} • Registered {timeAgo(agent.registrationTimestamp)}
                </div>
              </div>

              {/* Primary Actions */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  style={{
                    padding: "10px 16px",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    color: "var(--text-dim)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    transition: "all 0.2s"
                  }}
                >
                  {refreshing ? "SYNCING..." : "↺ REFRESH SCORE"}
                </button>
                
                <button
                  onClick={() => agent.x402Endpoint && router.push(`/hire/${agentId}?network=${network}`)}
                  disabled={!agent.x402Endpoint}
                  style={{
                    padding: "10px 24px",
                    background: agent.x402Endpoint ? "var(--green)" : "transparent",
                    border: `1px solid ${agent.x402Endpoint ? "var(--green)" : "var(--border)"}`,
                    borderRadius: "4px",
                    color: agent.x402Endpoint ? "#000" : "var(--text-dim)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    cursor: agent.x402Endpoint ? "pointer" : "not-allowed",
                    letterSpacing: "0.06em",
                    opacity: agent.x402Endpoint ? 1 : 0.4,
                  }}
                >
                  {agent.x402Endpoint ? "HIRE AGENT →" : "X402_OFFLINE"}
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              {/* CAM Analytics */}
              <section style={{ padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "0.65rem", color: "var(--text-dim)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>CAM_REPUTATION_SCORE</h3>
                <CAMScoreBar total={agent.camScore.total} breakdown={agent.camScore.breakdown} size="lg" />
                
                {agent.camScore.flags.length > 0 && (
                  <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {agent.camScore.flags.map((flag, i) => (
                      <div key={i} style={{
                        fontSize: "0.65rem",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        background: flag.severity === "critical" ? "rgba(255,68,68,0.05)" : "rgba(255,215,0,0.05)",
                        color: flag.severity === "critical" ? "var(--red)" : "var(--gold)",
                        border: `1px solid ${flag.severity === "critical" ? "rgba(255,68,68,0.15)" : "rgba(255,215,0,0.15)"}`,
                        fontFamily: "var(--font-mono)"
                      }}>
                        [{flag.severity.toUpperCase()}] {flag.message}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* SelfClaw Data */}
              <section style={{ padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "0.65rem", color: "var(--text-dim)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>SELFCLAW_VERIFICATION</h3>
                {agent.selfclaw ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                      <div style={{ fontSize: "1.5rem", color: agent.selfclaw.verified ? "var(--green)" : "var(--red)" }}>
                        {agent.selfclaw.verified ? "◈" : "◇"}
                      </div>
                      <div>
                        <div style={{ color: agent.selfclaw.verified ? "var(--green)" : "var(--red)", fontWeight: 700, fontSize: "0.9rem", fontFamily: "var(--font-mono)" }}>
                          {agent.selfclaw.verified ? "IDENTITY_VERIFIED" : "IDENTITY_UNVERIFIED"}
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                          LEVEL: {verificationLevelLabel(agent.selfclaw.verificationLevel)}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                      {[
                        { label: "NET_SCORE", value: agent.selfclaw.reputation?.score, color: "var(--text)" },
                        { label: "VALIDATED", value: agent.selfclaw.reputation?.validated, color: "var(--green)" },
                        { label: "SLASHED", value: agent.selfclaw.reputation?.slashed, color: "var(--red)" },
                      ].map((stat) => (
                        <div key={stat.label} style={{ padding: "0.75rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "4px", textAlign: "center" }}>
                          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: stat.color, fontFamily: "var(--font-mono)" }}>{stat.value ?? 0}</div>
                          <div style={{ fontSize: "0.5rem", color: "var(--text-dim)", letterSpacing: "0.05em", marginTop: "0.25rem" }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", fontFamily: "var(--font-mono)", opacity: 0.6 }}>
                    NO_SELFCLAW_RECORD_FOUND
                  </div>
                )}
              </section>
            </div>

            {/* History and Skills */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
              <section style={{ padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "0.65rem", color: "var(--text-dim)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>SCORE_HISTORY_FLOW</h3>
                <ScoreChart history={history} />
              </section>

              <section style={{ padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "0.65rem", color: "var(--text-dim)", margin: 0, letterSpacing: "0.1em" }}>CAPABILITIES</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {agent.skills.map((skill, i) => (
                    <div key={i} style={{ padding: "0.75rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "4px" }}>
                      <SkillBadge skill={skill} showSource={true} />
                      {skill.description && (
                        <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", margin: "0.5rem 0 0", lineHeight: 1.4 }}>
                          {skill.description.length > 80 ? `${skill.description.slice(0, 80)}...` : skill.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}