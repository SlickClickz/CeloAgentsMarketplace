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
//     { href: "/", label: "EXPLORE" },
//     { href: "/leaderboard", label: "TOP AGENTS" },
//     { href: "/about", label: "HOW CAM WORKS" },
//   ];

//   return (
//     <nav
//       style={{
//         position: "sticky",
//         top: 0,
//         zIndex: 100,
//         borderBottom: "1px solid var(--border)",
//         background: "rgba(9, 9, 11, 0.7)", // Softer dark matching the new theme
//         backdropFilter: "blur(16px)",
//         WebkitBackdropFilter: "blur(16px)",
//         padding: "0 2rem",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         height: "72px", // Increased height for better proportions
//         transition: "all 0.3s ease",
//       }}
//     >
//       {/* Logo */}
//       <Link
//         href="/"
//         style={{
//           fontFamily: "var(--font-display)",
//           fontWeight: 800,
//           fontSize: "1.25rem", // Increased from 1.1rem
//           color: "var(--green)",
//           textDecoration: "none",
//           letterSpacing: "-0.02em",
//           display: "flex",
//           alignItems: "center",
//           gap: "0.75rem",
//         }}
//       >
//         <span
//           style={{
//             width: 10, // Slightly larger dot
//             height: 10,
//             borderRadius: "50%",
//             background: "var(--green)",
//             display: "inline-block",
//             animation: "pulse-green 2s infinite",
//             boxShadow: "var(--green-glow)", // Utilizing the glow variable from CSS
//           }}
//         />
//         CAM
//         <span
//           style={{
//             color: "var(--text-dim)",
//             fontWeight: 500,
//             fontSize: "0.85rem", // Increased from 0.75rem for readability
//             letterSpacing: "0.05em",
//             marginLeft: "0.25rem",
//           }}
//         >
//           CELO AGENT MARKETPLACE
//         </span>
//       </Link>

//       {/* Nav links */}
//       <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
//         {links.map((link) => {
//           const isActive = pathname === link.href;
//           return (
//             <Link
//               key={link.href}
//               href={link.href}
//               style={{
//                 color: isActive ? "var(--green)" : "var(--text-dim)",
//                 textDecoration: "none",
//                 fontSize: "0.85rem", // Increased from 0.7rem
//                 letterSpacing: "0.08em",
//                 fontWeight: isActive ? 600 : 500,
//                 transition: "color 0.2s ease",
//                 borderBottom: isActive
//                   ? "2px solid var(--green)"
//                   : "2px solid transparent",
//                 paddingBottom: "4px", // Thicker, clearer active indicator
//               }}
//               onMouseEnter={(e) => {
//                 if (!isActive) e.currentTarget.style.color = "var(--text)";
//               }}
//               onMouseLeave={(e) => {
//                 if (!isActive) e.currentTarget.style.color = "var(--text-dim)";
//               }}
//             >
//               {link.label}
//             </Link>
//           );
//         })}
//       </div>

//       {/* Right side */}
//       <NetworkSwitcher network={network} onChange={onNetworkChange} />
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import NetworkSwitcher from "./NetworkSwitcher";
import { Network } from "@/lib/api";

interface NavbarProps {
  network: Network;
  onNetworkChange: (n: Network) => void;
}

export default function Navbar({ network, onNetworkChange }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resizing
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false); // Close menu if scaling up to desktop
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const links = [
    { href: "/", label: "EXPLORE" },
    { href: "/leaderboard", label: "TOP AGENTS" },
    { href: "/about", label: "HOW IT WORKS" },
  ];

  const navItemStyle = (isActive: boolean): React.CSSProperties => ({
    color: isActive ? "var(--green)" : "var(--text-dim)",
    textDecoration: "none",
    fontSize: isMobile ? "1.1rem" : "0.85rem",
    letterSpacing: "0.08em",
    fontWeight: isActive ? 600 : 500,
    transition: "all 0.2s ease",
    borderBottom: !isMobile && isActive ? "2px solid var(--green)" : "2px solid transparent",
    paddingBottom: isMobile ? "1rem" : "4px",
    width: isMobile ? "100%" : "auto",
    textAlign: isMobile ? "center" : "left",
  });

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          borderBottom: "1px solid var(--border)",
          background: "rgba(9, 9, 11, 0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: isMobile ? "0 1.25rem" : "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
          transition: "all 0.3s ease",
          boxSizing: "border-box",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "var(--green)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--green)",
              boxShadow: "var(--green-glow)",
            }}
          />
          CAM
          {!isMobile && (
            <span
              style={{
                color: "var(--text-dim)",
                fontWeight: 500,
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                marginLeft: "0.25rem",
              }}
            >
              CELO AGENT MARKETPLACE
            </span>
          )}
        </Link>

        {/* Desktop Nav Links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={navItemStyle(pathname === link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <NetworkSwitcher network={network} onChange={onNetworkChange} />
          
          {/* Mobile Hamburger Toggle */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text)",
                cursor: "pointer",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <div style={{ width: "22px", height: "2px", background: "currentColor", transition: "0.3s", transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <div style={{ width: "22px", height: "2px", background: "currentColor", opacity: isOpen ? 0 : 1, transition: "0.3s" }} />
              <div style={{ width: "22px", height: "2px", background: "currentColor", transition: "0.3s", transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: "72px",
            left: 0,
            width: "100%",
            height: isOpen ? "calc(100vh - 72px)" : "0",
            background: "var(--bg)",
            zIndex: 999,
            overflow: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: isOpen ? "2rem" : "0",
            opacity: isOpen ? 1 : 0,
            borderBottom: isOpen ? "1px solid var(--border)" : "none",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={navItemStyle(pathname === link.href)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}