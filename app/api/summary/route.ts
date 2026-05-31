import { NextResponse } from "next/server";
import { getLlmSetupError, isLlmConfigured } from "@/lib/ai/openai";
import { generateSummary } from "@/lib/ai/prompts";
import { buildDeterministicSummary, buildSummaryContext } from "@/lib/screening/screening-summary";
import { summaryRequestSchema } from "@/lib/validators";
import type { ScoreResult } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = summaryRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { score, match, context } = parsed.data;
    const s = score as ScoreResult;

    const scoreSummary = buildSummaryContext(s);

    const matchSummary =
      match.providers.length > 0
        ? `Matched ${match.providers.length} providers. ${match.rationale}`
        : "No in-network matches found; community resources recommended.";

    const patientStory = context?.optionalContext?.trim();

    let summary: string;
    try {
      summary = await generateSummary(scoreSummary, matchSummary, patientStory);
    } catch {
      summary = buildDeterministicSummary(s);
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary error:", error);
    const message =
      !isLlmConfigured() ||
      (error instanceof Error && error.message.includes("is not configured"))
        ? getLlmSetupError()
        : "Failed to generate summary";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
