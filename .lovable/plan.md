

## Plan: Live Case Study Demo + Polish to 10/10

### What You Asked
You want a **live interactive demo** that functions as a real case study — showing PSI in action, not just talking about it. Plus overall polish to make this a true 10/10.

### What I'll Build

#### 1. New Component: `LiveCaseStudy.tsx` — Interactive PSI Demo
A fully interactive section where visitors **experience** PSI working in real-time:

- **Scenario**: "MedScan AI — A fictional high-risk medical imaging AI system"
- **Interactive flow** (user clicks through steps):
  - **Step 1**: User sees a sample AI output (e.g., "Patient scan classified as benign — confidence 94.2%")
  - **Step 2**: Click "Register in PSI Ledger" → animated SHA-256 hash generation with real hash output, timestamp, block number
  - **Step 3**: Status shows "COMPLIANT — No Challenge" with a green indicator
  - **Step 4**: User clicks "Simulate Regulator Challenge" → triggers animated fraud proof generation
  - **Step 5**: ZK proof result displayed: "Proof verified. Model compliant with Article 14 (Human Oversight). IP preserved. Cost: $0.003"
- **Live stats sidebar**: Shows running totals — "Outputs Logged: 1,247 | Challenges: 2 | Proofs Generated: 2 | Total Cost: $0.006 vs $1,247,000 (Full ZKML)"
- The hash will be generated using real `crypto.subtle.digest('SHA-256', ...)` for authenticity
- Clear label: "SIMULATED CASE STUDY" — legally safe

#### 2. Polish Issues to Fix
- **BusinessModel.tsx**: Still reveals "10-15% Equity" and "50% Revenue Commission" — will replace with private/NDA-gated messaging ("Terms discussed under NDA")
- **HowItWorks.tsx**: Duplicate section with OptimisticModel (both use `id="how-it-works"`) — will remove `HowItWorks` and keep the superior `OptimisticModel`
- **SocialProofBar**: Metrics start from a fake launch date — will make the language more defensible ("Active Research Engagements" instead of hard counts)
- **Section ordering**: Streamline flow — remove redundant sections

#### 3. Updated Page Flow
```text
Navbar
Hero (WORLD'S FIRST + headline)
CountdownBanner (EU AI Act deadline)
SocialProofBar (defensible metrics)
ProblemSection (the paradox)
SolutionSection (PSI features)
TrioSection (three pillars)
ComparisonTable (why PSI wins)
LiveCaseStudy ← NEW: interactive demo
OptimisticModel (the 4-step model)
VisionSection
ArticlesSection
ResearchReferences
TechSpecs
FAQ
ContactSection
Footer
```

#### 4. Files to Create/Edit
- **Create**: `src/components/LiveCaseStudy.tsx`
- **Edit**: `src/pages/Index.tsx` (add LiveCaseStudy, remove HowItWorks)
- **Edit**: `src/components/BusinessModel.tsx` (remove specific equity/revenue terms)
- **Edit**: `src/components/Navbar.tsx` (add "Demo" nav link)
- **Edit**: `src/components/SocialProofBar.tsx` (safer metric language)

