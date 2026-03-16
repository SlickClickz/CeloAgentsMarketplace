// "use client";

// import { useState } from "react";
// import Navbar from "@/components/Navbar";
// import { Network } from "@/lib/api";

// const IDENTITY_ITEMS = [
//   { label: "ERC-8004 Registration", points: "+10", desc: "Agent is registered on-chain" },
//   { label: "Account Age Bonus", points: "+8", desc: "Older agents are more established" },
//   { label: "SelfClaw Verification", points: "+12", desc: "Scaled by verification level strength" },
//   { label: "Pipeline Complete", points: "+5", desc: "Wallet + token + ERC-8004 all set up" },
//   { label: "8004scan Score Bonus", points: "+5", desc: "Platform community score" },
// ];

// const REPUTATION_ITEMS = [
//   { label: "8004scan Platform Score", points: "+20", desc: "Community-assigned trust score" },
//   { label: "Feedback Quality", points: "+15", desc: "Volume and quality of user feedback" },
//   { label: "SelfClaw Stakes", points: "+15", desc: "Validated reputation stakes on SelfClaw" },
//   { label: "Published Skills", points: "+10", desc: "Skills published on SelfClaw marketplace" },
// ];

// const CONFIDENCE_LEVELS = [
//   { color: "#00ff88", label: "HIGH", source: "skill.md", desc: "Agent explicitly declared this skill in their metadata" },
//   { color: "#ffd700", label: "MEDIUM", source: "SelfClaw", desc: "Agent published this skill on SelfClaw marketplace" },
//   { color: "#888", label: "LOW", source: "Protocol", desc: "Inferred from supported protocols (A2A, MCP, Web...)" },
// ];

// const DATA_SOURCES = [
//   { name: "ERC-8004 Registry", desc: "On-chain agent identity NFTs on Celo", color: "var(--green)" },
//   { name: "8004scan", desc: "Platform reputation scores and feedbacks", color: "#00aaff" },
//   { name: "SelfClaw", desc: "Human verification and staking reputation", color: "var(--gold)" },
//   { name: "The Graph", desc: "Subgraph indexing for mainnet agents", color: "#aaa" },
// ];

// export default function About() {
//   const [network, setNetwork] = useState<Network>("mainnet");

//   return (
//     <div style={{ minHeight: "100vh" }}>
//       <Navbar network={network} onNetworkChange={setNetwork} />

//       <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem" }}>
//         <div className="fade-up">
//           <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--green)", marginBottom: "0.75rem" }}>
//             ◈ METHODOLOGY
//           </div>
//           <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2.5rem", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
//             How CAM Score Works
//           </h1>
//           <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: "3rem", maxWidth: "600px" }}>
//             CAM Score is a composite trust metric (0–100) that aggregates on-chain identity signals, community reputation data, and capability declarations from multiple independent sources. Higher scores indicate more trustworthy, established agents.
//           </p>
//         </div>

//         {/* Formula */}
//         <div className="fade-up fade-up-delay-1" style={{ padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--green-mid)", borderRadius: "6px", marginBottom: "2.5rem", textAlign: "center" }}>
//           <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", color: "var(--text-dim)", marginBottom: "1rem" }}>
//             THE FORMULA
//           </div>
//           <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>
//             CAM Score = <span style={{ color: "#00aaff" }}>Identity</span> (0–40) + <span style={{ color: "var(--green)" }}>Reputation</span> (0–60)
//           </div>
//         </div>

