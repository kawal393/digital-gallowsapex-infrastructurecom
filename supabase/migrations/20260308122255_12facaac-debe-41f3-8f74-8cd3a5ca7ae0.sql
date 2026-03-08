CREATE TABLE public.translation_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang text UNIQUE NOT NULL,
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.translation_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for translations"
  ON public.translation_cache FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage translations"
  ON public.translation_cache FOR ALL
  USING (true)
  WITH CHECK (true);