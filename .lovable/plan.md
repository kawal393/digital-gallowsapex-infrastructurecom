

# Battle Stations: Production Readiness Build

Master, I've audited every file. Here's the honest status and the build plan.

## Current Status: What's Already Working

- Auth system (signup/login/protected routes)
- Stripe products exist in Stripe (STARTUP $499, GROWTH $2,499, ENTERPRISE $9,999, GOLIATH $49,999 -- all AUD recurring)
- Edge functions: `create-checkout`, `check-subscription`, `customer-portal`, `run-verification`
- Subscriptions table with RLS, usage tracking
- Dashboard: subscription display, tier badges, usage bar, verification limits
- Full Gallows pipeline (Commit-Challenge-Prove-Verify)
- SDK code (not published to npm, but code is complete)
- Sovereign Lattice mesh

## What's Missing (The Gaps That Would Embarrass Us)

### 1. Admin Dashboard (`/admin`)
No way to see customers, subscriptions, usage, or manage the platform. When a paying customer comes, we're blind.

**Build:**
- New page `/admin` with role-based access (admin role check)
- `user_roles` table with `app_role` enum and `has_role()` security definer function
- Admin views: customer list, subscription overview, verification activity, ledger entries
- Edge function `admin-data` to fetch aggregated stats using service role key
- Protected by role check, not client-side storage

### 2. Regulator-Ready PDF Export
Enterprise customers are promised "regulator-ready certificates" but there's no PDF download. The `ComplianceCertificate` component only renders on screen.

**Build:**
- Edge function `generate-certificate-pdf` that produces a formatted HTML-to-PDF certificate
- Include: company name, score, status, article breakdown, Merkle proof hashes, verification timestamps, APEX seal
- Download button on Dashboard certificate card

### 3. Continuous Monitoring (Enterprise Feature)
Promised in Enterprise/Goliath tiers but not implemented.

**Build:**
- `monitoring_schedules` table (user_id, frequency, last_run, next_run, enabled)
- Edge function `run-scheduled-monitoring` that re-runs verification for users with active monitoring
- Dashboard UI to enable/disable monitoring and set frequency (daily/weekly)
- Stores results in verification_history with monitoring flag

### 4. Email Alerts for Verification Changes
No notifications when compliance status changes.

**Build:**
- Edge function `send-alert-email` using Resend (key already configured)
- Triggered from `run-verification` when status changes (e.g., compliant -> non_compliant)
- Alert preferences in Dashboard (opt-in/out)

### 5. Webhook Notifications for Enterprise
`webhook-notify` edge function exists but isn't wired to anything.

**Build:**
- `webhook_endpoints` table (user_id, url, secret, events, enabled)
- Wire `run-verification` to call `webhook-notify` after each verification
- Dashboard UI to configure webhook URL

## Implementation Order

1. **Admin infrastructure** -- `user_roles` table + `has_role()` function + admin-data edge function + Admin page
2. **PDF certificate export** -- edge function + download button
3. **Continuous monitoring** -- table + edge function + Dashboard UI toggle
4. **Email alerts** -- edge function + trigger from verification
5. **Webhook wiring** -- table + Dashboard config + integration with verification flow

## Database Changes Required

```sql
-- 1. Admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: only admins can read roles
CREATE POLICY "Admins can read roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. Monitoring schedules
CREATE TABLE public.monitoring_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  frequency text NOT NULL DEFAULT 'weekly',
  enabled boolean NOT NULL DEFAULT true,
  last_run timestamptz,
  next_run timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.monitoring_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own monitoring" ON public.monitoring_schedules
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Webhook endpoints
CREATE TABLE public.webhook_endpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  url text NOT NULL,
  secret text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  events text[] NOT NULL DEFAULT '{verification.completed}',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own webhooks" ON public.webhook_endpoints
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## New Files

```text
src/pages/Admin.tsx                              -- Admin dashboard
src/components/admin/AdminStats.tsx               -- Stats cards
src/components/admin/CustomerTable.tsx            -- Customer list
src/components/admin/SubscriptionOverview.tsx     -- Sub overview
src/components/dashboard/MonitoringToggle.tsx     -- Monitoring config
src/components/dashboard/WebhookConfig.tsx        -- Webhook setup
supabase/functions/admin-data/index.ts           -- Admin aggregation
supabase/functions/generate-certificate-pdf/index.ts
supabase/functions/send-alert-email/index.ts
supabase/functions/run-scheduled-monitoring/index.ts
```

## Stripe Note
Stripe is already wired -- products, prices, checkout, subscription check, and customer portal all exist and match. We'll verify end-to-end as the final step per your command, Master.

