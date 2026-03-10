const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export type Network = "mainnet" | "testnet";

export interface AgentSkill {
  name: string;
  description: string;
  category: string;
  source: "skill.md" | "selfclaw" | "protocol";
  confidence: "high" | "medium" | "low";
  version?: string;
}

export interface AgentFlag {
  type: string;
  message: string;
  severity: "critical" | "warning" | "info";
}

export interface CAMBreakdown {
  identity: number;
  reputation: number;
  skillIntegrity: number;
}

export interface DiscoveryResult {
  agentId: string;
  name: string;
  description: string;
  camScore: number;
  breakdown: CAMBreakdown;
  skills: AgentSkill[];
  flags: AgentFlag[];
  x402Endpoint: string | null;
  network: Network;
  relevance: {
    blendedScore: number;
    inVectorIndex: boolean;
    inExternalSearch: boolean;
    agreementBonus: boolean;
  };
  registrationTimestamp: string;
  blockExplorerUrl: string;
  chain: {
    chainId: number;
    name: string;
    blockExplorer: string;
    isTestnet: boolean;
  };
}

export interface AgentProfile {
  agentId: string;
  name: string;
  description: string;
  walletAddress: string;
  tokenURI: string;
  x402Endpoint: string | null;
  registrationTimestamp: string;
  network: Network;
  camScore: {
    total: number;
    breakdown: CAMBreakdown;
    flags: AgentFlag[];
    lastUpdated: string | null;
  };
  skills: AgentSkill[];
  skillSources: {
    skillMd: number;
    selfclaw: number;
    protocol: number;
  };
  selfclaw: {
    verified: boolean;
    verificationLevel: string | null;
    verificationLevelScore: number;
    agentName: string;
    humanId: string;
    pipelineComplete: boolean;
    reputation: {
      score: number;
      totalStakes: number;
      validated: number;
      slashed: number;
      badges: string[];
    } | null;
    skills: {
      name: string;
      description: string;
      category: string;
      price: string;
      priceToken: string;
      avgRating: number;
      totalPurchases: number;
    }[];
  } | null;
  platform: {
    totalScore: number;
    starCount: number;
    totalFeedbacks: number;
    supportedProtocols: string[];
    createdAt: string;
  } | null;
  chain: {
    chainId: number;
    name: string;
    blockExplorer: string;
    isTestnet: boolean;
    stablecoins: Record<string, string>;
  };
  blockExplorerUrl: string;
}

export interface X402PaymentDetails {
  jobId: string;
  amount: string;
  token: "cUSD" | "USDC";
  tokenAddress: string;
  receivingWallet: string;
  description?: string;
}

export interface ScoreHistory {
  total: number;
  breakdown: CAMBreakdown;
  recordedAt: string;
  date?: string;
}

export interface DiscoveryStats {
  platform: any;
  cam: {
    indexedAgents: number;
    network: Network;
    chainId: number;
  };
}

async function fetcher<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error?.error?.message ?? `API error ${res.status}`
    );
  }

  const json = await res.json();
  return json.data ?? json;
}

export const api = {
  discovery: {
    search: (params: {
      query: string;
      network?: Network;
      limit?: number;
      minScore?: number;
      category?: string;
      externalWeight?: number;
    }): Promise<DiscoveryResult[]> => {
      const qs = new URLSearchParams({
        query: params.query,
        network: params.network ?? "mainnet",
        limit: String(params.limit ?? 10),
        externalWeight: String(params.externalWeight ?? 0.3),
        ...(params.minScore !== undefined && {
          minScore: String(params.minScore),
        }),
        ...(params.category && { category: params.category }),
      });
      return fetcher(`/api/v1/discovery?${qs}`);
    },

    stats: (network: Network = "mainnet"): Promise<DiscoveryStats> =>
      fetcher(`/api/v1/discovery/stats?network=${network}`),
  },

  agent: {
    get: (agentId: string, network: Network = "mainnet"): Promise<AgentProfile> =>
      fetcher(`/api/v1/agent/${agentId}?network=${network}`),

    history: (
      agentId: string,
      network: Network = "mainnet",
      limit = 30
    ): Promise<ScoreHistory[]> =>
      fetcher(
        `/api/v1/agent/${agentId}/score/history?network=${network}&limit=${limit}`
      ),

    refreshScore: (
      agentId: string,
      network: Network = "mainnet"
    ): Promise<void> =>
      fetcher(`/api/v1/score/refresh/${agentId}?network=${network}`, {
        method: "POST",
      }),
  },
  // Add to api object in lib/api.ts
  leaderboard: (
    network: Network = "mainnet",
    limit = 50,
    minScore?: number
  ): Promise<DiscoveryResult[]> => {
    const qs = new URLSearchParams({
      network,
      limit: String(limit),
      ...(minScore !== undefined ? { minScore: String(minScore) } : {}),
    });
    return fetcher(`/api/v1/score/leaderboard?${qs}`);
  },

  networks: (): Promise<any> => fetcher("/api/v1/networks"),
};