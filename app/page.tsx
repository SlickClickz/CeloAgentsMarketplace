// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { api, DiscoveryResult, Network } from "@/lib/api";
// import AgentCard from "@/components/AgentCard";
// import Navbar from "@/components/Navbar";
// import AgentCardSkeleton from "@/components/AgentCardSkeleton";

// const CATEGORIES = [
//   "all",
//   "defi",
//   "payment-automation",
//   "data-oracle",
//   "nft-management",
//   "governance",
//   "cross-chain-transfer",
//   "other",
// ];

// const INITIAL_LIMIT = 20;
// const EXPANDED_LIMIT = 50;

// export default function Discovery() {
//   const [network, setNetwork] = useState<Network>("mainnet");
//   const [query, setQuery] = useState("");
//   const [inputValue, setInputValue] = useState("");
//   const [results, setResults] = useState<DiscoveryResult[]>([]);
//   const [featured, setFeatured] = useState<DiscoveryResult[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [featuredLoading, setFeaturedLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [minScore, setMinScore] = useState<number | undefined>();
//   const [category, setCategory] = useState("all");
//   const [stats, setStats] = useState<{ indexedAgents: number } | null>(null);
//   const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Load featured agents via leaderboard on mount + network change
//   useEffect(() => {
//     setFeaturedLoading(true);
//     setFeatured([]);
//     setDisplayLimit(INITIAL_LIMIT);

//     Promise.all([
//       api.leaderboard(network, EXPANDED_LIMIT),
//       api.discovery.stats(network),
//     ])
//       .then(([leaderboardResults, statsData]) => {
//         setFeatured(leaderboardResults);
//         setStats(statsData.cam);
//       })
//       .catch(() => {})
//       .finally(() => setFeaturedLoading(false));

//     if (query) handleSearch(query);
//   }, [network]);

