"use client";

import { useState } from "react";
import { connectWallet } from "@/lib/blockchain";

export function WalletButton() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  async function handleConnect() {
    try {
      setError("");
      const wallet = await connectWallet();
      setAddress(wallet.address);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect wallet");
    }
  }

  return (
    <div className="wallet-box">
      <button className="button button-secondary" onClick={handleConnect} type="button">
        {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Connect wallet"}
      </button>
      {error ? <p className="inline-error">{error}</p> : null}
    </div>
  );
}
