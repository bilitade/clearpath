import { NextResponse } from "next/server";
import { submitAnswer } from "@/lib/intake-flow";
import { onboardingContextSchema } from "@/lib/validators";
import { z } from "zod";

const schema = z.object({
  sessionId: z.string().min(1),
  context: onboardingContextSchema,
  value: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { sessionId, context, value } = parsed.data;
    const result = submitAnswer(sessionId, context, value);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Intake answer error:", error);
    return NextResponse.json(
      { error: "Failed to record answer" },
      { status: 500 },
    );
  }
}
