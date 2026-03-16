
-- Create storage bucket for evidence documents
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence-documents', 'evidence-documents', false);

-- RLS: Users can upload their own evidence files
CREATE POLICY "Users upload own evidence"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'evidence-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS: Users can view their own evidence files
CREATE POLICY "Users view own evidence"
ON storage.objects FOR SELECT
USING (bucket_id = 'evidence-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS: Users can delete their own evidence files
CREATE POLICY "Users delete own evidence"
ON storage.objects FOR DELETE
USING (bucket_id = 'evidence-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add evidence_hashes column to questionnaire_responses
ALTER TABLE public.questionnaire_responses
ADD COLUMN evidence_hashes jsonb DEFAULT '{}'::jsonb;
