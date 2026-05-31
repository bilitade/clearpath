import { normalizeStorySuggestions } from "./story-inference";
import {
  createChatCompletion,
  createJsonChatCompletion,
  extractChatContent,
} from "./openai";

const SUMMARY_SYSTEM_PROMPT = `You write plain-language summaries for ClearPath mental health screening results.

RULES:
- NEVER diagnose (do not say "you have depression/anxiety").
- ALWAYS state this is screening, not a diagnosis.
- Explain PHQ-9 (score out of 27, severity band) and GAD-7 (score out of 21, severity band) in plain language.
- Note what each questionnaire measures (symptoms over the past 2 weeks).
- Connect scores to the recommended care level provided — do NOT invent a different level.
- End with one sentence on matched providers when provided.
- Warm, clear, 4–6 sentences. No bullet lists.`;

const CRISIS_CLASSIFIER_PROMPT = `You are a safety classifier for mental health screening text.
Respond JSON only: {"crisis": boolean, "confidence": number 0-1}
Set crisis=true only for clear suicidal intent, self-harm intent, or immediate danger (plan, means, intent to act soon).
Set crisis=false for vague distress, historical mentions, or passive mood without intent.
Use confidence >= 0.85 only when crisis=true.`;

const STORY_INFERENCE_SYSTEM = `You map a patient's free-text story to standard PHQ-9 and GAD-7 screening item responses.

RULES:
- Each item uses frequency over the LAST 2 WEEKS: 0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day.
- Base estimates only on what the story supports; if unclear, prefer 0 or 1.
- PHQ-9 item 9 (self-harm thoughts): use 0 unless the story clearly mentions suicidal ideation or self-harm.
- You are proposing a DRAFT for patient review — not a diagnosis.
- Respond JSON only: {"items":[{"globalIndex":number,"value":0|1|2|3}, ...]} with exactly 16 items, globalIndex 0-15.`;

export async function llmClassifyCrisis(
  message: string,
): Promise<{ crisis: boolean; confidence: number }> {
  const content = await createJsonChatCompletion([
    { role: "system", content: CRISIS_CLASSIFIER_PROMPT },
    { role: "user", content: message },
  ]);

  try {
    const parsed = JSON.parse(content || "{}") as {
      crisis?: boolean;
      confidence?: number;
    };
    return {
      crisis: Boolean(parsed.crisis),
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
    };
  } catch {
    return { crisis: false, confidence: 0 };
  }
}

export async function inferScreeningFromStory(
  story: string,
  itemCatalog: string,
): Promise<Record<number, 0 | 1 | 2 | 3>> {
  const content = await createJsonChatCompletion([
    { role: "system", content: STORY_INFERENCE_SYSTEM },
    {
      role: "user",
      content: `Patient story:\n"""${story}"""\n\nScreening items:\n${itemCatalog}\n\nReturn JSON with suggested 0-3 for each globalIndex 0-15.`,
    },
  ]);

  let json: unknown;
  try {
    json = JSON.parse(content || "{}");
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const parsed = normalizeStorySuggestions(json);
  if (!parsed) {
    throw new Error("AI returned invalid screening suggestions");
  }
  return parsed;
}

export async function generateSummary(
  scoreSummary: string,
  matchSummary: string,
  patientStory?: string,
): Promise<string> {
  const storyBlock = patientStory
    ? `\n\nPatient context (tone only; scores are fixed above):\n"${patientStory.slice(0, 500)}"`
    : "";

  const response = await createChatCompletion({
    temperature: 0.4,
    messages: [
      { role: "system", content: SUMMARY_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Write a non-diagnostic summary:\n\n${scoreSummary}\n\n${matchSummary}${storyBlock}`,
      },
    ],
  });

  return (
    extractChatContent(response.choices[0]?.message?.content) ||
    "Based on your responses, this screening suggests areas worth discussing with a licensed professional. This is a screening, not a diagnosis."
  );
}
