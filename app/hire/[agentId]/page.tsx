// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import { api, AgentProfile, Network } from "@/lib/api";
// import {
//   x402Preflight,
//   x402Submit,
//   buildFallbackPayment,
//   formatTokenAmount,
//   X402PaymentRequired,
//   X402JobRequest,
//   CELO_TOKENS,
// } from "@/lib/x402";
// import {
//   connectWallet,
//   switchToChain,
//   sendERC20,
//   waitForTx,
//   isWalletAvailable,
//   onAccountChange,
//   onChainChange,
//   getChainId,
//   CELO_MAINNET,
//   CELO_SEPOLIA,
//   WalletState,
// } from "@/lib/wallet";
// import Navbar from "@/components/Navbar";
// import CAMScoreBar from "@/components/CAMScoreBar";
// import { truncateAddress } from "@/lib/utils";

// type Step = "review" | "connect" | "configure" | "pay" | "success";
// type TokenChoice = "cUSD" | "USDC";

// const CHAIN_IDS = { mainnet: CELO_MAINNET, testnet: CELO_SEPOLIA };

// export default function HirePage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const agentId = params.agentId as string;
//   const [network, setNetwork] = useState<Network>(
//     (searchParams.get("network") as Network) ?? "mainnet"
//   );

//   // ── Wallet state (replaces useAccount/useConnect) ──
//   const [wallet, setWallet] = useState<WalletState | null>(null);
//   const [walletLoading, setWalletLoading] = useState(false);
//   const [walletError, setWalletError] = useState<string | null>(null);
//   const isConnected = !!wallet;
//   const address = wallet?.address;
//   const isWrongChain = wallet ? wallet.chainId !== CHAIN_IDS[network] : false;

//   const [agent, setAgent] = useState<AgentProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [step, setStep] = useState<Step>("review");

//   const [jobDescription, setJobDescription] = useState("");
//   const [selectedSkill, setSelectedSkill] = useState("");
//   const [selectedToken, setSelectedToken] = useState<TokenChoice>("cUSD");

//   const [paymentDetails, setPaymentDetails] = useState<X402PaymentRequired | null>(null);
//   const [preflightLoading, setPreflightLoading] = useState(false);
//   const [payError, setPayError] = useState<string | null>(null);
//   const [payStatus, setPayStatus] = useState<string>("");
//   const [isPayPending, setIsPayPending] = useState(false);
//   const [isSwitching, setIsSwitching] = useState(false);

//   const [txHash, setTxHash] = useState<string | null>(null);
//   const [jobResult, setJobResult] = useState<string | null>(null);

//   // ── Load agent ──
//   useEffect(() => {
//     api.agent
//       .get(agentId, network)
//       .then((a) => {
//         setAgent(a);
//         if (a.skills.length > 0) setSelectedSkill(a.skills[0].name);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [agentId, network]);

//   // ── Listen for wallet/chain changes ──
//   useEffect(() => {
//     const unsubAccount = onAccountChange((addr) => {
//       if (addr) setWallet((w) => w ? { ...w, address: addr } : null);
//       else setWallet(null);
//     });
//     const unsubChain = onChainChange((chainId) => {
//       setWallet((w) => w ? { ...w, chainId } : null);
//     });
//     return () => { unsubAccount(); unsubChain(); };
//   }, []);

//   // ── Connect wallet (replaces useConnect) ──
//   const handleConnect = useCallback(async () => {
//     if (!isWalletAvailable()) {
//       setWalletError("No wallet detected. Please install MetaMask or Rabby.");
//       return;
//     }
//     setWalletLoading(true);
//     setWalletError(null);
//     try {
//       const state = await connectWallet();
//       // Auto switch to correct chain
//       if (state.chainId !== CHAIN_IDS[network]) {
//         await switchToChain(CHAIN_IDS[network]);
//         const chainId = await getChainId();
//         setWallet({ ...state, chainId });
//       } else {
//         setWallet(state);
//       }
//       setStep("configure");
//     } catch (err: any) {
//       setWalletError(err.message ?? "Failed to connect wallet");
//     } finally {
//       setWalletLoading(false);
//     }
//   }, [network]);

