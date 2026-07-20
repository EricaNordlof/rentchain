const layers = [
  ["Client", "Next.js / React / TypeScript", "Booking UI, wallet connection and proof verification."],
  ["Application", "API routes + validation", "Canonicalizes data and produces deterministic SHA-256 proofs."],
  ["Data", "Off-chain operational store", "Personal data and booking details stay outside the blockchain."],
  ["Trust", "Solidity RentalRegistry", "Stores unique hashes, lifecycle state and optional escrow deposit."],
  ["Quality", "Hardhat + CI + Docker", "Automated contract tests and reproducible development workflow."],
];

export default function AboutPage() {
  return (
    <div className="page-shell">
      <div className="page-header split-header">
        <div>
          <span className="eyebrow">System design</span>
          <h1>Architecture built around data minimization.</h1>
        </div>
        <p>
          RentChain deliberately avoids storing names, addresses or rental details on a public ledger. The blockchain is used as a trust layer, not as a database replacement.
        </p>
      </div>

      <section className="architecture-stack">
        {layers.map(([layer, tech, text], index) => (
          <article className="architecture-row" key={layer}>
            <span className="architecture-index">0{index + 1}</span>
            <div><small>{layer}</small><h2>{tech}</h2></div>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="decision-grid">
        <article className="panel">
          <span className="eyebrow">Key decision</span>
          <h2>Hash, don’t publish</h2>
          <p>A deterministic representation of a booking is hashed with SHA-256. Only the 32-byte proof is registered on-chain.</p>
        </article>
        <article className="panel">
          <span className="eyebrow">Smart contract</span>
          <h2>Explicit state machine</h2>
          <p>Created → Active → Returned → Completed. Invalid transitions revert, and provider-only actions enforce operational roles.</p>
        </article>
        <article className="panel">
          <span className="eyebrow">Security</span>
          <h2>Checks-effects-interactions</h2>
          <p>Deposit release updates state before value transfer and includes a reentrancy guard. Duplicate proof hashes are rejected.</p>
        </article>
      </section>
    </div>
  );
}
