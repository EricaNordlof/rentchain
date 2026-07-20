import { NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";

const schema = z.object({
  payload: z.string().min(1).max(10_000),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const hash = createHash("sha256").update(body.payload).digest("hex");
    return NextResponse.json({ hash: `0x${hash}` });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}