//   // ── Switch chain (replaces useSwitchChain) ──
//   const handleSwitchChain = useCallback(async () => {
//     setIsSwitching(true);
//     try {
//       await switchToChain(CHAIN_IDS[network]);
//       const chainId = await getChainId();
//       setWallet((w) => w ? { ...w, chainId } : null);
//     } catch (err: any) {
//       setPayError(err.message);
//     } finally {
//       setIsSwitching(false);
//     }
//   }, [network]);

//   // ── Preflight ──
//   const runPreflight = useCallback(async () => {
//     if (!agent) return;
//     setPreflightLoading(true);
//     setPayError(null);

//     const job: X402JobRequest = {
//       skill: selectedSkill || undefined,
//       description: jobDescription,
//     };

//     try {
//       let details = agent.x402Endpoint
//         ? await x402Preflight(agent.x402Endpoint, job)
//         : null;

//       if (!details) {
//         details = buildFallbackPayment(agent.walletAddress, network, selectedToken, "0.01");
//       }

//       details.token = selectedToken;
//       details.tokenAddress = CELO_TOKENS[network][selectedToken];

//       setPaymentDetails(details);
//       setStep("pay");
//     } catch {
//       setPayError("Failed to fetch agent quote.");
//     } finally {
//       setPreflightLoading(false);
//     }
//   }, [agent, selectedSkill, jobDescription, selectedToken, network]);

//   // ── Execute payment (replaces useWriteContract) ──
//   const executePayment = async () => {
//     if (!address || !paymentDetails || !agent) return;
//     setPayError(null);
//     setIsPayPending(true);

//     try {
//       if (isWrongChain) {
//         setPayStatus("Switching network...");
//         await switchToChain(CHAIN_IDS[network]);
//       }

//       setPayStatus("Confirm in wallet...");
//       const hash = await sendERC20(
//         paymentDetails.tokenAddress,
//         paymentDetails.receivingWallet,
//         paymentDetails.amount,
//         address
//       );

//       setTxHash(hash);
//       setPayStatus("Confirming transaction...");
//       await waitForTx(hash);

//       setPayStatus("Submitting proof...");
//       if (agent.x402Endpoint) {
//         try {
//           const res = await x402Submit(
//             agent.x402Endpoint,
//             { skill: selectedSkill || undefined, description: jobDescription },
//             {
//               txHash: hash,
//               tokenAddress: paymentDetails.tokenAddress,
//               amount: paymentDetails.amount,
//               jobId: paymentDetails.jobId,
//             }
//           );
//           if (res.result) setJobResult(res.result);
//         } catch {
//           console.warn("x402 proof submission failed, but payment was sent.");
//         }
//       }

//       setStep("success");
//     } catch (err: any) {
//       setPayError(
//         err.code === 4001
//           ? "Transaction rejected."
//           : err.message ?? "Payment failed"
//       );
//     } finally {
//       setPayStatus("");
//       setIsPayPending(false);
//     }
//   };

//   const steps: Step[] = ["review", "connect", "configure", "pay", "success"];
//   const stepLabels = ["Review", "Wallet", "Configure", "Pay", "Done"];
//   const stepIndex = steps.indexOf(step);

//   const cardStyle: React.CSSProperties = {
//     padding: "1.5rem",
//     background: "var(--bg-card)",
//     border: "1px solid var(--border)",
//     borderRadius: "6px",
//     marginBottom: "1.5rem",
//   };

