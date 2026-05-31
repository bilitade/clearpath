import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getLlmProvider,
  resolveApiKey,
  resolveBaseURL,
  resolveModel,
} from "@/lib/ai/openai";

const snapshot = { ...process.env };

function clearLlmEnv() {
  delete process.env.LLM_PROVIDER;
  delete process.env.LLM_DEFAULT_PROVIDER;
  delete process.env.LLM_API_KEY;
  delete process.env.LLM_BASE_URL;
  delete process.env.LLM_MODEL;
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

function seedHfEnv() {
  process.env.LLM_PROVIDER = "huggingface";
  process.env.LLM_API_KEY = "hf_test";
  process.env.LLM_BASE_URL = "https://router.huggingface.co/v1";
  process.env.LLM_MODEL = "google/gemma-4-31B-it";
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
});

describe("resolveApiKey", () => {
  beforeEach(() => {
    process.env = { ...snapshot };
    clearLlmEnv();
  });

  afterEach(() => {
    process.env = snapshot;
  });

  it("uses LLM_API_KEY for any provider", () => {
    seedHfEnv();
    delete process.env.HF_API_KEY;
    expect(resolveApiKey()).toBe("hf_test");
  });

  it("uses provider-specific key when LLM_API_KEY unset", () => {
    process.env.LLM_PROVIDER = "huggingface";
    process.env.HF_API_KEY = "hf_abc";
    expect(resolveApiKey()).toBe("hf_abc");
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

  it("uses LLM_BASE_URL", () => {
    seedHfEnv();
    expect(resolveBaseURL()).toBe("https://router.huggingface.co/v1");
  });

  it("uses HF_BASE_URL when LLM_BASE_URL unset", () => {
    process.env.LLM_PROVIDER = "huggingface";
    process.env.HF_BASE_URL = "https://router.huggingface.co/v1";
    expect(resolveBaseURL()).toBe("https://router.huggingface.co/v1");
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

  it("uses LLM_MODEL", () => {
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
    process.env.OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
    process.env.OPENROUTER_API_KEY = "sk-or-test";
    expect(resolveModel()).toBe("openai/gpt-4o-mini");
  });
});
