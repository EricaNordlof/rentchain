import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "RentChain | Full-stack blockchain portfolio project",
  description: "A privacy-first rental workflow with blockchain-verifiable booking proofs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            <span className="brand-mark">RC</span>
            <span>RentChain</span>
          </Link>
          <nav>
            <Link href="/dashboard">Demo</Link>
            <Link href="/verify">Verify</Link>
            <Link href="/about">Architecture</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div>
            <strong>RentChain</strong>
            <p>Independent portfolio project · Full-stack + Solidity + security-minded architecture.</p>
          </div>
          <span>Built to demonstrate applied engineering, not to represent completed formal blockchain studies.</span>
        </footer>
      </body>
    </html>
  );
}
