

## Plan: Convert the Meta Review Into Two Defensive Assets

Two small, high-leverage pages. No DB changes, no edge functions, no new dependencies. Both are link-targets for outbound emails and IETF correspondence.

### Asset 1 — Competitive Landscape Page (`/landscape`)

Public page that owns the search results for "PSI vs SCITT", "PSI vs DAAP", "ZKMLOps comparison".

**File:** `src/pages/Landscape.tsx`

**Structure:**
- Hero: "The Toll Booth Where Law, Crypto, and Compliance Meet" + subhead naming the 4 pieces (Protocol / Gallows / Sector / Consumer)
- Comparison table — rows are the 4 pieces, columns are: APEX PSI, ZKMLOps (`arXiv:2510.26576v1`), SCITT VeritasChain (`draft-ietf-scitt-vcp`), Google Longfellow, DAAP v2 (`draft-aylward-daap-v2-00`). Cells: green check / red dash / partial.
- Per-competitor card (5 cards): what they have, what they don't, our differentiator, "interop or compete" verdict. Cite draft IDs verbatim for SEO.
- Closing band: "Net: We didn't invent ZKPs. We invented the toll booth." + CTA to `/protocol` and `/research`
- Footer link added under "Standards"
- Navbar: NOT added (keeps nav clean; surfaced via Research Hub + footer + outbound links)

### Asset 2 — Patent Pledge Page (`/pledge`)

Standalone, lawyer-readable, ~400-word legal-style page. The link you paste into every IETF reply.

**File:** `src/pages/PatentPledge.tsx`

**Structure:**
- Header: "APEX PSI Patent Non-Assertion Pledge" + version + date + Australian Innovation Patent number (AMCZ-2615560564, per `mem://strategy/monopoly-on-verification`)
- Plain-English summary box (3 bullets): what's pledged, what's not, who it covers
- Formal pledge text (4 sections): Scope, Conformant Implementation Definition, Non-Assertion Commitment, Reservations (managed service, specific optimizations)
- "What This Means" table — for: IETF Working Groups / Open Source Implementers / Commercial Users of the Hosted Service / Forks
- Footer: "Questions? legal@apex-infrastructure.com" + link to IETF draft + GitHub
- Navbar: NOT added. Linked from `/protocol`, `InevitabilityDoctrine` component (existing Patent Pledge band), and footer under "Legal"

### Wiring

- `src/App.tsx` — register `/landscape` and `/pledge` routes
- `src/components/Footer.tsx` — add "Competitive Landscape" under Standards column, "Patent Pledge" under Legal column
- `src/components/InevitabilityDoctrine.tsx` — make the existing Patent Pledge text a link to `/pledge`
- `src/pages/Research.tsx` — add a single "See Full Competitive Landscape →" CTA card at the bottom linking to `/landscape`

### Out of Scope

- Homepage hero rewrite to "toll booth" framing — defer until we see if `/landscape` resonates in outbound
- Design Partner Engine (still parked from previous plan; revisit after first 10 outbound emails)
- Stale-number sync (still deferred)
- Full link audit (still deferred)
- New nav items (both pages are link-targets, not browse-targets)

