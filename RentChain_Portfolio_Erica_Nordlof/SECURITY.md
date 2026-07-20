# Security model

This repository is a portfolio demonstration, not audited production software.

## Assets

- Booking integrity
- Customer privacy
- Escrowed deposit funds
- Provider permissions
- Wallet/account authenticity

## Main threats and controls

### Personal data leakage on-chain
**Control:** only a cryptographic booking hash is stored. Do not include names, email, phone, addresses or free-text customer notes in contract storage or events.

### Duplicate proof registration
**Control:** `registeredHashes` rejects an already-registered booking hash.

### Unauthorized workflow changes
**Control:** operational state changes such as activation, return and completion are provider-only.

### Reentrancy during deposit release
**Control:** state and deposit value are updated before the external call and the function uses a reentrancy guard.

### Invalid state transitions
**Control:** each lifecycle method checks the current state and reverts on invalid transitions.

### Frontend input abuse
**Control:** API route validates request shape and payload length with Zod. Production forms should have equivalent server-side schemas for all operations.

### Private-key leakage
**Control:** `.env*` files are ignored. Never expose deployment private keys through `NEXT_PUBLIC_*` environment variables.

## Known limitations

- Contract is intentionally compact and unaudited.
- Disputed deposit resolution is not implemented.
- Demo data uses localStorage rather than authenticated persistent storage.
- The frontend does not enforce chain switching.
- Transaction indexing/confirmations are simplified.

## Production requirements

Before handling real funds:

- Independent contract audit
- Comprehensive property/fuzz tests
- Multisig provider administration
- Explicit dispute resolution
- Circuit breaker / pause strategy where appropriate
- Legal and accounting review of escrow behavior
- Monitoring of contract events and abnormal balances
