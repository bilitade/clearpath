# ClearPath

**Prepared by:** Bilisuma Tadesse

## Primary Research Dossier

| **Field** | **Details** |
| --- | --- |
| **Document Type** | Primary Research Dossier |
| **Project** | ClearPath — AI-Powered Mental Health Triage and Navigation |
| **Version** | v1.0 — Final Draft |
| **Date** | June 4, 2026 |
| **Companion Documents** | Product Dossier; Software Requirements Specification |

> **Document purpose.** This dossier provides the foundational research layer underpinning the ClearPath product. It establishes the problem, synthesizes the evidence base, and frames the opportunity. Product decisions, design choices, and technical tradeoffs documented in the companion Product Dossier and SRS are traceable back to findings in this document. All claims carry source attribution, reliability ratings, and limitation notes where material.

## Table of Contents

1. [Research Methodology](#1-research-methodology)
2. [The Core Problem: Intent-to-Care Gap](#2-the-core-problem-intent-to-care-gap)
3. [Epidemiology: Scale of Mental Health Need](#3-epidemiology-scale-of-mental-health-need)
4. [Workforce Supply: A Structural Shortage](#4-workforce-supply-a-structural-shortage)
5. [Access Barriers: Where the System Fails](#5-access-barriers-where-the-system-fails)
6. [Economic Impact: The Cost of Inaction](#6-economic-impact-the-cost-of-inaction)
7. [Digital Mental Health: Evidence for Technology Interventions](#7-digital-mental-health-evidence-for-technology-interventions)
8. [Market Context](#8-market-context)
9. [Regulatory and Ethical Landscape](#9-regulatory-and-ethical-landscape)
10. [Competitive Landscape Analysis](#10-competitive-landscape-analysis)
11. [Key Research Conclusions](#11-key-research-conclusions)
12. [References](#12-references)

## 1. Research Methodology

### 1.1 Scope

This research covers the United States mental healthcare access landscape as of 2024–2026. The scope is bounded to:

- Epidemiology of mental illness prevalence and treatment access
- Healthcare workforce supply and shortage projections
- Access barriers including wait times, insurance complexity, and cost
- Economic burden of untreated mental illness, particularly in the workplace
- Evidence for digital and AI-enabled mental health interventions
- Regulatory environment for digital health tools
- Competitive product landscape

### 1.2 Sources Used

Research draws from five tiers of sources, prioritized by reliability:

| Tier | Source Type | Reliability | Examples |
| --- | --- | --- | --- |
| **1 — Primary Federal** | Federal agencies, government surveys | High | SAMHSA NSDUH, HRSA Workforce Data, CDC/NCHS, FDA Guidance |
| **2 — Peer-Reviewed** | Academic journals, RCTs, systematic reviews | High | BMJ Open, Psychiatric Services, Nature Communications Medicine, PMC/NCBI |
| **3 — Policy/Advocacy** | Nonpartisan policy institutes, professional bodies | Moderate-High | Commonwealth Fund, APA, NAMI, Gallup, IFEBP |
| **4 — Market Research** | Commercial market-sizing firms | Moderate | SNS Insider, Mordor Intelligence, Straits Research |
| **5 — Industry/Vendor** | Proprietary studies, vendor reports | Moderate (directional only) | Wysa, Woebot, Big Health |

### 1.3 Reliability Conventions

Throughout this document, reliability labels are applied as follows:

- **[High]** — Federal primary source or peer-reviewed publication; methodology is documented and reproducible
- **[Moderate-High]** — Professional body or nonpartisan policy institute citing primary data; methodology partially documented
- **[Moderate]** — Advocacy, commercial, or vendor synthesis; directional use only; noted where estimates vary materially across firms
- **[Directional only]** — Proprietary, non-peer-reviewed, or self-reported industry data; cited for illustration, not as definitive

### 1.4 Verification Process

Key statistics were cross-checked against primary federal and peer-reviewed sources before inclusion. Figures are attributed to the primary source even when first encountered via a secondary synthesis. Where a statistic is commonly misquoted in industry summaries, the body text states the precise definition, scope, and limitation inline — for example, wait-time benchmarks scoped to community mental health centers, or economic figures distinguished by component and time horizon.

## 2. The Core Problem: Intent-to-Care Gap

### 2.1 Framing

> **The critical failure in U.S. mental healthcare is not a lack of willingness to seek help — it is the system's structural inability to convert that intent into care quickly and correctly.**

When a motivated adult decides to seek mental health support today, they face a sequence of friction points that — individually — might be surmountable, but together create a systemic failure:

1. **No structured self-assessment** — there is no validated, accessible tool to help them understand what type of care they actually need before they begin searching
2. **Invisible availability** — directories show who exists, not who is accepting new patients
3. **Insurance opacity** — coverage is often unknown until after the first visit
4. **Long waits** — even when a suitable provider is found, waiting weeks to months is standard
5. **No step-down logic** — the system defaults to weekly individual therapy regardless of clinical need, bypassing evidence-based stepped-care models

The outcome: people either never enter care, enter mismatched care, or abandon the process entirely after weeks of fruitless effort.

### 2.2 Primary User Profile

The target user is not the most acutely ill — that population is served (imperfectly) by crisis systems. The most underserved population is the large, commercially accessible middle:

| Attribute | Profile |
| --- | --- |
| **Age range** | 25–45 years |
| **Employment status** | Employed, often with employer-sponsored insurance |
| **Digital literacy** | Moderate to high |
| **Clinical state** | Mild-to-moderate anxiety or depression; not in acute crisis |
| **Behavioral pattern** | Has searched for help; hit walls of unavailability; stalled |
| **Primary need** | Fast, personalized, actionable guidance — not generic information |

**Why this user:** They are large in number (tens of millions), commercially reachable through employer benefit channels, capable of completing a digital intake, and most harmed by the intent-to-care gap. Their treatment gap drives the largest share of measurable economic loss.

## 3. Epidemiology: Scale of Mental Health Need

### 3.1 Prevalence of Mental Illness

**Finding:** In 2024, approximately **61.5 million U.S. adults (23.4%)** met criteria for any mental illness (AMI). Of these, only **52.1% received any mental health treatment** in the past year, leaving approximately **29.5 million adults (48%) with no treatment** despite meeting diagnostic criteria. **[High]**

> **Source:** Substance Abuse and Mental Health Services Administration (SAMHSA). (2025). *Key Substance Use and Mental Health Indicators in the United States: Results from the 2024 National Survey on Drug Use and Health (NSDUH).* [1]
>
> **Limitation:** Self-report; stigma likely causes underreporting. Cross-sectional design captures prevalence at a point in time. Figures match SAMHSA published tables (61.5 million / 23.4%).

### 3.2 Substance Use Disorders

**Finding:** The treatment gap is even wider for substance use disorders: approximately **80% of people** who needed treatment in 2024 did not receive it. **[High]**

> **Source:** SAMHSA NSDUH 2024 [1, 4]
>
> **Limitation:** Same survey caveats as §3.1 above.

### 3.3 Depression and Income Disparity

**Finding:** Federal data consistently show depression prevalence is substantially higher among lower-income adults than higher-income adults across survey cycles. **[High]**

> **Source:** CDC/NCHS data briefs, multiple cycles
>
> **Note:** The specific income-to-prevalence multiplier varies by survey year and design. This is stated as a directional finding rather than a fixed ratio; citing a specific multiplier from any single cycle risks false precision.

### 3.4 Summary Table

| Metric | Value | Year | Source |
| --- | --- | --- | --- |
| U.S. adults with any mental illness | 61.5 million (23.4%) | 2024 | SAMHSA NSDUH [1, 4] |
| Of those, received no treatment | ~48% (~29.5 million) | 2024 | SAMHSA NSDUH [1, 4] |
| SUD treatment gap | ~80% | 2024 | SAMHSA NSDUH [1] |

## 4. Workforce Supply: A Structural Shortage

### 4.1 Geographic Access Shortage

**Finding:** As of **December 2, 2025, 40% of the U.S. population — approximately 137 million people** — lives in a federally designated Mental Health Professional Shortage Area (Mental Health HPSA). **[High]**

> **Source:** HRSA, National Center for Health Workforce Analysis. (December 2025). *Behavioral Health Workforce Brief 2025.* [9]
>
> **Note:** HPSA designations are updated regularly; this figure reflects the December 2, 2025 data snapshot published in the brief.

### 4.2 Psychiatrist Supply

**Finding:** There were **52,164 psychiatrists** in the United States as of 2023. Federal workforce projection models indicate substantial shortages across multiple behavioral health professions are projected to persist through the 2030s. **[High]**

> **Source:** HRSA Behavioral Health Workforce Brief 2025 [9]
>
> **Limitation:** Supply-demand modeling involves assumptions about utilization rates, population growth, and provider productivity; projections carry inherent uncertainty.

### 4.3 Psychologist Availability

**Finding:** A majority of psychologists surveyed by the American Psychological Association report **not accepting new patients**. Among those with active waitlists, average waits of **three months or longer** are common. **[Moderate-High]**

> **Source:** American Psychological Association practitioner workforce surveys, 2023 [20]
>
> **Limitation:** Self-selected respondent pool; may overrepresent busier practitioners. Results are from a 2023 survey and may not reflect 2025–2026 conditions precisely.

### 4.4 Summary Table

| Metric | Value | Year | Source |
| --- | --- | --- | --- |
| Population in Mental Health HPSA | 40% (137 million) | Dec 2, 2025 | HRSA Workforce Brief 2025 [9] |
| Total U.S. psychiatrists | 52,164 | 2023 | HRSA Workforce Brief 2025 [9] |
| Psychologists not accepting new patients | Majority | 2023 | APA practitioner survey [20] |

## 5. Access Barriers: Where the System Fails

### 5.1 Wait Times

**Finding — Community Mental Health Centers:** The national average wait between a client's first outreach or referral and their first appointment at **community mental health centers** is **48 days**, according to an MTM Services analysis of approximately 10,000 care-access flowcharts from approximately 1,000 centers across 47 states, cited by the National Council for Mental Wellbeing. **[Moderate-High]**

> **Source:** National Council for Mental Wellbeing / MTM Services. *CCBHC Impact Report* [16]
>
> **Important scope note:** This figure is specific to community mental health centers and the 2021 analysis period. It is the most-cited national wait-time benchmark but should not be generalized as a universal behavioral health appointment average across all care settings or years.

**Finding — Patient-Reported Waits:** A peer-reviewed cross-sectional survey found mean reported wait times of **94.1 days**, with **85.2% of respondents** characterizing their wait as too long. **[High]**

> **Source:** Subotic-Kerry, M. et al. (2025). *While they wait: a cross-sectional survey on wait times for mental health services.* BMJ Open, 15(3), e087342. [18]
>
> **Limitation:** International sample; U.S.-specific figures may differ from the aggregate mean.

**Finding — Psychiatrist Availability:** A 2022 mystery-shopper study found only approximately **18.5% of psychiatrists** available to new patients in a five-state sample; the median in-person wait was **67 days** and the median telepsychiatry wait was **43 days**. **[High]**

> **Source:** Mullangi, S. et al. (2023). *Low availability, long wait times, and high geographic disparity of psychiatric outpatient care in the US.* Psychiatric Services. [21]
>
> **Limitation:** Five-state sample; 2022 data; may not fully represent national conditions.

### 5.2 Insurance and Cost Barriers

**Finding — Cost:** Roughly **1 in 5 Americans** delayed or did not receive mental health care due to cost. **[Moderate-High]**

> **Source:** Commonwealth Fund. (November 2024). *State of Health Insurance Coverage in the U.S.: 2024 Biennial Survey.* [10]

**Finding — In-Network Access:** About **1 in 3 people** with private insurance reported difficulty finding an in-network mental health therapist and were more likely to seek out-of-network care compared to medical/surgical care. **[Moderate]**

> **Source:** NAMI survey data, via insurance/MHPAEA analysis [15]
>
> **Limitation:** Advocacy survey; methodology not fully detailed; exact ratio varies by source year.

**Finding — Parity Gaps:** Out-of-network utilization for behavioral health is materially higher than for medical/surgical care. Mental health parity enforcement remains variable across states and federally. **[High]**

> **Source:** Commonwealth Fund [11, 14]; parity synthesis [13]

### 5.3 Structural Failures in the Current System

| Failure Mode | Description |
| --- | --- |
| **Unstructured intake** | Patients self-refer with no validated symptom data; clinicians re-collect what PHQ-9/GAD-7 capture in minutes |
| **Undirected matching** | Directories match on keyword and geography, not clinical severity or specialty need |
| **Invisible wait times** | Little real-time availability data; users apply in parallel with no feedback loop |
| **Insurance opacity** | Coverage often unknown until after the first visit |
| **No stepped-care logic** | Defaults to weekly individual therapy regardless of need, bypassing evidence-based stepped-care models |
| **Passive crisis handling** | Most tools display a hotline number; few implement active triage protocols |

### 5.4 Summary Table

| Metric | Value | Setting/Notes | Source |
| --- | --- | --- | --- |
| Average first-outreach-to-appointment wait | 48 days | Community mental health centers (2021) | National Council / MTM [16] |
| Patient-reported mean wait | 94.1 days | Cross-sectional survey; international sample | Subotic-Kerry et al. 2025 [18] |
| Psychiatrists accepting new patients | ~18.5% | Five-state mystery-shopper, 2022 | Mullangi et al. 2023 [21] |
| Median in-person psychiatry wait | 67 days | Same study | Mullangi et al. 2023 [21] |
| Delayed care due to cost | ~1 in 5 Americans | Commonwealth Fund 2024 | [10] |
| Difficulty finding in-network therapist | ~1 in 3 privately insured | NAMI survey | [15] |

## 6. Economic Impact: The Cost of Inaction

### 6.1 Total Avoidable Cost of Mental Health Inequities

**Finding:** Mental health inequities in the United States cost an estimated **$477.5 billion in avoidable or unnecessary expenditures in 2024**, spanning chronic physical health conditions, emergency department overutilization, productivity loss, and premature death. Annual costs are projected to reach approximately **$1.3 trillion by 2040**, with cumulative costs from 2024–2040 approaching **$14 trillion**. **[Moderate-High]**

> **Source:** Deloitte Health Equity Institute & Meharry School of Global Health (Dawes, D. et al.). (May 2024). *The Projected Costs and Economic Impact of Mental Health Inequities in the United States.* [27]
>
> **Critical nuance:** The $477.5 billion figure represents the **total avoidable cost of mental health inequities** — it is not lost productivity alone. Of that total, productivity loss accounts for approximately **$116 billion**. The $14 trillion figure is a **cumulative** projection over 2024–2040, not an annual figure.

### 6.2 Workplace Absence Cost

**Finding:** Unplanned absences attributable to poor employee mental health cost the U.S. economy an estimated **$47.6 billion annually**. **[Moderate-High]**

> **Source:** Gallup. (2023, updated 2025). *The Economic Cost of Poor Employee Mental Health.* Sample size approximately 15,000+. [26]
>
> **Limitation:** Self-reported; absence attribution methodology is subject to recall bias.

### 6.3 Depression and Lost Productive Time

**Finding:** Depression alone is associated with approximately **$44 billion per year** in lost productive time among U.S. workers. **[Moderate]**

> **Source:** Industry synthesis citing Stewart et al. and related research, 2024 [29]
>
> **Limitation:** Derived from cost-of-illness modeling; productivity valuation methodologies vary.

### 6.4 Employer Awareness Gap

**Finding:** Roughly **half of employees** report not knowing how to access mental health care through their employer. **[Moderate]**

> **Source:** Workplace mental health survey synthesis (NAMI/Gallup/APA/Mind Share Partners), 2026 [25]
>
> **Limitation:** Self-reported; composite from multiple surveys with differing samples and years.

### 6.5 Summary Table

| Economic Metric | Value | Notes | Source |
| --- | --- | --- | --- |
| Avoidable cost of mental health inequities (U.S., 2024) | $477.5 billion | Total — includes chronic conditions, ED overuse, productivity loss, premature death | Deloitte/Meharry [27] |
| Of that: productivity loss component | ~$116 billion | Subset, not the whole | Deloitte/Meharry [27] |
| Projected annual cost (mental health inequities, 2040) | ~$1.3 trillion | Annual estimate | Deloitte/Meharry [27] |
| Projected cumulative cost (2024–2040) | ~$14 trillion | Multi-year cumulative | Deloitte/Meharry [27] |
| Absence costs from poor mental health | ~$47.6 billion/year | Employer perspective | Gallup [26] |
| Lost productive time from depression | ~$44 billion/year | Worker perspective | Industry synthesis [29] |

## 7. Digital Mental Health: Evidence for Technology Interventions

### 7.1 Generative AI and CBT Engagement

**Finding:** A 2026 randomized controlled trial (N=540) found that a generative-AI-enabled cognitive behavioral therapy (CBT) application significantly enhanced participant engagement compared to digital workbooks among adults with elevated anxiety or depression symptoms. **[High]**

> **Source:** McFadyen et al. (January 15, 2026). *Increasing engagement with CBT using generative AI: a randomized controlled trial.* Communications Medicine (Nature Portfolio). [35]
>
> **Limitation:** Open-label design; outcomes measured by self-report; single-country sample; generalizability to other settings requires confirmation.

### 7.2 AI-Supported CBT vs. Face-to-Face

**Finding:** A 2024–2025 comparative study found AI-supported digital CBT showed **comparable effectiveness** to face-to-face CBT for generalized anxiety, while requiring substantially less clinician time per patient. **[High]**

> **Source:** PMC/NCBI. (2024–2025). *Combining Artificial Intelligence and Human Support in Mental Health.* PMC12117275. [34]
>
> **Limitation:** Propensity-matching design, not a fully randomized head-to-head trial; self-selection effects possible.

### 7.3 Early AI Companion Evidence

**Finding:** Woebot's foundational randomized controlled trial demonstrated statistically significant reduction in PHQ-9 depression scores within **two weeks** of use among college students with anxiety and depression. **[Moderate-High (directional)]**

> **Source:** Industry summary of the Woebot RCT results, citing a published peer-reviewed trial [33]
>
> **Limitation:** Original RCT conducted in a specific population (college students); generalizability to working adults is not established by this study alone.

### 7.4 AI Crisis Detection

**Finding:** Wysa, a conversational AI mental health platform, reported that its AI system flagged **82% of crisis incidents** compared to only 18% identified through user self-report, across a dataset of approximately 19,000 users. **[Directional only]**

> **Source:** Wysa / BusinessWire. (April 15, 2024). Business wire press release. [55]
>
> **Limitation:** Proprietary, non-peer-reviewed data; possible selection bias; not independently validated. This figure is cited directionally to support the feasibility of AI-based crisis detection, not as a precision benchmark.

### 7.5 Evidence Quality Summary

| Intervention | Evidence Level | Finding |
| --- | --- | --- |
| Generative AI + CBT (engagement) | RCT — High | Significant improvement in engagement vs. digital workbooks |
| AI-supported vs. face-to-face CBT | Comparative study — High | Comparable effectiveness; lower clinician time |
| AI chatbot (PHQ-9 reduction) | RCT (specific population) — Moderate-High | Significant PHQ-9 reduction within 2 weeks |
| AI crisis detection | Proprietary — Directional only | 82% crisis flag rate claimed; not peer-reviewed |

## 8. Market Context

### 8.1 Market Size

**Finding:** The U.S. mental health apps market was valued at approximately **$3.87 billion in 2025** and is projected to reach approximately **$18.14 billion by 2035**, representing a CAGR of approximately 16.8%. The global market is projected at approximately **$45.12 billion by 2035**. **[Moderate]**

> **Source:** SNS Insider (via GlobeNewswire/Yahoo Finance). (February 2026). [40]
>
> **Important note:** Market-sizing estimates vary materially across research firms. At least one other firm estimates the U.S. market at approximately $2.31 billion in 2025. These figures are directional; significant variance in methodology and market definition drives the divergence.

### 8.2 Employer Market Dynamics

**Finding:** Employer investment in digital mental health benefits has been **expanding year over year**. More employers are offering virtual/EAP mental health resources, and more are gaining access to utilization data. **[Moderate]**

> **Source:** International Foundation of Employee Benefit Plans. (2024). *Mental Health and Substance Use Disorder Benefits: 2024 Survey.* [30]

**Finding:** North America is the largest regional segment of the digital mental health market, with enterprise growth driven by **self-insured employers** adopting workforce mental health platforms. **[Moderate]**

> **Source:** Mordor Intelligence. (2026). *Mental Health Apps Market Report.* [43]

### 8.3 Mid-Market Gap

Research synthesis indicates a measurable gap at the **mid-market employer tier** (200–5,000 employees):

- Large enterprise platforms (e.g., Spring Health, Lyra) are clinically validated but cost-structured for Fortune 500 employers
- Teletherapy marketplaces (e.g., BetterHelp, Talkspace) operate in closed ecosystems and do not connect users to external or in-person providers
- AI wellness companions (e.g., Woebot, Wysa) focus on ongoing support, not triage and navigation
- Provider directories (Psychology Today, Zocdoc) offer large databases but no validated clinical intake or severity-matched routing

## 9. Regulatory and Ethical Landscape

### 9.1 FDA Regulatory Framework

**Finding:** The FDA's **General Wellness Policy for Low Risk Devices** (2020) provides a relevant framework for digital health tools that promote wellness generally and are not intended to treat, diagnose, cure, or mitigate a specific disease. **[High — Primary regulatory source]**

> **Source:** FDA. (September 27, 2020). *General Wellness: Policy for Low Risk Devices.* [54]
>
> **Application:** A triage and navigation tool using validated screening instruments (PHQ-9/GAD-7) — without making diagnostic claims — is intended to be positioned within this framework. A formal regulatory assessment must be completed prior to launch.

**Finding:** Mounting regulatory and legal pressure exists for AI mental health tools, with increasing FDA scrutiny of products making clinical claims beyond general wellness. **[Moderate-High]**

> **Source:** Gardner Law. (September 25, 2025). *AI Mental Health Tools Face Mounting Regulatory and Legal Pressure.* [52]; Sidley Austin LLP. (2026). *U.S. FDA and CMS Actions on Generative AI-Enabled Mental Health Devices.* [51]

### 9.2 HIPAA Considerations

For digital health products:

- A product that stores no personally identifiable health information and has no covered-entity relationship has limited HIPAA obligations in prototype/MVP form
- A formal legal review is required before any pilot involving identified employee data
- A HIPAA-compliant architecture (including Business Associate Agreements) is a prerequisite for employer or insurer pilots with identified user data

### 9.3 Mental Health Parity

**Finding:** The Mental Health Parity and Addiction Equity Act (MHPAEA) requires that mental health and SUD benefits not be subject to more restrictive limitations than medical/surgical benefits. Enforcement remains variable at the state level and federal rulemaking is ongoing. Payers need demonstrable triage infrastructure to support parity compliance. **[High]**

> **Source:** Commonwealth Fund [11, 14]; parity synthesis [13]

### 9.4 Key Ethical Considerations

| Consideration | Research Finding | Implication |
| --- | --- | --- |
| **Scope of practice** | PHQ-9 and GAD-7 are validated screening tools, not diagnostic instruments | Product must make no diagnostic claims; defer interpretation to licensed providers |
| **Algorithmic bias** | Matching may underserve rural ZIPs, Medicaid enrollees, non-English speakers | Require "no matches" fallback; plan demographic-parity audits |
| **Stigma and language** | Validated questionnaire wording reduces stigma vs. open free-text requests | Use verbatim validated instrument wording; avoid clinical jargon |
| **Informed consent** | User must understand scope, data use, and limitations before beginning | Clear intake disclaimers required |

## 10. Competitive Landscape Analysis

### 10.1 Category Map

| Category | Representative Products | Core Strength | Critical Gap |
| --- | --- | --- | --- |
| **Provider directories** | Psychology Today, Zocdoc | Large, searchable databases | No validated intake; no clinical severity matching |
| **Teletherapy marketplaces** | BetterHelp, Talkspace | Scale, brand recognition, accessibility | Closed ecosystems; no routing to external or in-person providers |
| **Enterprise workforce platforms** | Spring Health, Lyra Health | Clinically validated; enterprise-grade infrastructure | Higher cost structure; designed for large employers (5,000+) |
| **AI companions** | Woebot, Wysa | Clinically studied AI for ongoing support | Ongoing support focus, not triage and navigation |
| **Wellness / meditation** | Headspace, Calm | Strong B2B distribution base | Wellness, not clinical-severity navigation |
| **EAP platforms** | Various | Established employer relationships | Often underutilized; limited structured intake |

### 10.2 Differentiation Opportunity

The research identifies a differentiated position for an **AI-first triage-and-match product** targeting the **mid-market employer segment (200–5,000 employees)** with validated clinical intake as the core engine:

- Validated instruments (PHQ-9/GAD-7) provide a clinical foundation that directory-style products lack
- Deterministic, auditable scoring (not LLM-generated) addresses the primary clinical risk of AI health tools
- Mid-market pricing and a B2B SaaS model fills the gap between consumer-facing apps and large-enterprise platforms
- A navigation-and-match design — rather than ongoing support — avoids the regulatory surface area of therapeutic tools

> **Note:** This differentiation analysis is based on desk research and public product information as of 2026. It represents a positioning observation, not a comprehensive competitive audit. Direct competitive analysis with current feature parity mapping should be conducted prior to launch.

## 11. Key Research Conclusions

The following conclusions are supported by the evidence reviewed and directly inform the product and business decisions documented in the companion Product Dossier:

**C1. The scale of unmet need is large and measurable.** Approximately 29.5 million adults with mental illness received no treatment in 2024. This is a quantifiable, addressable population, not an amorphous concept.

**C2. The primary failure is structural, not motivational.** The access barriers documented — wait times, insurance opacity, lack of self-assessment tools, and absent matching logic — are system failures that technology can meaningfully reduce without requiring regulatory or policy change.

**C3. The economic case for employer buyers is strong.** Combined, absence-related mental health costs (~$47.6B/year), depression productivity losses (~$44B/year), and the broader avoidable cost of mental health inequities (~$477.5B/year) create a clear ROI case for employer-sponsored navigation tools.

**C4. AI-enabled interventions have an emerging evidence base.** The 2026 RCT by McFadyen et al. and the 2024–2025 PMC comparative study provide meaningful evidence that AI-augmented CBT and digital interventions can achieve outcomes comparable to traditional delivery at lower cost. Crisis detection evidence from Wysa is directional but consistent with the theoretical basis.

**C5. The regulatory pathway is navigable with clear scope limits.** Positioning a triage-and-navigation tool as a general wellness product (not SaMD), using validated screening instruments without diagnostic claims, and ensuring deterministic (not LLM-generated) clinical scoring represents a defensible and achievable regulatory posture.

**C6. A mid-market product gap exists.** No currently dominant product serves the 200–5,000-employee employer segment with validated clinical intake, deterministic scoring, and multi-provider routing at accessible price points.

## 12. References

All references are presented with: publication year, source type, and reliability rating. Where a figure originates from a primary source, it is attributed to that source even if first encountered via a secondary synthesis.

**[1]** Substance Abuse and Mental Health Services Administration (SAMHSA). (2025). *Key Substance Use and Mental Health Indicators in the United States: Results from the 2024 National Survey on Drug Use and Health (NSDUH).* Federal survey. **[High]**
https://www.samhsa.gov/data/sites/default/files/reports/rpt56287/2024-nsduh-annual-national/2024-nsduh-annual-national.htm

**[4]** SAMHSA. (2025). *2024 NSDUH Annual National Report (full report).* Federal survey. **[High]** Primary source for the 61.5 million / 23.4% and treatment-gap figures.
https://www.samhsa.gov/data/sites/default/files/reports/rpt56287/2024-nsduh-annual-national-report.pdf

**[5]** U.S. Government Accountability Office. (October 27, 2022). *Behavioral Health: Available Workforce Information and Federal Actions.* GAO-23-105250. **[High]**
https://www.gao.gov/products/gao-23-105250

**[9]** HRSA, National Center for Health Workforce Analysis. (December 2025). *Behavioral Health Workforce Brief 2025.* Federal agency. **[High]** Primary source for HPSA data (40%/137M, as of December 2, 2025) and psychiatrist count (52,164 in 2023).
https://bhw.hrsa.gov/sites/default/files/bureau-health-workforce/data-research/Behavioral-Health-Workforce-Brief-2025.pdf

**[10]** Commonwealth Fund. (November 21, 2024). *State of Health Insurance Coverage in the U.S.: 2024 Biennial Survey.* Nonpartisan policy institute. **[High]**
https://www.commonwealthfund.org/publications/surveys/2024/nov/state-health-insurance-coverage-us-2024-biennial-survey

**[11]** Commonwealth Fund. (August 5, 2024). *Enforcing Mental Health Parity: State Options to Improve Access to Care.* Policy brief; qualitative 10-state sample. **[Moderate-High]**
https://www.commonwealthfund.org/publications/issue-briefs/enforcing-mental-health-parity-state-options-improve-access-care

**[13]** Parity-tracking synthesis (ParityTrack / KFF / Commonwealth Fund / DOL). (2026). *Mental Health Parity Laws by State.* Multi-source commercial synthesis. **[Moderate]**
https://www.moneygeek.com/insurance/health/mental-health-parity/

**[14]** Commonwealth Fund. (May 25, 2023). *Building on Behavioral Health Parity: State Options to Strengthen Access.* Nonpartisan policy. **[High]**
https://www.commonwealthfund.org/blog/2023/building-behavioral-health-parity-state-options-strengthen-access-care

**[15]** NAMI survey data (via insurance/MHPAEA analysis). (2024). *Mental Health Parity Update.* Advocacy survey. **[Moderate]** Methodology not fully detailed; exact ratio varies by source.
https://w3ins.com/news/mental-health-parity-update-2024/

**[16]** National Council for Mental Wellbeing / MTM Services. *CCBHC Impact Report.* MTM Services analysis of ~10,000 care-access flowcharts from ~1,000 centers across 47 states, 2021. **[Moderate-High]** Specific to community mental health centers; not a universal behavioral health average.
https://www.thenationalcouncil.org/eliminate-barriers-to-access/

**[18]** Subotic-Kerry, M. et al. (2025). *While they wait: a cross-sectional survey on wait times for mental health services.* BMJ Open, 15(3), e087342. Peer-reviewed. **[High]** Limitation: international sample.
https://bmjopen.bmj.com/content/15/3/e087342

**[19]** American Psychiatric Association / Psychiatric Services. (April 1, 2025). *Elimination of Behavioral Health Wait Times.* Psychiatric Services, 76(4), 398–401. Peer-reviewed. **[High]**
https://psychiatryonline.org/doi/10.1176/appi.ps.20240287

**[20]** NPR / American Psychological Association. (December 6, 2023). *Psychologists keep long waitlists as they struggle to meet demand for mental health care.* APA practitioner survey. **[Moderate-High]** Limitation: self-selected respondents.
https://www.npr.org/sections/health-shots/2023/12/06/1217487323/psychologists-waitlist-demand-mental-health-care

**[21]** Mullangi, S. et al. (2023). *Low availability, long wait times, and high geographic disparity of psychiatric outpatient care in the US.* Psychiatric Services / ScienceDirect. Peer-reviewed. **[High]** Limitation: five-state, 2022 data.
https://www.sciencedirect.com/science/article/abs/pii/S0163834323000877

**[23]** PMC / NCBI. (2022). *Waiting Lists for Psychotherapy and Provider Attitudes Toward Low-Intensity Treatments.* PMC9526124. Peer-reviewed. **[High]**
https://pmc.ncbi.nlm.nih.gov/articles/PMC9526124/

**[25]** Workplace mental health statistics synthesis (NAMI / Gallup / APA / Mind Share Partners). (2026). Commercial synthesis citing primary sources. **[Moderate]**
https://growtherapy.com/blog/workplace-mental-health-statistics/

**[26]** Gallup. (2023, updated 2025). *The Economic Cost of Poor Employee Mental Health.* Polling organization; sample size approximately 15,000+. **[Moderate-High]** Limitation: self-reported; absence attribution methodology subject to recall bias.
https://www.gallup.com/workplace/404174/economic-cost-poor-employee-mental-health.aspx

**[27]** Deloitte Health Equity Institute & Meharry School of Global Health (Dawes, D. et al.). (May 2024). *The Projected Costs and Economic Impact of Mental Health Inequities in the United States.* **[Moderate-High]** Primary source for $477.5B (2024 avoidable cost of mental health inequities), ~$116B productivity component, ~$1.3T annual by 2040, ~$14T cumulative by 2040.
https://www2.deloitte.com/us/en/insights/industry/health-care/economic-burden-mental-health-inequities.html

**[29]** Industry synthesis citing Stewart et al. and related research. (2024). *The Hidden Costs of Neglecting Mental Health in the Workplace.* ~$44B/year lost productive time from depression. **[Moderate]**
https://www.bighealth.com/blog/the-hidden-costs-of-neglecting-mental-health-in-the-workplace

**[30]** International Foundation of Employee Benefit Plans. (2024). *Mental Health and Substance Use Disorder Benefits: 2024 Survey.* Industry survey. **[Moderate]**
https://blog.ifebp.org/mental-health-and-substance-use-disorders-employers-improve-response-but-employees-continue-to-struggle/

**[33]** Industry summary of Woebot RCT results. (2026). Cites a published peer-reviewed RCT. **[Moderate]**
https://amworldgroup.com/blog/ai-therapy-apps

**[34]** NCBI PMC. (2024–2025). *Combining Artificial Intelligence and Human Support in Mental Health.* PMC12117275. Peer-reviewed. **[High]** Limitation: propensity-matching design.
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12117275/

**[35]** McFadyen et al. (January 15, 2026). *Increasing engagement with CBT using generative AI: a randomized controlled trial.* Communications Medicine (Nature Portfolio). Peer-reviewed RCT. **[High]** Limitation: open-label; self-report outcomes.
https://www.nature.com/articles/s43856-025-01321-8

**[36]** Torous, J. et al. (2025). *The evolving field of digital mental health.* World Psychiatry. Peer-reviewed. **[High]**
https://onlinelibrary.wiley.com/doi/10.1002/wps.21299

**[40]** SNS Insider (via GlobeNewswire/Yahoo Finance). (February 27, 2026). *Mental Health Apps Market Size.* U.S.: $3.87B (2025) to $18.14B (2035), CAGR ~16.8%; global to ~$45.12B (2035). Market research. **[Moderate]** Estimates vary widely across firms.
https://finance.yahoo.com/news/mental-health-apps-market-size-091500341.html

**[41]** Straits Research. (March 5, 2026). *Mental Health Apps Market.* Market research. **[Moderate]**
https://straitsresearch.com/report/mental-health-apps-market

**[43]** Mordor Intelligence. (2026). *Mental Health Apps Market Report.* Market research. **[Moderate]**
https://www.mordorintelligence.com/industry-reports/mental-health-apps

**[49]** Industry submission to FDA. (2025). *Response: Docket No. FDA-2025-N-2338.* FDA public comment docket. **[Moderate]**
https://downloads.regulations.gov/FDA-2025-N-2338-0033/attachment_1.pdf

**[50]** medRxiv. (2026). *Suicide- and crisis-risk detection using large language models in mental-health chatbots.* Pre-print, under review. **[Moderate — not yet peer-reviewed]**
https://www.medrxiv.org/

**[51]** Sidley Austin LLP. (2026). *U.S. FDA and CMS Actions on Generative AI-Enabled Mental Health Devices Yield Insights Across AI.* Legal analysis. **[High for regulatory summary]**
https://www.sidley.com/en/insights/newsupdates/2025/11/us-fda-and-cms-actions-on-generative-ai-enabled-mental-health-devices-yield-insights-across-ai

**[52]** Gardner Law. (September 25, 2025). *AI Mental Health Tools Face Mounting Regulatory and Legal Pressure.* Legal analysis. **[Moderate-High]**
https://gardner.law/news/legal-and-regulatory-pressure-on-ai-mental-health-tools

**[53]** PMC / NCBI. (2025). *Framework to Assist Stakeholders in Technology Evaluation for Recovery (FASTER).* PMC12044955. Peer-reviewed. **[High]**
https://pmc.ncbi.nlm.nih.gov/articles/PMC12044955/

**[54]** U.S. Food and Drug Administration. (September 27, 2020). *General Wellness: Policy for Low Risk Devices — Guidance for Industry and Food and Drug Administration Staff.* Primary regulatory guidance. **[High]**
https://www.fda.gov/media/90652/download

**[55]** Wysa / BusinessWire. (April 15, 2024). *AI Detects 82% of Mental Health App Users in Crisis.* Industry study, N approximately 19,000. **[Directional only]** Proprietary, not peer-reviewed; possible selection bias.
https://markets.financialcontent.com/pennwell.elp/article/bizwire-2024-4-15-ai-detects-82-of-mental-health-app-users-in-crisis-finds-wysa
