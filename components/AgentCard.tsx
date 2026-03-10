// "use client";

// import { useRouter } from "next/navigation";
// import { DiscoveryResult } from "@/lib/api";
// import CAMScoreBar from "./CAMScoreBar";
// import SkillBadge from "./SkillBadge";
// import { timeAgo } from "@/lib/utils";

// interface Props {
//   agent: DiscoveryResult;
//   rank?: number;
//   style?: React.CSSProperties;
// }

// export default function AgentCard({ agent, rank, style }: Props) {
//   const router = useRouter();
//   const hasEndpoint = !!agent.x402Endpoint;

//   return (
//     <div
//       onClick={() =>
//         router.push(`/agent/${agent.agentId}?network=${agent.network}`)
//       }
//       style={{
//         background: "rgba(255, 255, 255, 0.03)",
//         border: "1px solid rgba(255, 255, 255, 0.08)",
//         borderRadius: "12px",
//         padding: "1.5rem",
//         cursor: "pointer",
//         transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//         position: "relative",
//         overflow: "hidden",
//         backdropFilter: "blur(8px)",
//         ...style,
//       }}
//       onMouseEnter={(e) => {
//         const target = e.currentTarget as HTMLElement;
//         target.style.borderColor = "rgba(0, 255, 136, 0.3)";
//         target.style.background = "rgba(255, 255, 255, 0.05)";
//         target.style.transform = "translateY(-2px)";
//         target.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 255, 136, 0.05)";
//       }}
//       onMouseLeave={(e) => {
//         const target = e.currentTarget as HTMLElement;
//         target.style.borderColor = "rgba(255, 255, 255, 0.08)";
//         target.style.background = "rgba(255, 255, 255, 0.03)";
//         target.style.transform = "translateY(0)";
//         target.style.boxShadow = "none";
//       }}
//     >
//       {/* Rank indicator */}
//       {rank !== undefined && (
//         <div
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "4px",
//             height: "100%",
//             background:
//               rank === 0
//                 ? "var(--gold)"
//                 : rank === 1
//                 ? "#cbd5e1"
//                 : rank === 2
//                 ? "#b45309"
//                 : "transparent",
//           }}
//         />
//       )}

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//           gap: "1.5rem",
//         }}
//       >
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//               marginBottom: "0.5rem",
//             }}
//           >
//             {rank !== undefined && (
//               <span
//                 style={{
//                   fontSize: "0.75rem",
//                   color: "var(--text-dim)",
//                   fontWeight: 600,
//                   opacity: 0.5,
//                 }}
//               >
//                 {String(rank + 1).padStart(2, '0')}
//               </span>
//             )}
            
//             {/* FIX: Removed whiteSpace: nowrap and overflow: hidden to show full name */}
//             <h3
//               style={{
//                 fontFamily: "var(--font-display)",
//                 fontWeight: 700,
//                 fontSize: "1.2rem", 
//                 color: "var(--text)",
//                 margin: 0,
//                 lineHeight: "1.2",
//               }}
//             >
//               {agent.name}
//             </h3>
            
//             <span
//               style={{
//                 fontSize: "0.6rem",
//                 letterSpacing: "0.08em",
//                 fontWeight: 700,
//                 padding: "2px 8px",
//                 borderRadius: "100px",
//                 background: agent.network === "mainnet"
//                   ? "rgba(0, 255, 136, 0.1)"
//                   : "rgba(255, 170, 0, 0.1)",
//                 color: agent.network === "mainnet"
//                   ? "var(--green)"
//                   : "#ffaa00",
//                 border: `1px solid ${
//                   agent.network === "mainnet"
//                     ? "rgba(0, 255, 136, 0.2)"
//                     : "rgba(255, 170, 0, 0.2)"
//                 }`,
//                 flexShrink: 0,
//               }}
//             >
//               {agent.network.toUpperCase()}
//             </span>
//           </div>

//           <div
//             style={{
//               fontSize: "0.75rem",
//               color: "var(--text-dim)",
//               marginBottom: "1rem",
//               display: "flex",
//               gap: "0.5rem",
//               alignItems: "center"
//             }}
//           >
//             <span>Agent #{agent.agentId}</span>
//             <span style={{ opacity: 0.3 }}>•</span>
//             <span>{timeAgo(agent.registrationTimestamp)}</span>
//           </div>

//           {/* FIX: Conditional rendering for Skills - Only shows if skills exist */}
//           {agent.skills && agent.skills.length > 0 && (
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: "0.5rem",
//                 marginBottom: "1rem",
//               }}
//             >
//               {agent.skills.slice(0, 3).map((skill, i) => (
//                 <SkillBadge key={i} skill={skill} />
//               ))}
//               {agent.skills.length > 3 && (
//                 <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", alignSelf: "center" }}>
//                   +{agent.skills.length - 3} more
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         <div style={{ width: "160px", flexShrink: 0 }}>
//           <CAMScoreBar
//             total={agent.camScore}
//             breakdown={agent.breakdown}
//             size="sm"
//           />
//         </div>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingTop: "1rem",
//           borderTop: "1px solid rgba(255, 255, 255, 0.06)",
//           marginTop: "0.5rem",
//         }}
//       >
//         <div style={{ display: "flex", gap: "1rem", fontSize: "0.7rem" }}>
//           {agent.flags.some(f => f.severity === "critical") ? (
//             <span style={{ color: "var(--red)", fontWeight: 500 }}>
//               ⚠️ CRITICAL FLAGS
//             </span>
//           ) : (
//             <span style={{ color: "var(--green)", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
//               <div style={{ width: 4, height: 4, background: "var(--green)", borderRadius: "50%" }} />
//               VERIFIED SECURE
//             </span>
//           )}
//         </div>

