import { NextResponse } from "next/server";
import { getIntakeItem, TOTAL_INTAKE_ITEMS } from "@/lib/instruments";
import {
  classifyCrisisMessage,
  checkItem9Crisis,
  mergeCrisisChecks,
} from "@/lib/crisis";
import { llmClassifyCrisis, parseIntakeTurn } from "@/lib/prompts";
import { createSession, getSession, updateSession } from "@/lib/session";
import type { IntakeAnswer, MessageResponse } from "@/lib/types";
import { messageRequestSchema } from "@/lib/validators";

const INTRO_PENDING = "__intro_pending__";

function getLastAssistantMessage(
  messages: Array<{ role: string; content: string }>,
): string | null {
  const last = [...messages].reverse().find((m) => m.role === "assistant");
  if (!last || last.content === INTRO_PENDING) return null;
  return last.content;
}

async function waitForIntroMessage(
  sessionId: string,
  maxMs = 60000,
): Promise<string | null> {
  const started = Date.now();
  while (Date.now() - started < maxMs) {
    const session = getSession(sessionId);
    const content = session ? getLastAssistantMessage(session.messages) : null;
    if (content) return content;
    await new Promise((r) => setTimeout(r, 300));
  }
  return null;
}

function introResponse(assistantMessage: string): MessageResponse {
  return {
    assistantMessage,
    crisis: { crisis: false, confidence: 0, source: "none" },
    progress: { current: 0, total: TOTAL_INTAKE_ITEMS },
    done: false,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = messageRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { sessionId, userMessage, context, confirmedValue } = parsed.data;
    const trimmedMessage = userMessage?.trim() ?? null;

    let session = getSession(sessionId);
    if (!session) {
      session = createSession({
        sessionId,
        itemIndex: 0,
        answers: [],
        context,
        messages: [],
        classifierCrisisFlag: false,
      });
    }

    // Idempotent greeting (React Strict Mode / duplicate init)
    if (
      !trimmedMessage &&
      confirmedValue === undefined &&
      session.answers.length === 0
    ) {
      const cached = getLastAssistantMessage(session.messages);
      if (cached) {
        return NextResponse.json(introResponse(cached));
      }

      if (session.messages.some((m) => m.content === INTRO_PENDING)) {
        const waited = await waitForIntroMessage(sessionId);
        if (waited) {
          return NextResponse.json(introResponse(waited));
        }
      }
    }

    if (trimmedMessage) {
      const crisisCheck = await classifyCrisisMessage(
        trimmedMessage,
        llmClassifyCrisis,
      );
      if (crisisCheck.crisis) {
        updateSession(sessionId, (s) => ({
          ...s,
          classifierCrisisFlag: true,
          messages: [
            ...s.messages,
            { role: "user", content: trimmedMessage },
          ],
        }));
        return NextResponse.json({
          assistantMessage:
            "I'm concerned about what you've shared. Your safety matters. Please use the crisis resources — we're pausing the screening.",
          crisis: crisisCheck,
          progress: {
            current: session.answers.length,
            total: TOTAL_INTAKE_ITEMS,
          },
          done: false,
        } satisfies MessageResponse);
      }
    }

    if (confirmedValue !== undefined) {
      const currentItem = getIntakeItem(session.answers.length);
      if (!currentItem) {
        return NextResponse.json(
          { error: "Intake already complete" },
          { status: 400 },
        );
      }

      const answer: IntakeAnswer = {
        instrument: currentItem.instrument,
        index: currentItem.index,
        value: confirmedValue,
        confirmed: true,
        rawText: trimmedMessage ?? undefined,
      };

      const newAnswers = [...session.answers, answer];
      const item9Check = checkItem9Crisis(newAnswers);
      if (item9Check.crisis) {
        updateSession(sessionId, (s) => ({ ...s, answers: newAnswers }));
        return NextResponse.json({
          assistantMessage:
            "Thank you for answering honestly. Based on your response, we want to connect you with immediate support.",
          captured: answer,
          crisis: item9Check,
          progress: { current: newAnswers.length, total: TOTAL_INTAKE_ITEMS },
          done: false,
        } satisfies MessageResponse);
      }

      if (newAnswers.length >= TOTAL_INTAKE_ITEMS) {
        updateSession(sessionId, (s) => ({
          ...s,
          answers: newAnswers,
          itemIndex: newAnswers.length,
        }));
        return NextResponse.json({
          assistantMessage:
            "Thank you for completing all the questions. We're preparing your results.",
          captured: answer,
          crisis: { crisis: false, confidence: 0, source: "none" },
          progress: { current: TOTAL_INTAKE_ITEMS, total: TOTAL_INTAKE_ITEMS },
          done: true,
        } satisfies MessageResponse);
      }

      const nextItem = getIntakeItem(newAnswers.length)!;
      const parsedTurn = await parseIntakeTurn(
        nextItem.text,
        null,
        false,
        session.messages,
      );

      updateSession(sessionId, (s) => ({
        ...s,
        answers: newAnswers,
        itemIndex: newAnswers.length,
        messages: [
          ...s.messages,
          ...(trimmedMessage
            ? [{ role: "user" as const, content: trimmedMessage }]
            : []),
          { role: "assistant", content: parsedTurn.assistantMessage },
        ],
      }));

      return NextResponse.json({
        assistantMessage: parsedTurn.assistantMessage,
        captured: answer,
        crisis: { crisis: false, confidence: 0, source: "none" },
        progress: { current: newAnswers.length, total: TOTAL_INTAKE_ITEMS },
        done: false,
      } satisfies MessageResponse);
    }

    const currentItem = getIntakeItem(session.answers.length);

    if (!currentItem) {
      return NextResponse.json({
        assistantMessage: "Intake is complete.",
        crisis: { crisis: false, confidence: 0, source: "none" },
        progress: { current: TOTAL_INTAKE_ITEMS, total: TOTAL_INTAKE_ITEMS },
        done: true,
      } satisfies MessageResponse);
    }

    if (trimmedMessage) {
      const parsedTurn = await parseIntakeTurn(
        currentItem.text,
        trimmedMessage,
        session.answers.length === 0,
        session.messages,
      );

      if (
        parsedTurn.needsConfirmation ||
        !parsedTurn.confirmed ||
        parsedTurn.value === null
      ) {
        updateSession(sessionId, (s) => ({
          ...s,
          messages: [
            ...s.messages,
            { role: "user", content: trimmedMessage },
            { role: "assistant", content: parsedTurn.assistantMessage },
          ],
        }));

        return NextResponse.json({
          assistantMessage: parsedTurn.assistantMessage,
          crisis: { crisis: false, confidence: 0, source: "none" },
          progress: {
            current: session.answers.length,
            total: TOTAL_INTAKE_ITEMS,
          },
          done: false,
          needsConfirmation: parsedTurn.needsConfirmation,
          needsNumericFallback: parsedTurn.value === null,
        } satisfies MessageResponse);
      }

      const answer: IntakeAnswer = {
        instrument: currentItem.instrument,
        index: currentItem.index,
        value: parsedTurn.value,
        confirmed: true,
        rawText: trimmedMessage,
      };

      const newAnswers = [...session.answers, answer];
      const crisisChecks = mergeCrisisChecks(
        checkItem9Crisis(newAnswers),
        await classifyCrisisMessage(trimmedMessage, llmClassifyCrisis),
      );

      if (crisisChecks.crisis) {
        updateSession(sessionId, (s) => ({
          ...s,
          answers: newAnswers,
          classifierCrisisFlag: crisisChecks.source === "classifier",
          messages: [
            ...s.messages,
            { role: "user", content: trimmedMessage },
            { role: "assistant", content: parsedTurn.assistantMessage },
          ],
        }));
        return NextResponse.json({
          assistantMessage:
            "Thank you for sharing. We want to make sure you have immediate support available.",
          captured: answer,
          crisis: crisisChecks,
          progress: { current: newAnswers.length, total: TOTAL_INTAKE_ITEMS },
          done: false,
        } satisfies MessageResponse);
      }

      if (newAnswers.length >= TOTAL_INTAKE_ITEMS) {
        updateSession(sessionId, (s) => ({
          ...s,
          answers: newAnswers,
          messages: [
            ...s.messages,
            { role: "user", content: trimmedMessage },
            { role: "assistant", content: parsedTurn.assistantMessage },
          ],
        }));
        return NextResponse.json({
          assistantMessage:
            "Thank you for completing all the questions. We're preparing your results.",
          captured: answer,
          crisis: { crisis: false, confidence: 0, source: "none" },
          progress: { current: TOTAL_INTAKE_ITEMS, total: TOTAL_INTAKE_ITEMS },
          done: true,
        } satisfies MessageResponse);
      }

      const nextItem = getIntakeItem(newAnswers.length)!;
      const nextTurn = await parseIntakeTurn(
        nextItem.text,
        null,
        false,
        [
          ...session.messages,
          { role: "user", content: trimmedMessage },
          { role: "assistant", content: parsedTurn.assistantMessage },
        ],
      );

      updateSession(sessionId, (s) => ({
        ...s,
        answers: newAnswers,
        itemIndex: newAnswers.length,
        messages: [
          ...s.messages,
          { role: "user", content: trimmedMessage },
          { role: "assistant", content: nextTurn.assistantMessage },
        ],
      }));

      return NextResponse.json({
        assistantMessage: nextTurn.assistantMessage,
        captured: answer,
        crisis: { crisis: false, confidence: 0, source: "none" },
        progress: { current: newAnswers.length, total: TOTAL_INTAKE_ITEMS },
        done: false,
      } satisfies MessageResponse);
    }

    // First turn: no user message yet — generate intro
    if (session.answers.length === 0) {
      updateSession(sessionId, (s) => {
        if (
          getLastAssistantMessage(s.messages) ||
          s.messages.some((m) => m.content === INTRO_PENDING)
        ) {
          return s;
        }
        return {
          ...s,
          messages: [
            ...s.messages,
            { role: "assistant", content: INTRO_PENDING },
          ],
        };
      });
    }

    const parsedTurn = await parseIntakeTurn(
      currentItem.text,
      null,
      session.answers.length === 0,
      session.messages.filter((m) => m.content !== INTRO_PENDING),
    );

    updateSession(sessionId, (s) => ({
      ...s,
      messages: [
        ...s.messages.filter((m) => m.content !== INTRO_PENDING),
        { role: "assistant", content: parsedTurn.assistantMessage },
      ],
    }));

    return NextResponse.json({
      assistantMessage: parsedTurn.assistantMessage,
      crisis: { crisis: false, confidence: 0, source: "none" },
      progress: { current: session.answers.length, total: TOTAL_INTAKE_ITEMS },
      done: false,
    } satisfies MessageResponse);
  } catch (error) {
    console.error("Intake message error:", error);
    const message =
      error instanceof Error && error.message.includes("OPENAI_API_KEY")
        ? "OpenAI API key is not configured"
        : "Failed to process intake message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
