# ClearPath Brand Guide

Brand system used across the dossier HTML/PDF exports and aligned with the MVP Tailwind teal theme.

---

## 1. Color Palette

Based on **Tailwind CSS teal** + **slate** for text. Use these consistently on slides, diagrams, and documents.

| Token | Hex | Tailwind | Usage |
| --- | --- | --- | --- |
| **Teal 50** | `#f0fdfa` | `teal-50` | Page/section backgrounds, table headers, evidence callouts, diagram subgraph fills |
| **Teal 100** | `#ccfbf1` | `teal-100` | Code backgrounds, Mermaid primary nodes, light fills |
| **Teal 200** | `#99f6e4` | `teal-200` | Section divider lines (h2), table borders, subtle borders |
| **Teal 300** | `#5eead4` | `teal-300` | Decision/diamond nodes in flowcharts (optional accent) |
| **Teal 500** | `#14b8a6` | `teal-500` | **Primary brand color** — h1 underline, diagram strokes, links hover, accent bars |
| **Teal 600** | `#0d9488` | `teal-600` | Links, interactive accent |
| **Teal 700** | `#0f766e` | `teal-700` | h2/h3 headings, inline code text, evidence tags |
| **Teal 800** | `#115e59` | `teal-800` | h1, h4, table header text, strong titles |
| **Slate 900** | `#0f172a` | `slate-900` | Diagram node text, Mermaid labels |
| **Body text** | `#1e293b` | `slate-800` | Body copy on screen |
| **Print body** | `#000000` | — | Body copy in PDF print |
| **White** | `#ffffff` | `white` | Slide/page background, edge labels |

### Custom diagram fills (MVP / export)

| Name | Hex | Usage |
| --- | --- | --- |
| **Node fill** | `#D1FAF5` | Mermaid process/step nodes |
| **Decision fill** | `#99f6e4` | Mermaid decision/diamond nodes |
| **Subgraph fill** | `#f0fdfa` | Mermaid grouped sections (Intake, Output, etc.) |

### Color rules

- **Primary accent:** Teal 500 (`#14b8a6`) for lines, underlines, and diagram connectors.
- **Headings:** Teal 700–800; never pure black on slides — use Teal 800 or Slate 900.
- **Backgrounds:** White base; use Teal 50 for callout boxes, stat highlights, and table headers.
- **Avoid:** Bright cyan, blue link colors, gold/yellow inline code (legacy export style removed).

---

## 2. Typography

### Font families

| Role | Font stack | PPT recommendation |
| --- | --- | --- |
| **Primary (UI & slides)** | `-apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Droid Sans", sans-serif` | **Segoe UI** (Windows) or **SF Pro** (Mac) — both match the export |
| **Monospace (code, endpoints, paths)** | `Menlo, Monaco, Consolas, "Courier New", monospace` | **Consolas** or **Courier New** at ~90% of body size |

> The MVP uses Tailwind system sans-serif (`font-sans`), which resolves to the same system stack above. For Google Slides / Canva, **Inter** or **Segoe UI** are close substitutes.

### Document typography (HTML / PDF / A4)

Base body: **11pt**, line-height **1.5** (print: **1.45**).

| Element | Size | Weight | Color | Other |
| --- | --- | --- | --- | --- |
| **h1 — Document title** | `1.75em` (~**19pt**) | **700** Bold | Teal 800 | 2px bottom border, Teal 500 |
| **h2 — Section** | `1.35em` (~**15pt**) | **600** Semi-bold | Teal 700 | 2px bottom border, Teal 200 |
| **h3 — Subsection** | `1.12em` (~**12pt**) | **600** Semi-bold | Teal 700 | — |
| **h4–h6** | inherit (~**11pt**) | **600** Semi-bold | Teal 800 | — |
| **Body** | **11pt** | 400 Regular | `#1e293b` | line-height 1.5 |
| **Strong / emphasis** | inherit | **600–700** | inherit | — |
| **Links** | inherit | 400 | Teal 600 | underline on hover |
| **Inline code** | **0.88em** (~**10pt**) | **500** Medium | Teal 700 | Teal 50 bg, Teal 100 border |
| **Evidence tags** | **0.92em** (~**10pt**) | **600** Semi-bold | Teal 700 | Teal 50 background |
| **Table headers** | **10pt** (print) | **600** | Teal 800 | Teal 50 background |

### PPT slide typography (recommended)

Scale up for projection readability while keeping the same hierarchy ratios.

| Element | Suggested size | Weight | Color |
| --- | --- | --- | --- |
| **Slide title** | **36–40pt** | **700** Bold | Teal 800 `#115e59` |
| **Slide subtitle / deck title** | **24–28pt** | **600** Semi-bold | Teal 700 `#0f766e` |
| **Section label** (e.g. SLIDE 2) | **14–16pt** | **600** | Teal 600 `#0d9488` |
| **Body bullet** | **18–22pt** | 400 Regular | Slate 800 `#1e293b` |
| **Stat / headline number** | **28–36pt** | **700** | Teal 800 |
| **Caption / footer / date** | **12–14pt** | 400 | Teal 700 or `#475569` (slate-600) |
| **Tagline** | **20–24pt** | **500–600** | Teal 700 |
| **Code / endpoint** | **16–18pt** | **500** | Teal 700 on Teal 50 box |

