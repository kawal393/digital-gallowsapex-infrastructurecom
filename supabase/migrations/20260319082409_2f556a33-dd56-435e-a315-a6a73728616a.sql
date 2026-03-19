
-- Social proof endorsements table
CREATE TABLE public.social_proof (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author_name text NOT NULL,
  author_title text DEFAULT '',
  author_affiliation text DEFAULT '',
  source_url text DEFAULT '',
  source_type text NOT NULL DEFAULT 'linkedin',
  approved boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.social_proof ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved social proof"
  ON public.social_proof FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Admins manage social proof"
  ON public.social_proof FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Research publications table
CREATE TABLE public.research_publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  authors text NOT NULL DEFAULT '',
  publication_date date,
  pub_type text NOT NULL DEFAULT 'article',
  source_name text DEFAULT '',
  url text NOT NULL,
  description text DEFAULT '',
  is_own boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.research_publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read publications"
  ON public.research_publications FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage publications"
  ON public.research_publications FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
