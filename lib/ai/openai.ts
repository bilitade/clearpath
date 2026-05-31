import OpenAI from "openai";

export type LlmProvider = "openai" | "openrouter" | "huggingface";

const PROVIDERS: LlmProvider[] = ["openai", "openrouter", "huggingface"];

const API_KEY_ENV: Record<LlmProvider, string> = {
  openai: "OPENAI_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  huggingface: "HF_API_KEY",
};

const BASE_URL_ENV: Record<LlmProvider, string> = {
  openai: "OPENAI_API_BASE_URL",
  openrouter: "OPENROUTER_BASE_URL",
  huggingface: "HF_BASE_URL",
};

const MODEL_ENV: Record<LlmProvider, string> = {
  openai: "OPENAI_MODEL",
  openrouter: "OPENROUTER_MODEL",
  huggingface: "HF_MODEL",
};

let client: OpenAI | null = null;

function env(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

function envInt(key: string): number | undefined {
  const raw = env(key);
  if (!raw) return undefined;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}

function pickEnv(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = env(key);
    if (value) return value;
  }
  return undefined;
}

function isProvider(value: string): value is LlmProvider {
  return PROVIDERS.includes(value as LlmProvider);
}

function baseUrlForDetection(): string {
  return [
    env("LLM_BASE_URL"),
    env("HF_BASE_URL"),
    env("OPENROUTER_BASE_URL"),
    env("OPENAI_API_BASE_URL"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getLlmApiKeyEnvVar(provider?: LlmProvider): string {
  const p = provider ?? getLlmProvider();
  return `LLM_API_KEY or ${API_KEY_ENV[p]}`;
}

export function resolveApiKey(provider?: LlmProvider): string | undefined {
  const p = provider ?? getLlmProvider();
  return pickEnv(["LLM_API_KEY", API_KEY_ENV[p]]);
}

export function isLlmConfigured(provider?: LlmProvider): boolean {
  return Boolean(resolveApiKey(provider));
}

export function getLlmProvider(): LlmProvider {
  const explicit = env("LLM_PROVIDER")?.toLowerCase();
  if (explicit && isProvider(explicit)) return explicit;

  const hints = baseUrlForDetection();
  if (hints.includes("huggingface.co")) return "huggingface";
  if (hints.includes("openrouter.ai")) return "openrouter";

  if (env("HF_API_KEY")) return "huggingface";
  if (env("OPENROUTER_API_KEY")) return "openrouter";
  if (env("OPENAI_API_KEY")) return "openai";

  const fallback = env("LLM_DEFAULT_PROVIDER")?.toLowerCase();
  if (fallback && isProvider(fallback)) return fallback;

  return "huggingface";
}

export function isHuggingFaceProvider(): boolean {
  return getLlmProvider() === "huggingface";
}

export function resolveBaseURL(provider?: LlmProvider): string {
  const p = provider ?? getLlmProvider();
  const url = pickEnv(["LLM_BASE_URL", BASE_URL_ENV[p]]);
  if (!url) {
    throw new Error(
      `LLM_BASE_URL or ${BASE_URL_ENV[p]} is not configured (see .env.example)`,
    );
  }
  return url;
}

export function getLlmSetupError(): string {
  const p = getLlmProvider();
  const missing: string[] = [];

  if (!resolveApiKey(p)) {
    missing.push(`LLM_API_KEY or ${API_KEY_ENV[p]}`);
  }
  try {
    resolveBaseURL(p);
  } catch {
    missing.push(`LLM_BASE_URL or ${BASE_URL_ENV[p]}`);
  }
  try {
    resolveModel();
  } catch {
    missing.push(`LLM_MODEL or ${MODEL_ENV[p]}`);
  }

  if (missing.length === 0) {
    return "AI is not configured";
  }
  return `AI is not configured (set ${missing.join("; ")} — provider: ${p})`;
}

function resolveModelId(provider: LlmProvider): string {
  const model = pickEnv(["LLM_MODEL", MODEL_ENV[provider], "OPENAI_MODEL"]);
  if (!model) {
    throw new Error(
      `LLM_MODEL or ${MODEL_ENV[provider]} is not configured (see .env.example)`,
    );
  }
  return model;
}

function resolveHfModelId(model: string): string {
  if (model.includes(":")) return model;
  const suffix = env("HF_INFERENCE_PROVIDER");
  if (!suffix) return model;
  return `${model}:${suffix}`;
}

export function resolveModel(): string {
  const provider = getLlmProvider();
  const model = resolveModelId(provider);
  if (provider !== "huggingface") return model;
  return resolveHfModelId(model);
}

function openRouterHeaders(): Record<string, string> | undefined {
  const referer = env("OPENROUTER_HTTP_REFERER");
  const title = env("OPENROUTER_APP_TITLE");
  if (!referer && !title) return undefined;
  const headers: Record<string, string> = {};
  if (referer) headers["HTTP-Referer"] = referer;
  if (title) headers["X-Title"] = title;
  return headers;
}

export function getOpenAIClient(): OpenAI {
  if (!client) {
    const provider = getLlmProvider();
    const apiKey = resolveApiKey(provider);
    if (!apiKey) {
      throw new Error(getLlmSetupError());
    }

    const options: ConstructorParameters<typeof OpenAI>[0] = {
      apiKey,
      baseURL: resolveBaseURL(provider),
    };

    const headers = provider === "openrouter" ? openRouterHeaders() : undefined;
    if (headers) options.defaultHeaders = headers;

    client = new OpenAI(options);
  }
  return client;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = envInt("LLM_RETRY_COUNT") ?? 2,
  delayMs = envInt("LLM_RETRY_DELAY_MS") ?? 500,
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

export function extractChatContent(
  content: OpenAI.Chat.ChatCompletionMessage["content"],
): string {
  if (typeof content === "string") return content;
  return "";
}

type ChatMessage = OpenAI.Chat.ChatCompletionMessageParam;

function chatTemperature(): number {
  const t = env("LLM_TEMPERATURE");
  if (t === undefined) return 0;
  const n = Number.parseFloat(t);
  return Number.isFinite(n) ? n : 0;
}

export async function createChatCompletion(
  params: Omit<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming, "model">,
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const openai = getOpenAIClient();
  return withRetry(() =>
    openai.chat.completions.create({
      temperature: chatTemperature(),
      ...params,
      model: resolveModel(),
    }),
  );
}

export async function createJsonChatCompletion(
  messages: ChatMessage[],
): Promise<string> {
  const jsonGuard =
    env("LLM_JSON_GUARD") ??
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

    const response = await createChatCompletion({ messages: hfMessages });
    return extractChatContent(response.choices[0]?.message?.content);
  }

  const response = await createChatCompletion({
    response_format: { type: "json_object" },
    messages,
  });
  return extractChatContent(response.choices[0]?.message?.content);
}

export function getLlmProviderLabel(): LlmProvider {
  return getLlmProvider();
}
