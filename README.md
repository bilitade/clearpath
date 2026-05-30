# ClearPath — Mental Health Triage & Provider Match (MVP1)

ClearPath converts *"I need help"* into a ranked, contactable provider shortlist through AI-guided conversational screening (PHQ-9 + GAD-7), deterministic scoring, safe triage, and provider matching.

**Live demo:** Deploy to Vercel (see [Deployment](#deployment))

---

## Quick start

```bash
pnpm install
cp .env.example .env.local   # add your OPENAI_API_KEY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm test      # unit tests (scoring + matcher)
pnpm build     # production build
```

---

## Core loop

```
Landing → Onboarding (ZIP, insurance, concern)
       → AI intake (PHQ-9 ×9, GAD-7 ×7)
       ├─ Crisis → /crisis (988, Crisis Text Line, 911)
       └─ Deterministic scoring → care level → provider match → results
```

---

## Architecture

Single **Next.js 16 (App Router)** application — UI and API in one deployable.

| Layer | Responsibility |
|---|---|
| **OpenAI API** | Conversational intake phrasing + non-diagnostic summary only |
| **`lib/scoring.ts`** | Deterministic PHQ-9/GAD-7 scoring, severity bands, care level |
| **`lib/crisis.ts`** | Dual-layer crisis detection (item 9 + classifier) |
| **`lib/matcher.ts`** | Deterministic provider ranking from seeded JSON |
| **`data/providers.json`** | ~20 seeded providers (MVP1) |

**Trust boundary:** The LLM never computes clinical scores. All scoring, routing, and ranking are pure TypeScript.

### API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/intake/message` | POST | One conversational turn |
| `/api/intake/score` | POST | Deterministic scoring |
| `/api/intake/session` | POST | Retrieve session answers |
| `/api/match` | POST | Ranked provider match |
| `/api/summary` | POST | Non-diagnostic LLM narrative |

---

## Safety design

1. **Deterministic scoring** — PHQ-9/GAD-7 totals and bands are pure code with unit tests.
2. **Dual-layer crisis detection** — PHQ-9 item 9 ≥ 1 OR crisis-language classifier → `/crisis`.
3. **Urgent ≠ crisis** — Severe scores without suicidality route to urgent care guidance, not the 988 page.
4. **Static crisis page** — `/crisis` renders crisis resources with high-contrast styling.
5. **Non-diagnostic posture** — Disclaimers on landing, results, and in LLM summary prompts.
6. **No PII persistence** — Session data in memory only; client uses sessionStorage for active tab.

---

## Limitations (MVP1)

- Seeded provider data (not real-time availability)
- No accounts, auth, or persistent storage
- English only; web-responsive (no native app)
- OpenAI required for conversational intake (numeric fallback available for ambiguous answers)
- Not HIPAA-compliant (no PHI stored; see product dossier for MVP2+ path)

---

## Deployment

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables: `OPENAI_API_KEY`, optionally `OPENAI_MODEL`
4. Deploy from `main`

**Post-deploy smoke checks:**
- `/` loads
- `/crisis` loads directly
- Full persona run on public URL

---

## Project structure

```
app/           # Pages + API routes
components/    # UI design system + domain components
lib/           # Clinical logic, prompts, session, validators
data/          # Seeded providers
tests/         # Vitest unit tests
```

---

## License

Private — MVP1 prototype.
