
-- Subscriptions table for Stripe post-payment provisioning
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tier TEXT NOT NULL DEFAULT 'startup',
  stripe_customer_id TEXT,
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  verifications_limit INTEGER NOT NULL DEFAULT 100,
  verifications_used INTEGER NOT NULL DEFAULT 0,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role (edge functions) will handle inserts/updates via service_role key
-- No public insert/update/delete policies needed
