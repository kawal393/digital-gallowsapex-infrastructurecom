CREATE TABLE public.assessment_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  company_name TEXT DEFAULT '',
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'non_compliant',
  industry TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assessment_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.assessment_leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "No public read" ON public.assessment_leads
  FOR SELECT USING (false);