//   const primaryBtn = (disabled = false, color = "var(--green)"): React.CSSProperties => ({
//     width: "100%", padding: "1rem",
//     background: disabled ? "var(--border)" : color,
//     border: "none", borderRadius: "6px",
//     color: disabled ? "var(--text-dim)" : "#000",
//     fontFamily: "var(--font-mono)", fontWeight: 700,
//     fontSize: "0.85rem", cursor: disabled ? "not-allowed" : "pointer",
//   });

//   return (
//     <div style={{ minHeight: "100vh" }}>
//       <Navbar network={network} onNetworkChange={setNetwork} />

//       <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 2rem" }}>
//         <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", cursor: "pointer", marginBottom: "2rem" }}>← BACK</button>

//         <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", marginBottom: "2rem" }}>
//           {loading ? "Loading..." : `Hire ${agent?.name}`}
//         </h1>

//         {/* Step indicator */}
//         <div style={{ display: "flex", alignItems: "center", marginBottom: "2.5rem" }}>
//           {steps.slice(0, -1).map((s, i) => (
//             <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
//                 <div style={{
//                   width: 28, height: 28, borderRadius: "50%",
//                   border: `1px solid ${i <= stepIndex ? "var(--green)" : "var(--border)"}`,
//                   background: i < stepIndex ? "var(--green)" : "transparent",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontSize: "0.65rem",
//                   color: i < stepIndex ? "#000" : i === stepIndex ? "var(--green)" : "var(--text-dim)",
//                   fontWeight: 600,
//                 }}>
//                   {i < stepIndex ? "✓" : i + 1}
//                 </div>
//                 <div style={{ fontSize: "0.55rem", color: i <= stepIndex ? "var(--green)" : "var(--text-dim)" }}>
//                   {stepLabels[i]}
//                 </div>
//               </div>
//               {i < steps.length - 2 && (
//                 <div style={{ flex: 1, height: "1px", background: i < stepIndex ? "var(--green)" : "var(--border)", margin: "0 4px", marginBottom: "1.2rem" }} />
//               )}
//             </div>
//           ))}
//         </div>

//         {agent && (
//           <>
//             {/* ── Step 1: Review ── */}
//             {step === "review" && (
//               <div className="fade-up">
//                 <div style={cardStyle}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
//                     <div>
//                       <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>{agent.name}</div>
//                       <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{truncateAddress(agent.walletAddress)}</div>
//                     </div>
//                     <div style={{ width: "100px" }}>
//                       <CAMScoreBar total={agent.camScore.total} breakdown={agent.camScore.breakdown} size="sm" />
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setStep(isConnected ? "configure" : "connect")}
//                     style={primaryBtn()}
//                   >
//                     CONTINUE →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* ── Step 2: Connect ── */}
//             {step === "connect" && (
//               <div className="fade-up">
//                 <div style={cardStyle}>
//                   <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "1.5rem" }}>
//                     Connect your wallet to proceed with payment on Celo {network === "testnet" ? "Sepolia" : "Mainnet"}.
//                     Works with MetaMask, Rabby, or any injected wallet.
//                   </p>

//                   {!isWalletAvailable() ? (
//                     <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#ff5555" }}>
//                       No wallet detected.{" "}
//                       <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)" }}>
//                         Install MetaMask →
//                       </a>
//                     </div>
//                   ) : isConnected ? (
//                     <>
//                       <div style={{ color: "var(--green)", textAlign: "center", fontSize: "0.8rem", marginBottom: "1rem" }}>
//                         ✓ {truncateAddress(address!)} connected
//                       </div>
//                       <button onClick={() => setStep("configure")} style={primaryBtn()}>
//                         NEXT STEP →
//                       </button>
//                     </>
//                   ) : (
//                     <button onClick={handleConnect} disabled={walletLoading} style={primaryBtn(walletLoading)}>
//                       {walletLoading ? "CONNECTING..." : "👛 CONNECT WALLET"}
//                     </button>
//                   )}

