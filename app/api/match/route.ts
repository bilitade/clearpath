import { NextResponse } from "next/server";
import { matchProviders } from "@/lib/matching/matcher";
import { matchRequestSchema } from "@/lib/validators";
import type { ScoreResult } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = matchRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { score, context } = parsed.data;
    const result = matchProviders(score as ScoreResult, context);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Match error:", error);
    return NextResponse.json({ error: "Failed to match providers" }, { status: 500 });
  }
}
