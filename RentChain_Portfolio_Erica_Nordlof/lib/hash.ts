export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return `0x${Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function canonicalBookingPayload(input: {
  id: string;
  customerName: string;
  itemName: string;
  startDate: string;
  endDate: string;
}) {
  return JSON.stringify({
    id: input.id.trim(),
    customerName: input.customerName.trim(),
    itemName: input.itemName.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
  });
}
