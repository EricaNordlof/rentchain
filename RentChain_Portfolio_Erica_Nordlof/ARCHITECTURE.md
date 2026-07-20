# Architecture

## Goal

Demonstrate a realistic hybrid architecture in which a normal web application handles private operational data and a smart contract provides a tamper-evident trust layer.

## Core sequence

1. User creates a booking.
2. Application canonicalizes relevant fields in a deterministic order.
3. SHA-256 generates a 32-byte proof.
4. Original data is retained off-chain.
5. Proof hash can be registered in `RentalRegistry`.
6. Later verification recomputes the proof and checks whether it is registered.

## Why hybrid architecture?

### Relational/document database strengths
- Fast queries
- Mutable operational records
- Access controls
- Suitable for personal data
- Backups and business reporting

### Blockchain strengths
- Append-only public verification
- Event history
- Independent verification
- Programmatic escrow/state rules

RentChain uses each technology where it is strongest.

## Trust boundaries

- Browser input is untrusted.
- API requests require validation.
- Wallet signatures prove control of a blockchain account, not real-world identity.
- Smart contract code is public and deterministic once deployed.
- A booking hash proves integrity only if the original canonicalization rules and source record are preserved.

## Production evolution

A production version would introduce:

- Persistent PostgreSQL/MongoDB storage
- Authenticated user/admin sessions
- Queue-based blockchain writes
- Chain event indexer
- Idempotency keys
- Structured audit log
- Monitoring and alerts
- Key-management/HSM or multisig administration
- External smart-contract audit
- GDPR/legal review for the complete business process
