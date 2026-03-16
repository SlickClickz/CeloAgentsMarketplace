// "use client";

// import { Network } from "@/lib/api";

// interface Props {
//   network: Network;
//   onChange: (n: Network) => void;
// }

// export default function NetworkSwitcher({ network, onChange }: Props) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         gap: "4px",
//         background: "rgba(255, 255, 255, 0.04)",
//         border: "1px solid rgba(255, 255, 255, 0.08)",
//         borderRadius: "8px",
//         padding: "4px",
//         position: "relative",
//         backdropFilter: "blur(4px)",
//       }}
//     >
//       {(["mainnet", "testnet"] as Network[]).map((n) => {
//         const isActive = network === n;
//         const isMainnet = n === "mainnet";

//         return (
//           <button
//             key={n}
//             onClick={() => onChange(n)}
//             style={{
//               padding: "6px 14px",
//               borderRadius: "6px",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "0.7rem", // Increased from 0.65rem
//               letterSpacing: "0.08em",
//               fontFamily: "var(--font-mono)",
//               fontWeight: isActive ? 700 : 500,
//               transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//               position: "relative",
//               zIndex: 1,
              
//               // Active Colors
//               background: isActive 
//                 ? (isMainnet ? "var(--green)" : "#ffaa00") 
//                 : "transparent",
//               color: isActive 
//                 ? "#000" 
//                 : "var(--text-dim)",
              
//               // Glow effect for active state
//               boxShadow: isActive 
//                 ? `0 0 12px ${isMainnet ? "rgba(0, 255, 136, 0.3)" : "rgba(255, 170, 0, 0.3)"}` 
//                 : "none",
//             }}
//             onMouseEnter={(e) => {
//               if (!isActive) e.currentTarget.style.color = "var(--text)";
//             }}
//             onMouseLeave={(e) => {
//               if (!isActive) e.currentTarget.style.color = "var(--text-dim)";
//             }}
//             onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
//             onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
//           >
//             {n.toUpperCase()}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Network } from "@/lib/api";

interface Props {
  network: Network;
  onChange: (n: Network) => void;
}

export default function NetworkSwitcher({ network, onChange }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "8px",
        padding: "4px",
        position: "relative",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      {(["mainnet", "testnet"] as Network[]).map((n) => {
        const isActive = network === n;
        const isMainnet = n === "mainnet";

        return (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              padding: isMobile ? "8px 12px" : "6px 14px", // Increased vertical padding for mobile
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: isMobile ? "0.65rem" : "0.7rem", 
              letterSpacing: "0.08em",
              fontFamily: "var(--font-mono)",
              fontWeight: isActive ? 700 : 500,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              zIndex: 1,
              outline: "none",
              
              // Colors
              background: isActive 
                ? (isMainnet ? "var(--green)" : "#ffaa00") 
                : "transparent",
              color: isActive 
                ? "#000" 
                : "var(--text-dim)",
              
              // Visual depth
              boxShadow: isActive 
                ? `0 0 12px ${isMainnet ? "rgba(0, 255, 136, 0.25)" : "rgba(255, 170, 0, 0.25)"}` 
                : "none",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = "var(--text-dim)";
            }}
            // Enhanced tactile feedback for mobile touch
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* Shortened text for mobile to save horizontal space */}
            {isMobile ? n.toUpperCase().replace("NET", "") : n.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}