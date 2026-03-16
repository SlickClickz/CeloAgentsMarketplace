// "use client";

// import { scoreColor, scoreLabel } from "@/lib/utils";
// import { useState, useEffect } from "react";

// interface Props {
//   total: number;
//   breakdown: {
//     identity: number;
//     reputation: number;
//     skillIntegrity: number;
//   };
//   size?: "sm" | "lg";
// }

// export default function CAMScoreBar({
//   total,
//   breakdown,
//   size = "sm",
// }: Props) {
//   const color = scoreColor(total);
//   const label = scoreLabel(total);
//   const isLarge = size === "lg";

//   // State to handle the grid layout for the breakdown labels on mobile
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 640);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   return (
//     <div style={{ width: "100%", minWidth: isLarge ? "auto" : "140px" }}>
//       {/* Score header */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-end",
//           marginBottom: isLarge ? "1.25rem" : "0.5rem",
//           flexWrap: "wrap", // Allows label to wrap if name is too long
//           gap: "8px"
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
//           <span
//             style={{
//               fontFamily: "var(--font-display)",
//               fontWeight: 800,
//               fontSize: isLarge ? "clamp(2.5rem, 8vw, 3.5rem)" : "1.75rem",
//               color,
//               lineHeight: 0.9,
//               textShadow: isLarge ? `0 0 20px ${color}44` : "none",
//             }}
//           >
//             {total}
//           </span>
//           <span style={{ color: "var(--text-dim)", fontSize: isLarge ? "1rem" : "0.75rem", fontWeight: 500, opacity: 0.6 }}>
//             /100
//           </span>
//         </div>
//         <span
//           style={{
//             fontSize: isLarge ? "0.75rem" : "0.6rem",
//             letterSpacing: "0.1em",
//             color,
//             padding: "3px 10px",
//             border: `1px solid ${color}66`,
//             borderRadius: "100px",
//             background: `${color}11`,
//             fontWeight: 700,
//             whiteSpace: "nowrap"
//           }}
//         >
//           {label.toUpperCase()}
//         </span>
//       </div>

//       {/* Stacked bar */}
//       <div
//         style={{
//           height: isLarge ? "10px" : "6px",
//           background: "rgba(255, 255, 255, 0.05)",
//           borderRadius: "100px",
//           overflow: "hidden",
//           display: "flex",
//           gap: "2px",
//         }}
//       >
//         <div
//           style={{
//             width: `${breakdown.identity}%`,
//             background: "#00aaff",
//             transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
//             boxShadow: isLarge ? "0 0 10px #00aaff44" : "none",
//           }}
//         />
//         <div
//           style={{
//             width: `${breakdown.reputation}%`,
//             background: "var(--green)",
//             transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
//             boxShadow: isLarge ? "0 0 10px var(--green-glow)" : "none",
//           }}
//         />
//         <div
//           style={{
//             width: `${breakdown.skillIntegrity}%`,
//             background: "var(--gold)",
//             transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
//             boxShadow: isLarge ? "0 0 10px var(--gold-glow)" : "none",
//           }}
//         />
//       </div>

//       {/* Breakdown labels */}
//       {isLarge && (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
//             gap: "0.75rem",
//             marginTop: "1.5rem",
//           }}
//         >
//           {[
//             { label: "Identity", value: breakdown.identity, max: 20, color: "#00aaff" },
//             { label: "Reputation", value: breakdown.reputation, max: 40, color: "var(--green)" },
//             { label: "Skill Integrity", value: breakdown.skillIntegrity, max: 40, color: "var(--gold)" },
//           ].map((item) => (
//             <div
//               key={item.label}
//               style={{
//                 padding: "0.75rem",
//                 background: "rgba(255, 255, 255, 0.02)",
//                 border: "1px solid rgba(255, 255, 255, 0.05)",
//                 borderLeft: `3px solid ${item.color}`,
//                 borderRadius: "6px",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "0.65rem",
//                   letterSpacing: "0.08em",
//                   color: "var(--text-dim)",
//                   marginBottom: "0.4rem",
//                   fontWeight: 600
//                 }}
//               >
//                 {item.label.toUpperCase()}
//               </div>
//               <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
//                 <span style={{ color: "var(--text)", fontWeight: 700, fontSize: "1.1rem" }}>
//                   {item.value}
//                 </span>
//                 <span style={{ color: "var(--text-dim)", fontSize: "0.7rem", opacity: 0.5 }}>
//                   /{item.max}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { scoreColor, scoreLabel } from "@/lib/utils";
import { useState, useEffect } from "react";

interface Props {
  total: number;
  breakdown: {
    identity: number;
    reputation: number;
    skillIntegrity: number;
  };
  size?: "sm" | "lg";
}

export default function CAMScoreBar({
  total,
  breakdown,
  size = "sm",
}: Props) {
  const color = scoreColor(total);
  const label = scoreLabel(total);
  const isLarge = size === "lg";

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div style={{ width: "100%", minWidth: isLarge ? "auto" : "140px" }}>
      {/* Score header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: isLarge ? "1.25rem" : "0.5rem",
          flexWrap: "wrap",
          gap: "8px"
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: isLarge ? "clamp(2.5rem, 8vw, 3.5rem)" : "1.75rem",
              color,
              lineHeight: 0.9,
              textShadow: isLarge ? `0 0 20px ${color}44` : "none",
            }}
          >
            {total}
          </span>
          <span style={{ color: "var(--text-dim)", fontSize: isLarge ? "1rem" : "0.75rem", fontWeight: 500, opacity: 0.6 }}>
            /100
          </span>
        </div>
        <span
          style={{
            fontSize: isLarge ? "0.75rem" : "0.6rem",
            letterSpacing: "0.1em",
            color,
            padding: "3px 10px",
            border: `1px solid ${color}66`,
            borderRadius: "100px",
            background: `${color}11`,
            fontWeight: 700,
            whiteSpace: "nowrap"
          }}
        >
          {label.toUpperCase()}
        </span>
      </div>

      {/* Stacked bar */}
      <div
        style={{
          height: isLarge ? "10px" : "6px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "100px",
          overflow: "hidden",
          display: "flex",
          gap: "2px",
        }}
      >
        <div
          style={{
            width: `${breakdown.identity}%`,
            background: "#00aaff",
            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: isLarge ? "0 0 10px #00aaff44" : "none",
          }}
        />
        <div
          style={{
            width: `${breakdown.reputation}%`,
            background: "var(--green)",
            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
            boxShadow: isLarge ? "0 0 10px var(--green-glow)" : "none",
          }}
        />
        {breakdown.skillIntegrity > 0 && (
          <div
            style={{
              width: `${breakdown.skillIntegrity}%`,
              background: "var(--gold)",
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
              boxShadow: isLarge ? "0 0 10px var(--gold-glow)" : "none",
            }}
          />
        )}
      </div>

      {/* Breakdown labels */}
      {isLarge && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : breakdown.skillIntegrity > 0 ? "1fr 1fr 1fr" : "1fr 1fr",
            gap: "0.75rem",
            marginTop: "1.5rem",
          }}
        >
          {[
            { label: "Identity", value: breakdown.identity, max: 40, color: "#00aaff" },
            { label: "Reputation", value: breakdown.reputation, max: 60, color: "var(--green)" },
            ...(breakdown.skillIntegrity > 0
              ? [{ label: "Skill Integrity", value: breakdown.skillIntegrity, max: 40, color: "var(--gold)" }]
              : []),
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderLeft: `3px solid ${item.color}`,
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  color: "var(--text-dim)",
                  marginBottom: "0.4rem",
                  fontWeight: 600
                }}
              >
                {item.label.toUpperCase()}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                <span style={{ color: "var(--text)", fontWeight: 700, fontSize: "1.1rem" }}>
                  {item.value}
                </span>
                <span style={{ color: "var(--text-dim)", fontSize: "0.7rem", opacity: 0.5 }}>
                  /{item.max}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}