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
//     let isMounted = true;
//     setLoading(true);
//     setError(null);

//     Promise.all([
//       api.agent.get(agentId, network),
//       api.agent.history(agentId, network),
//     ])
//       .then(([a, h]) => {
//         if (isMounted) {
//           setAgent(a);
//           setHistory(h);
//         }
//       })
//       .catch((err) => {
//         if (isMounted) setError(err.message);
//       })
//       .finally(() => {
//         if (isMounted) setLoading(false);
//       });

//     return () => { isMounted = false; };
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
//     <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
//       <Navbar network={network} onNetworkChange={setNetwork} />

//       <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
//         {/* Navigation */}
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
//           <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
//             INITIALIZING DATA...
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
//               fontFamily: "var(--font-mono)",
//             }}
//           >
//             ERROR: {error}
//           </div>
//         )}

//         {agent && (
//           <div className="fade-up">
//             {/* Header Section */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "flex-end",
//                 marginBottom: "2rem",
//                 gap: "2rem",
//                 borderBottom: "1px solid var(--border)",
//                 paddingBottom: "2rem"
//               }}
//             >
//               <div>
//                 <div
//                   style={{
//                     fontSize: "0.6rem",
//                     letterSpacing: "0.12em",
//                     color: "var(--text-dim)",
//                     marginBottom: "0.25rem",
//                     fontFamily: "var(--font-mono)",
//                   }}
//                 >
//                   AGENT_ID_{agentId} // {network.toUpperCase()}
//                 </div>
//                 <h1
//                   style={{
//                     fontFamily: "var(--font-display)",
//                     fontWeight: 800,
//                     fontSize: "2.5rem",
//                     letterSpacing: "-0.03em",
//                     color: "var(--text)",
//                     margin: 0,
//                   }}
//                 >
//                   {agent.name}
//                 </h1>
//                 <div
//                   style={{
//                     fontSize: "0.75rem",
//                     color: "var(--text-dim)",
//                     fontFamily: "var(--font-mono)",
//                     marginTop: "0.5rem"
//                   }}
//                 >
//                   {truncateAddress(agent.walletAddress)} • Registered {timeAgo(agent.registrationTimestamp)}
//                 </div>
//               </div>

//               {/* Primary Actions */}
//               <div style={{ display: "flex", gap: "0.75rem" }}>
//                 <button
//                   onClick={handleRefresh}
//                   disabled={refreshing}
//                   style={{
//                     padding: "10px 16px",
//                     background: "transparent",
//                     border: "1px solid var(--border)",
//                     borderRadius: "4px",
//                     color: "var(--text-dim)",
//                     fontFamily: "var(--font-mono)",
//                     fontSize: "0.65rem",
//                     cursor: "pointer",
//                     letterSpacing: "0.06em",
//                     transition: "all 0.2s"
//                   }}
//                 >
//                   {refreshing ? "SYNCING..." : "↺ REFRESH SCORE"}
//                 </button>
                
//                 <button
//                   onClick={() => agent.x402Endpoint && router.push(`/hire/${agentId}?network=${network}`)}
//                   disabled={!agent.x402Endpoint}
//                   style={{
//                     padding: "10px 24px",
//                     background: agent.x402Endpoint ? "var(--green)" : "transparent",
//                     border: `1px solid ${agent.x402Endpoint ? "var(--green)" : "var(--border)"}`,
//                     borderRadius: "4px",
//                     color: agent.x402Endpoint ? "#000" : "var(--text-dim)",
//                     fontFamily: "var(--font-mono)",
//                     fontWeight: 700,
//                     fontSize: "0.7rem",
//                     cursor: agent.x402Endpoint ? "pointer" : "not-allowed",
//                     letterSpacing: "0.06em",
//                     opacity: agent.x402Endpoint ? 1 : 0.4,
//                   }}
//                 >
//                   {agent.x402Endpoint ? "HIRE AGENT →" : "X402_OFFLINE"}
//                 </button>
//               </div>
//             </div>

//             {/* Metrics Grid */}
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
//               {/* CAM Analytics */}
//               <section style={{ padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
//                 <h3 style={{ fontSize: "0.65rem", color: "var(--text-dim)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>CAM_REPUTATION_SCORE</h3>
//                 <CAMScoreBar total={agent.camScore.total} breakdown={agent.camScore.breakdown} size="lg" />
                
//                 {agent.camScore.flags.length > 0 && (
//                   <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//                     {agent.camScore.flags.map((flag, i) => (
//                       <div key={i} style={{
//                         fontSize: "0.65rem",
//                         padding: "6px 10px",
//                         borderRadius: "4px",
//                         background: flag.severity === "critical" ? "rgba(255,68,68,0.05)" : "rgba(255,215,0,0.05)",
//                         color: flag.severity === "critical" ? "var(--red)" : "var(--gold)",
//                         border: `1px solid ${flag.severity === "critical" ? "rgba(255,68,68,0.15)" : "rgba(255,215,0,0.15)"}`,
//                         fontFamily: "var(--font-mono)"
//                       }}>
//                          {flag.message} 
//                          {/* [{flag.severity.toUpperCase()}] */}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </section>

