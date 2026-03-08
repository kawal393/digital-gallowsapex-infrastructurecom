ALTER TABLE public.assessment_leads ADD CONSTRAINT assessment_leads_email_unique UNIQUE (email);

-- Add ON CONFLICT support: if email exists, update the score
COMMENT ON TABLE public.assessment_leads IS 'Lead capture from free assessment funnel. Email is unique to prevent duplicates.';