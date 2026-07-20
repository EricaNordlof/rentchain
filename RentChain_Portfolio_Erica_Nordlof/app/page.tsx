import Link from "next/link";
import { WalletButton } from "@/components/WalletButton";

const capabilities = [
  ["01", "Full-stack workflow", "Next.js and TypeScript frontend with API endpoints and production-oriented separation of concerns."],
  ["02", "Blockchain proofs", "Solidity smart contract stores booking hashes and manages a deposit-backed rental lifecycle."],
  ["03", "Privacy by design", "Personal booking data stays off-chain while SHA-256 proofs provide tamper evidence."],
  ["04", "Engineering quality", "Contract tests, CI workflow, Docker support, threat model and architecture documentation."],
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Portfolio case · Web3 rental infrastructure</span>
          <h1>Trust the booking.<br /><span>Not the database.</span></h1>
          <p>
            RentChain is a full-stack rental platform concept that anchors cryptographic booking proofs on-chain while keeping customer data private and operational workflows fast.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/dashboard">Open interactive demo</Link>
            <Link className="button button-secondary" href="/about">View architecture</Link>
          </div>
          <div className="hero-meta">
            <span>Next.js</span><span>TypeScript</span><span>Solidity</span><span>ethers.js</span><span>Hardhat</span>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card-head">
            <span>BOOKING PROOF</span>
            <span className="pulse-dot">LIVE</span>
          </div>
          <div className="chain-visual">
            <div className="chain-node"><small>Booking</small><strong>#RC-2048</strong></div>
            <div className="chain-line" />
            <div className="chain-node active"><small>SHA-256</small><strong>0x7a93…e12f</strong></div>
            <div className="chain-line" />
            <div className="chain-node"><small>Registry</small><strong>Verified</strong></div>
          </div>
          <div className="metric-row"><span>Customer data on-chain</span><strong>0 bytes</strong></div>
          <div className="metric-row"><span>Proof integrity</span><strong>256-bit</strong></div>
          <div className="metric-row"><span>Rental state</span><strong>Active</strong></div>
          <WalletButton />
        </div>
      </section>

      <section className="section-wrap">
        <div className="section-heading">
          <span className="eyebrow">Engineering scope</span>
          <h2>One project. Four competency signals.</h2>
        </div>
        <div className="capability-grid">
          {capabilities.map(([number, title, text]) => (
            <article className="capability-card" key={number}>
              <span className="card-number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-strip">
        <div>
          <span className="eyebrow">Try the workflow</span>
          <h2>Create → hash → register → verify.</h2>
        </div>
        <Link className="button" href="/dashboard">Launch demo</Link>
      </section>
    </>
  );
}
