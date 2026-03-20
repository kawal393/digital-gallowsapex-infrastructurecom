
-- APEX NOTARY API Keys table
CREATE TABLE public.notary_api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  api_key_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default',
  tier TEXT NOT NULL DEFAULT 'free',
  daily_limit INTEGER NOT NULL DEFAULT 100,
  daily_used INTEGER NOT NULL DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notary_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own API keys"
  ON public.notary_api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys"
  ON public.notary_api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON public.notary_api_keys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON public.notary_api_keys FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_notary_api_keys_user ON public.notary_api_keys(user_id);
CREATE INDEX idx_notary_api_keys_hash ON public.notary_api_keys(api_key_hash);
