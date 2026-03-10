// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import { useAccount, useWriteContract, useSwitchChain, useReadContract } from "wagmi";
// import { parseUnits } from "viem";
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
// import Navbar from "@/components/Navbar";
// import CAMScoreBar from "@/components/CAMScoreBar";
// import { truncateAddress } from "@/lib/utils";

// const ERC20_ABI = [
//   {
//     name: "transfer",
//     type: "function",
//     inputs: [
//       { name: "to", type: "address" },
//       { name: "amount", type: "uint256" },
//     ],
//     outputs: [{ name: "", type: "bool" }],
//     stateMutability: "nonpayable",
//   },
//   {
//     name: "balanceOf",
//     type: "function",
//     inputs: [{ name: "account", type: "address" }],
//     outputs: [{ name: "", type: "uint256" }],
//     stateMutability: "view",
//   },
// ] as const;

// type Step = "review" | "connect" | "configure" | "pay" | "success";
// type TokenChoice = "cUSD" | "USDC";

// const CHAIN_IDS = { mainnet: 42220, testnet: 44787 };

// export default function HirePage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const agentId = params.agentId as string;
//   const [network, setNetwork] = useState<Network>(
//     (searchParams.get("network") as Network) ?? "mainnet"
//   );

//   // Wagmi Hooks
//   const { address, isConnected, chain } = useAccount();
//   const { writeContractAsync, isPending: isPayPending } = useWriteContract();
//   const { switchChain, isPending: isSwitching } = useSwitchChain();

//   const [agent, setAgent] = useState<AgentProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [step, setStep] = useState<Step>("review");

//   // Job config
//   const [jobDescription, setJobDescription] = useState("");
//   const [selectedSkill, setSelectedSkill] = useState("");
//   const [selectedToken, setSelectedToken] = useState<TokenChoice>("cUSD");

//   // x402 state
//   const [paymentDetails, setPaymentDetails] = useState<X402PaymentRequired | null>(null);
//   const [preflightLoading, setPreflightLoading] = useState(false);
//   const [payError, setPayError] = useState<string | null>(null);
//   const [payStatus, setPayStatus] = useState<string>("");

//   // Result
//   const [txHash, setTxHash] = useState<string | null>(null);
//   const [jobResult, setJobResult] = useState<string | null>(null);

//   const targetChainId = CHAIN_IDS[network];
//   const isWrongChain = chain?.id !== targetChainId;

//   // Read balance for UI feedback
//   const { data: rawBalance } = useReadContract({
//     address: paymentDetails?.tokenAddress as `0x${string}`,
//     abi: ERC20_ABI,
//     functionName: "balanceOf",
//     args: [address ?? "0x0000000000000000000000000000000000000000"],
//     query: { enabled: !!address && !!paymentDetails },
//   });

//   const balance = rawBalance ? (Number(rawBalance) / 1_000_000).toFixed(2) : "—";

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
//     } catch (err) {
//       setPayError("Failed to fetch agent quote.");
//     } finally {
//       setPreflightLoading(false);
//     }
//   }, [agent, selectedSkill, jobDescription, selectedToken, network]);

//   const executePayment = async () => {
//     if (!address || !paymentDetails || !agent) return;
//     setPayError(null);
//     setPayStatus("Initiating wallet...");

//     try {
//       if (isWrongChain) {
//         setPayStatus("Switching network...");
//         await switchChain({ chainId: targetChainId });
//       }

//       const amountWei = parseUnits(paymentDetails.amount, 6);
      
//       setPayStatus("Confirm in wallet...");
//       const hash = await writeContractAsync({
//         address: paymentDetails.tokenAddress as `0x${string}`,
//         abi: ERC20_ABI,
//         functionName: "transfer",
//         args: [paymentDetails.receivingWallet as `0x${string}`, amountWei],
//       });

//       setTxHash(hash);
//       setPayStatus("Submitting proof to agent...");

