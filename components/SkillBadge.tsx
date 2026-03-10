// import { confidenceColor, confidenceLabel } from "@/lib/utils";
// import { AgentSkill } from "@/lib/api";

// interface Props {
//   skill: AgentSkill;
//   showSource?: boolean;
// }

// export default function SkillBadge({ skill, showSource = true }: Props) {
//   const color = confidenceColor(skill.confidence);
//   const sourceLabel = confidenceLabel(skill.confidence);

//   return (
//     <div
//       title={skill.description}
//       style={{
//         display: "inline-flex",
//         alignItems: "center",
//         gap: "0.35rem",
//         padding: "3px 8px",
//         border: `1px solid ${color}22`,
//         borderRadius: "3px",
//         background: `${color}08`,
//         fontSize: "0.65rem",
//         letterSpacing: "0.04em",
//         cursor: "default",
//       }}
//     >
//       <span
//         style={{
//           width: 5,
//           height: 5,
//           borderRadius: "50%",
//           background: color,
//           flexShrink: 0,
//         }}
//       />
//       <span style={{ color: "var(--text)" }}>{skill.name}</span>
//       {showSource && (
//         <span style={{ color: "var(--text-dim)" }}>· {sourceLabel}</span>
//       )}
//     </div>
//   );
// }

"use client";

import { confidenceColor, confidenceLabel } from "@/lib/utils";
import { AgentSkill } from "@/lib/api";

interface Props {
  skill: AgentSkill;
  showSource?: boolean;
}

export default function SkillBadge({ skill, showSource = true }: Props) {
  const color = confidenceColor(skill.confidence);
  const sourceLabel = confidenceLabel(skill.confidence);

  return (
    <div
      title={`${skill.name}: ${skill.description}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "4px 10px",
        border: `1px solid ${color}33`,
        borderRadius: "100px", // Pill-shaped for modern glass look
        background: "rgba(255, 255, 255, 0.03)", // Standard glass base
        fontSize: "0.7rem", // Increased for readability
        letterSpacing: "0.02em",
        cursor: "help",
        transition: "all 0.2s ease",
        backdropFilter: "blur(2px)",
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.background = `${color}15`;
        target.style.borderColor = `${color}66`;
        target.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.background = "rgba(255, 255, 255, 0.03)";
        target.style.borderColor = `${color}33`;
        target.style.transform = "translateY(0)";
      }}
    >
      {/* Animated status dot */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
            boxShadow: `0 0 6px ${color}aa`,
          }}
        />
        {/* Subtle pulse for high confidence skills */}
        {Number(skill.confidence) > 80 && (
          <span
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: color,
              animation: "pulse 2s infinite",
              opacity: 0.5,
            }}
          />
        )}
      </div>

      <span style={{ color: "var(--text)", fontWeight: 500 }}>
        {skill.name}
      </span>

      {showSource && (
        <span 
          style={{ 
            color: "var(--text-dim)", 
            fontSize: "0.6rem", 
            fontWeight: 600,
            opacity: 0.6,
            fontFamily: "var(--font-mono)"
          }}
        >
          {sourceLabel.toUpperCase()}
        </span>
      )}
    </div>
  );
}