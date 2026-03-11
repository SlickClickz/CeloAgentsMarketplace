// "use client";

// import { useAccount, useWriteContract, useSwitchChain, useReadContract } from "wagmi";
// import { parseUnits } from "viem";
// import { X402PaymentRequired, x402Submit, X402JobRequest, formatTokenAmount } from "@/lib/x402";

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

// export default function PayButton({
//   paymentDetails,
//   job,
//   agentEndpoint,
//   targetChainId,
//   onSuccess,
//   onError,
// }: {
//   paymentDetails: X402PaymentRequired;
//   job: X402JobRequest;
//   agentEndpoint: string | null;
//   targetChainId: number;
//   onSuccess: (txHash: string, result?: string) => void;
//   onError: (msg: string) => void;
// }) {
//   const { address, chain } = useAccount();
//   const { writeContractAsync, isPending } = useWriteContract();
//   const { switchChain, isPending: isSwitching } = useSwitchChain();

//   const isWrongChain = chain?.id !== targetChainId;

//   const { data: rawBalance } = useReadContract({
//     address: paymentDetails.tokenAddress as `0x${string}`,
//     abi: ERC20_ABI,
//     functionName: "balanceOf",
//     args: [address ?? "0x0000000000000000000000000000000000000000"],
//     query: { enabled: !!address },
//   });

//   const balance = rawBalance ? (Number(rawBalance as bigint) / 1_000_000).toFixed(2) : "—";
//   const requiredAmount = parseFloat(paymentDetails.amount);
//   const availableAmount = rawBalance ? Number(rawBalance as bigint) / 1_000_000 : 0;
//   const insufficientFunds = availableAmount < requiredAmount;

//   const handlePay = async () => {
//     if (!address) return;
//     try {
//       if (isWrongChain) {
//         await switchChain({ chainId: targetChainId });
//       }

//       const amountWei = parseUnits(paymentDetails.amount, 6);
//       const hash = await writeContractAsync({
//         address: paymentDetails.tokenAddress as `0x${string}`,
//         abi: ERC20_ABI,
//         functionName: "transfer",
//         args: [paymentDetails.receivingWallet as `0x${string}`, amountWei],
//         chainId: targetChainId,
//       });

//       let result: string | undefined;
//       if (agentEndpoint) {
//         try {
//           const res = await x402Submit(agentEndpoint, job, {
//             txHash: hash,
//             tokenAddress: paymentDetails.tokenAddress,
//             amount: paymentDetails.amount,
//             jobId: paymentDetails.jobId,
//           });
//           result = res.result;
//         } catch {
//           // async processing — not fatal
//         }
//       }

//       onSuccess(hash, result);
//     } catch (err: any) {
//       onError(err.shortMessage ?? err.message ?? "Payment failed");
//     }
//   };

//   // Switch Chain State
//   if (isWrongChain) {
//     return (
//       <button
//         onClick={() => switchChain({ chainId: targetChainId })}
//         disabled={isSwitching}
//         style={{
//           width: "100%",
//           padding: "1.25rem",
//           background: "rgba(255, 170, 0, 0.1)",
//           border: "1px solid #ffaa00",
//           borderRadius: "8px",
//           color: "#ffaa00",
//           fontFamily: "var(--font-mono)",
//           fontWeight: 700,
//           fontSize: "0.85rem",
//           cursor: "pointer",
//           transition: "all 0.2s",
//           letterSpacing: "0.05em"
//         }}
//         onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 170, 0, 0.2)")}
//         onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 170, 0, 0.1)")}
//       >
//         {isSwitching ? "SWITCHING NETWORK..." : "⚠ SWITCH TO CELO"}
//       </button>
//     );
//   }

//   return (
//     <div style={{ width: "100%" }}>
//       <div 
//         style={{ 
//           display: "flex", 
//           justifyContent: "space-between", 
//           fontSize: "0.7rem", 
//           fontFamily: "var(--font-mono)",
//           color: "var(--text-dim)", 
//           marginBottom: "0.75rem",
//           padding: "0 4px"
//         }}
//       >
//         <span>AVAILABLE BALANCE</span>
//         <span style={{ color: insufficientFunds ? "var(--red)" : "var(--text)" }}>
//           {balance} {paymentDetails.token}
//         </span>
//       </div>

//       <button
//         onClick={handlePay}
//         disabled={isPending || insufficientFunds}
//         style={{
//           width: "100%",
//           padding: "1.25rem",
//           background: insufficientFunds 
//             ? "rgba(255, 255, 255, 0.05)" 
//             : isPending 
//             ? "rgba(0, 255, 136, 0.2)" 
//             : "var(--green)",
//           border: "none",
//           borderRadius: "8px",
//           color: insufficientFunds ? "rgba(255,255,255,0.3)" : "#000",
//           fontFamily: "var(--font-mono)",
//           fontWeight: 800,
//           fontSize: "0.9rem",
//           cursor: isPending || insufficientFunds ? "not-allowed" : "pointer",
//           letterSpacing: "0.08em",
//           transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//           boxShadow: !insufficientFunds && !isPending ? "var(--green-glow)" : "none",
//         }}
//         onMouseEnter={(e) => {
//           if (!isPending && !insufficientFunds) {
//             e.currentTarget.style.transform = "translateY(-1px)";
//             e.currentTarget.style.filter = "brightness(1.1)";
//           }
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.transform = "translateY(0)";
//           e.currentTarget.style.filter = "brightness(1)";
//         }}
//       >
//         {isPending
//           ? "CONFIRMING TX..."
//           : insufficientFunds
//           ? `INSUFFICIENT FUNDS`
//           : `SEND PAYMENT →`}
//       </button>

//       {insufficientFunds && (
//         <p style={{ 
//           fontSize: "0.65rem", 
//           color: "var(--red)", 
//           textAlign: "center", 
//           marginTop: "0.75rem",
//           opacity: 0.8,
//           letterSpacing: "0.02em"
//         }}>
//           You need at least {paymentDetails.amount} {paymentDetails.token} to hire this agent.
//         </p>
//       )}
//     </div>
//   );
// }