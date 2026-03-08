

# Remove All Lovable Branding

## What's Already Done
The CSS in `src/index.css` already hides the Lovable badge element via aggressive CSS selectors (`#lovable-badge`, `[id*="lovable"]`, etc.).

## What Still Needs Fixing
The `.lovable.app` domain appears as **user-visible text** in multiple places — embed codes, share URLs, email templates, and the score card SVG. These need to be replaced with the custom domain `digital-gallows.apex-infrastructure.com`.

### Files to Update

1. **`src/components/ReferralGate.tsx`** — Referral URL uses `.lovable.app`
2. **`src/pages/ScoreCard.tsx`** — Share page URL uses `.lovable.app`
3. **`src/pages/FreeAssessment.tsx`** — Share URLs use `.lovable.app`
4. **`src/pages/EmbedCountdown.tsx`** — CTA link uses `.lovable.app`
5. **`src/pages/Badge.tsx`** — Embed code snippets use `.lovable.app`
6. **`src/components/EmbedCodeGenerator.tsx`** — May use `.lovable.app`
7. **`supabase/functions/generate-score-card/index.ts`** — SVG text shows `.lovable.app`
8. **`supabase/functions/lead-drip/index.ts`** — Email HTML links use `.lovable.app`
9. **`supabase/functions/customer-portal/index.ts`** — Return URL uses `.lovable.app`

All instances of `digital-gallowsapex-infrastructurecom.lovable.app` will be replaced with `digital-gallows.apex-infrastructure.com`.

### Additional CSS Hardening
Strengthen the existing badge-hiding CSS to catch any edge cases with broader selectors.

