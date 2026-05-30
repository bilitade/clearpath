import { NextResponse } from "next/server";
import { generateSummary } from "@/lib/prompts";
import { CARE_LEVEL_LABELS } from "@/lib/scoring";
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

    const { score, match } = parsed.data;
    const s = score as ScoreResult;

    const scoreSummary = [
      `PHQ-9 total: ${s.phq9Total} (${s.phq9Band})`,
      `GAD-7 total: ${s.gad7Total} (${s.gad7Band})`,
      `Recommended care level: ${CARE_LEVEL_LABELS[s.careLevel]}`,
      s.isUrgent ? "Urgent care recommended (not crisis)." : "",
    ]
      .filter(Boolean)
      .join("\n");

    const matchSummary =
      match.providers.length > 0
        ? `Matched ${match.providers.length} providers. ${match.rationale}`
        : "No in-network matches found; community resources recommended.";

    const summary = await generateSummary(scoreSummary, matchSummary);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary error:", error);
    const message =
      error instanceof Error && error.message.includes("OPENAI_API_KEY")
        ? "OpenAI API key is not configured"
        : "Failed to generate summary";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
