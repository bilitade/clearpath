import { NextResponse } from "next/server";
import { submitBatchAnswers } from "@/lib/intake/intake-flow";
import { batchSubmitRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = batchSubmitRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { sessionId, context, answers } = parsed.data;
    const result = submitBatchAnswers(sessionId, context, answers);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Intake batch error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to record answers",
      },
      { status: 500 },
    );
  }
}