//                   {walletError && (
//                     <div style={{ color: "#ff5555", fontSize: "0.7rem", marginTop: "1rem", textAlign: "center" }}>
//                       {walletError}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ── Step 3: Configure ── */}
//             {step === "configure" && (
//               <div className="fade-up">
//                 <div style={cardStyle}>
//                   {address && (
//                     <div style={{ fontSize: "0.65rem", color: "var(--green)", marginBottom: "1rem" }}>
//                       ✓ {truncateAddress(address)}
//                     </div>
//                   )}
//                   <textarea
//                     value={jobDescription}
//                     onChange={(e) => setJobDescription(e.target.value)}
//                     placeholder="Describe your task clearly for the agent..."
//                     rows={4}
//                     style={{
//                       width: "100%", padding: "0.85rem",
//                       background: "var(--bg)", border: "1px solid var(--border)",
//                       borderRadius: "4px", color: "#fff",
//                       marginBottom: "1rem", outline: "none",
//                       fontSize: "0.85rem", boxSizing: "border-box",
//                       fontFamily: "var(--font-mono)", resize: "vertical",
//                     }}
//                     onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
//                     onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
//                   />
//                   <button
//                     onClick={runPreflight}
//                     disabled={!jobDescription.trim() || preflightLoading}
//                     style={primaryBtn(!jobDescription.trim() || preflightLoading)}
//                   >
//                     {preflightLoading ? "CALCULATING..." : "GET QUOTE →"}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* ── Step 4: Pay ── */}
//             {step === "pay" && paymentDetails && (
//               <div className="fade-up">
//                 <div style={cardStyle}>
//                   <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
//                     <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
//                       <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--green)" }}>
//                         {paymentDetails.amount}
//                       </span>
//                       <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-dim)", marginTop: "0.8rem" }}>
//                         {paymentDetails.token}
//                       </span>
//                     </div>

//                     {/* Quote status badge */}
//                     <div style={{
//                       display: "inline-flex", alignItems: "center", gap: "6px",
//                       padding: "4px 10px", borderRadius: "100px",
//                       border: `1px solid ${(paymentDetails as any).source === "live" ? "rgba(0,255,136,0.2)" : "rgba(255,255,255,0.1)"}`,
//                       background: "rgba(0,0,0,0.2)",
//                     }}>
//                       <div style={{ width: 6, height: 6, borderRadius: "50%", background: (paymentDetails as any).source === "live" ? "var(--green)" : "#888" }} />
//                       <span style={{
//                         fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em",
//                         color: (paymentDetails as any).source === "live" ? "var(--green)" : "var(--text-dim)",
//                       }}>
//                         {(paymentDetails as any).source === "live" ? "LIVE VERIFIED QUOTE" : "ESTIMATED REGISTRY PRICE"}
//                       </span>
//                     </div>
//                   </div>

//                   {isWrongChain ? (
//                     <button
//                       onClick={handleSwitchChain}
//                       disabled={isSwitching}
//                       style={primaryBtn(isSwitching, "orange")}
//                     >
//                       {isSwitching ? "SWITCHING..." : `SWITCH TO CELO ${network === "testnet" ? "SEPOLIA" : "MAINNET"}`}
//                     </button>
//                   ) : (
//                     <button
//                       onClick={executePayment}
//                       disabled={isPayPending}
//                       style={primaryBtn(isPayPending)}
//                     >
//                       {isPayPending
//                         ? payStatus || "PROCESSING..."
//                         : `PAY & HIRE AGENT →`}
//                     </button>
//                   )}

