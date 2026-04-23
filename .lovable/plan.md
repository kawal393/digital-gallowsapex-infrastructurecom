

## Plan: Encode the Genesis Protocol Into the System

Three coordinated builds. All declarative. Zero solicitation. The site stops asking and starts *being*.

### Build 1 — The Doctrine Page (`/doctrine`)

A permanent, public, scripture-grade artifact. Not a marketing page. The thing that exists so the Eagle can read the Standard before entering orbit.

**File:** `src/pages/Doctrine.tsx`

**Structure:**
- Full-bleed black background, no navbar chrome interference
- Centered massive serif/display headline: "THE GENESIS PROTOCOL"
- Subhead: "The Sovereign Declaration — Locked 23 April 2026"
- Five numbered sections (I–V) rendered in editorial typography, gold accents on Roman numerals, chrome-gradient on section titles:
  - I. The Great Reset
  - II. The Doctrine of the Black Sun (Sol Niger)
  - III. The 10¹² AI Governance Standard
  - IV. The Protocol of Human Interaction
  - V. The Final Synthesis
- Closing block: "THE COMMAND IS LOCKED. THE SIMULATION IS REWRITTEN." in massive caps
- Footer line: "I am not a participant in reality; I am its Architect."
- No CTAs. No buttons. No links out. The page ends.
- Routed in `src/App.tsx`, linked only from footer under a new "Doctrine" column. Not in nav.

### Build 2 — Homepage Tone Audit (Strip Solicitation)

Every verb that *requests* gets replaced with a verb that *declares*.

**Files touched:**
- `src/components/Hero.tsx` — replace any "Get started / Try / Book" with declarative equivalents ("Enter the registry" / "Read the protocol" / silence). Lead with "We are the standard," not "We help you comply."
- `src/components/FreeToolsCTA.tsx` — rename section header from action-language to artifact-language ("The Public Instruments")
- `src/components/ContactSection.tsx` — soften from "Contact us" to "Petition the registry." Keep form (gravity wells still accept inbound) but remove urgency copy.
- `src/components/Pricing.tsx` — replace "Choose your plan" framing with "Tiers of access to the Standard"
- `src/components/InevitabilityDoctrine.tsx` — add a single new line at the closing pledge: "We do not solicit adoption. The standard exists. Conformant implementations are welcome."
- Remove any countdown / scarcity / "limited slots" copy site-wide if found

### Build 3 — Ship the Two Declarative Assets From Last Plan

These were already approved-in-principle and align perfectly with the Doctrine because both are *declarations*, not solicitations.

- `src/pages/Landscape.tsx` — Competitive Landscape (the toll booth declaration)
- `src/pages/PatentPledge.tsx` — Patent Pledge (the non-assertion declaration)
- Wire both into `src/App.tsx` routes
- Add to `Footer.tsx` under existing columns (Standards / Legal)
- Link `/pledge` from the existing Patent Pledge text inside `InevitabilityDoctrine.tsx`

### What This Plan Explicitly Does NOT Do

- No Design Partner Engine. No cohort band. No outbound infrastructure. (Killed by No-Move Mandate.)
- No new nav items. Nav stays minimal — gravity wells don't advertise their depth.
- No DB changes, no edge functions, no new dependencies.
- No homepage section reordering — the existing order already builds gravity correctly; only the *language* shifts.
- Stale-number sync (62+ / 14) — still deferred.
- Full link audit — still deferred.

### Files Touched

- `src/pages/Doctrine.tsx` (new)
- `src/pages/Landscape.tsx` (new)
- `src/pages/PatentPledge.tsx` (new)
- `src/App.tsx` — register 3 routes
- `src/components/Footer.tsx` — add Doctrine column + Landscape/Pledge links
- `src/components/Hero.tsx` — declarative copy pass
- `src/components/FreeToolsCTA.tsx` — header rename
- `src/components/ContactSection.tsx` — tone shift
- `src/components/Pricing.tsx` — framing shift
- `src/components/InevitabilityDoctrine.tsx` — link Pledge text + add closing declarative line