### Line spacing (PPT)

- **Title slides:** 1.2–1.3
- **Content slides:** 1.4–1.5
- **Dense table slides:** 1.25

---

## 3. Layout & Spacing

### Document (A4)

| Setting | Value |
| --- | --- |
| Page size | A4 |
| Max content width | 210mm |
| Screen padding | 18mm top/bottom, 15mm left/right |
| Print margins | 18mm top, 15mm sides, 20mm bottom |

### PPT (16:9 recommended)

| Setting | Value |
| --- | --- |
| Slide size | 16:9 (1920×1080 or 13.333×7.5 in) |
| Margins | ~5–8% from each edge |
| Title area | Top 15–20% of slide |
| Content area | Middle 60–70% |
| Footer | Presenter name, date, slide number — 12–14pt, Teal 700 |

---

## 4. UI Patterns (for slides & docs)

### Section divider

- **h2 style:** 2px line under title, color Teal 200
- **h1 style:** 2px line under title, color Teal 500 (stronger)

### Callout / evidence box

- Background: Teal 50 `#f0fdfa`
- Left accent bar: 3–4px solid Teal 500
- Text: Teal 700 for labels; body stays slate
- Border radius: 4px

### Tables

- Header row: Teal 50 background, Teal 800 text, 2px Teal 200 bottom border
- Body: white background, standard text

### Blockquote / pull quote

- Teal 50 background
- Left border: Teal 500, 5px
- Use for key insights or taglines on slides

---

## 5. Diagram / Mermaid Theme

Use on architecture, user flow, and SRS diagrams.

### Global Mermaid config

```json
{
  "theme": "base",
  "themeVariables": {
    "primaryColor": "#ccfbf1",
    "primaryTextColor": "#0f172a",
    "primaryBorderColor": "#14b8a6",
    "lineColor": "#14b8a6",
    "secondaryColor": "#f0fdfa",
    "tertiaryColor": "#99f6e4",
    "edgeLabelBackground": "#ffffff",
    "fontSize": "11px"
  },
  "flowchart": {
    "nodeSpacing": 18,
    "rankSpacing": 22,
    "padding": 6,
    "curve": "basis"
  }
}
```

### Node class definitions

```
classDef teal fill:#D1FAF5,stroke:#14B8A6,stroke-width:2px,color:#0F172A;
classDef decision fill:#99f6e4,stroke:#14B8A6,stroke-width:2px,color:#0F172A;
```

### Subgraph styling

```
style L1 fill:#f0fdfa,stroke:#14B8A6,stroke-width:1.5px
```

### PPT diagram tips

- Use **Teal 500** for all arrows and connector lines
- Node fill: `#D1FAF5` or Teal 100; stroke: Teal 500
- Group boxes (subgraphs): Teal 50 fill, Teal 500 border
- Label font: 11–14pt, Slate 900
- Keep diagrams horizontal (`LR`) when possible for slide fit

---

## 6. Slide Template Quick Reference

### Title slide

- Background: white or very subtle Teal 50 gradient (optional)
- **ClearPath** — 40pt Bold, Teal 800
- Subtitle — 24pt Semi-bold, Teal 700
- Tagline — 20pt, Teal 600
- Presenter / date — 14pt, Teal 700
- Optional: thin Teal 500 rule under title

### Content slide

- Slide title — 32–36pt Bold, Teal 800 + Teal 200 underline
- Bullets — 20pt Regular, Slate 800
- Key stat — 32pt Bold, Teal 800 in Teal 50 callout box
- Evidence citation — 14pt Semi-bold, Teal 700 on Teal 50 badge

### Closing / thank-you slide

- Same as title slide hierarchy
- Live demo URL in monospace, Teal 700 on Teal 50

---

## 7. Brand Voice (presentation)

- **Tone:** Clear, evidence-backed, confident but not clinical
- **Safety language:** “Screening, not diagnosis” — use Teal 700 emphasis
- **Stats:** Bold number + short context; cite with evidence tag styling
- **Product name:** Always **ClearPath** (camelCase P)

---

## 8. File Reference

These tokens are implemented in:

- `html/product.html`
- `html/SRS.html`
- `html/research.html`

CSS variables (root):

```css
--cp-teal-50:  #f0fdfa;
--cp-teal-100: #ccfbf1;
--cp-teal-200: #99f6e4;
--cp-teal-500: #14b8a6;
--cp-teal-600: #0d9488;
--cp-teal-700: #0f766e;
--cp-teal-800: #115e59;
--cp-text:     #1e293b;
```

---

*Prepared for ClearPath presentation materials — Bilisuma Tadesse, June 2026.*
