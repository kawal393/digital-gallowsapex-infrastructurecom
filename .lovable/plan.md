

## Plan: Capture the Rob V Opportunity (3 Coordinated Moves)

### Move 1 — Add Australia-First Positioning Band to Homepage

Insert a new compact section between `Hero` and the existing trust band on `/` that signals Australian regulatory pedigree to Rob V's audience and Australian enterprise buyers landing from his post.

**New file:** `src/components/AustraliaPositioningBand.tsx`

Contents:
- Single-row band, dark card with subtle gold accent border
- Eyebrow chip: "Built in Melbourne · Deployed Globally"
- Headline: "The Cryptographic Evolution of IRAP — for AI"
- Sub-line: "While the world debates frameworks, Australia ships them. APEX PSI extends the operational rigour of ISM/IRAP into runtime AI verification."
- 4 inline pills: `IRAP-Aligned` · `ISM-Mapped` · `NDIS-Ready (76 days)` · `Privacy Act 2026`
- Right side: small `🇦🇺 → 🌏` glyph

**Edit:** `src/pages/Index.tsx` — import and render `<AustraliaPositioningBand />` immediately after `<Hero />`.

### Move 2 — Draft the Public LinkedIn Follow-Up Comment

Deliver as text in chat (not a file). Under 600 chars, factual, references Rob's IRAP point directly, anchors APEX PSI as the runtime-cryptographic extension of his thesis. Includes the IETF draft ID and the 62-predicate / 14-jurisdiction stat. No tags, no attacks, no emojis.

### Move 3 — Draft the Direct Message to Rob V

Deliver as text in chat. 3 paragraphs:
1. Acknowledge his IRAP/ISM thesis with one specific reference to his post
2. Position APEX PSI as runtime-cryptographic IRAP — IETF `draft-singh-psi-00`, MPC consensus, Ed25519 signed Merkle roots
3. Offer the EU AI Act Articles 13 & 14 Technical Implementation Guide PDF and a 20-min walkthrough; link to `digital-gallows.apex-infrastructure.com/protocol`

### Technical Notes

- `AustraliaPositioningBand.tsx` uses existing tokens: `bg-card/80`, `border-primary/20`, `text-chrome-gradient`, `text-gold-gradient`, framer-motion `whileInView` fade — matches `OpenSourceGateway.tsx` styling for visual consistency
- No new dependencies, no DB changes, no edge functions
- Mobile: pills wrap to 2x2 grid below `sm` breakpoint
- All copy is factual and defensible (IRAP/ISM are real Australian frameworks; NDIS 76-day countdown matches existing site copy; Privacy Act 2026 is on the site's regulatory map)

### Out of Scope (Deferred)

- Stale-number sync (55+ → 62+, 12 → 14) — separate dedicated pass
- Pre-launch full link audit — separate pass

