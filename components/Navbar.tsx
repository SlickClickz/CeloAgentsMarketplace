// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import NetworkSwitcher from "./NetworkSwitcher";
// import { Network } from "@/lib/api";

// interface NavbarProps {
//   network: Network;
//   onNetworkChange: (n: Network) => void;
// }

// export default function Navbar({ network, onNetworkChange }: NavbarProps) {
//   const pathname = usePathname();

//   const links = [
//     { href: "/", label: "DISCOVER" },
//     { href: "/leaderboard", label: "LEADERBOARD" },
//     { href: "/about", label: "HOW IT WORKS" },
//   ];

//   return (
//     <nav
//       style={{
//         position: "sticky",
//         top: 0,
//         zIndex: 100,
//         borderBottom: "1px solid var(--border)",
//         background: "rgba(8,8,8,0.92)",
//         backdropFilter: "blur(12px)",
//         padding: "0 2rem",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         height: "56px",
//       }}
//     >
//       {/* Logo */}
//       <Link
//         href="/"
//         style={{
//           fontFamily: "var(--font-display)",
//           fontWeight: 800,
//           fontSize: "1.1rem",
//           color: "var(--green)",
//           textDecoration: "none",
//           letterSpacing: "-0.02em",
//           display: "flex",
//           alignItems: "center",
//           gap: "0.5rem",
//         }}
//       >
//         <span
//           style={{
//             width: 8,
//             height: 8,
//             borderRadius: "50%",
//             background: "var(--green)",
//             display: "inline-block",
//             animation: "pulse-green 2s infinite",
//           }}
//         />
//         CAM
//         <span
//           style={{
//             color: "var(--text-dim)",
//             fontWeight: 400,
//             fontSize: "0.75rem",
//             letterSpacing: "0.05em",
//           }}
//         >
//           CELO AGENT MARKETPLACE
//         </span>
//       </Link>

//       {/* Nav links */}
//       <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
//         {links.map((link) => (
//           <Link
//             key={link.href}
//             href={link.href}
//             style={{
//               color:
//                 pathname === link.href
//                   ? "var(--green)"
//                   : "var(--text-dim)",
//               textDecoration: "none",
//               fontSize: "0.7rem",
//               letterSpacing: "0.1em",
//               fontWeight: 500,
//               transition: "color 0.15s",
//               borderBottom:
//                 pathname === link.href
//                   ? "1px solid var(--green)"
//                   : "1px solid transparent",
//               paddingBottom: "2px",
//             }}
//           >
//             {link.label}
//           </Link>
//         ))}
//       </div>

//       {/* Right side */}
//       <NetworkSwitcher network={network} onChange={onNetworkChange} />
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NetworkSwitcher from "./NetworkSwitcher";
import { Network } from "@/lib/api";

interface NavbarProps {
  network: Network;
  onNetworkChange: (n: Network) => void;
}

export default function Navbar({ network, onNetworkChange }: NavbarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "EXPLORE" },
    { href: "/leaderboard", label: "TOP AGENTS" },
    { href: "/about", label: "HOW CAM WORKS" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid var(--border)",
        background: "rgba(9, 9, 11, 0.7)", // Softer dark matching the new theme
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "72px", // Increased height for better proportions
        transition: "all 0.3s ease",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "1.25rem", // Increased from 1.1rem
          color: "var(--green)",
          textDecoration: "none",
          letterSpacing: "-0.02em",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <span
          style={{
            width: 10, // Slightly larger dot
            height: 10,
            borderRadius: "50%",
            background: "var(--green)",
            display: "inline-block",
            animation: "pulse-green 2s infinite",
            boxShadow: "var(--green-glow)", // Utilizing the glow variable from CSS
          }}
        />
        CAM
        <span
          style={{
            color: "var(--text-dim)",
            fontWeight: 500,
            fontSize: "0.85rem", // Increased from 0.75rem for readability
            letterSpacing: "0.05em",
            marginLeft: "0.25rem",
          }}
        >
          CELO AGENT MARKETPLACE
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: isActive ? "var(--green)" : "var(--text-dim)",
                textDecoration: "none",
                fontSize: "0.85rem", // Increased from 0.7rem
                letterSpacing: "0.08em",
                fontWeight: isActive ? 600 : 500,
                transition: "color 0.2s ease",
                borderBottom: isActive
                  ? "2px solid var(--green)"
                  : "2px solid transparent",
                paddingBottom: "4px", // Thicker, clearer active indicator
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text-dim)";
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <NetworkSwitcher network={network} onChange={onNetworkChange} />
    </nav>
  );
}