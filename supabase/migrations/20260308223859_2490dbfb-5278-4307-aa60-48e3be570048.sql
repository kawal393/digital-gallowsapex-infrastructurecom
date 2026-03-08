
-- Add share_id to assessment_leads for shareable score card URLs
ALTER TABLE public.assessment_leads ADD COLUMN IF NOT EXISTS share_id text UNIQUE;

-- Update existing RLS: allow public SELECT on assessment_leads by share_id (score card sharing)
DROP POLICY IF EXISTS "No public read" ON public.assessment_leads;
CREATE POLICY "Public read by share_id" ON public.assessment_leads FOR SELECT USING (share_id IS NOT NULL);

-- Allow public SELECT on compliance_results by id (for pulse widget)
CREATE POLICY "Public read for pulse widget" ON public.compliance_results FOR SELECT USING (true);
-- Drop the old user-only select policy since the new one is more permissive
DROP POLICY IF EXISTS "Users can view own compliance" ON public.compliance_results;
