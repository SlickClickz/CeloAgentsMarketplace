// // ─────────────────────────────────────────
// // x402 Protocol Client
// // Handles preflight, payment, and retry
// // ─────────────────────────────────────────

// export interface X402PaymentRequired {
//   jobId: string;
//   amount: string;        // e.g. "0.01"
//   token: "cUSD" | "USDC";
//   tokenAddress: string;  // ERC-20 contract address
//   receivingWallet: string;
//   description?: string;
//   expiresAt?: string;
// }

// export interface X402JobRequest {
//   skill?: string;
//   description: string;
//   parameters?: Record<string, any>;
// }

// export interface X402JobResult {
//   jobId: string;
//   status: "accepted" | "processing" | "complete" | "failed";
//   result?: string;
//   message?: string;
// }

// // Token addresses on Celo
// export const CELO_TOKENS = {
//   mainnet: {
//     cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
//     USDC: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
//   },
//   testnet: {
//     cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
//     USDC: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B",
//   },
// } as const;

// // ─────────────────────────────────────────
// // Step 1: Preflight — send job request
// // Expect 402 back with payment details
// // Falls back to metadata price if endpoint
// // doesn't implement x402 properly
// // ─────────────────────────────────────────
// export async function x402Preflight(
//   endpoint: string,
//   job: X402JobRequest
// ): Promise<X402PaymentRequired | null> {
//   try {
//     const res = await fetch(endpoint, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(job),
//     });

//     // Proper x402 response
//     if (res.status === 402) {
//       const data = await res.json();
//       return data as X402PaymentRequired;
//     }

//     // Agent accepted without payment (free tier)
//     if (res.ok) return null;

//     return null;
//   } catch {
//     return null;
//   }
// }

// // ─────────────────────────────────────────
// // Step 2: Retry with payment proof
// // Sends job + tx hash as payment proof
// // ─────────────────────────────────────────
// export async function x402Submit(
//   endpoint: string,
//   job: X402JobRequest,
//   payment: {
//     txHash: string;
//     tokenAddress: string;
//     amount: string;
//     jobId: string;
//   }
// ): Promise<X402JobResult> {
//   const res = await fetch(endpoint, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-Payment-Tx": payment.txHash,
//       "X-Payment-Token": payment.tokenAddress,
//       "X-Payment-Amount": payment.amount,
//       "X-Payment-Job-Id": payment.jobId,
//     },
//     body: JSON.stringify(job),
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err?.message ?? `Agent returned ${res.status}`);
//   }

//   return res.json();
// }

// // ─────────────────────────────────────────
// // Build default payment details when
// // agent doesn't implement x402 preflight
// // Uses agent wallet + default price
// // ─────────────────────────────────────────
// export function buildFallbackPayment(
//   agentWallet: string,
//   network: "mainnet" | "testnet",
//   token: "cUSD" | "USDC" = "cUSD",
//   amount = "0.01"
// ): X402PaymentRequired {
//   return {
//     jobId: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
//     amount,
//     token,
//     tokenAddress: CELO_TOKENS[network][token],
//     receivingWallet: agentWallet,
//   };
// }

// // ─────────────────────────────────────────
// // Format token amount for display
// // ─────────────────────────────────────────
// export function formatTokenAmount(amount: string, token: string): string {
//   const num = parseFloat(amount);
//   return `${num.toFixed(4).replace(/\.?0+$/, "")} ${token}`;
// }

// ─────────────────────────────────────────
// x402 Protocol Client
// Handles preflight, payment, and retry
// ─────────────────────────────────────────

export interface X402PaymentRequired {
  jobId: string;
  amount: string;        // e.g. "0.01"
  token: "cUSD" | "USDC";
  tokenAddress: string;  // ERC-20 contract address
  receivingWallet: string;
  description?: string;
  expiresAt?: string;
  source: "live" | "fallback" | "free"; // Added to track quote origin
}

export interface X402JobRequest {
  skill?: string;
  description: string;
  parameters?: Record<string, any>;
}

export interface X402JobResult {
  jobId: string;
  status: "accepted" | "processing" | "complete" | "failed";
  result?: string;
  message?: string;
}

// Token addresses on Celo
export const CELO_TOKENS = {
  mainnet: {
    cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    USDC: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
  },
  testnet: {
    cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
    USDC: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B",
  },
} as const;

// ─────────────────────────────────────────
// Step 1: Preflight — send job request
// Expect 402 back with payment details
// ─────────────────────────────────────────
export async function x402Preflight(
  endpoint: string,
  job: X402JobRequest
): Promise<X402PaymentRequired | null> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });

    // Proper x402 response from agent server
    if (res.status === 402) {
      const data = await res.json();
      return { ...data, source: "live" } as X402PaymentRequired;
    }

    // Agent accepted without payment (free tier)
    if (res.ok) return null;

    return null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────
// Step 2: Retry with payment proof
// Sends job + tx hash as payment proof
// ─────────────────────────────────────────
export async function x402Submit(
  endpoint: string,
  job: X402JobRequest,
  payment: {
    txHash: string;
    tokenAddress: string;
    amount: string;
    jobId: string;
  }
): Promise<X402JobResult> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Payment-Tx": payment.txHash,
      "X-Payment-Token": payment.tokenAddress,
      "X-Payment-Amount": payment.amount,
      "X-Payment-Job-Id": payment.jobId,
    },
    body: JSON.stringify(job),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Agent returned ${res.status}`);
  }

  return res.json();
}

// ─────────────────────────────────────────
// Build default payment details when
// agent doesn't implement x402 preflight
// ─────────────────────────────────────────
export function buildFallbackPayment(
  agentWallet: string,
  network: "mainnet" | "testnet",
  token: "cUSD" | "USDC" = "cUSD",
  amount = "0.01"
): X402PaymentRequired {
  return {
    jobId: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    amount,
    token,
    tokenAddress: CELO_TOKENS[network][token],
    receivingWallet: agentWallet,
    source: "fallback", // Clearly mark this as a fallback quote
  };
}

// ─────────────────────────────────────────
// Format token amount for display
// ─────────────────────────────────────────
export function formatTokenAmount(amount: string, token: string): string {
  const num = parseFloat(amount);
  return `${num.toFixed(4).replace(/\.?0+$/, "")} ${token}`;
}