//         <div
//           style={{ display: "flex", gap: "1rem", alignItems: "center" }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               if (hasEndpoint) {
//                 router.push(`/hire/${agent.agentId}?network=${agent.network}`);
//               }
//             }}
//             style={{
//               padding: "6px 16px",
//               background: hasEndpoint ? "var(--green)" : "transparent",
//               border: `1px solid ${hasEndpoint ? "var(--green)" : "rgba(255,255,255,0.1)"}`,
//               borderRadius: "6px",
//               color: hasEndpoint ? "#000" : "var(--text-dim)",
//               fontFamily: "var(--font-mono)",
//               fontSize: "0.7rem",
//               fontWeight: 700,
//               cursor: hasEndpoint ? "pointer" : "not-allowed",
//               transition: "all 0.2s",
//               opacity: hasEndpoint ? 1 : 0.5,
//             }}
//           >
//             {hasEndpoint ? "HIRE AGENT" : "OFFLINE"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { DiscoveryResult } from "@/lib/api";
import CAMScoreBar from "./CAMScoreBar";
import SkillBadge from "./SkillBadge";
import { timeAgo } from "@/lib/utils";

interface Props {
  agent: DiscoveryResult;
  rank?: number;
  style?: React.CSSProperties;
}

export default function AgentCard({ agent, rank, style }: Props) {
  const router = useRouter();
  const hasEndpoint = !!agent.x402Endpoint;

  return (
    <div
      onClick={() =>
        router.push(`/agent/${agent.agentId}?network=${agent.network}`)
      }
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        padding: "1.5rem",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(8px)",
        ...style,
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.borderColor = "rgba(0, 255, 136, 0.3)";
        target.style.background = "rgba(255, 255, 255, 0.05)";
        target.style.transform = "translateY(-2px)";
        target.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 255, 136, 0.05)";
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.borderColor = "rgba(255, 255, 255, 0.08)";
        target.style.background = "rgba(255, 255, 255, 0.03)";
        target.style.transform = "translateY(0)";
        target.style.boxShadow = "none";
      }}
    >
      {rank !== undefined && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            background:
              rank === 0
                ? "var(--gold)"
                : rank === 1
                ? "#cbd5e1"
                : rank === 2
                ? "#b45309"
                : "transparent",
          }}
        />
      )}

      {/* HEADER SECTION: Flexible layout for long names */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem", // Gap between text and score bar
          marginBottom: "1rem"
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap", // Allows the network badge to wrap if name is too long
              alignItems: "center",
              gap: "0.5rem 0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            {rank !== undefined && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  fontWeight: 600,
                  opacity: 0.5,
                  flexShrink: 0
                }}
              >
                {String(rank + 1).padStart(2, '0')}
              </span>
            )}
            
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.2rem", 
                color: "var(--text)",
                margin: 0,
                lineHeight: "1.2",
                wordBreak: "break-word", // Ensures extremely long single words don't overflow
              }}
            >
              {agent.name}
            </h3>
            
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "100px",
                background: agent.network === "mainnet"
                  ? "rgba(0, 255, 136, 0.1)"
                  : "rgba(255, 170, 0, 0.1)",
                color: agent.network === "mainnet"
                  ? "var(--green)"
                  : "#ffaa00",
                border: `1px solid ${
                  agent.network === "mainnet"
                    ? "rgba(0, 255, 136, 0.2)"
                    : "rgba(255, 170, 0, 0.2)"
                }`,
                flexShrink: 0,
              }}
            >
              {agent.network.toUpperCase()}
            </span>
          </div>

          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-dim)",
              marginBottom: "1rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              alignItems: "center"
            }}
          >
            <span>Agent #{agent.agentId}</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <span>{timeAgo(agent.registrationTimestamp)}</span>
          </div>

          {agent.skills && agent.skills.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {agent.skills.slice(0, 3).map((skill, i) => (
                <SkillBadge key={i} skill={skill} />
              ))}
              {agent.skills.length > 3 && (
                <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", alignSelf: "center" }}>
                  +{agent.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* SCORE BAR: Fixed width, won't overlap anymore */}
        <div style={{ width: "160px", flexShrink: 0 }}>
          <CAMScoreBar
            total={agent.camScore}
            breakdown={agent.breakdown}
            size="sm"
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          marginTop: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.7rem" }}>
          {agent.flags.some(f => f.severity === "critical") ? (
            <span style={{ color: "var(--red)", fontWeight: 500 }}>
              ⚠️ CRITICAL FLAGS
            </span>
          ) : (
            <span style={{ color: "var(--green)", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: 4, height: 4, background: "var(--green)", borderRadius: "50%" }} />
              VERIFIED SECURE
            </span>
          )}
        </div>

        <div
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (hasEndpoint) {
                router.push(`/hire/${agent.agentId}?network=${agent.network}`);
              }
            }}
            style={{
              padding: "6px 16px",
              background: hasEndpoint ? "var(--green)" : "transparent",
              border: `1px solid ${hasEndpoint ? "var(--green)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "6px",
              color: hasEndpoint ? "#000" : "var(--text-dim)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              fontWeight: 700,
              cursor: hasEndpoint ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              opacity: hasEndpoint ? 1 : 0.5,
            }}
          >
            {hasEndpoint ? "HIRE AGENT" : "OFFLINE"}
          </button>
        </div>
      </div>
    </div>
  );
}