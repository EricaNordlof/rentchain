import type { DemoRental, RentalStatus } from "./types";

export const STORAGE_KEY = "rentchain.demo.rentals.v1";

export const STATUS_FLOW: RentalStatus[] = [
  "Created",
  "Active",
  "Returned",
  "Completed",
];

export function nextStatus(status: RentalStatus): RentalStatus {
  const index = STATUS_FLOW.indexOf(status);
  if (index < 0 || index === STATUS_FLOW.length - 1) return status;
  return STATUS_FLOW[index + 1];
}

export function readRentals(): DemoRental[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as DemoRental[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeRentals(rentals: DemoRental[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rentals));
}

export function demoTransactionHash(seed: string) {
  const cleaned = seed.replace(/^0x/, "").padEnd(64, "0").slice(0, 64);
  return `0x${cleaned}`;
}