//   const handleSearch = useCallback(
//     async (q: string) => {
//       if (!q.trim()) return;
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await api.discovery.search({
//           query: q,
//           network,
//           limit: 20,
//           minScore,
//           category: category !== "all" ? category : undefined,
//         });
//         setResults(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [network, minScore, category]
//   );

//   const handleLoadMore = async () => {
//     setLoadingMore(true);
//     // Featured already has 50 loaded — just expand display limit
//     setDisplayLimit(EXPANDED_LIMIT);
//     setLoadingMore(false);
//   };

//   const onSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setQuery(inputValue);
//     handleSearch(inputValue);
//   };

//   const visibleFeatured = featured.slice(0, displayLimit);
//   const hasMore = featured.length > displayLimit;

//   return (
//     <div style={{ minHeight: "100vh" }}>
//       <Navbar network={network} onNetworkChange={setNetwork} />

//       <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 2rem 2rem" }}>
//         {/* Hero */}
//         <div className="fade-up">
//           <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--green)", marginBottom: "1rem", fontWeight: 600 }}>
//             ◈ CELO AGENT MARKETPLACE
//           </div>
//           <h1
//             style={{
//               fontFamily: "var(--font-display)",
//               fontWeight: 800,
//               fontSize: "clamp(2rem, 5vw, 3.5rem)",
//               lineHeight: 1.05,
//               letterSpacing: "-0.03em",
//               marginBottom: "1.5rem",
//               color: "var(--text)",
//             }}
//           >
//             Find agents you can
//             <br />
//             <span style={{ color: "var(--green)" }}>actually trust.</span>
//           </h1>
//         </div>

//         {/* Search */}
//         <div className="fade-up fade-up-delay-1">
//           <form onSubmit={onSubmit}>
//             <div
//               style={{
//                 display: "flex",
//                 border: "1px solid var(--border-active)",
//                 borderRadius: "6px",
//                 overflow: "hidden",
//                 background: "var(--bg-card)",
//               }}
//             >
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 placeholder='Try "hedge my stablecoins" or "automate payments"'
//                 style={{
//                   flex: 1,
//                   padding: "1rem 1.25rem",
//                   background: "transparent",
//                   border: "none",
//                   outline: "none",
//                   color: "var(--text)",
//                   fontFamily: "var(--font-mono)",
//                   fontSize: "0.85rem",
//                 }}
//               />
//               <button
//                 type="submit"
//                 disabled={loading}
//                 style={{
//                   padding: "1rem 1.5rem",
//                   background: loading ? "var(--border)" : "var(--green)",
//                   border: "none",
//                   cursor: loading ? "not-allowed" : "pointer",
//                   color: "#000",
//                   fontFamily: "var(--font-mono)",
//                   fontWeight: 600,
//                   fontSize: "0.75rem",
//                   letterSpacing: "0.08em",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {loading ? "SEARCHING..." : "SEARCH →"}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Filters */}
//         <div
//           className="fade-up fade-up-delay-2"
//           style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap", alignItems: "center" }}
//         >
//           <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>FILTERS:</span>
//           <select
//             value={minScore ?? ""}
//             onChange={(e) => setMinScore(e.target.value ? Number(e.target.value) : undefined)}
//             style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "4px 8px", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.65rem", cursor: "pointer" }}
//           >
//             <option value="">MIN SCORE: ANY</option>
//             <option value="20">MIN SCORE: 20+</option>
//             <option value="40">MIN SCORE: 40+</option>
//             <option value="60">MIN SCORE: 60+</option>
//           </select>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "4px 8px", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.65rem", cursor: "pointer" }}
//           >
//             {CATEGORIES.map((c) => (
//               <option key={c} value={c}>
//                 {c === "all" ? "ALL CATEGORIES" : c.toUpperCase()}
//               </option>
//             ))}
//           </select>

//           {query && (
//             <button
//               onClick={() => { setQuery(""); setInputValue(""); setResults([]); }}
//               style={{ background: "none", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", cursor: "pointer", padding: "4px 10px" }}
//             >
//               ✕ CLEAR SEARCH
//             </button>
//           )}
//         </div>

//         {/* Stats bar */}
//         {stats && (
//           <div
//             className="fade-up fade-up-delay-3"
//             style={{ marginTop: "1.5rem", padding: "0.75rem 1rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "4px", display: "flex", gap: "2rem", fontSize: "0.65rem" }}
//           >
//             <span>
//               <span style={{ color: "var(--green)", fontWeight: 600 }}>{stats.indexedAgents}</span>{" "}
//               <span style={{ color: "var(--text-dim)" }}>AGENTS INDEXED</span>
//             </span>
//             <span>
//               <span style={{ color: "var(--green)", fontWeight: 600 }}>{network.toUpperCase()}</span>{" "}
//               <span style={{ color: "var(--text-dim)" }}>NETWORK</span>
//             </span>
//             <span style={{ color: "var(--text-dim)" }}>POWERED BY CAM SCORE</span>
//           </div>
//         )}

//         {error && (
//           <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(255,68,68,0.05)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: "4px", color: "var(--red)", fontSize: "0.75rem" }}>
//             {error}
//           </div>
//         )}

//         {/* ── Search Results ── */}
//         {/* {query && (
//           <div style={{ marginTop: "2rem" }}>
//             <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
//               {loading
//                 ? "SEARCHING..."
//                 : `${results.length} RESULTS FOR "${query.toUpperCase()}" ON ${network.toUpperCase()} — RANKED BY CAM SCORE`}
//             </div>
//             {!loading && (
//               <>
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
//                   {results.map((agent, i) => (
//                     <AgentCard
//                       key={agent.agentId}
//                       agent={agent}
//                       style={{ opacity: 0, animation: `fadeUp 0.4s ease ${i * 0.05}s forwards` }}
//                     />
//                   ))}
//                 </div>
//                 {results.length === 0 && (
//                   <div style={{ textAlign: "center", color: "var(--text-dim)", fontSize: "0.75rem", padding: "3rem 0" }}>
//                     <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>◈</div>
//                     No agents found for "{query}" on {network}
//                     <br />
//                     <span style={{ fontSize: "0.65rem" }}>Try a different query or switch networks</span>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )} */}
//         {query && (
//           <div style={{ marginTop: "2rem" }}>
//             {/* Status line */}
//             <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.08em", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//               {loading ? (
//                 <>
//                   <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
//                   SEARCHING FOR "{query.toUpperCase()}"...
//                 </>
//               ) : (
//                 <>
//                   <span style={{ color: "var(--green)" }}>{results.length}</span>
//                   {results.length === 1 ? " RESULT" : " RESULTS"} FOR "{query.toUpperCase()}" ON {network.toUpperCase()}
//                   {results.length > 0 && <span style={{ color: "var(--border)" }}>— RANKED BY CAM SCORE</span>}
//                 </>
//               )}
//             </div>

//             {/* Skeleton while loading */}
//             {loading && (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
//                 {Array.from({ length: 4 }).map((_, i) => (
//                   <AgentCardSkeleton key={i} />
//                 ))}
//               </div>
//             )}

//             {/* Results */}
//             {!loading && results.length > 0 && (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
//                 {results
//                   .filter((agent) => !!agent.agentId)
//                   .map((agent, i) => (
//                     <AgentCard
//                       key={agent.agentId}
//                       agent={agent}
//                       style={{ opacity: 0, animation: `fadeUp 0.4s ease ${i * 0.05}s forwards` }}
//                     />
//                   ))}
//               </div>
//             )}

//             {/* Empty state */}
//             {!loading && results.length === 0 && (
//               <div style={{ textAlign: "center", color: "var(--text-dim)", fontSize: "0.75rem", padding: "3rem 0", border: "1px solid var(--border)", borderRadius: "6px" }}>
//                 <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>◈</div>
//                 <div style={{ marginBottom: "0.5rem" }}>No agents found for "{query}" on {network}</div>
//                 <div style={{ fontSize: "0.65rem" }}>Try a broader query or switch networks</div>
//                 <button
//                   onClick={() => { setQuery(""); setInputValue(""); setResults([]); }}
//                   style={{ marginTop: "1rem", background: "none", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "6px 14px", cursor: "pointer" }}
//                 >
//                   CLEAR SEARCH
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── Featured / Leaderboard Grid ── */}
//         {!query && (
//           <div style={{ marginTop: "2.5rem" }}>
//             <div
//               className="fade-up fade-up-delay-4"
//               style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}
//             >
//               <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.08em" }}>
//                 ◈ TOP AGENTS ON {network.toUpperCase()} BY CAM SCORE
//                 {!featuredLoading && (
//                   <span style={{ color: "var(--green)", marginLeft: "0.75rem" }}>
//                     {visibleFeatured.length}/{featured.length}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {featuredLoading ? (
//               // <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
//               //   {Array.from({ length: 6 }).map((_, i) => (
//               //     <div
//               //       key={i}
//               //       style={{
//               //         height: "180px",
//               //         background: "var(--bg-card)",
//               //         border: "1px solid var(--border)",
//               //         borderRadius: "6px",
//               //         opacity: 0.5,
//               //         animation: "pulse 1.5s ease infinite",
//               //       }}
//               //     />
//               //   ))}
//               // </div>
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
//                 {Array.from({ length: 6 }).map((_, i) => (
//                   <AgentCardSkeleton key={i} />
//                 ))}
//               </div>
//             ) : visibleFeatured.length > 0 ? (
//               <>
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//                     gap: "1rem",
//                   }}
//                 >
//                   {visibleFeatured.map((agent, i) => (
//                     <AgentCard
//                       key={agent.agentId}
//                       agent={agent}
//                       rank={i}
//                       style={{
//                         opacity: 0,
//                         animation: `fadeUp 0.4s ease ${Math.min(i, 10) * 0.04}s forwards`,
//                       }}
//                     />
//                   ))}
//                 </div>

//                 {/* Load More */}
//                 {hasMore && (
//                   <div style={{ textAlign: "center", marginTop: "2rem" }}>
//                     <button
//                       onClick={handleLoadMore}
//                       disabled={loadingMore}
//                       style={{
//                         padding: "0.75rem 2.5rem",
//                         background: "transparent",
//                         border: "1px solid var(--green)",
//                         borderRadius: "4px",
//                         color: "var(--green)",
//                         fontFamily: "var(--font-mono)",
//                         fontSize: "0.75rem",
//                         cursor: "pointer",
//                         letterSpacing: "0.08em",
//                         transition: "all 0.15s",
//                       }}
//                       onMouseEnter={(e) => {
//                         (e.currentTarget as HTMLElement).style.background = "var(--green)";
//                         (e.currentTarget as HTMLElement).style.color = "#000";
//                       }}
//                       onMouseLeave={(e) => {
//                         (e.currentTarget as HTMLElement).style.background = "transparent";
//                         (e.currentTarget as HTMLElement).style.color = "var(--green)";
//                       }}
//                     >
//                       {loadingMore ? "LOADING..." : `LOAD MORE — SHOWING ${visibleFeatured.length} OF ${featured.length} AGENTS`}
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", padding: "2rem 0", textAlign: "center" }}>
//                 No agents indexed yet on {network}.
//                 {network === "testnet" && (
//                   <span>
//                     {" "}Try switching to{" "}
//                     <button
//                       onClick={() => setNetwork("mainnet")}
//                       style={{ background: "none", border: "none", color: "var(--green)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
//                     >
//                       mainnet
//                     </button>.
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* Suggested searches */}
//             <div style={{ marginTop: "3rem" }}>
//               <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.08em", marginBottom: "1rem" }}>
//                 SUGGESTED SEARCHES
//               </div>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
//                 {["automate payments", "DeFi yield", "stablecoin savings", "cross chain bridge", "governance voting", "NFT management"].map((s) => (
//                   <button
//                     key={s}
//                     onClick={() => { setInputValue(s); setQuery(s); handleSearch(s); }}
//                     style={{ padding: "6px 14px", background: "transparent", border: "1px solid var(--border)", borderRadius: "3px", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", cursor: "pointer", transition: "all 0.15s" }}
//                     onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "var(--green)"; (e.target as HTMLElement).style.color = "var(--green)"; }}
//                     onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border)"; (e.target as HTMLElement).style.color = "var(--text-dim)"; }}
//                   >
//                     {s}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { api, DiscoveryResult, Network } from "@/lib/api";
import AgentCard from "@/components/AgentCard";
import Navbar from "@/components/Navbar";
import AgentCardSkeleton from "@/components/AgentCardSkeleton";