//                   {payError && (
//                     <div style={{ color: "#ff5555", fontSize: "0.7rem", marginTop: "1rem", textAlign: "center" }}>
//                       ❌ {payError}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ── Step 5: Success ── */}
//             {step === "success" && (
//               <div className="fade-up" style={{ textAlign: "center" }}>
//                 <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
//                 <h2 style={{ color: "var(--green)", marginBottom: "1rem" }}>Payment Confirmed</h2>
//                 <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: "1.5" }}>
//                   Your request has been sent to {agent.name}.<br />
//                   Keep an eye on your dashboard for the agent's response.
//                 </p>
//                 {txHash && (
//                   <a
//                     href={network === "mainnet"
//                       ? `https://celoscan.io/tx/${txHash}`
//                       : `https://celo-sepolia.blockscout.com/tx/${txHash}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{ color: "var(--green)", fontSize: "0.7rem", marginTop: "1.5rem", display: "block", textDecoration: "underline" }}
//                   >
//                     View Transaction on Explorer ↗
//                   </a>
//                 )}
//                 <button
//                   onClick={() => router.push("/")}
//                   style={{ ...primaryBtn(), marginTop: "2rem", background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}
//                 >
//                   RETURN TO CAM
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { api, AgentProfile, Network } from "@/lib/api";
import {
  x402Preflight,
  x402Submit,
  buildFallbackPayment,
  formatTokenAmount,
  X402PaymentRequired,
  X402JobRequest,
  CELO_TOKENS,
} from "@/lib/x402";
import {
  connectWallet,
  switchToChain,
  sendERC20,
  waitForTx,
  isWalletAvailable,
  onAccountChange,
  onChainChange,
  getChainId,
  CELO_MAINNET,
  CELO_SEPOLIA,
  WalletState,
} from "@/lib/wallet";
import Navbar from "@/components/Navbar";
import CAMScoreBar from "@/components/CAMScoreBar";
import { truncateAddress } from "@/lib/utils";

type Step = "review" | "connect" | "configure" | "pay" | "success";
type TokenChoice = "cUSD" | "USDC";

const CHAIN_IDS = { mainnet: CELO_MAINNET, testnet: CELO_SEPOLIA };

