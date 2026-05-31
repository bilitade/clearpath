import { NextResponse } from "next/server";
import {
  resumeIntake,
  setClassifierCrisisFlag,
  startIntake,
  startQuestionnaireIntake,
} from "@/lib/intake/intake-flow";
import { classifyCrisisMessage } from "@/lib/screening/crisis";
import { llmClassifyCrisis } from "@/lib/ai/prompts";
import { onboardingContextSchema } from "@/lib/validators";
import { z } from "zod";

const schema = z.object({
  sessionId: z.string().min(1),
  context: onboardingContextSchema,
  resume: z.boolean().optional(),
  mode: z.enum(["story", "questionnaire"]).optional(),
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

    const { sessionId, context, resume, mode } = parsed.data;

    if (mode !== "questionnaire" && context.optionalContext?.trim()) {
      const crisis = await classifyCrisisMessage(
        context.optionalContext,
        llmClassifyCrisis,
      );
      if (crisis.crisis) {
        setClassifierCrisisFlag(sessionId, true);
      }
    }

    const result = resume
      ? resumeIntake(sessionId, context)
      : mode === "questionnaire"
        ? startQuestionnaireIntake(sessionId, context)
        : startIntake(sessionId, context);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Intake start error:", error);
    return NextResponse.json(
      { error: "Failed to start intake" },
      { status: 500 },
    );
  }
}
