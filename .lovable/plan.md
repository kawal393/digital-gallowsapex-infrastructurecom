

## Plan: Visibility Fix + Test Run + Toolset Audit

### Issue 1 — Australia Band Not Visible (Real Bug)

**Root cause:** `Hero` uses `min-h-screen` (line 19). On mobile (384x620), it consumes the full viewport, pushing `AustraliaPositioningBand` below the fold. The band IS rendering correctly — it's just hidden by an oversized hero.

**Fix:** Two coordinated changes in `src/components/AustraliaPositioningBand.tsx`:
1. Reduce top padding on mobile (`pt-2 sm:pt-10`) so the band hugs the hero on small screens
2. Add a subtle scroll-cue: small "↓ Australia-First" pill anchored at the bottom of `Hero.tsx` only on mobile, hinting that more content sits below

Plus a one-line tweak in `src/components/Hero.tsx`: change `min-h-screen` → `min-h-[calc(100vh-4rem)] md:min-h-screen` so on mobile the hero is shorter than full viewport and the top of the Australia band peeks in.

### Issue 2 — Run Test Suite

Execute `npx vitest run` against the existing 3 test files (`example.test.ts`, `pipeline.test.ts`, `registry.test.ts`). Report pass/fail counts and surface any failures. Note that `pipeline.test.ts` and `registry.test.ts` hit the live Supabase edge functions, so failures may indicate real backend issues worth investigating.

### Issue 3 — AI Governance Toolset Audit

**Verdict: No new tools needed.** The site already exposes 12 distinct governance tools across `Navbar`, `Footer`, and `FreeToolsCTA`:

```text
Verify Hash · Free Score · Regulation Map · Trust Badge · Standards Mapping
Verified Registry · SDK · Notary · Explorer · Protocol Spec · Evidence/Governance · Research Hub
```

This already exceeds what comparable governance platforms (Credo AI, Holistic AI, Fairly AI) ship publicly. Adding more would dilute focus. The honest gap isn't *more tools* — it's that `FreeToolsCTA` only surfaces 4 of the 12. So instead of building new tools, I'll **expand `FreeToolsCTA` from 4 to 8 cards** to surface the underexposed ones: Standards Mapping, Verified Registry, Notary, and Explorer.

### Files Touched

- `src/components/Hero.tsx` — relax `min-h-screen` on mobile only
- `src/components/AustraliaPositioningBand.tsx` — tighten mobile padding
- `src/components/FreeToolsCTA.tsx` — add 4 more tool cards (grid becomes `lg:grid-cols-4` with 8 items wrapping to 2 rows)

### Out of Scope

- New governance tools (existing 12 are sufficient)
- Stale-number sync (still deferred)
- Pre-launch link audit (still deferred — separate dedicated pass)