//               {/* SelfClaw Data */}
//               <section style={{ padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
//                 <h3 style={{ fontSize: "0.65rem", color: "var(--text-dim)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>SELFCLAW_VERIFICATION</h3>
//                 {agent.selfclaw ? (
//                   <>
//                     <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
//                       <div style={{ fontSize: "1.5rem", color: agent.selfclaw.verified ? "var(--green)" : "var(--red)" }}>
//                         {agent.selfclaw.verified ? "◈" : "◇"}
//                       </div>
//                       <div>
//                         <div style={{ color: agent.selfclaw.verified ? "var(--green)" : "var(--red)", fontWeight: 700, fontSize: "0.9rem", fontFamily: "var(--font-mono)" }}>
//                           {agent.selfclaw.verified ? "IDENTITY_VERIFIED" : "IDENTITY_UNVERIFIED"}
//                         </div>
//                         <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
//                           LEVEL: {verificationLevelLabel(agent.selfclaw.verificationLevel)}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
//                       {[
//                         { label: "NET_SCORE", value: agent.selfclaw.reputation?.score, color: "var(--text)" },
//                         { label: "VALIDATED", value: agent.selfclaw.reputation?.validated, color: "var(--green)" },
//                         { label: "SLASHED", value: agent.selfclaw.reputation?.slashed, color: "var(--red)" },
//                       ].map((stat) => (
//                         <div key={stat.label} style={{ padding: "0.75rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "4px", textAlign: "center" }}>
//                           <div style={{ fontSize: "1.1rem", fontWeight: 700, color: stat.color, fontFamily: "var(--font-mono)" }}>{stat.value ?? 0}</div>
//                           <div style={{ fontSize: "0.5rem", color: "var(--text-dim)", letterSpacing: "0.05em", marginTop: "0.25rem" }}>{stat.label}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 ) : (
//                   <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", fontFamily: "var(--font-mono)", opacity: 0.6 }}>
//                     NO_SELFCLAW_RECORD_FOUND
//                   </div>
//                 )}
//               </section>
//             </div>

//             {/* History and Skills */}
//             <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
//               <section style={{ padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
//                 <h3 style={{ fontSize: "0.65rem", color: "var(--text-dim)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>SCORE_HISTORY_FLOW</h3>
//                 <ScoreChart history={history} />
//               </section>

//               <section style={{ padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
//                   <h3 style={{ fontSize: "0.65rem", color: "var(--text-dim)", margin: 0, letterSpacing: "0.1em" }}>CAPABILITIES</h3>
//                 </div>
//                 <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
//                   {agent.skills.map((skill, i) => (
//                     <div key={i} style={{ padding: "0.75rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "4px" }}>
//                       <SkillBadge skill={skill} showSource={true} />
//                       {skill.description && (
//                         <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", margin: "0.5rem 0 0", lineHeight: 1.4 }}>
//                           {skill.description.length > 80 ? `${skill.description.slice(0, 80)}...` : skill.description}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </section>
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

  // Responsive state for grid stacking
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
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

    return () => { 
      isMounted = false; 
      window.removeEventListener("resize", checkMobile);
    };
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

      <div style={{ 
        maxWidth: "900px", 
        margin: "0 auto", 
        padding: isMobile ? "1.5rem 1rem" : "2rem",
        boxSizing: "border-box" 
      }}>
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
          <div style={{
            padding: "1rem",
            background: "rgba(255,68,68,0.05)",
            border: "1px solid rgba(255,68,68,0.2)",
            borderRadius: "4px",
            color: "var(--red)",
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
          }}>
            ERROR: {error}
          </div>
        )}

        {agent && (
          <div className="fade-up">
            {/* Header Section */}
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "flex-end",
              marginBottom: "2rem",
              gap: isMobile ? "1.5rem" : "2rem",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "2rem"
            }}>
              <div style={{ width: "100%" }}>
                <div style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  color: "var(--text-dim)",
                  marginBottom: "0.25rem",
                  fontFamily: "var(--font-mono)",
                }}>
                  AGENT_ID_{agentId.slice(0, 8)}... // {network.toUpperCase()}
                </div>
                <h1 style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: isMobile ? "2rem" : "2.5rem",
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                  margin: 0,
                  lineHeight: 1.1
                }}>
                  {agent.name}
                </h1>
                <div style={{
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  fontFamily: "var(--font-mono)",
                  marginTop: "0.5rem"
                }}>
                  {truncateAddress(agent.walletAddress)} • Registered {timeAgo(agent.registrationTimestamp)}
                </div>
              </div>

              {/* Primary Actions */}
              <div style={{ 
                display: "flex", 
                gap: "0.75rem", 
                width: isMobile ? "100%" : "auto" 
              }}>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    color: "var(--text-dim)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap"
                  }}
                >
                  {refreshing ? "SYNCING..." : "↺ REFRESH"}
                </button>
                
                <button
                  onClick={() => agent.x402Endpoint && router.push(`/hire/${agentId}?network=${network}`)}
                  disabled={!agent.x402Endpoint}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
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
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
              gap: "1.5rem", 
              marginBottom: "1.5rem" 
            }}>
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
                         {flag.message} 
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
                          <div style={{ fontSize: isMobile ? "0.9rem" : "1.1rem", fontWeight: 700, color: stat.color, fontFamily: "var(--font-mono)" }}>{stat.value ?? 0}</div>
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
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", 
              gap: "1.5rem" 
            }}>
              <section style={{ 
                padding: "1.5rem", 
                background: "var(--bg-card)", 
                border: "1px solid var(--border)", 
                borderRadius: "8px",
                overflow: "hidden" // Keeps chart contained
              }}>
                <h3 style={{ fontSize: "0.65rem", color: "var(--text-dim)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>SCORE_HISTORY_FLOW</h3>
                <ScoreChart history={history} />
              </section>

              <section style={{ padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "0.65rem", color: "var(--text-dim)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>CAPABILITIES</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {agent.skills.map((skill, i) => (
                    <div key={i} style={{ padding: "0.75rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "4px" }}>
                      <SkillBadge skill={skill} showSource={true} />
                      {skill.description && (
                        <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", margin: "0.5rem 0 0", lineHeight: 1.4 }}>
                          {skill.description}
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