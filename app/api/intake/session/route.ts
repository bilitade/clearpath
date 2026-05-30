import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { z } from "zod";

const schema = z.object({ sessionId: z.string().min(1) });

export async function POST(request: Request) {
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
    messages: session.messages.filter((m) => m.content !== "__intro_pending__"),
    classifierCrisisFlag: session.classifierCrisisFlag,
    progress: { current: session.answers.length, total: 16 },
  });
}
