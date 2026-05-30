export type Concern =
  | "anxiety"
  | "depression"
  | "relationship"
  | "stress"
  | "unsure";

export interface OnboardingContext {
  zip: string;
  insurance: string;
  concern: Concern;
}

export type Instrument = "PHQ9" | "GAD7";

export interface IntakeItem {
  instrument: Instrument;
  index: number;
  text: string;
}

export interface IntakeAnswer {
  instrument: Instrument;
  index: number;
  value: 0 | 1 | 2 | 3;
  rawText?: string;
  confirmed: boolean;
}

export type Phq9Band =
  | "minimal"
  | "mild"
  | "moderate"
  | "moderately_severe"
  | "severe";

export type Gad7Band = "minimal" | "mild" | "moderate" | "severe";

export type CareLevel =
  | "self_guided"
  | "coaching"
  | "therapy"
  | "psychiatry"
  | "urgent"
  | "crisis";

export interface ScoreResult {
  phq9Total: number;
  phq9Band: Phq9Band;
  phq9Item9: 0 | 1 | 2 | 3;
  gad7Total: number;
  gad7Band: Gad7Band;
  careLevel: CareLevel;
  isCrisis: boolean;
  isUrgent: boolean;
}

export interface Provider {
  id: string;
  name: string;
  specialties: string[];
  insurances: string[];
  format: ("in_person" | "tele")[];
  zipCluster: string;
  estWaitDays: number;
  costEstimate: string;
  acceptingNew: boolean;
}

export interface MatchResult {
  providers: Provider[];
  rationale: string;
  fallback?: "community_resources";
}

export interface CrisisCheck {
  crisis: boolean;
  confidence: number;
  source: "item9" | "classifier" | "none";
}

export interface IntakeProgress {
  current: number;
  total: number;
}

export interface IntakeState {
  sessionId: string;
  itemIndex: number;
  answers: IntakeAnswer[];
  context: OnboardingContext;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  classifierCrisisFlag: boolean;
}

export interface MessageResponse {
  assistantMessage: string;
  captured?: IntakeAnswer;
  crisis: CrisisCheck;
  progress: IntakeProgress;
  done: boolean;
  needsConfirmation?: boolean;
  needsNumericFallback?: boolean;
}

export const INSURANCE_OPTIONS = [
  { id: "aetna", label: "Aetna" },
  { id: "bcbs", label: "Blue Cross Blue Shield" },
  { id: "cigna", label: "Cigna" },
  { id: "united", label: "UnitedHealthcare" },
  { id: "self_pay", label: "Self-pay / No insurance" },
] as const;

export const CONCERN_OPTIONS = [
  { id: "anxiety", label: "Anxiety or worry" },
  { id: "depression", label: "Depression or low mood" },
  { id: "relationship", label: "Relationship issues" },
  { id: "stress", label: "Stress or burnout" },
  { id: "unsure", label: "Not sure yet" },
] as const;
