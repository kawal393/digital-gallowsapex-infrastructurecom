
CREATE TABLE public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  page_path text NOT NULL,
  referrer text,
  user_agent text,
  screen_width integer,
  screen_height integer,
  language text,
  country text,
  city text,
  session_id text,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visits" ON public.site_visits
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "No public read" ON public.site_visits
  FOR SELECT TO public USING (false);

CREATE INDEX idx_site_visits_created_at ON public.site_visits (created_at DESC);
CREATE INDEX idx_site_visits_visitor_id ON public.site_visits (visitor_id);
CREATE INDEX idx_site_visits_page_path ON public.site_visits (page_path);
