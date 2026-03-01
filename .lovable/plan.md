

# APEX Digital Gallows - Major Feature Update

## Overview
Adding authentication gate, compliance dashboard, social proof counters, and enhanced EU AI Act countdown — all without removing any existing content.

---

## 1. Database Schema (Migrations)

Create two new tables plus enable auth:

**`compliance_results`** — stores company compliance data per user
- `id` (uuid, PK)
- `user_id` (uuid, references auth.users, ON DELETE CASCADE)
- `company_name` (text)
- `overall_score` (integer, 0-100)
- `status` (text: compliant / partially_compliant / non_compliant)
- `next_audit_date` (timestamptz)
- `trio_mode` (text: SHIELD / SWORD / JUDGE)
- `referral_code` (text, unique)
- `referral_count` (integer, default 0)
- `created_at` / `updated_at` (timestamptz)

**`verification_history`** — article-level verification logs
- `id` (uuid, PK)
- `user_id` (uuid, references auth.users)
- `compliance_result_id` (uuid, references compliance_results)
- `article_number` (text, e.g. "Article 12")
- `article_title` (text)
- `status` (text: verified / pending / failed)
- `verified_at` (timestamptz)
- `merkle_proof_hash` (text)

**RLS Policies**: Users can only read/insert/update their own records.

---

## 2. Authentication System

### Pages & Components
- **`/auth`** route — Login / Sign Up page (the "Membership Gate")
  - Dark themed, matching existing design
  - "Member Access Only" heading
  - Social proof: "Trusted by 150+ AI Companies" and "32 companies joined this week"
  - Email + password sign up / sign in forms
  - Toggle between login and signup modes
  - Password reset flow with `/reset-password` route

- **`/dashboard`** route — Protected, redirects to `/auth` if not logged in
- **`/reset-password`** route — Password reset form

### Auth Context
- Create `AuthProvider` component wrapping the app
- `useAuth` hook for session state
- `ProtectedRoute` wrapper component

---

## 3. Compliance Dashboard (`/dashboard`)

Four card-based sections in a responsive grid:

### A. Compliance Status Card
- Circular/linear progress bar showing overall score (seeded at 0% for new users)
- Color-coded status badge (green/orange/red)
- Next Audit Deadline countdown
- Days remaining to August 2, 2026

### B. TRIO Verification Mode Selector
- Three toggle cards for SHIELD / SWORD / JUDGE
- Only one active at a time
- Visual feedback with gold highlight on selected mode
- Persisted to `compliance_results.trio_mode`

### C. Compliance Ledger
- Table listing EU AI Act articles (12, 13, 14, 15)
- Status column with color-coded badges (Verified=green, Pending=orange, Failed=red)
- Timestamp column
- Merkle proof hash (truncated, copyable)
- Data from `verification_history` table

### D. Partner Referral Card
- Display unique referral link (generated from user ID)
- Copy-to-clipboard button
- "50% Commission" badge
- Referral count display

---

## 4. Social Proof Counters

Add a new `SocialProofBar` component rendered on the landing page (between Hero and TrioSection):
- "Trusted by 150+ AI Companies"
- "32 companies joined this week"
- "2,500+ Compliances Verified"
- Animated count-up on scroll into view
- Styled with gold accents on dark background

---

## 5. Enhanced EU AI Act Countdown Banner

Add a sticky/prominent `CountdownBanner` component below the navbar on the landing page:
```text
EU AI ACT ENFORCEMENT: AUGUST 2, 2026
   XXX DAYS    XX HOURS    XX MINUTES
Penalties: EUR 35,000,000 OR 7% Global Turnover
          [ GET COMPLIANT NOW ]
```
- Live countdown (updates every second)
- Warning icon
- Red/orange gradient background
- CTA links to `#contact` (or `/auth` if not logged in)

---

## 6. Navbar Updates

- Add "Login" / "Dashboard" button to navbar (conditional on auth state)
- If logged in: show "Dashboard" link + user avatar/initial
- If not logged in: show "Login" button

---

## 7. Design Tokens

Add to CSS variables:
- `--eu-blue: 220 100% 20%` (#003399)
- `--compliant: 142 76% 36%` (green)
- `--warning: 38 92% 50%` (orange)  
- `--danger: 0 84% 60%` (red — already exists as destructive)

---

## File Structure (New Files)

```text
src/
  components/
    auth/
      AuthForm.tsx          -- Login/Signup form component
      ProtectedRoute.tsx    -- Route guard
    dashboard/
      ComplianceStatus.tsx  -- Score + progress bar
      TrioModeSelector.tsx  -- SHIELD/SWORD/JUDGE toggle
      ComplianceLedger.tsx  -- Article verification table
      ReferralCard.tsx      -- Referral link + commission
      DashboardLayout.tsx   -- Dashboard shell with sidebar/nav
    CountdownBanner.tsx     -- Prominent countdown strip
    SocialProofBar.tsx      -- Counter stats bar
  contexts/
    AuthContext.tsx          -- Auth provider + hook
  pages/
    Auth.tsx                -- /auth page (membership gate)
    Dashboard.tsx           -- /dashboard page
    ResetPassword.tsx       -- /reset-password page
```

## Modified Files

```text
src/App.tsx                -- Add new routes + AuthProvider
src/components/Navbar.tsx  -- Add Login/Dashboard button
src/pages/Index.tsx        -- Add SocialProofBar + CountdownBanner
src/index.css              -- Add new design tokens
```

## Implementation Order

1. Database migration (tables + RLS)
2. Auth context + auth pages
3. Navbar auth-aware updates
4. Dashboard page with all four sections
5. SocialProofBar component on landing page
6. CountdownBanner component on landing page

