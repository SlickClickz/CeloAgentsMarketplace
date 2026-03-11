export default function AgentCardSkeleton() {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px", // Matched to new AgentCard
        padding: "1.5rem",   // Matched to new AgentCard
        position: "relative",
        overflow: "hidden",
        height: "210px",      // Ensures consistent height during load
      }}
    >
      {/* Shimmer overlay - logic remains, opacity adjusted for glass theme */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          animation: "shimmer 1.8s ease-in-out infinite",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", gap: "1.5rem" }}>
        <div style={{ flex: 1 }}>
          {/* Header Row: Rank + Title + Badge */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem", alignItems: "center" }}>
            <div style={{ width: "20px", height: "0.75rem", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }} />
            <div style={{ width: "160px", height: "1.1rem", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
            <div style={{ width: "60px", height: "1rem", background: "rgba(255,255,255,0.06)", borderRadius: "100px" }} />
          </div>
          
          {/* Subtitle / Timestamp */}
          <div style={{ width: "120px", height: "0.75rem", background: "rgba(255,255,255,0.06)", borderRadius: "2px", marginBottom: "1.25rem" }} />
          
          {/* Skill badges - using the new gap and sizing */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[70, 85, 60].map((w, i) => (
              <div key={i} style={{ width: `${w}px`, height: "1.5rem", background: "rgba(255,255,255,0.04)", borderRadius: "6px" }} />
            ))}
          </div>
        </div>

        {/* Score bar section */}
        <div style={{ width: "160px", flexShrink: 0 }}>
          <div style={{ width: "100%", height: "0.7rem", background: "rgba(255,255,255,0.06)", borderRadius: "2px", marginBottom: "0.6rem" }} />
          <div style={{ width: "50%", height: "1.8rem", background: "rgba(255,255,255,0.1)", borderRadius: "4px", marginBottom: "0.6rem" }} />
          <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "100px" }} />
        </div>
      </div>

      {/* Footer */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          paddingTop: "1rem", 
          borderTop: "1px solid rgba(255,255,255,0.06)", 
          marginTop: "1rem" 
        }}
      >
        <div style={{ width: "100px", height: "0.7rem", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }} />
        <div style={{ width: "90px", height: "2rem", background: "rgba(255,255,255,0.06)", borderRadius: "6px" }} />
      </div>
    </div>
  );
}