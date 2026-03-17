
-- 1. Add 'auditor' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'auditor';

-- 2. Create tribunal_auditors table
CREATE TABLE public.tribunal_auditors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  auditor_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  jurisdiction TEXT NOT NULL DEFAULT 'EU',
  public_key TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  appointed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tribunal_auditors ENABLE ROW LEVEL SECURITY;

-- Admin-only writes
CREATE POLICY "Admins manage tribunal auditors"
  ON public.tribunal_auditors FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Public reads for transparency
CREATE POLICY "Public read tribunal auditors"
  ON public.tribunal_auditors FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3. Create tribunal_reviews table
CREATE TABLE public.tribunal_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  commit_id TEXT NOT NULL,
  auditor_id UUID NOT NULL REFERENCES public.tribunal_auditors(id) ON DELETE CASCADE,
  verdict TEXT NOT NULL DEFAULT 'pending',
  rationale TEXT,
  auditor_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (commit_id, auditor_id)
);

ALTER TABLE public.tribunal_reviews ENABLE ROW LEVEL SECURITY;

-- Auditors can insert their own reviews
CREATE POLICY "Auditors insert own reviews"
  ON public.tribunal_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auditor_id IN (
      SELECT ta.id FROM public.tribunal_auditors ta
      WHERE ta.user_id = auth.uid() AND ta.status = 'active'
    )
  );

-- Auditors can read own reviews
CREATE POLICY "Auditors read own reviews"
  ON public.tribunal_reviews FOR SELECT
  TO authenticated
  USING (
    auditor_id IN (
      SELECT ta.id FROM public.tribunal_auditors ta WHERE ta.user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Public can read aggregate (verdict + commit_id, no rationale exposed via view later)
CREATE POLICY "Public read review verdicts"
  ON public.tribunal_reviews FOR SELECT
  TO anon
  USING (true);

-- 4. Add ratification columns to gallows_ledger
ALTER TABLE public.gallows_ledger
  ADD COLUMN IF NOT EXISTS ratification_hash TEXT,
  ADD COLUMN IF NOT EXISTS ratified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS tribunal_votes_approve INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tribunal_votes_reject INTEGER DEFAULT 0;