//       if (agent.x402Endpoint) {
//         try {
//           const res = await x402Submit(agent.x402Endpoint, {
//             skill: selectedSkill || undefined,
//             description: jobDescription
//           }, {
//             txHash: hash,
//             tokenAddress: paymentDetails.tokenAddress,
//             amount: paymentDetails.amount,
//             jobId: paymentDetails.jobId,
//           });
//           if (res.result) setJobResult(res.result);
//         } catch (e) {
//           // Non-fatal if submission fails but TX is mined
//         }
//       }

//       setStep("success");
//     } catch (err: any) {
//       setPayError(err.shortMessage ?? err.message ?? "Payment failed");
//     } finally {
//       setPayStatus("");
//     }
//   };

//   const steps: Step[] = ["review", "connect", "configure", "pay", "success"];
//   const stepLabels = ["Review", "Wallet", "Configure", "Pay", "Done"];
//   const stepIndex = steps.indexOf(step);

//   // Styles
//   const cardStyle: React.CSSProperties = { padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", marginBottom: "1.5rem" };
//   const primaryBtn = (disabled = false, color = "var(--green)"): React.CSSProperties => ({
//     width: "100%", padding: "1rem", background: disabled ? "var(--border)" : color, border: "none", borderRadius: "6px",
//     color: disabled ? "var(--text-dim)" : "#000", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.85rem", cursor: disabled ? "not-allowed" : "pointer",
//   });
//   const rowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid var(--border)", fontSize: "0.7rem" };

//   return (
//     <div style={{ minHeight: "100vh" }}>
//       <Navbar network={network} onNetworkChange={setNetwork} />

//       <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 2rem" }}>
//         <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", cursor: "pointer", marginBottom: "2rem" }}>← BACK</button>

//         <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", marginBottom: "2rem" }}>
//           {loading ? "Loading..." : `Hire ${agent?.name}`}
//         </h1>

//         {/* Step Indicator */}
//         <div style={{ display: "flex", alignItems: "center", marginBottom: "2.5rem" }}>
//           {steps.slice(0, -1).map((s, i) => (
//             <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
//                 <div style={{
//                   width: 28, height: 28, borderRadius: "50%", border: `1px solid ${i <= stepIndex ? "var(--green)" : "var(--border)"}`,
//                   background: i < stepIndex ? "var(--green)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
//                   fontSize: "0.65rem", color: i < stepIndex ? "#000" : i === stepIndex ? "var(--green)" : "var(--text-dim)", fontWeight: 600,
//                 }}>
//                   {i < stepIndex ? "✓" : i + 1}
//                 </div>
//                 <div style={{ fontSize: "0.55rem", color: i <= stepIndex ? "var(--green)" : "var(--text-dim)" }}>{stepLabels[i]}</div>
//               </div>
//               {i < steps.length - 2 && <div style={{ flex: 1, height: "1px", background: i < stepIndex ? "var(--green)" : "var(--border)", margin: "0 4px", marginBottom: "1.2rem" }} />}
//             </div>
//           ))}
//         </div>

//         {agent && (
//           <>
//             {step === "review" && (
//               <div className="fade-up">
//                 <div style={cardStyle}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
//                     <div>
//                       <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>{agent.name}</div>
//                       <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{truncateAddress(agent.walletAddress)}</div>
//                     </div>
//                     <div style={{ width: "100px" }}><CAMScoreBar total={agent.camScore.total} breakdown={agent.camScore.breakdown} size="sm" /></div>
//                   </div>
//                   <button onClick={() => setStep(isConnected ? "configure" : "connect")} style={primaryBtn()}>CONTINUE →</button>
//                 </div>
//               </div>
//             )}

//             {step === "connect" && (
//               <div className="fade-up">
//                 <div style={cardStyle}>
//                   <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "1.5rem" }}>Connect your wallet to proceed with payment on Celo {network}.</p>
//                   <div style={{ color: "var(--green)", textAlign: "center", fontSize: "0.8rem" }}>
//                     {isConnected ? "✓ Wallet Connected" : "Please use the connect button in the header"}
//                   </div>
//                   {isConnected && <button onClick={() => setStep("configure")} style={{ ...primaryBtn(), marginTop: "1rem" }}>NEXT STEP</button>}
//                 </div>
//               </div>
//             )}

