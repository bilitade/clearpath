# ClearPath — Mental Health Triage & Provider Match (Prototype)

ClearPath is an early prototype that turns *"I need help"* into a ranked provider shortlist through validated screening (PHQ-9 + GAD-7), deterministic scoring, safe triage, and provider matching — with an AI-written plain-language summary on the results page.

> **Status:** Prototype — not production-ready. See [Limitations](#limitations).

---

## Quick start

```bash
pnpm install
cp .env.example .env.local   # add OPENAI_API_KEY (or Hugging Face hf_ token)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm test      # 34 unit tests (scoring, care level, matcher, intake flow)
pnpm build     # production build
pnpm lint      # ESLint
```

---

## Core loop

```
Landing → Onboarding (ZIP, insurance, concern)
       → Intake — 16 structured questions (PHQ-9 ×9, GAD-7 ×7)
       │    tap 0–3 per question (Not at all → Nearly every day)
       │
       ├─ PHQ-9 item 9 ≥ 1 → /crisis (988, Crisis Text Line, 911)
       │
       └─ After Q16 → /processing (animated pipeline)
              ├─ Score responses (deterministic)
              ├─ Match providers (deterministic)
              ├─ Write summary (LLM)
              └─ → /results
```

---

## What uses AI vs code

| Step | How it works |
|---|---|
| Questionnaire (16 items) | **Deterministic** — choice buttons, no LLM |
| PHQ-9 / GAD-7 scoring | **Deterministic** — `lib/scoring.ts` |
| Care level | **Deterministic** — `lib/scoring.ts` |
| Provider ranking | **Deterministic** — `lib/matcher.ts` + seeded JSON |
| Results summary paragraph | **LLM** — `/api/summary` (fallback text if API fails) |

**Trust boundary:** The LLM never computes clinical scores. Scoring, triage, and provider ranking are pure TypeScript with unit tests.

---

## Architecture

Single **Next.js 16 (App Router)** app — UI and API in one deployable.

| Layer | Responsibility |
|---|---|
| **`lib/intake-flow.ts`** | Question progression, answer capture, crisis on item 9 |
| **`lib/scoring.ts`** | PHQ-9/GAD-7 bands, care level, crisis/urgent flags |
| **`lib/matcher.ts`** | Provider ranking from `data/providers.json` |
| **`lib/crisis.ts`** | Item 9 check + optional crisis-language classifier |
| **`lib/openai.ts`** | OpenAI or Hugging Face router client (summary only in main flow) |
| **`data/providers.json`** | ~20 seeded providers |

### Pages

| Route | Purpose |
|---|---|
| `/` | Landing |
| `/onboarding` | ZIP, insurance, primary concern |
| `/intake` | 16-question structured screening |
| `/processing` | Post-intake scoring, matching, summary animation |
| `/results` | Scores, care level, AI summary, matched providers |
| `/crisis` | Static crisis resources |

### API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/intake/start` | POST | Begin or resume intake |
| `/api/intake/answer` | POST | Save one 0–3 answer, return next step |
| `/api/intake/session` | POST | Retrieve all answers |
| `/api/intake/score` | POST | Deterministic scoring |
| `/api/match` | POST | Ranked provider match |
| `/api/summary` | POST | Non-diagnostic LLM narrative |
| `/api/intake/message` | POST | Legacy conversational turn (unused by current UI) |

---

## Environment

```bash
# OpenAI (default)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Hugging Face router — auto-detected when key starts with hf_
OPENAI_API_KEY=hf_...
OPENAI_MODEL=google/gemma-4-31B-it
OPENAI_MODEL_PROVIDER=novita   # optional
```

See `.env.example` for all options. **LLM is required for the AI summary**; intake works without it.

---

## Safety design

1. **Deterministic scoring** — PHQ-9/GAD-7 totals and bands are pure code with unit tests.
2. **Crisis routing** — PHQ-9 item 9 ≥ 1 on answer save → `/crisis` immediately.
3. **Urgent ≠ crisis** — Severe scores without suicidality show urgent guidance on results, not the 988 page.
4. **Static crisis page** — `/crisis` is independent of intake/session state.
5. **Non-diagnostic posture** — Disclaimers on landing, results, and in summary prompts.
6. **No PII persistence** — Server session is in-memory; client uses sessionStorage for the active tab only.

---

## Limitations (prototype)

- **Not an MVP or clinical product** — demo-quality, not validated for production care
- Seeded provider data (not real-time availability or verified listings)
- No accounts, auth, or persistent storage
- English only; web-responsive (no native app)
- LLM needed for results summary (static fallback if unavailable)
- Not HIPAA-compliant (no PHI stored long-term)

---

## Deployment

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`)
4. Deploy from `main`

**Post-deploy smoke checks:**
- `/` and `/crisis` load
- Full flow: onboarding → intake → processing → results

---

## Project structure

```
app/
  (marketing)/     Landing page
  onboarding/      User context form
  intake/          Structured screening
  processing/      Post-intake pipeline UI
  results/         Scores + providers + summary
  crisis/          Crisis resources
  api/             Intake, match, summary routes
components/        UI primitives + domain components
lib/               Scoring, matching, intake flow, prompts, session
data/              Seeded providers
tests/             Vitest (34 tests across 4 files)
```

---

## License

Private — prototype for demonstration and iteration.
