import { z } from "zod";
import { STORY_MAX_CHARS } from "@/lib/ai/story-inference";
import { TOTAL_INTAKE_ITEMS } from "@/lib/intake/instruments";

export const concernSchema = z.enum([
  "anxiety",
  "depression",
  "relationship",
  "stress",
  "unsure",
]);

export const formatPreferenceSchema = z.enum(["tele", "in_person", "either"]);

export const onboardingContextSchema = z.object({
  zip: z.string().regex(/^\d{5}$/, "ZIP must be 5 digits"),
  insurance: z.string().min(1),
  concern: concernSchema,
  formatPreference: formatPreferenceSchema.default("either"),
  optionalContext: z.string().max(STORY_MAX_CHARS).optional(),
});

const scaleValueSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const globalAnswerInputSchema = z.object({
  globalIndex: z.number().int().min(0).max(TOTAL_INTAKE_ITEMS - 1),
  value: scaleValueSchema,
});

export const intakeAnswerSchema = z.object({
  instrument: z.enum(["PHQ9", "GAD7"]),
  index: z.number().int().min(0),
  value: scaleValueSchema,
  rawText: z.string().optional(),
  confirmed: z.boolean(),
});

export const batchSubmitRequestSchema = z.object({
  sessionId: z.string().min(1),
  context: onboardingContextSchema,
  answers: z.array(globalAnswerInputSchema).min(1),
});

export const reviewSubmitRequestSchema = z.object({
  sessionId: z.string().min(1),
  context: onboardingContextSchema,
  answers: z.array(globalAnswerInputSchema).length(TOTAL_INTAKE_ITEMS),
});

export const scoreRequestSchema = z.object({
  sessionId: z.string().min(1),
  answers: z.array(intakeAnswerSchema).length(TOTAL_INTAKE_ITEMS),
  classifierCrisisFlag: z.boolean().optional(),
});

export const scoreResultSchema = z.object({
  phq9Total: z.number(),
  phq9Band: z.string(),
  phq9Item9: scaleValueSchema,
  gad7Total: z.number(),
  gad7Band: z.string(),
  careLevel: z.string(),
  isCrisis: z.boolean(),
  isUrgent: z.boolean(),
});

export const matchRequestSchema = z.object({
  score: scoreResultSchema,
  context: onboardingContextSchema,
});

export const summaryRequestSchema = z.object({
  score: scoreResultSchema,
  match: z.object({
    providers: z.array(z.unknown()),
    matches: z.array(z.unknown()).optional(),
    rationale: z.string(),
    fallback: z.enum(["community_resources"]).optional(),
  }),
  context: onboardingContextSchema.optional(),
});