//         {/* Identity Section */}
//         <div className="fade-up fade-up-delay-2" style={{ marginBottom: "2rem" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
//             <div style={{ width: 8, height: 32, background: "#00aaff", borderRadius: "2px" }} />
//             <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "#00aaff" }}>
//               Identity Score — max 40pts
//             </h2>
//           </div>
//           <div style={{ border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
//             {IDENTITY_ITEMS.map((item, i) => (
//               <div key={item.label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", padding: "0.85rem 1.25rem", borderBottom: i < IDENTITY_ITEMS.length - 1 ? "1px solid var(--border)" : "none", alignItems: "center" }}>
//                 <div>
//                   <div style={{ fontSize: "0.8rem", color: "var(--text)", marginBottom: "0.2rem" }}>{item.label}</div>
//                   <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{item.desc}</div>
//                 </div>
//                 <div style={{ fontSize: "0.85rem", color: "#00aaff", fontWeight: 600, whiteSpace: "nowrap" }}>{item.points}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Reputation Section */}
//         <div className="fade-up fade-up-delay-3" style={{ marginBottom: "2rem" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
//             <div style={{ width: 8, height: 32, background: "var(--green)", borderRadius: "2px" }} />
//             <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--green)" }}>
//               Reputation Score — max 60pts
//             </h2>
//           </div>
//           <div style={{ border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
//             {REPUTATION_ITEMS.map((item, i) => (
//               <div key={item.label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", padding: "0.85rem 1.25rem", borderBottom: i < REPUTATION_ITEMS.length - 1 ? "1px solid var(--border)" : "none", alignItems: "center" }}>
//                 <div>
//                   <div style={{ fontSize: "0.8rem", color: "var(--text)", marginBottom: "0.2rem" }}>{item.label}</div>
//                   <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{item.desc}</div>
//                 </div>
//                 <div style={{ fontSize: "0.85rem", color: "var(--green)", fontWeight: 600, whiteSpace: "nowrap" }}>{item.points}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Confidence Levels */}
//         <div className="fade-up fade-up-delay-4" style={{ marginBottom: "2rem" }}>
//           <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
//             Skill Confidence Levels
//           </h2>
//           <div style={{ border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
//             {CONFIDENCE_LEVELS.map((level, i) => (
//               <div key={level.label} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", borderBottom: i < CONFIDENCE_LEVELS.length - 1 ? "1px solid var(--border)" : "none" }}>
//                 <div style={{ width: 8, height: 8, borderRadius: "50%", background: level.color, flexShrink: 0 }} />
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: "0.75rem", color: level.color, fontWeight: 600, marginBottom: "0.2rem" }}>
//                     {level.label} — {level.source}
//                   </div>
//                   <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{level.desc}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Data Sources */}
//         <div className="fade-up" style={{ marginBottom: "2rem" }}>
//           <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
//             Data Sources
//           </h2>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
//             {DATA_SOURCES.map((source) => (
//               <div key={source.name} style={{ padding: "1rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px" }}>
//                 <div style={{ fontSize: "0.75rem", fontWeight: 600, color: source.color, marginBottom: "0.35rem" }}>{source.name}</div>
//                 <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{source.desc}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Network } from "@/lib/api";

const IDENTITY_ITEMS = [
  { label: "ERC-8004 Registration", points: "+10", desc: "Agent is registered on-chain" },
  { label: "Account Age Bonus", points: "+8", desc: "Older agents are more established" },
  { label: "SelfClaw Verification", points: "+12", desc: "Scaled by verification level strength" },
  { label: "Pipeline Complete", points: "+5", desc: "Wallet + token + ERC-8004 all set up" },
  { label: "8004scan Score Bonus", points: "+5", desc: "Platform community score" },
];

const REPUTATION_ITEMS = [
  { label: "8004scan Platform Score", points: "+20", desc: "Community-assigned trust score" },
  { label: "Feedback Quality", points: "+15", desc: "Volume and quality of user feedback" },
  { label: "SelfClaw Stakes", points: "+15", desc: "Validated reputation stakes on SelfClaw" },
  { label: "Published Skills", points: "+10", desc: "Skills published on SelfClaw marketplace" },
];

const CONFIDENCE_LEVELS = [
  { color: "#00ff88", label: "HIGH", source: "skill.md", desc: "Agent explicitly declared this skill in their metadata" },
  { color: "#ffd700", label: "MEDIUM", source: "SelfClaw", desc: "Agent published this skill on SelfClaw marketplace" },
  { color: "#888", label: "LOW", source: "Protocol", desc: "Inferred from supported protocols (A2A, MCP, Web...)" },
];

const DATA_SOURCES = [
  { name: "ERC-8004 Registry", desc: "On-chain agent identity NFTs on Celo", color: "var(--green)" },
  { name: "8004scan", desc: "Platform reputation scores and feedbacks", color: "#00aaff" },
  { name: "SelfClaw", desc: "Human verification and staking reputation", color: "var(--gold)" },
  { name: "The Graph", desc: "Subgraph indexing for mainnet agents", color: "#aaa" },
];

