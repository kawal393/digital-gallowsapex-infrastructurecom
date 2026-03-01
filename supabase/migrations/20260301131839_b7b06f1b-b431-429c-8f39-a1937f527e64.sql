
-- Table to store questionnaire responses
CREATE TABLE public.questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  -- Step 1: Company Info
  company_name text NOT NULL DEFAULT '',
  industry text NOT NULL DEFAULT '',
  company_size text NOT NULL DEFAULT '',
  eu_presence text NOT NULL DEFAULT '',
  -- Step 2: AI Systems
  ai_system_count integer NOT NULL DEFAULT 0,
  ai_providers text[] NOT NULL DEFAULT '{}',
  high_risk_uses text[] NOT NULL DEFAULT '{}',
  automated_decisions text NOT NULL DEFAULT '',
  -- Step 3: Data Processing
  personal_data text NOT NULL DEFAULT '',
  special_category_data text[] NOT NULL DEFAULT '{}',
  ai_profiling text NOT NULL DEFAULT '',
  -- Step 4: Transparency
  users_informed text NOT NULL DEFAULT '',
  ai_content_labeled text NOT NULL DEFAULT '',
  right_to_explanation text NOT NULL DEFAULT '',
  -- Step 5: Governance
  governance_policy text NOT NULL DEFAULT '',
  compliance_officer text NOT NULL DEFAULT '',
  risk_assessments text NOT NULL DEFAULT '',
  -- Meta
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own questionnaire" ON public.questionnaire_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own questionnaire" ON public.questionnaire_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questionnaire" ON public.questionnaire_responses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_questionnaire_updated_at
  BEFORE UPDATE ON public.questionnaire_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
