import OpenAI from "openai";

export const HF_ROUTER_BASE_URL = "https://router.huggingface.co/v1";

let client: OpenAI | null = null;

/** True when using Hugging Face Inference router (OpenAI-compatible). */
export function isHuggingFaceProvider(): boolean {
  const baseURL = process.env.OPENAI_BASE_URL ?? "";
  if (baseURL.includes("huggingface.co")) return true;
  const apiKey = process.env.OPENAI_API_KEY ?? "";
  return apiKey.startsWith("hf_");
}

export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const options: ConstructorParameters<typeof OpenAI>[0] = { apiKey };

    if (isHuggingFaceProvider()) {
      options.baseURL = process.env.OPENAI_BASE_URL ?? HF_ROUTER_BASE_URL;
    } else if (process.env.OPENAI_BASE_URL) {
      options.baseURL = process.env.OPENAI_BASE_URL;
    }

    client = new OpenAI(options);
  }
  return client;
}

/**
 * Resolves model id for the active provider.
 * HF router expects a provider suffix, e.g. google/gemma-4-31B-it:novita
 */
export function resolveModel(): string {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  if (!isHuggingFaceProvider()) return model;
  if (model.includes(":")) return model;
  const provider = process.env.OPENAI_MODEL_PROVIDER ?? "novita";
  return `${model}:${provider}`;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 500,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries) {
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
      }
    }
  }
  throw lastError;
}

function extractMessageContent(
  content: OpenAI.Chat.ChatCompletionMessage["content"],
): string {
  if (typeof content === "string") return content;
  return "";
}

type ChatMessage = OpenAI.Chat.ChatCompletionMessageParam;

/** Chat completion with provider-aware model id. */
export async function createChatCompletion(
  params: Omit<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming, "model">,
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const openai = getOpenAIClient();
  return withRetry(() =>
    openai.chat.completions.create({
      ...params,
      model: resolveModel(),
    }),
  );
}

/**
 * JSON-mode completion. OpenAI uses response_format; HF Gemma uses prompt-only JSON.
 */
export async function createJsonChatCompletion(
  messages: ChatMessage[],
): Promise<string> {
  const jsonGuard =
    "You must respond with a single valid JSON object only. No markdown, no prose outside JSON.";

  if (isHuggingFaceProvider()) {
    const hfMessages: ChatMessage[] = messages.map((message, index) => {
      if (index === 0 && message.role === "system" && typeof message.content === "string") {
        return {
          ...message,
          content: `${message.content}\n\n${jsonGuard}`,
        };
      }
      return message;
    });

    const response = await createChatCompletion({
      temperature: 0,
      messages: hfMessages,
    });
    return extractMessageContent(response.choices[0]?.message?.content);
  }

  const response = await createChatCompletion({
    temperature: 0,
    response_format: { type: "json_object" },
    messages,
  });
  return extractMessageContent(response.choices[0]?.message?.content);
}

export function getLlmProviderLabel(): "huggingface" | "openai" {
  return isHuggingFaceProvider() ? "huggingface" : "openai";
}
