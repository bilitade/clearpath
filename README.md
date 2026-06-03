# ClearPath

Mental health triage and provider matching: PHQ-9 + GAD-7 screening, deterministic scoring and care level, ranked shortlist, optional story path with AI-assisted mapping and a plain-language results summary.

**Live:** https://clearpathcare-demo.vercel.app

---

## Run locally

```bash
pnpm install
cp .env.example .env.local   # LLM_PROVIDER + LLM_API_KEY, LLM_BASE_URL, LLM_MODEL
pnpm dev
```

```bash
pnpm test
pnpm build
```

---

## User flow

```
/ → /welcome → /onboarding → /intake
  ├─ /intake/questions   (PHQ-9 + GAD-7, batched)
  └─ /intake/story → /intake/review   (AI draft → user confirms all 16 items)
→ /processing → /results
/crisis   (988, crisis text line, 911 — optional anytime)
```

Scores use confirmed 0–3 answers only. PHQ-9 item 9 ≥ 1 (or crisis classifier on story text) sets crisis care level and shows safety resources; screening is not hard-stopped.

---

## AI vs deterministic logic

| Area | Implementation |
|------|----------------|
| Questionnaires, PHQ-9/GAD-7 totals, care level | `lib/screening/scoring.ts` |
| Provider ranking | `lib/matching/matcher.ts` + `data/providers.json` |
| Story → draft item values | LLM (`/api/intake/infer-story`) |
| Crisis language (story) | Keywords + optional LLM classifier (`lib/screening/crisis.ts`) |
| Results narrative | LLM (`/api/summary`); static fallback if unavailable |

---

## Scope

**Shipped:** Profile → intake (questionnaire or story) → score → match → results; safety handling; seeded provider fixtures for matching logic.

**Not in this repo:** Live provider directory, scheduling, accounts, persistence across sessions, employer admin.

Sessions are in-memory on the server and `sessionStorage` in the browser for the active tab.

---

## Stack

Next.js 16 (App Router), TypeScript, Vitest.

```
lib/
  types.ts, utils.ts, validators.ts
  ai/          openai, prompts, story-inference
  intake/      intake-flow, instruments, finalize-intake-client
  screening/   scoring, crisis, screening-summary
  storage/     session, client-storage
  matching/    matcher, provider-avatar
  hooks/
```

**API:** `/api/intake/start`, `batch`, `infer-story`, `review-submit`, `session`, `score`, `match`, `summary` — see route handlers under `app/api/`.

**Env:** `.env.example` — set `LLM_PROVIDER` and shared `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL` (or provider-specific `HF_*` / `OPENAI_*` / `OPENROUTER_*`).

---

## Safety (summary)

- Clinical scores are not LLM-generated.
- Story-path answers must be confirmed on `/intake/review` before scoring.
- Non-diagnostic copy in UI and summary prompts.
