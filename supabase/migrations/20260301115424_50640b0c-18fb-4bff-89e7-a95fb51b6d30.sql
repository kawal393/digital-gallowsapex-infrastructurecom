
-- compliance_results table
CREATE TABLE public.compliance_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL DEFAULT '',
  overall_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'non_compliant',
  next_audit_date TIMESTAMPTZ DEFAULT '2026-08-02T00:00:00Z',
  trio_mode TEXT NOT NULL DEFAULT 'SHIELD',
  referral_code TEXT UNIQUE,
  referral_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- verification_history table
CREATE TABLE public.verification_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  compliance_result_id UUID REFERENCES public.compliance_results(id) ON DELETE CASCADE,
  article_number TEXT NOT NULL,
  article_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  merkle_proof_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for compliance_results
ALTER TABLE public.compliance_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own compliance" ON public.compliance_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own compliance" ON public.compliance_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own compliance" ON public.compliance_results
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS for verification_history
ALTER TABLE public.verification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verifications" ON public.verification_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verifications" ON public.verification_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verifications" ON public.verification_history
  FOR UPDATE USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_compliance_results_updated_at
  BEFORE UPDATE ON public.compliance_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create compliance_results + seed verification_history on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_compliance_id UUID;
BEGIN
  INSERT INTO public.compliance_results (user_id, referral_code)
  VALUES (NEW.id, substr(md5(NEW.id::text), 1, 8))
  RETURNING id INTO new_compliance_id;

  INSERT INTO public.verification_history (user_id, compliance_result_id, article_number, article_title, status) VALUES
    (NEW.id, new_compliance_id, 'Article 12', 'Record-Keeping', 'pending'),
    (NEW.id, new_compliance_id, 'Article 13', 'Transparency', 'pending'),
    (NEW.id, new_compliance_id, 'Article 14', 'Human Oversight', 'pending'),
    (NEW.id, new_compliance_id, 'Article 15', 'Accuracy & Robustness', 'pending');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
