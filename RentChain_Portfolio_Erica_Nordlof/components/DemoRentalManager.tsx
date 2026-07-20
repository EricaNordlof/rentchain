"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createOnChainRental, isBlockchainConfigured } from "@/lib/blockchain";
import { canonicalBookingPayload, sha256Hex } from "@/lib/hash";
import {
  demoTransactionHash,
  nextStatus,
  readRentals,
  writeRentals,
} from "@/lib/demo";
import type { DemoRental } from "@/lib/types";

const EMPTY = {
  customerName: "",
  itemName: "",
  startDate: "",
  endDate: "",
};

export function DemoRentalManager() {
  const [rentals, setRentals] = useState<DemoRental[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setRentals(readRentals());
  }, []);

  const configured = useMemo(() => isBlockchainConfigured(), []);

  function persist(next: DemoRental[]) {
    setRentals(next);
    writeRentals(next);
  }

  async function createRental(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    const id = crypto.randomUUID();
    const payload = canonicalBookingPayload({ id, ...form });
    const bookingHash = await sha256Hex(payload);

    const rental: DemoRental = {
      id,
      ...form,
      bookingHash,
      status: "Created",
      createdAt: new Date().toISOString(),
    };

    persist([rental, ...rentals]);
    setForm(EMPTY);
    setMessage("Booking created. Only its SHA-256 proof is intended for blockchain storage.");
  }

  async function registerProof(rental: DemoRental) {
    setBusyId(rental.id);
    setMessage("");
    try {
      let transactionHash: string;
      if (configured) {
        transactionHash = await createOnChainRental(rental.bookingHash);
      } else {
        transactionHash = demoTransactionHash(rental.bookingHash);
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      persist(
        rentals.map((item) =>
          item.id === rental.id ? { ...item, transactionHash } : item,
        ),
      );
      setMessage(
        configured
          ? "Proof registered on the configured blockchain network."
          : "Demo proof created locally. Configure a deployed contract to create a real transaction.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setBusyId("");
    }
  }

  function advance(rental: DemoRental) {
    persist(
      rentals.map((item) =>
        item.id === rental.id ? { ...item, status: nextStatus(item.status) } : item,
      ),
    );
  }

  function resetDemo() {
    persist([]);
    setMessage("Demo data cleared.");
  }

  return (
    <div className="dashboard-grid">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Create booking</span>
            <h2>Rental intake</h2>
          </div>
          <span className="network-pill">{configured ? "Blockchain ready" : "Demo mode"}</span>
        </div>

        <form className="form-grid" onSubmit={createRental}>
          <label>
            Customer
            <input
              required
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              placeholder="Alex Example"
            />
          </label>
          <label>
            Rental item
            <input
              required
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              placeholder="Event kit · 10 units"
            />
          </label>
          <label>
            Start date
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </label>
          <label>
            End date
            <input
              required
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </label>
          <button className="button" type="submit">Create booking proof</button>
        </form>

        <div className="privacy-note">
          <strong>Privacy by design:</strong> customer data remains off-chain. The blockchain layer receives only a cryptographic booking hash.
        </div>
      </section>

      <section className="panel panel-wide">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Lifecycle</span>
            <h2>Rental operations</h2>
          </div>
          <button className="text-button" type="button" onClick={resetDemo}>Clear demo</button>
        </div>

        {message ? <div className="message-box">{message}</div> : null}

        {rentals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">RC</div>
            <h3>No bookings yet</h3>
            <p>Create a booking to see hashing, proof registration and lifecycle controls in action.</p>
          </div>
        ) : (
          <div className="rental-list">
            {rentals.map((rental) => (
              <article className="rental-card" key={rental.id}>
                <div className="rental-card-top">
                  <div>
                    <span className="status-badge">{rental.status}</span>
                    <h3>{rental.itemName}</h3>
                    <p>{rental.customerName} · {rental.startDate} → {rental.endDate}</p>
                  </div>
                  <div className="rental-actions">
                    <button
                      className="button button-small"
                      type="button"
                      disabled={Boolean(rental.transactionHash) || busyId === rental.id}
                      onClick={() => registerProof(rental)}
                    >
                      {rental.transactionHash ? "Proof registered" : busyId === rental.id ? "Registering…" : "Register proof"}
                    </button>
                    <button
                      className="button button-small button-secondary"
                      type="button"
                      disabled={rental.status === "Completed" || rental.status === "Disputed"}
                      onClick={() => advance(rental)}
                    >
                      Advance status
                    </button>
                  </div>
                </div>
                <dl className="proof-grid">
                  <div>
                    <dt>Booking hash</dt>
                    <dd>{rental.bookingHash}</dd>
                  </div>
                  <div>
                    <dt>Transaction</dt>
                    <dd>{rental.transactionHash || "Not registered"}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