const CATEGORIES = [
  "all",
  "defi",
  "payment-automation",
  "data-oracle",
  "nft-management",
  "governance",
  "cross-chain-transfer",
  "other",
];

const INITIAL_LIMIT = 20;
const EXPANDED_LIMIT = 50;

export default function Discovery() {
  const [network, setNetwork] = useState<Network>("mainnet");
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [featured, setFeatured] = useState<DiscoveryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minScore, setMinScore] = useState<number | undefined>();
  const [category, setCategory] = useState("all");
  const [stats, setStats] = useState<{ indexedAgents: number } | null>(null);
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setFeaturedLoading(true);
    setFeatured([]);
    setDisplayLimit(INITIAL_LIMIT);

    Promise.all([
      api.leaderboard(network, EXPANDED_LIMIT),
      api.discovery.stats(network),
    ])
      .then(([leaderboardResults, statsData]) => {
        setFeatured(leaderboardResults);
        setStats(statsData.cam);
      })
      .catch(() => {})
      .finally(() => setFeaturedLoading(false));

    if (query) handleSearch(query);
  }, [network]);

  const handleSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const data = await api.discovery.search({
          query: q,
          network,
          limit: 20,
          minScore,
          category: category !== "all" ? category : undefined,
        });
        setResults(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [network, minScore, category]
  );

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setDisplayLimit(EXPANDED_LIMIT);
    setLoadingMore(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
    handleSearch(inputValue);
  };

  const visibleFeatured = featured.slice(0, displayLimit);
  const hasMore = featured.length > displayLimit;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar network={network} onNetworkChange={setNetwork} />

      <main style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "5rem 2rem 4rem" }}>
        {/* Hero */}
        <div className="fade-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ 
            fontSize: "0.85rem", 
            letterSpacing: "0.2em", 
            color: "var(--green)", 
            marginBottom: "1.5rem", 
            fontWeight: 600,
            textTransform: "uppercase"
          }}>
            ◈ Celo Agent Marketplace
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              marginBottom: "1.5rem",
              color: "var(--text)",
            }}
          >
            Find agents you can <br />
            <span style={{ 
              color: "transparent", 
              background: "linear-gradient(90deg, #00ff88, #00d2ff)", 
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              filter: "drop-shadow(0px 0px 12px rgba(0, 255, 136, 0.2))"
            }}>
              actually trust.
            </span>
          </h1>
        </div>

        {/* Search */}
        <div className="fade-up fade-up-delay-1" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <form onSubmit={onSubmit}>
            <div
              className="glass-panel"
              style={{
                display: "flex",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "var(--green-glow)",
                padding: "0.5rem",
                transition: "border-color 0.3s ease",
              }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Try "hedge my stablecoins" or "automate payments"'
                style={{
                  flex: 1,
                  padding: "1.25rem 1.5rem",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.05rem",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0 2rem",
                  background: loading ? "var(--border)" : "var(--green)",
                  border: "none",
                  borderRadius: "12px",
                  cursor: loading ? "not-allowed" : "pointer",
                  color: "#000",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "SEARCHING..." : "SEARCH →"}
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div
          className="fade-up fade-up-delay-2"
          style={{ 
            display: "flex", 
            justifyContent: "center",
            gap: "1rem", 
            marginTop: "2rem", 
            flexWrap: "wrap", 
            alignItems: "center" 
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "var(--text-dim)", fontWeight: 500 }}>FILTERS:</span>
          
          <select
            value={minScore ?? ""}
            onChange={(e) => setMinScore(e.target.value ? Number(e.target.value) : undefined)}
            className="glass-panel"
            style={{ 
              color: "var(--text)", 
              padding: "0.6rem 1rem", 
              borderRadius: "8px", 
              fontFamily: "var(--font-mono)", 
              fontSize: "0.85rem", 
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="">MIN SCORE: ANY</option>
            <option value="20">MIN SCORE: 20+</option>
            <option value="40">MIN SCORE: 40+</option>
            <option value="60">MIN SCORE: 60+</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="glass-panel"
            style={{ 
              color: "var(--text)", 
              padding: "0.6rem 1rem", 
              borderRadius: "8px", 
              fontFamily: "var(--font-mono)", 
              fontSize: "0.85rem", 
              cursor: "pointer",
              outline: "none"
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "ALL CATEGORIES" : c.toUpperCase().replace("-", " ")}
              </option>
            ))}
          </select>

          {query && (
            <button
              onClick={() => { setQuery(""); setInputValue(""); setResults([]); }}
              style={{ 
                background: "transparent", 
                border: "1px solid var(--border)", 
                borderRadius: "8px", 
                color: "var(--text-dim)", 
                fontFamily: "var(--font-mono)", 
                fontSize: "0.85rem", 
                cursor: "pointer", 
                padding: "0.6rem 1rem",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.borderColor = "var(--text-dim)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-dim)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              ✕ CLEAR
            </button>
          )}
        </div>

        {/* Stats bar */}
        {stats && (
          <div
            className="fade-up fade-up-delay-3 glass-panel"
            style={{ 
              marginTop: "2.5rem", 
              padding: "1rem 1.5rem", 
              borderRadius: "12px", 
              display: "flex", 
              justifyContent: "center",
              gap: "3rem", 
              fontSize: "0.85rem",
              maxWidth: "800px",
              margin: "2.5rem auto 0"
            }}
          >
            <span>
              <span style={{ color: "var(--green)", fontWeight: 600, fontSize: "1.1rem" }}>{stats.indexedAgents}</span>{" "}
              <span style={{ color: "var(--text-dim)", marginLeft: "0.5rem" }}>AGENTS INDEXED</span>
            </span>
            <span>
              <span style={{ color: "var(--green)", fontWeight: 600, fontSize: "1.1rem" }}>{network.toUpperCase()}</span>{" "}
              <span style={{ color: "var(--text-dim)", marginLeft: "0.5rem" }}>NETWORK</span>
            </span>
            <span style={{ color: "var(--text-dim)", display: "flex", alignItems: "center" }}>
              ⚡ POWERED BY CAM SCORE
            </span>
          </div>
        )}

        {error && (
          <div style={{ 
            marginTop: "2rem", 
            padding: "1rem 1.5rem", 
            background: "rgba(255,68,68,0.1)", 
            border: "1px solid rgba(255,68,68,0.3)", 
            borderRadius: "12px", 
            color: "var(--red)", 
            fontSize: "0.9rem",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {/* ── Search Results ── */}
        {query && (
          <div style={{ marginTop: "4rem" }}>
            {/* Status line */}
            <div style={{ 
              fontSize: "0.9rem", 
              color: "var(--text-dim)", 
              letterSpacing: "0.05em", 
              marginBottom: "2rem", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem" 
            }}>
              {loading ? (
                <>
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
                  SEARCHING FOR "{query.toUpperCase()}"...
                </>
              ) : (
                <>
                  <span style={{ color: "var(--green)", fontWeight: 600 }}>{results.length}</span>
                  {results.length === 1 ? " RESULT" : " RESULTS"} FOR "{query.toUpperCase()}" ON {network.toUpperCase()}
                  {results.length > 0 && <span style={{ color: "var(--border)", marginLeft: "auto" }}>RANKED BY CAM SCORE</span>}
                </>
              )}
            </div>

            {/* Skeleton while loading */}
            {loading && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <AgentCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {results
                  .filter((agent) => !!agent.agentId)
                  .map((agent, i) => (
                    <AgentCard
                      key={agent.agentId}
                      agent={agent}
                      style={{ opacity: 0, animation: `fadeUp 0.5s ease ${i * 0.05}s forwards` }}
                    />
                  ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && results.length === 0 && (
              <div className="glass-panel" style={{ 
                textAlign: "center", 
                padding: "4rem 2rem", 
                borderRadius: "16px" 
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem", color: "var(--border-active)" }}>◈</div>
                <div style={{ marginBottom: "0.75rem", fontSize: "1.1rem", color: "var(--text)" }}>
                  No agents found for "{query}" on {network}
                </div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>
                  Try a broader query or switch networks
                </div>
                <button
                  onClick={() => { setQuery(""); setInputValue(""); setResults([]); }}
                  style={{ 
                    marginTop: "2rem", 
                    background: "transparent", 
                    border: "1px solid var(--border)", 
                    borderRadius: "8px", 
                    color: "var(--text)", 
                    fontFamily: "var(--font-mono)", 
                    fontSize: "0.85rem", 
                    padding: "0.8rem 1.5rem", 
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--green)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  CLEAR SEARCH
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Featured / Leaderboard Grid ── */}
        {!query && (
          <div style={{ marginTop: "4rem" }}>
            <div
              className="fade-up fade-up-delay-4"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}
            >
              <div style={{ fontSize: "0.9rem", color: "var(--text-dim)", letterSpacing: "0.05em", fontWeight: 500 }}>
                ◈ TOP AGENTS ON {network.toUpperCase()}
                {!featuredLoading && (
                  <span style={{ color: "var(--green)", marginLeft: "1rem", fontWeight: 600 }}>
                    {visibleFeatured.length} / {featured.length}
                  </span>
                )}
              </div>
            </div>

            {featuredLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <AgentCardSkeleton key={i} />
                ))}
              </div>
            ) : visibleFeatured.length > 0 ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {visibleFeatured.map((agent, i) => (
                    <AgentCard
                      key={agent.agentId}
                      agent={agent}
                      rank={i}
                      style={{
                        opacity: 0,
                        animation: `fadeUp 0.5s ease ${Math.min(i, 10) * 0.05}s forwards`,
                      }}
                    />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div style={{ textAlign: "center", marginTop: "4rem" }}>
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      style={{
                        padding: "1rem 3rem",
                        background: "transparent",
                        border: "1px solid var(--green)",
                        borderRadius: "8px",
                        color: "var(--green)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: "0.05em",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--green)";
                        e.currentTarget.style.color = "#000";
                        e.currentTarget.style.boxShadow = "var(--green-glow)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--green)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {loadingMore ? "LOADING..." : `LOAD MORE AGENTS (${visibleFeatured.length} OF ${featured.length})`}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-panel" style={{ color: "var(--text-dim)", fontSize: "1rem", padding: "4rem 0", textAlign: "center", borderRadius: "16px" }}>
                No agents indexed yet on {network}.
                {network === "testnet" && (
                  <div style={{ marginTop: "1rem" }}>
                    Try switching to{" "}
                    <button
                      onClick={() => setNetwork("mainnet")}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "var(--green)", 
                        cursor: "pointer", 
                        fontFamily: "var(--font-mono)", 
                        fontSize: "1rem",
                        textDecoration: "underline",
                        textUnderlineOffset: "4px"
                      }}
                    >
                      mainnet
                    </button>.
                  </div>
                )}
              </div>
            )}

            {/* Suggested searches */}
            <div style={{ marginTop: "5rem", textAlign: "center" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", letterSpacing: "0.05em", marginBottom: "1.5rem" }}>
                SUGGESTED SEARCHES
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
                {["automate payments", "DeFi yield", "stablecoin savings", "cross chain bridge", "governance voting", "NFT management"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInputValue(s); setQuery(s); handleSearch(s); }}
                    className="glass-panel"
                    style={{ 
                      padding: "0.75rem 1.25rem", 
                      borderRadius: "20px", 
                      color: "var(--text-mid)", 
                      fontFamily: "var(--font-mono)", 
                      fontSize: "0.85rem", 
                      cursor: "pointer", 
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.borderColor = "var(--green)"; 
                      e.currentTarget.style.color = "var(--green)"; 
                      e.currentTarget.style.boxShadow = "var(--green-glow)";
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.borderColor = "var(--border)"; 
                      e.currentTarget.style.color = "var(--text-mid)"; 
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
