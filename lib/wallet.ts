// ─────────────────────────────────────────
// Raw window.ethereum wallet client
// No dependencies — just browser APIs
// ─────────────────────────────────────────

export interface WalletState {
  address: string;
  chainId: number;
}

// Chain IDs
export const CELO_MAINNET = 42220;
export const CELO_SEPOLIA = 11142220;

// RPC URLs for chain switching
const CHAIN_PARAMS: Record<number, object> = {
  [CELO_MAINNET]: {
    chainId: "0xA4EC",
    chainName: "Celo Mainnet",
    nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
    rpcUrls: ["https://forno.celo.org"],
    blockExplorerUrls: ["https://celoscan.io"],
  },
  [CELO_SEPOLIA]: {
    chainId: "0xAA289C",
    chainName: "Celo Sepolia",
    nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
    rpcUrls: ["https://forno.celo-sepolia.celo-testnet.org"],
    blockExplorerUrls: ["https://celo-sepolia.blockscout.com"],
  },
};

function getEthereum(): any {
  if (typeof window === "undefined") return null;
  return (window as any).ethereum ?? null;
}

export function isWalletAvailable(): boolean {
  return !!getEthereum();
}

export async function connectWallet(): Promise<WalletState> {
  const eth = getEthereum();
  if (!eth) throw new Error("No wallet detected. Please install MetaMask or Rabby.");

  const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
  if (!accounts.length) throw new Error("No accounts returned.");

  const chainIdHex: string = await eth.request({ method: "eth_chainId" });
  const chainId = parseInt(chainIdHex, 16);

  return { address: accounts[0], chainId };
}

export async function switchToChain(targetChainId: number): Promise<void> {
  const eth = getEthereum();
  if (!eth) throw new Error("No wallet detected.");

  const targetHex = "0x" + targetChainId.toString(16);

  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetHex }],
    });
  } catch (err: any) {
    // Chain not added yet — add it
    if (err.code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [CHAIN_PARAMS[targetChainId]],
      });
    } else {
      throw err;
    }
  }
}

export async function getChainId(): Promise<number> {
  const eth = getEthereum();
  if (!eth) throw new Error("No wallet detected.");
  const hex: string = await eth.request({ method: "eth_chainId" });
  return parseInt(hex, 16);
}

// ERC-20 transfer via eth_sendTransaction
// amount is in human units e.g. "0.01"
// token uses 6 decimals (cUSD + USDC on Celo)
export async function sendERC20(
  tokenAddress: string,
  toAddress: string,
  amount: string,
  fromAddress: string
): Promise<string> {
  const eth = getEthereum();
  if (!eth) throw new Error("No wallet detected.");

  // Encode ERC-20 transfer(address,uint256)
  // Function selector: 0xa9059cbb
  const amountWei = BigInt(Math.round(parseFloat(amount) * 1_000_000));
  const paddedTo = toAddress.toLowerCase().replace("0x", "").padStart(64, "0");
  const paddedAmount = amountWei.toString(16).padStart(64, "0");
  const data = "0xa9059cbb" + paddedTo + paddedAmount;

  const txHash: string = await eth.request({
    method: "eth_sendTransaction",
    params: [{
      from: fromAddress,
      to: tokenAddress,
      data,
      gas: "0x186A0", // 100000 gas
    }],
  });

  return txHash;
}

// Wait for tx to be mined by polling
export async function waitForTx(
  txHash: string,
  timeoutMs = 60000
): Promise<void> {
  const eth = getEthereum();
  if (!eth) return;

  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const receipt = await eth.request({
      method: "eth_getTransactionReceipt",
      params: [txHash],
    });
    if (receipt?.blockNumber) return;
    await new Promise((r) => setTimeout(r, 2000));
  }
  // Timeout — tx likely still pending, not an error
}

export function onAccountChange(cb: (address: string) => void): () => void {
  const eth = getEthereum();
  if (!eth) return () => {};
  const handler = (accounts: string[]) => cb(accounts[0] ?? "");
  eth.on("accountsChanged", handler);
  return () => eth.removeListener("accountsChanged", handler);
}

export function onChainChange(cb: (chainId: number) => void): () => void {
  const eth = getEthereum();
  if (!eth) return () => {};
  const handler = (chainIdHex: string) => cb(parseInt(chainIdHex, 16));
  eth.on("chainChanged", handler);
  return () => eth.removeListener("chainChanged", handler);
}