//             {step === "configure" && (
//               <div className="fade-up">
//                 <div style={cardStyle}>
//                   <textarea
//                     value={jobDescription}
//                     onChange={(e) => setJobDescription(e.target.value)}
//                     placeholder="Describe your task..."
//                     rows={4}
//                     style={{ width: "100%", padding: "0.85rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "4px", color: "#fff", marginBottom: "1rem" }}
//                   />
//                   <button onClick={runPreflight} disabled={!jobDescription.trim() || preflightLoading} style={primaryBtn(preflightLoading)}>
//                     {preflightLoading ? "CALCULATING..." : "GET QUOTE →"}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {step === "pay" && paymentDetails && (
//               <div className="fade-up">
//                 <div style={cardStyle}>
//                   <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
//                     <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--green)" }}>{paymentDetails.amount} {paymentDetails.token}</div>
//                     <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Balance: {balance}</div>
//                   </div>

//                   {isWrongChain ? (
//                     <button onClick={() => switchChain({ chainId: targetChainId })} disabled={isSwitching} style={primaryBtn(isSwitching, "orange")}>
//                       {isSwitching ? "SWITCHING..." : "SWITCH TO CORRECT NETWORK"}
//                     </button>
//                   ) : (
//                     <button onClick={executePayment} disabled={isPayPending} style={primaryBtn(isPayPending)}>
//                       {isPayPending ? "WAITING FOR WALLET..." : payStatus || `PAY ${paymentDetails.token} →`}
//                     </button>
//                   )}
//                   {payError && <div style={{ color: "#ff5555", fontSize: "0.7rem", marginTop: "1rem", textAlign: "center" }}>{payError}</div>}
//                 </div>
//               </div>
//             )}

//             {step === "success" && (
//               <div className="fade-up" style={{ textAlign: "center" }}>
//                 <h2 style={{ color: "var(--green)", marginBottom: "1rem" }}>Success!</h2>
//                 <p style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Transaction confirmed. Agent is processing your request.</p>
//                 {txHash && <a href={`https://celoscan.io/tx/${txHash}`} target="_blank" style={{ color: "var(--green)", fontSize: "0.7rem", marginTop: "1rem", display: "block" }}>View on Explorer</a>}
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
import { useAccount, useWriteContract, useSwitchChain, useReadContract } from "wagmi";
import { parseUnits } from "viem";
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
import Navbar from "@/components/Navbar";
import CAMScoreBar from "@/components/CAMScoreBar";
import { truncateAddress } from "@/lib/utils";

const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

type Step = "review" | "connect" | "configure" | "pay" | "success";
type TokenChoice = "cUSD" | "USDC";

const CHAIN_IDS = { mainnet: 42220, testnet: 44787 };

