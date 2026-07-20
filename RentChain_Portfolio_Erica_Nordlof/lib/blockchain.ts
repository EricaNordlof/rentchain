import { BrowserProvider, Contract, parseEther } from "ethers";

const ABI = [
  "function createRental(bytes32 bookingHash) payable returns (uint256)",
  "function verifyHash(bytes32 bookingHash) view returns (bool)",
  "function getRental(uint256 rentalId) view returns (tuple(uint256 id,address customer,bytes32 bookingHash,uint256 deposit,uint8 status,uint64 createdAt))",
];

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export function registryAddress() {
  return process.env.NEXT_PUBLIC_RENTAL_REGISTRY_ADDRESS?.trim() || "";
}

export function isBlockchainConfigured() {
  return Boolean(registryAddress());
}

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("No injected wallet found. Install MetaMask or another EIP-1193 wallet.");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer, address: await signer.getAddress() };
}

export async function createOnChainRental(bookingHash: string, depositEth = "0") {
  const address = registryAddress();
  if (!address) throw new Error("RentalRegistry contract address is not configured.");
  const { signer } = await connectWallet();
  const contract = new Contract(address, ABI, signer);
  const tx = await contract.createRental(bookingHash, {
    value: parseEther(depositEth || "0"),
  });
  const receipt = await tx.wait();
  return receipt.hash as string;
}

export async function verifyOnChainHash(bookingHash: string) {
  const address = registryAddress();
  if (!address) return false;
  const { provider } = await connectWallet();
  const contract = new Contract(address, ABI, provider);
  return Boolean(await contract.verifyHash(bookingHash));
}
