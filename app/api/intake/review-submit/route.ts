import { NextResponse } from "next/server";
import { getReviewState, submitReviewAnswers } from "@/lib/intake/intake-flow";
import { reviewSubmitRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reviewSubmitRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { sessionId, context, answers } = parsed.data;

    if (!getReviewState(sessionId)?.hasStory) {
      return NextResponse.json(
        { error: "Complete your story before review" },
        { status: 400 },
      );
    }

    const result = submitReviewAnswers(sessionId, context, answers);

    return NextResponse.json({
      done: true,
      crisis: result.crisis.crisis,
    });
  } catch (error) {
    console.error("Review submit error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save review",
      },
      { status: 500 },
    );
  }
}
