

# Become a Partner - Full Feature Addition

## Overview
Add a public-facing "Become a Partner" page, a dedicated Partner Dashboard for tracking earnings and referrals, and integrate partner CTAs throughout the site. Any authenticated user can become a partner and earn 50% commission on referred sales.

---

## 1. Database Changes

### New table: `partners`
Tracks partner status and earnings for users who opt in.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| user_id | uuid | references auth.users, ON DELETE CASCADE, unique |
| partner_code | text | unique, auto-generated (8-char hash) |
| status | text | active / pending / suspended (default: active) |
| total_earnings | numeric | default 0 |
| total_referrals | integer | default 0 |
| payout_email | text | PayPal/bank email for payouts |
| created_at | timestamptz | default now() |

### New table: `partner_referrals`
Logs each referred signup and sale.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| partner_id | uuid | references partners |
| referred_user_id | uuid | nullable (references auth.users) |
| referred_email | text | email of the referred person |
| status | text | clicked / signed_up / converted / paid |
| commission_amount | numeric | default 0 |
| created_at | timestamptz | default now() |

### RLS Policies
- Partners can only read/update their own `partners` row
- Partners can only read their own `partner_referrals`
- Insert on `partners` restricted to authenticated users (user_id = auth.uid())

---

## 2. New Pages and Components

### A. `/partner` - Public "Become a Partner" Page
A landing page selling the partnership opportunity:
- Hero: "Earn 50% Commission on Every Sale"
- How it works: 3 steps (Sign Up, Share Link, Earn)
- Commission structure breakdown
- CTA: "Become a Partner" button (links to /auth if not logged in, or activates partner status if logged in)
- Social proof: "Join 150+ partners earning with APEX"
- FAQ section specific to partners

### B. `/partner/dashboard` - Partner Dashboard (Protected)
Accessible only to authenticated partners:
- **Earnings Overview Card**: Total earnings, this month's earnings, pending payouts
- **Referral Stats Card**: Total referrals, conversions, conversion rate
- **Unique Referral Link**: Copy-to-clipboard with partner code
- **Referral Activity Table**: List of referrals with status (clicked/signed_up/converted/paid), date, and commission
- **Payout Settings**: Update payout email

### C. New Components
- `src/components/partner/PartnerHero.tsx` - Partner page hero section
- `src/components/partner/PartnerHowItWorks.tsx` - 3-step process
- `src/components/partner/PartnerEarnings.tsx` - Dashboard earnings card
- `src/components/partner/PartnerReferralTable.tsx` - Referral activity table
- `src/components/partner/PartnerCTA.tsx` - Reusable CTA banner for landing page
- `src/pages/Partner.tsx` - Public partner page
- `src/pages/PartnerDashboard.tsx` - Protected partner dashboard

---

## 3. Site Integration

### Navbar
- Add "Partner" link in the navigation menu (between FAQ and Contact)
- On the partner dashboard, show "Partner Dashboard" in header

### Landing Page
- Add a `PartnerCTA` banner section between FAQ and Contact sections on Index page
- Gold-accented banner: "Earn 50% on Every Sale. Become a Partner."

### Footer
- Add "Become a Partner" link under Resources column

### Existing Dashboard
- Replace or enhance the existing `ReferralCard` component to link to the full Partner Dashboard

---

## 4. Partner Activation Flow

1. Visitor clicks "Become a Partner" on `/partner` page
2. If not logged in: redirected to `/auth`, then back to `/partner`
3. If logged in: clicks "Activate Partnership" button
4. Backend inserts a row into `partners` table with auto-generated partner code
5. User is redirected to `/partner/dashboard`

---

## 5. File Structure

```text
New files:
  src/pages/Partner.tsx              -- Public partner landing page
  src/pages/PartnerDashboard.tsx     -- Protected partner dashboard
  src/components/partner/
    PartnerHero.tsx                  -- Hero section
    PartnerHowItWorks.tsx            -- 3-step explainer
    PartnerEarnings.tsx              -- Earnings overview card
    PartnerReferralTable.tsx         -- Referral activity table
    PartnerCTA.tsx                   -- Reusable CTA banner

Modified files:
  src/App.tsx                        -- Add /partner and /partner/dashboard routes
  src/components/Navbar.tsx          -- Add Partner nav link
  src/components/Footer.tsx          -- Add Partner link
  src/pages/Index.tsx                -- Add PartnerCTA section
  src/pages/Dashboard.tsx            -- Link ReferralCard to partner dashboard
```

---

## 6. Implementation Order

1. Database migration (partners + partner_referrals tables with RLS)
2. Public partner landing page (`/partner`)
3. Partner activation flow (insert into partners table)
4. Partner dashboard page (`/partner/dashboard`) with earnings + referral table
5. Navbar, footer, and landing page integration (CTAs and links)
6. Enhance existing ReferralCard to link to partner dashboard
