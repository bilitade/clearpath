import { NextResponse } from "next/server";
import { scoreIntake } from "@/lib/scoring";
import { getSession } from "@/lib/session";
import { scoreRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = scoreRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { sessionId, answers, classifierCrisisFlag } = parsed.data;
    const session = getSession(sessionId);
    const classifierFlag =
      classifierCrisisFlag ?? session?.classifierCrisisFlag ?? false;

    const result = scoreIntake(answers, classifierFlag);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Score error:", error);
    return NextResponse.json({ error: "Failed to score intake" }, { status: 500 });
  }
}
