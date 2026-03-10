// "use client";

// import { scoreColor, scoreLabel } from "@/lib/utils";

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

//   return (
//     <div style={{ width: "100%" }}>
//       {/* Score header */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "baseline",
//           marginBottom: isLarge ? "1rem" : "0.5rem",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
//           <span
//             style={{
//               fontFamily: "var(--font-display)",
//               fontWeight: 800,
//               fontSize: isLarge ? "3rem" : "1.5rem",
//               color,
//               lineHeight: 1,
//             }}
//           >
//             {total}
//           </span>
//           <span style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
//             /100
//           </span>
//         </div>
//         <span
//           style={{
//             fontSize: "0.65rem",
//             letterSpacing: "0.12em",
//             color,
//             fontWeight: 600,
//             padding: "2px 8px",
//             border: `1px solid ${color}`,
//             borderRadius: "2px",
//           }}
//         >
//           {label}
//         </span>
//       </div>

//       {/* Stacked bar */}
//       <div
//         style={{
//           height: isLarge ? "8px" : "4px",
//           background: "var(--border)",
//           borderRadius: "2px",
//           overflow: "hidden",
//           display: "flex",
//           gap: "1px",
//         }}
//       >
//         <div
//           style={{
//             width: `${(breakdown.identity / 100) * 100}%`,
//             background: "#00aaff",
//             transition: "width 0.6s ease",
//           }}
//         />
//         <div
//           style={{
//             width: `${(breakdown.reputation / 100) * 100}%`,
//             background: "var(--green)",
//             transition: "width 0.6s ease 0.1s",
//           }}
//         />
//         <div
//           style={{
//             width: `${(breakdown.skillIntegrity / 100) * 100}%`,
//             background: "var(--gold)",
//             transition: "width 0.6s ease 0.2s",
//           }}
//         />
//       </div>

//       {/* Breakdown labels */}
//       {isLarge && (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr 1fr",
//             gap: "0.5rem",
//             marginTop: "0.75rem",
//           }}
//         >
//           {[
//             { label: "Identity", value: breakdown.identity, max: 40, color: "#00aaff" },
//             { label: "Reputation", value: breakdown.reputation, max: 60, color: "var(--green)" },
//             { label: "Integrity", value: breakdown.skillIntegrity, max: 0, color: "var(--gold)" },
//           ].map((item) => (
//             <div
//               key={item.label}
//               style={{
//                 padding: "0.5rem",
//                 background: "var(--bg)",
//                 border: "1px solid var(--border)",
//                 borderRadius: "4px",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "0.6rem",
//                   letterSpacing: "0.08em",
//                   color: "var(--text-dim)",
//                   marginBottom: "0.25rem",
//                 }}
//               >
//                 {item.label.toUpperCase()}
//               </div>
//               <span style={{ color: item.color, fontWeight: 600 }}>
//                 {item.value}
//               </span>
//               <span style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}>
//                 /{item.max}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { scoreColor, scoreLabel } from "@/lib/utils";

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

  return (
    <div style={{ width: "100%" }}>
      {/* Score header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end", // Changed to flex-end for better alignment with large numbers
          marginBottom: isLarge ? "1.25rem" : "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: isLarge ? "3.5rem" : "1.75rem",
              color,
              lineHeight: 0.9,
              textShadow: isLarge ? `0 0 20px ${color}44` : "none", // Subtle glow for large scores
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
            fontWeight: 700,
            padding: "3px 10px",
            border: `1px solid ${color}66`, // Softer border color
            borderRadius: "100px", // Pill style to match new UI
            background: `${color}11`, // Very faint background tint
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
            width: `${(breakdown.identity / 100) * 100}%`,
            background: "#00aaff",
            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: isLarge ? "0 0 10px #00aaff44" : "none",
          }}
        />
        <div
          style={{
            width: `${(breakdown.reputation / 100) * 100}%`,
            background: "var(--green)",
            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
            boxShadow: isLarge ? "0 0 10px var(--green-glow)" : "none",
          }}
        />
        <div
          style={{
            width: `${(breakdown.skillIntegrity / 100) * 100}%`,
            background: "var(--gold)",
            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
            boxShadow: isLarge ? "0 0 10px var(--gold-glow)" : "none",
          }}
        />
      </div>

      {/* Breakdown labels (Large mode only) */}
      {isLarge && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0.75rem",
            marginTop: "1.5rem",
          }}
        >
          {[
            { label: "Identity", value: breakdown.identity, max: 20, color: "#00aaff" },
            { label: "Reputation", value: breakdown.reputation, max: 40, color: "var(--green)" },
            { label: "Skill Integrity", value: breakdown.skillIntegrity, max: 40, color: "var(--gold)" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderLeft: `3px solid ${item.color}`, // Accent border
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