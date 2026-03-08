

# World Domination Growth Engine

## The Strategy

Build 4 self-propagating mechanisms that turn every user interaction into an outbound marketing asset. The website promotes itself without you lifting a finger.

---

## 1. Shareable Score Cards with Dynamic OG Images

**What:** Every completed assessment gets a unique `/score/:id` URL. When shared on LinkedIn, X, or WhatsApp, it renders a branded preview card with the company's score, status, and APEX branding.

**How it works:**
- New edge function `generate-score-card` returns a dynamically generated SVG image (company name, score percentage, status badge, APEX branding baked in)
- New page `/score/:id` fetches from `assessment_leads` table, renders the result with `<meta og:image>` pointing to the edge function URL
- Assessment results page gets prominent "Share My Score" buttons that copy the unique URL
- Every shared card is a branded advertisement: "Assessed by APEX Digital Gallows"

**Database:** Add `share_id` column (unique short hash) to `assessment_leads` for clean URLs

---

## 2. Embeddable EU AI Act Countdown Widget

**What:** A tiny, self-contained `<iframe>` embed any website can drop in. Shows the live countdown to Aug 2, 2026 with APEX branding and a "Check Your Compliance" CTA linking back.

**How it works:**
- New route `/embed/countdown` -- minimal page (no navbar/footer), just countdown + brand + CTA link back to APEX
- Embed code generator added to the Badge page with theme/size options (like the existing badge generator)
- Lightweight (~5KB), works anywhere

**Why it spreads:** Compliance blogs, SaaS companies, law firms, consultancies all want to show urgency to their audience. Every embed = permanent backlink.

---

## 3. Live Compliance Pulse Widget

**What:** Evolution of the static badge. A live micro-widget (`/embed/pulse/:id`) showing real-time compliance status, TRIO mode, last audit timestamp. Embedded on client websites.

**How it works:**
- New route `/embed/pulse/:id` fetches from `compliance_results` (public read for verified companies via RLS)
- Shows animated status indicator, score, last verification date, "Verified by APEX" link
- Embed code generator on the existing Badge page

**Why it spreads:** Every paying customer's website becomes an APEX billboard. Their visitors/partners see it and want the same.

---

## 4. Referral-Gated Assessment Results

**What:** After scoring, the detailed article-by-article breakdown is locked behind "Share with 2 colleagues to unlock your full report."

**How it works:**
- `compliance_results` already has `referral_code` and `referral_count` columns
- New `ReferralGate` component on the results page -- shows the score but locks the breakdown
- Unique referral link per assessment: `/assess?ref=abc123`
- When a referred user completes their assessment, increment the referrer's `referral_count`
- At `referral_count >= 2`, unlock the full breakdown (or signup unlocks it too)

**Why it spreads:** Every assessment completion triggers 2+ new assessments. Exponential.

---

## New Files

```text
src/pages/ScoreCard.tsx          -- Public shareable score page with OG meta
src/pages/EmbedCountdown.tsx     -- Minimal embeddable countdown widget
src/pages/EmbedPulse.tsx         -- Live compliance status embed
src/components/ReferralGate.tsx  -- Share-to-unlock component
src/components/EmbedCodeGenerator.tsx -- Reusable embed code snippet UI
supabase/functions/generate-score-card/index.ts -- Dynamic OG image SVG
```

## Modified Files

```text
src/App.tsx                      -- Add 4 new routes
src/pages/FreeAssessment.tsx     -- Add share buttons, referral tracking, ReferralGate
src/pages/Badge.tsx              -- Add countdown + pulse embed generators
```

## Database Changes

- Add `share_id` (text, unique, nullable) to `assessment_leads`
- RLS policy: allow public SELECT on `assessment_leads` by `share_id` (score + company only)
- RLS policy: allow public SELECT on `compliance_results` by `id` (for pulse widget)

## Implementation Order

1. Database migration (share_id column + public read policies)
2. `generate-score-card` edge function
3. `ScoreCard.tsx` page with OG meta
4. `EmbedCountdown.tsx` minimal page
5. `EmbedPulse.tsx` live widget
6. `ReferralGate.tsx` + integrate into FreeAssessment
7. `EmbedCodeGenerator.tsx` + integrate into Badge page
8. Update App.tsx routes

