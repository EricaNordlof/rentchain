"use client";

import { FormEvent, useState } from "react";
import { verifyOnChainHash, isBlockchainConfigured } from "@/lib/blockchain";
import { readRentals } from "@/lib/demo";

export function VerifyTool() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState<null | { verified: boolean; source: string }>(null);
  const [error, setError] = useState("");

  async function verify(event: FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);
    const normalized = hash.trim().toLowerCase();

    if (!/^0x[a-f0-9]{64}$/.test(normalized)) {
      setError("Enter a SHA-256 hash as 0x followed by 64 hexadecimal characters.");
      return;
    }

    try {
      if (isBlockchainConfigured()) {
        const verified = await verifyOnChainHash(normalized);
        setResult({ verified, source: "RentalRegistry smart contract" });
      } else {
        const verified = readRentals().some(
          (rental) => rental.bookingHash.toLowerCase() === normalized && Boolean(rental.transactionHash),
        );
        setResult({ verified, source: "local portfolio demo registry" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    }
  }

  return (
    <section className="panel verify-panel">
      <span className="eyebrow">Integrity check</span>
      <h1>Verify a booking proof</h1>
      <p className="lead-sm">
        Paste a booking hash to check whether the proof has been registered. A hash proves integrity without publishing customer details.
      </p>
      <form className="verify-form" onSubmit={verify}>
        <input
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          placeholder="0x…"
          aria-label="Booking hash"
        />
        <button className="button" type="submit">Verify proof</button>
      </form>
      {error ? <div className="message-box error-box">{error}</div> : null}
      {result ? (
        <div className={`verification-result ${result.verified ? "verified" : "not-verified"}`}>
          <strong>{result.verified ? "Verified" : "Not found"}</strong>
          <span>Checked against {result.source}.</span>
        </div>
      ) : null}
    </section>
  );
}
