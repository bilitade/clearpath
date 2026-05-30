import { z } from "zod";

export const concernSchema = z.enum([
  "anxiety",
  "depression",
  "relationship",
  "stress",
  "unsure",
]);

export const onboardingContextSchema = z.object({
  zip: z.string().regex(/^\d{5}$/, "ZIP must be 5 digits"),
  insurance: z.string().min(1),
  concern: concernSchema,
});

export const intakeAnswerSchema = z.object({
  instrument: z.enum(["PHQ9", "GAD7"]),
  index: z.number().int().min(0),
  value: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  rawText: z.string().optional(),
  confirmed: z.boolean(),
});

export const messageRequestSchema = z.object({
  sessionId: z.string().min(1),
  userMessage: z.string().nullable().optional(),
  context: onboardingContextSchema,
  confirmedValue: z
    .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
    .optional(),
});

export const scoreRequestSchema = z.object({
  sessionId: z.string().min(1),
  answers: z.array(intakeAnswerSchema).length(16),
  classifierCrisisFlag: z.boolean().optional(),
});

export const scoreResultSchema = z.object({
  phq9Total: z.number(),
  phq9Band: z.string(),
  phq9Item9: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
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
    providers: z.array(z.any()),
    rationale: z.string(),
    fallback: z.enum(["community_resources"]).optional(),
  }),
});

export const initSessionSchema = z.object({
  sessionId: z.string().min(1),
  context: onboardingContextSchema,
});