export default function About() {
  const [network, setNetwork] = useState<Network>("mainnet");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar network={network} onNetworkChange={setNetwork} />

      {/* Main Content Container */}
      <div style={{ 
        maxWidth: "760px", 
        margin: "0 auto", 
        padding: "clamp(2rem, 8vw, 4rem) clamp(1rem, 5vw, 2rem)", 
        boxSizing: "border-box" 
      }}>
        <div className="fade-up">
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--green)", marginBottom: "0.75rem" }}>
            ◈ METHODOLOGY
          </div>
          <h1 style={{ 
            fontFamily: "var(--font-display)", 
            fontWeight: 800, 
            fontSize: "clamp(2rem, 7vw, 2.5rem)", 
            letterSpacing: "-0.03em", 
            marginBottom: "1rem",
            lineHeight: 1.1
          }}>
            How CAM Score Works
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: "3rem", maxWidth: "600px" }}>
            CAM Score is a composite trust metric (0–100) that aggregates on-chain identity signals, community reputation data, and capability declarations from multiple independent sources.
          </p>
        </div>

        {/* Formula Section */}
        <div className="fade-up fade-up-delay-1" style={{ 
          padding: "1.5rem 1rem", 
          background: "var(--bg-card)", 
          border: "1px solid var(--green-mid)", 
          borderRadius: "8px", 
          marginBottom: "2.5rem", 
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", color: "var(--text-dim)", marginBottom: "1rem" }}>
            THE FORMULA
          </div>
          <div style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "clamp(1rem, 4vw, 1.5rem)", // Shrinks formula on mobile to prevent wrapping
            fontWeight: 700, 
            color: "var(--text)",
            lineHeight: 1.4
          }}>
            CAM Score = <span style={{ color: "#00aaff", whiteSpace: "nowrap" }}>Identity</span> (0–40) + <br style={{ display: "var(--mobile-only)" }} />
            <span style={{ color: "var(--green)", whiteSpace: "nowrap" }}>Reputation</span> (0–60)
          </div>
        </div>

        {/* Identity & Reputation Tables */}
        {[
          { title: "Identity Score — max 40pts", color: "#00aaff", items: IDENTITY_ITEMS },
          { title: "Reputation Score — max 60pts", color: "var(--green)", items: REPUTATION_ITEMS }
        ].map((section, idx) => (
          <div key={idx} className={`fade-up fade-up-delay-${idx + 2}`} style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ width: 6, height: 24, background: section.color, borderRadius: "2px" }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: section.color }}>
                {section.title}
              </h2>
            </div>
            <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.01)" }}>
              {section.items.map((item, i) => (
                <div key={item.label} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  gap: "1rem", 
                  padding: "1rem 1.25rem", 
                  borderBottom: i < section.items.length - 1 ? "1px solid var(--border)" : "none", 
                  alignItems: "flex-start" 
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--text)", marginBottom: "0.25rem", fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                  <div style={{ fontSize: "0.9rem", color: section.color, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                    {item.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Confidence Levels */}
        <div className="fade-up fade-up-delay-4" style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
            Skill Confidence Levels
          </h2>
          <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
            {CONFIDENCE_LEVELS.map((level, i) => (
              <div key={level.label} style={{ display: "flex", gap: "1rem", padding: "1.25rem", borderBottom: i < CONFIDENCE_LEVELS.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: level.color, marginTop: "4px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.75rem", color: level.color, fontWeight: 700, marginBottom: "0.35rem", letterSpacing: "0.05em" }}>
                    {level.label} — {level.source}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: 1.5 }}>{level.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources Grid */}
        <div className="fade-up" style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
            Data Sources
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: "1rem" 
          }}>
            {DATA_SOURCES.map((source) => (
              <div key={source.name} style={{ 
                padding: "1.25rem", 
                background: "var(--bg-card)", 
                border: "1px solid var(--border)", 
                borderRadius: "8px",
                transition: "border-color 0.2s"
              }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: source.color, marginBottom: "0.5rem" }}>{source.name}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", lineHeight: 1.5 }}>{source.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}