import { NextResponse } from "next/server";
import { z } from "zod";
import { classifyCrisisMessage } from "@/lib/screening/crisis";
import { getLlmApiKeyEnvVar, isLlmConfigured } from "@/lib/ai/openai";
import { inferScreeningFromStory, llmClassifyCrisis } from "@/lib/ai/prompts";
import {
  savePatientStory,
  setClassifierCrisisFlag,
  startIntake,
} from "@/lib/intake/intake-flow";
import {
  buildStoryInferenceCatalog,
  STORY_MAX_CHARS,
  STORY_MIN_CHARS,
} from "@/lib/ai/story-inference";
import { onboardingContextSchema } from "@/lib/validators";

const schema = z.object({
  sessionId: z.string().min(1),
  context: onboardingContextSchema,
  story: z.string().min(STORY_MIN_CHARS).max(STORY_MAX_CHARS),
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

    const { sessionId, context, story } = parsed.data;
    const trimmed = story.trim();

    const safety = await classifyCrisisMessage(trimmed, llmClassifyCrisis);
    if (safety.crisis) {
      setClassifierCrisisFlag(sessionId, true);
    }

    startIntake(sessionId, context);

    const catalog = buildStoryInferenceCatalog();
    const suggestions = await inferScreeningFromStory(trimmed, catalog);

    savePatientStory(
      sessionId,
      { ...context, optionalContext: trimmed },
      trimmed,
      suggestions,
    );

    return NextResponse.json({
      crisis: safety.crisis,
      suggestions: Object.entries(suggestions).map(([k, value]) => ({
        globalIndex: Number(k),
        value,
      })),
    });
  } catch (error) {
    console.error("Infer story error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to map story to screening";
    const isConfig =
      !isLlmConfigured() ||
      message.includes("is not configured");
    const envVar = getLlmApiKeyEnvVar();
    return NextResponse.json(
      { error: isConfig ? `AI is not configured (set ${envVar})` : message },
      { status: isConfig ? 503 : 500 },
    );
  }
}
