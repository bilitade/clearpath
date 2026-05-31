import { NextResponse } from "next/server";
import { TOTAL_INTAKE_ITEMS } from "@/lib/intake/instruments";
import { getSession } from "@/lib/storage/session";
import { z } from "zod";

const schema = z.object({ sessionId: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const session = getSession(parsed.data.sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      answers: session.answers,
      classifierCrisisFlag: session.classifierCrisisFlag,
      progress: {
        current: session.answers.length,
        total: TOTAL_INTAKE_ITEMS,
      },
      patientStory: session.patientStory,
      aiSuggestions: session.aiSuggestions,
    });
  } catch (error) {
    console.error("Intake session error:", error);
    return NextResponse.json(
      { error: "Failed to load session" },
      { status: 500 },
    );
  }
}