export default function HirePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  const [network, setNetwork] = useState<Network>(
    (searchParams.get("network") as Network) ?? "mainnet"
  );

  const [isMobile, setIsMobile] = useState(false);
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const isConnected = !!wallet;
  const address = wallet?.address;
  const isWrongChain = wallet ? wallet.chainId !== CHAIN_IDS[network] : false;

  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("review");

  const [jobDescription, setJobDescription] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedToken, setSelectedToken] = useState<TokenChoice>("cUSD");

  const [paymentDetails, setPaymentDetails] = useState<X402PaymentRequired | null>(null);
  const [preflightLoading, setPreflightLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [payStatus, setPayStatus] = useState<string>("");
  const [isPayPending, setIsPayPending] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const [txHash, setTxHash] = useState<string | null>(null);
  const [jobResult, setJobResult] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    api.agent
      .get(agentId, network)
      .then((a) => {
        setAgent(a);
        if (a.skills.length > 0) setSelectedSkill(a.skills[0].name);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    return () => window.removeEventListener("resize", checkMobile);
  }, [agentId, network]);

  useEffect(() => {
    const unsubAccount = onAccountChange((addr) => {
      if (addr) setWallet((w) => w ? { ...w, address: addr } : null);
      else setWallet(null);
    });
    const unsubChain = onChainChange((chainId) => {
      setWallet((w) => w ? { ...w, chainId } : null);
    });
    return () => { unsubAccount(); unsubChain(); };
  }, []);

  const handleConnect = useCallback(async () => {
    if (!isWalletAvailable()) {
      setWalletError("No wallet detected. Please install MetaMask or Rabby.");
      return;
    }
    setWalletLoading(true);
    setWalletError(null);
    try {
      const state = await connectWallet();
      if (state.chainId !== CHAIN_IDS[network]) {
        await switchToChain(CHAIN_IDS[network]);
        const chainId = await getChainId();
        setWallet({ ...state, chainId });
      } else {
        setWallet(state);
      }
      setStep("configure");
    } catch (err: any) {
      setWalletError(err.message ?? "Failed to connect wallet");
    } finally {
      setWalletLoading(false);
    }
  }, [network]);

  const handleSwitchChain = useCallback(async () => {
    setIsSwitching(true);
    try {
      await switchToChain(CHAIN_IDS[network]);
      const chainId = await getChainId();
      setWallet((w) => w ? { ...w, chainId } : null);
    } catch (err: any) {
      setPayError(err.message);
    } finally {
      setIsSwitching(false);
    }
  }, [network]);

  const runPreflight = useCallback(async () => {
    if (!agent) return;
    setPreflightLoading(true);
    setPayError(null);

    const job: X402JobRequest = {
      skill: selectedSkill || undefined,
      description: jobDescription,
    };

    try {
      let details = agent.x402Endpoint
        ? await x402Preflight(agent.x402Endpoint, job)
        : null;

      if (!details) {
        details = buildFallbackPayment(agent.walletAddress, network, selectedToken, "0.01");
      }

      details.token = selectedToken;
      details.tokenAddress = CELO_TOKENS[network][selectedToken];

      setPaymentDetails(details);
      setStep("pay");
    } catch {
      setPayError("Failed to fetch agent quote.");
    } finally {
      setPreflightLoading(false);
    }
  }, [agent, selectedSkill, jobDescription, selectedToken, network]);

  const executePayment = async () => {
    if (!address || !paymentDetails || !agent) return;
    setPayError(null);
    setIsPayPending(true);

    try {
      if (isWrongChain) {
        setPayStatus("Switching network...");
        await switchToChain(CHAIN_IDS[network]);
      }

      setPayStatus("Confirm in wallet...");
      const hash = await sendERC20(
        paymentDetails.tokenAddress,
        paymentDetails.receivingWallet,
        paymentDetails.amount,
        address
      );

      setTxHash(hash);
      setPayStatus("Confirming transaction...");
      await waitForTx(hash);

      setPayStatus("Submitting proof...");
      if (agent.x402Endpoint) {
        try {
          const res = await x402Submit(
            agent.x402Endpoint,
            { skill: selectedSkill || undefined, description: jobDescription },
            {
              txHash: hash,
              tokenAddress: paymentDetails.tokenAddress,
              amount: paymentDetails.amount,
              jobId: paymentDetails.jobId,
            }
          );
          if (res.result) setJobResult(res.result);
        } catch {
          console.warn("x402 proof submission failed, but payment was sent.");
        }
      }

      setStep("success");
    } catch (err: any) {
      setPayError(
        err.code === 4001
          ? "Transaction rejected."
          : err.message ?? "Payment failed"
      );
    } finally {
      setPayStatus("");
      setIsPayPending(false);
    }
  };

  const steps: Step[] = ["review", "connect", "configure", "pay", "success"];
  const stepLabels = ["Review", "Wallet", "Config", "Pay", "Done"];
  const stepIndex = steps.indexOf(step);

  const cardStyle: React.CSSProperties = {
    padding: isMobile ? "1.25rem" : "1.5rem",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    marginBottom: "1.5rem",
  };

  const primaryBtn = (disabled = false, color = "var(--green)"): React.CSSProperties => ({
    width: "100%", 
    padding: "1.1rem",
    background: disabled ? "var(--border)" : color,
    border: "none", 
    borderRadius: "6px",
    color: disabled ? "var(--text-dim)" : "#000",
    fontFamily: "var(--font-mono)", 
    fontWeight: 700,
    fontSize: "0.85rem", 
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "transform 0.1s active",
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <Navbar network={network} onNetworkChange={setNetwork} />

      <div style={{ 
        maxWidth: "600px", 
        margin: "0 auto", 
        padding: isMobile ? "2rem 1rem" : "3rem 2rem",
        boxSizing: "border-box" 
      }}>
        <button 
          onClick={() => router.back()} 
          style={{ 
            background: "none", 
            border: "none", 
            color: "var(--text-dim)", 
            fontFamily: "var(--font-mono)", 
            fontSize: "0.7rem", 
            cursor: "pointer", 
            marginBottom: "2rem",
            padding: 0
          }}
        >
          ← BACK
        </button>

        <h1 style={{ 
          fontFamily: "var(--font-display)", 
          fontWeight: 800, 
          fontSize: isMobile ? "1.75rem" : "2.25rem", 
          marginBottom: "2rem",
          letterSpacing: "-0.02em"
        }}>
          {loading ? "Initializing..." : `Hire ${agent?.name}`}
        </h1>

        {/* Step indicator */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          marginBottom: "2.5rem",
          justifyContent: "space-between" 
        }}>
          {steps.slice(0, -1).map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 2 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                <div style={{
                  width: isMobile ? 24 : 30, 
                  height: isMobile ? 24 : 30, 
                  borderRadius: "50%",
                  border: `1px solid ${i <= stepIndex ? "var(--green)" : "var(--border)"}`,
                  background: i < stepIndex ? "var(--green)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem",
                  color: i < stepIndex ? "#000" : i === stepIndex ? "var(--green)" : "var(--text-dim)",
                  fontWeight: 700,
                }}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <div style={{ 
                  fontSize: isMobile ? "0.45rem" : "0.55rem", 
                  fontWeight: 600,
                  color: i <= stepIndex ? "var(--green)" : "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  {stepLabels[i]}
                </div>
              </div>
              {i < steps.length - 2 && (
                <div style={{ 
                  flex: 1, 
                  height: "1px", 
                  background: i < stepIndex ? "var(--green)" : "var(--border)", 
                  margin: isMobile ? "0 8px" : "0 12px", 
                  marginBottom: "1.2rem" 
                }} />
              )}
            </div>
          ))}
        </div>

        {agent && (
          <>
            {/* Step 1: Review */}
            {step === "review" && (
              <div className="fade-up">
                <div style={cardStyle}>
                  <div style={{ 
                    display: "flex", 
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between", 
                    alignItems: isMobile ? "flex-start" : "center",
                    marginBottom: "2rem",
                    gap: "1.5rem"
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--text)" }}>{agent.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>
                        {truncateAddress(agent.walletAddress)}
                      </div>
                    </div>
                    <div style={{ width: isMobile ? "100%" : "120px" }}>
                      <div style={{ fontSize: "0.6rem", color: "var(--text-dim)", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>REP_SCORE</div>
                      <CAMScoreBar total={agent.camScore.total} breakdown={agent.camScore.breakdown} size="sm" />
                    </div>
                  </div>
                  <button onClick={() => setStep(isConnected ? "configure" : "connect")} style={primaryBtn()}>
                    CONTINUE →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Connect */}
            {step === "connect" && (
              <div className="fade-up">
                <div style={cardStyle}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                    Connect your wallet to authorize the transaction on Celo {network === "testnet" ? "Sepolia" : "Mainnet"}.
                  </p>

                  {!isWalletAvailable() ? (
                    <div style={{ textAlign: "center", padding: "1rem", background: "rgba(255,85,85,0.05)", borderRadius: "4px" }}>
                      <div style={{ fontSize: "0.8rem", color: "#ff5555", marginBottom: "0.5rem" }}>No wallet detected.</div>
                      <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)", fontSize: "0.75rem", fontWeight: 700 }}>
                        GET METAMASK ↗
                      </a>
                    </div>
                  ) : isConnected ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: "var(--green)", fontSize: "0.85rem", marginBottom: "1.5rem", fontFamily: "var(--font-mono)" }}>
                        [CONNECTED: {truncateAddress(address!)}]
                      </div>
                      <button onClick={() => setStep("configure")} style={primaryBtn()}>
                        NEXT STEP →
                      </button>
                    </div>
                  ) : (
                    <button onClick={handleConnect} disabled={walletLoading} style={primaryBtn(walletLoading)}>
                      {walletLoading ? "AUTHORIZING..." : "👛 CONNECT WALLET"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Configure */}
            {step === "configure" && (
              <div className="fade-up">
                <div style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <label style={{ fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.1em" }}>TASK_SPECIFICATION</label>
                    {address && <span style={{ fontSize: "0.6rem", color: "var(--green)", fontFamily: "var(--font-mono)" }}>{truncateAddress(address)}</span>}
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Provide detailed instructions for the agent..."
                    rows={6}
                    style={{
                      width: "100%", padding: "1rem",
                      background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)",
                      borderRadius: "4px", color: "#fff",
                      marginBottom: "1.5rem", outline: "none",
                      fontSize: "0.9rem", boxSizing: "border-box",
                      fontFamily: "var(--font-mono)", resize: "none",
                    }}
                  />
                  <button
                    onClick={runPreflight}
                    disabled={!jobDescription.trim() || preflightLoading}
                    style={primaryBtn(!jobDescription.trim() || preflightLoading)}
                  >
                    {preflightLoading ? "GEN_QUOTE..." : "GET QUOTE →"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Pay */}
            {step === "pay" && paymentDetails && (
              <div className="fade-up">
                <div style={cardStyle}>
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: isMobile ? "2.5rem" : "3.5rem", fontWeight: 900, color: "var(--green)", letterSpacing: "-0.05em" }}>
                        {paymentDetails.amount}
                      </span>
                      <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-dim)" }}>
                        {paymentDetails.token}
                      </span>
                    </div>

                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "8px",
                      padding: "6px 12px", borderRadius: "4px",
                      border: "1px solid rgba(255,255,255,0.05)",
                      background: "rgba(0,0,0,0.3)",
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: (paymentDetails as any).source === "live" ? "var(--green)" : "#555" }} />
                      <span style={{
                        fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em",
                        color: (paymentDetails as any).source === "live" ? "var(--green)" : "var(--text-dim)",
                      }}>
                        {(paymentDetails as any).source === "live" ? "VERIFIED_AGENT_QUOTE" : "FALLBACK_REGISTRY_PRICE"}
                      </span>
                    </div>
                  </div>

                  {isWrongChain ? (
                    <button onClick={handleSwitchChain} disabled={isSwitching} style={primaryBtn(isSwitching, "#ff8800")}>
                      {isSwitching ? "SWITCHING..." : `SWITCH TO CELO ${network.toUpperCase()}`}
                    </button>
                  ) : (
                    <button onClick={executePayment} disabled={isPayPending} style={primaryBtn(isPayPending)}>
                      {isPayPending ? payStatus || "SIGNING..." : `EXECUTE PAYMENT →`}
                    </button>
                  )}

                  {payError && <div style={{ color: "#ff5555", fontSize: "0.75rem", marginTop: "1rem", textAlign: "center", fontFamily: "var(--font-mono)" }}>!! {payError}</div>}
                </div>
              </div>
            )}

            {/* Step 5: Success */}
            {step === "success" && (
              <div className="fade-up" style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>⚡</div>
                <h2 style={{ color: "var(--green)", fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>DEPLOYMENT_SUCCESS</h2>
                <p style={{ fontSize: "0.9rem", color: "var(--text-dim)", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 2.5rem" }}>
                  The job has been broadcast to {agent.name}. You can track the execution status in your agent console.
                </p>
                
                {txHash && (
                  <a
                    href={network === "mainnet" ? `https://celoscan.io/tx/${txHash}` : `https://celo-sepolia.blockscout.com/tx/${txHash}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ color: "var(--green)", fontSize: "0.7rem", fontFamily: "var(--font-mono)", textDecoration: "none", borderBottom: "1px solid var(--green)", paddingBottom: "2px" }}
                  >
                    VIEW_ON_EXPLORER_↗
                  </a>
                )}

                <button
                  onClick={() => router.push("/")}
                  style={{ ...primaryBtn(), marginTop: "3rem", background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  RETURN TO TERMINAL
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}