import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getLlmApiKeyEnvVar,
  getLlmProvider,
  resolveApiKey,
  resolveBaseURL,
  resolveModel,
} from "@/lib/ai/openai";

const snapshot = { ...process.env };

function seedHfEnv() {
  process.env.LLM_PROVIDER = "huggingface";
  process.env.HF_BASE_URL = "https://router.huggingface.co/v1";
  process.env.HF_MODEL = "google/gemma-4-31B-it";
}

function clearLlmEnv() {
  delete process.env.LLM_PROVIDER;
  delete process.env.LLM_DEFAULT_PROVIDER;
  delete process.env.LLM_BASE_URL;
  delete process.env.OPENAI_BASE_URL;
  delete process.env.HF_API_KEY;
  delete process.env.HF_BASE_URL;
  delete process.env.HF_MODEL;
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.OPENROUTER_BASE_URL;
  delete process.env.OPENROUTER_MODEL;
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_BASE_URL;
  delete process.env.OPENAI_MODEL;
  delete process.env.HF_INFERENCE_PROVIDER;
}

describe("getLlmProvider", () => {
  beforeEach(() => {
    process.env = { ...snapshot };
    clearLlmEnv();
  });

  afterEach(() => {
    process.env = snapshot;
  });

  it("uses LLM_PROVIDER when set", () => {
    process.env.LLM_PROVIDER = "openrouter";
    expect(getLlmProvider()).toBe("openrouter");
  });

  it("detects Hugging Face from HF_API_KEY", () => {
    process.env.HF_API_KEY = "hf_test";
    expect(getLlmProvider()).toBe("huggingface");
  });

  it("detects OpenRouter from OPENROUTER_API_KEY", () => {
    process.env.OPENROUTER_API_KEY = "sk-or-test";
    expect(getLlmProvider()).toBe("openrouter");
  });

  it("detects openai from OPENAI_API_KEY", () => {
    process.env.OPENAI_API_KEY = "sk-test";
    expect(getLlmProvider()).toBe("openai");
  });

  it("detects provider from HF_BASE_URL", () => {
    process.env.HF_BASE_URL = "https://router.huggingface.co/v1";
    expect(getLlmProvider()).toBe("huggingface");
  });

  it("uses LLM_DEFAULT_PROVIDER when unset", () => {
    process.env.LLM_DEFAULT_PROVIDER = "openai";
    expect(getLlmProvider()).toBe("openai");
  });
});

describe("resolveApiKey", () => {
  beforeEach(() => {
    process.env = { ...snapshot };
    clearLlmEnv();
  });

  afterEach(() => {
    process.env = snapshot;
  });

  it("reads the key for the active provider", () => {
    seedHfEnv();
    process.env.HF_API_KEY = "hf_abc";
    expect(resolveApiKey()).toBe("hf_abc");
    expect(getLlmApiKeyEnvVar()).toBe("HF_API_KEY");
  });
});

describe("resolveBaseURL", () => {
  beforeEach(() => {
    process.env = { ...snapshot };
    clearLlmEnv();
  });

  afterEach(() => {
    process.env = snapshot;
  });

  it("reads HF_BASE_URL from env", () => {
    seedHfEnv();
    expect(resolveBaseURL()).toBe("https://router.huggingface.co/v1");
  });

  it("prefers LLM_BASE_URL override", () => {
    seedHfEnv();
    process.env.LLM_BASE_URL = "https://custom.example/v1";
    expect(resolveBaseURL()).toBe("https://custom.example/v1");
  });
});

describe("resolveModel", () => {
  beforeEach(() => {
    process.env = { ...snapshot };
    clearLlmEnv();
  });

  afterEach(() => {
    process.env = snapshot;
  });

  it("uses HF_MODEL from env", () => {
    seedHfEnv();
    expect(resolveModel()).toBe("google/gemma-4-31B-it");
  });

  it("appends HF_INFERENCE_PROVIDER when set", () => {
    seedHfEnv();
    process.env.HF_INFERENCE_PROVIDER = "hf-inference";
    expect(resolveModel()).toBe("google/gemma-4-31B-it:hf-inference");
  });

  it("uses OPENROUTER_MODEL from env", () => {
    process.env.LLM_PROVIDER = "openrouter";
    process.env.OPENROUTER_MODEL = "openai/gpt-4o-mini";
    expect(resolveModel()).toBe("openai/gpt-4o-mini");
  });
});
