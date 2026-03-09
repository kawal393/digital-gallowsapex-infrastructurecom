CREATE TABLE public.feedback_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'suggestion',
  message TEXT NOT NULL,
  email TEXT,
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
ON public.feedback_submissions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "No public read on feedback"
ON public.feedback_submissions
FOR SELECT
TO public
USING (false);