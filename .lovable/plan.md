

# Strategic Hardening: Pricing, Credibility, and Distribution

## What Claude's Analysis Revealed (and What We're Fixing)

Every flaw identified is a **positioning problem**, not a product problem. The code works. The crypto is real. Here's what we change in code to match the strategy:

---

## Changes

### 1. Raise NOTARY Pricing 5x ($99 -> $499/mo)

**File:** `src/components/notary/NotaryPricing.tsx`

$99 signals "toy." $499 signals "enterprise tool." Competitors (Vanta $10K/yr, Drata $15K/yr) charge 10-20x more. We're still the cheapest entry point but no longer look like a side project.

- Free tier: stays $0 (100 receipts/day) — the viral hook
- Pro: $99 -> **$499/mo** (10,000 receipts/day)
- Enterprise: stays "Custom" but add **"Starting at $2,000/mo"** to anchor expectations

### 2. Add "Book a Demo" CTA on Enterprise Tiers

**Files:** `src/components/notary/NotaryPricing.tsx`, `src/components/Pricing.tsx`, `src/pages/Pharma.tsx`

Replace generic "Contact Sales" links with a direct **Calendly-style booking link** (using `/#contact` for now, but with copy that says "Book a Demo" instead of "Contact Sales"). Enterprise buyers need a meeting, not a form.

### 3. Raise Stripe Price IDs for Notary Pro

**File:** `supabase/functions/create-checkout/index.ts`

The `startup` tier maps to $99 Stripe price. We need to ensure the Notary Pro checkout uses the correct price. This requires creating a new Stripe product/price for the $499 Notary Pro tier.

### 4. Add Patent + IETF Status Badges to Footer/Trust Section

**File:** `src/components/TrustSection.tsx` or `src/components/Footer.tsx`

Add clear status indicators:
- "Australian Innovation Patent AMCZ-2615560564 — Filed"
- "IETF Internet-Draft draft-singh-psi-00 — Active on Datatracker"

Honest status. No overclaiming. Technical audiences respect transparency.

### 5. Add "Seed Your Ledger" Self-Notarization Guide

**File:** `src/components/notary/NotaryDocs.tsx`

Add a section showing companies how to notarize their own compliance assessments, patent filings, and regulatory submissions. This teaches users to seed their own ledger — solving the "empty ledger" problem through education rather than fake data.

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/notary/NotaryPricing.tsx` | Pro: $99->$499, Enterprise: add "from $2,000/mo", CTAs updated |
| `src/components/Pricing.tsx` | Add starting price anchor to Sovereign Certification |
| `src/pages/Pharma.tsx` | Update enterprise CTA to "Book a Demo" |
| `src/components/Footer.tsx` | Add patent + IETF draft status badges |
| `src/components/notary/NotaryDocs.tsx` | Add "Seed Your Compliance Ledger" use-case section |

## What This Does NOT Change

- The free tier stays free (viral hook)
- The crypto stays real (no mocks, confirmed)
- The IETF language already says "draft" correctly throughout
- No new edge functions needed