export default function HirePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  const [network, setNetwork] = useState<Network>(
    (searchParams.get("network") as Network) ?? "mainnet"
  );

  const { address, isConnected, chain } = useAccount();
  const { writeContractAsync, isPending: isPayPending } = useWriteContract();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

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

  const [txHash, setTxHash] = useState<string | null>(null);
  const [jobResult, setJobResult] = useState<string | null>(null);

  const targetChainId = CHAIN_IDS[network];
  const isWrongChain = chain?.id !== targetChainId;

  const { data: rawBalance } = useReadContract({
    address: paymentDetails?.tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address && !!paymentDetails },
  });

  const balance = rawBalance ? (Number(rawBalance) / 1e18).toFixed(2) : "—";

  useEffect(() => {
    api.agent
      .get(agentId, network)
      .then((a) => {
        setAgent(a);
        if (a.skills.length > 0) setSelectedSkill(a.skills[0].name);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [agentId, network]);

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
        // Updated: Clearly use Registry Price when endpoint fails/is missing
        details = buildFallbackPayment(agent.walletAddress, network, selectedToken, "0.01");
      }

      details.token = selectedToken;
      details.tokenAddress = CELO_TOKENS[network][selectedToken];

      setPaymentDetails(details);
      setStep("pay");
    } catch (err) {
      setPayError("Failed to fetch agent quote.");
    } finally {
      setPreflightLoading(false);
    }
  }, [agent, selectedSkill, jobDescription, selectedToken, network]);

  const executePayment = async () => {
    if (!address || !paymentDetails || !agent) return;
    setPayError(null);
    setPayStatus("Initiating wallet...");

    try {
      if (isWrongChain) {
        setPayStatus("Switching network...");
        await switchChain({ chainId: targetChainId });
      }

      // Celo cUSD/USDC are 18 decimals
      const amountWei = parseUnits(paymentDetails.amount, 18);
      
      setPayStatus("Confirm in wallet...");
      const hash = await writeContractAsync({
        address: paymentDetails.tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [paymentDetails.receivingWallet as `0x${string}`, amountWei],
      });

      setTxHash(hash);
      setPayStatus("Submitting proof...");

      if (agent.x402Endpoint) {
        try {
          const res = await x402Submit(agent.x402Endpoint, {
            skill: selectedSkill || undefined,
            description: jobDescription
          }, {
            txHash: hash,
            tokenAddress: paymentDetails.tokenAddress,
            amount: paymentDetails.amount,
            jobId: paymentDetails.jobId,
          });
          if (res.result) setJobResult(res.result);
        } catch (e) {
          console.warn("x402 proof submission failed, but payment was sent.");
        }
      }

      setStep("success");
    } catch (err: any) {
      setPayError(err.shortMessage ?? err.message ?? "Payment failed");
    } finally {
      setPayStatus("");
    }
  };

  const steps: Step[] = ["review", "connect", "configure", "pay", "success"];
  const stepLabels = ["Review", "Wallet", "Configure", "Pay", "Done"];
  const stepIndex = steps.indexOf(step);

  const cardStyle: React.CSSProperties = { padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", marginBottom: "1.5rem" };
  const primaryBtn = (disabled = false, color = "var(--green)"): React.CSSProperties => ({
    width: "100%", padding: "1rem", background: disabled ? "var(--border)" : color, border: "none", borderRadius: "6px",
    color: disabled ? "var(--text-dim)" : "#000", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.85rem", cursor: disabled ? "not-allowed" : "pointer",
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar network={network} onNetworkChange={setNetwork} />

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 2rem" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", cursor: "pointer", marginBottom: "2rem" }}>← BACK</button>

        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", marginBottom: "2rem" }}>
          {loading ? "Loading..." : `Hire ${agent?.name}`}
        </h1>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "2.5rem" }}>
          {steps.slice(0, -1).map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", border: `1px solid ${i <= stepIndex ? "var(--green)" : "var(--border)"}`,
                  background: i < stepIndex ? "var(--green)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", color: i < stepIndex ? "#000" : i === stepIndex ? "var(--green)" : "var(--text-dim)", fontWeight: 600,
                }}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <div style={{ fontSize: "0.55rem", color: i <= stepIndex ? "var(--green)" : "var(--text-dim)" }}>{stepLabels[i]}</div>
              </div>
              {i < steps.length - 2 && <div style={{ flex: 1, height: "1px", background: i < stepIndex ? "var(--green)" : "var(--border)", margin: "0 4px", marginBottom: "1.2rem" }} />}
            </div>
          ))}
        </div>

        {agent && (
          <>
            {step === "review" && (
              <div className="fade-up">
                <div style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>{agent.name}</div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{truncateAddress(agent.walletAddress)}</div>
                    </div>
                    <div style={{ width: "100px" }}><CAMScoreBar total={agent.camScore.total} breakdown={agent.camScore.breakdown} size="sm" /></div>
                  </div>
                  <button onClick={() => setStep(isConnected ? "configure" : "connect")} style={primaryBtn()}>CONTINUE →</button>
                </div>
              </div>
            )}

            {step === "connect" && (
              <div className="fade-up">
                <div style={cardStyle}>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "1.5rem" }}>Connect your wallet to proceed with payment on Celo {network}.</p>
                  <div style={{ color: "var(--green)", textAlign: "center", fontSize: "0.8rem" }}>
                    {isConnected ? "✓ Wallet Connected" : "Please use the connect button in the header"}
                  </div>
                  {isConnected && <button onClick={() => setStep("configure")} style={{ ...primaryBtn(), marginTop: "1rem" }}>NEXT STEP</button>}
                </div>
              </div>
            )}

            {step === "configure" && (
              <div className="fade-up">
                <div style={cardStyle}>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Describe your task clearly for the agent..."
                    rows={4}
                    style={{ width: "100%", padding: "0.85rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "4px", color: "#fff", marginBottom: "1rem", outline: "none", fontSize: "0.85rem" }}
                  />
                  <button onClick={runPreflight} disabled={!jobDescription.trim() || preflightLoading} style={primaryBtn(preflightLoading)}>
                    {preflightLoading ? "CALCULATING..." : "GET QUOTE →"}
                  </button>
                </div>
              </div>
            )}

            {step === "pay" && paymentDetails && (
              <div className="fade-up">
                <div style={cardStyle}>
                  <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--green)" }}>{paymentDetails.amount}</span>
                      <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-dim)", marginTop: "0.8rem" }}>{paymentDetails.token}</span>
                    </div>
                    
                    {/* Visual Quote Status Badge */}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "100px", border: `1px solid ${paymentDetails.source === "live" ? "rgba(0, 255, 136, 0.2)" : "rgba(255,255,255,0.1)"}`, background: "rgba(0,0,0,0.2)" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: paymentDetails.source === "live" ? "var(--green)" : "#888" }} />
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: paymentDetails.source === "live" ? "var(--green)" : "var(--text-dim)", letterSpacing: "0.05em" }}>
                        {paymentDetails.source === "live" ? "LIVE VERIFIED QUOTE" : "ESTIMATED REGISTRY PRICE"}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", marginTop: "1rem" }}>Your Balance: {balance} {paymentDetails.token}</div>
                  </div>

                  {isWrongChain ? (
                    <button onClick={() => switchChain({ chainId: targetChainId })} disabled={isSwitching} style={primaryBtn(isSwitching, "orange")}>
                      {isSwitching ? "SWITCHING..." : "SWITCH TO CORRECT NETWORK"}
                    </button>
                  ) : (
                    <button onClick={executePayment} disabled={isPayPending} style={primaryBtn(isPayPending)}>
                      {isPayPending ? "WAITING FOR WALLET..." : payStatus || `PAY & HIRE AGENT →`}
                    </button>
                  )}
                  {payError && <div style={{ color: "#ff5555", fontSize: "0.7rem", marginTop: "1rem", textAlign: "center" }}>{payError}</div>}
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="fade-up" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
                <h2 style={{ color: "var(--green)", marginBottom: "1rem" }}>Payment Confirmed</h2>
                <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: "1.5" }}>
                  Your request has been sent to {agent.name}. <br />
                  Keep an eye on your dashboard for the agent's response.
                </p>
                {txHash && (
                  <a 
                    href={network === "mainnet" ? `https://celoscan.io/tx/${txHash}` : `https://celo-sepolia.blockscout.com/tx/${txHash}`} 
                    target="_blank" 
                    style={{ color: "var(--green)", fontSize: "0.7rem", marginTop: "1.5rem", display: "block", textDecoration: "underline" }}
                  >
                    View Transaction on Explorer
                  </a>
                )}
                <button 
                  onClick={() => router.push("/")} 
                  style={{ ...primaryBtn(), marginTop: "2rem", background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  RETURN TO CAM
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}