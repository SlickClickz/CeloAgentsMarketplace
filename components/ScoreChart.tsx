"use client";

import { ScoreHistory } from "@/lib/api";
import { scoreColor } from "@/lib/utils";

interface Props {
  history: ScoreHistory[];
}

export default function ScoreChart({ history }: Props) {
  if (!history.length) {
    return (
      <div
        style={{
          padding: "3rem",
          textAlign: "center",
          color: "var(--text-dim)",
          fontSize: "0.8rem",
          letterSpacing: "0.1em",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          fontFamily: "var(--font-mono)",
        }}
      >
        NO HISTORY DATA RECORDED
      </div>
    );
  }

  const reversed = [...history].reverse();
  const max = 100;
  const min = 0;
  const range = max - min;
  const width = 800; // Increased width for better resolution
  const height = 180; // Increased height for better visibility
  const padding = 32;

  const points = reversed.map((h, i) => ({
    x: padding + (i / Math.max(reversed.length - 1, 1)) * (width - padding * 2),
    y: height - padding - ((h.total - min) / range) * (height - padding * 2),
    value: h.total,
    date: new Date(h.recordedAt).toLocaleDateString(),
  }));

  // Create a smoother path using the points
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const fillD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const latestScore = reversed[reversed.length - 1]?.total ?? 0;
  const color = scoreColor(latestScore);

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        overflow: "hidden",
        backdropFilter: "blur(8px)",
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 25, 50, 75, 100].map((v) => {
          const y = height - padding - ((v - min) / range) * (height - padding * 2);
          return (
            <g key={v}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={y + 3}
                fill="rgba(255, 255, 255, 0.3)"
                fontSize="10"
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Fill Area */}
        <path d={fillD} fill="url(#chartGradient)" />

        {/* Main Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#080808" // Dark center
            stroke={color}
            strokeWidth="2"
          />
        ))}
      </svg>

      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          fontFamily: "var(--font-mono)",
          color: "var(--text-dim)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          <span>START: {points[0].date}</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>END: {points[points.length - 1].date}</span>
        </div>
        <span style={{ color: "var(--green)" }}>{history.length} SAMPLES RECORDED</span>
      </div>
    </div>
  );
}