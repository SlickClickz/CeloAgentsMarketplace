export function scoreColor(score: number): string {
  if (score >= 70) return "#00ff88";
  if (score >= 40) return "#ffd700";
  return "#ff4444";
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "TRUSTED";
  if (score >= 60) return "VERIFIED";
  if (score >= 40) return "MODERATE";
  if (score >= 20) return "LOW";
  return "UNVERIFIED";
}

export function confidenceColor(
  confidence: "high" | "medium" | "low"
): string {
  return confidence === "high"
    ? "#00ff88"
    : confidence === "medium"
    ? "#ffd700"
    : "#888888";
}

export function confidenceLabel(
  confidence: "high" | "medium" | "low"
): string {
  return confidence === "high"
    ? "skill.md"
    : confidence === "medium"
    ? "SelfClaw"
    : "inferred";
}

export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours}h ago`;
  return "just now";
}

export function verificationLevelLabel(level: string | null): string {
  if (!level) return "Unverified";
  const labels: Record<string, string> = {
    "talent-human+signature": "Human + Signature",
    "talent-human": "Human Verified",
    "talent-passport+signature": "Passport + Signature",
    "talent-passport": "Passport Verified",
    selfxyz_passport: "ZK Passport",
  };
  return labels[level] ?? level;
}