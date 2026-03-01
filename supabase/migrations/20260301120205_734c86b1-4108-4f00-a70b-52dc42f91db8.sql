
-- Partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  partner_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  total_earnings NUMERIC NOT NULL DEFAULT 0,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  payout_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own row" ON public.partners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own partner row" ON public.partners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Partners can update own row" ON public.partners FOR UPDATE USING (auth.uid() = user_id);

-- Partner referrals table
CREATE TABLE public.partner_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  referred_user_id UUID,
  referred_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'clicked',
  commission_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own referrals" ON public.partner_referrals FOR SELECT
  USING (partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid()));
