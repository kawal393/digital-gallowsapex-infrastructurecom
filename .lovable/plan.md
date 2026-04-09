

## Plan: Add "Critiques & Responses" Defense Section

### What
A new homepage section called **"Adversarial Review"** or **"We Address the Hard Questions"** — a bold, transparent section that lists the 4 major technical/legal critiques and shows how the architecture already handles them. This turns criticism into credibility.

### Why
- Pre-empts critics by showing you've already thought through every attack vector
- Builds trust with regulators and technical evaluators who will have the same questions
- No other compliance platform does this — radical transparency becomes a competitive moat

### Implementation

**1. New component: `src/components/AdversarialReview.tsx`**
- 4-card layout, each addressing one critique
- Cards structured as: **Critique** (honest statement of the concern) → **Reality** (how PSI already handles it) → **Source** (link to supporting research)
- The 4 critiques:
  - Oracle Problem → "We notarize attestations, not truth. Like a legal notary."
  - ZKP Transparency → "ZKPs protect model weights only. The ledger itself is fully transparent and Article 14 compliant."
  - Standardization → "First-mover to IETF forces convergence. MIT license ensures the math survives any standard."
  - Liability → "APEX Standards Foundation (ASF) serves as the legal entity wrapper under Article 3(3)."
- Visual style: dark cards with red/amber "critique" headers flipping to gold/green "response" — reinforcing the "challenge → proof" metaphor of the protocol itself
- Include links to the actual critique sources (the references shared) alongside your rebuttals

**2. Add relevant critique sources to `ResearchReferences.tsx`**
- Add 4-6 of the strongest cited sources (the EU AI Act Article 14 link, the ZKP policy review paper, the Springer standardization chapter, the oracle problem papers) under appropriate categories
- This shows you don't hide from criticism — you cite it

**3. Place in Index.tsx**
- Insert after `ComparisonTable` and before `BusinessModel` — the logical position after showing competitive advantages and before showing the business case
- This creates a narrative flow: "Here's why we're better" → "Here's what critics say and why they're wrong" → "Here's the business model"

### Technical Details
- Pure frontend component, no database changes
- Framer Motion animations consistent with existing sections
- Responsive grid: 1 column mobile, 2 columns desktop
- Approximately 150 lines of code

