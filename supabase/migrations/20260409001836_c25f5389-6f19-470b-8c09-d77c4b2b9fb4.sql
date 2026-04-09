
CREATE TABLE public.public_attestations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commit_id text NOT NULL,
  attestor_hash text NOT NULL,
  verification_result text NOT NULL,
  attestation_hash text NOT NULL,
  ip_country text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_attestations_commit_id ON public.public_attestations (commit_id);
CREATE INDEX idx_attestations_attestor ON public.public_attestations (attestor_hash);

ALTER TABLE public.public_attestations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit attestations"
ON public.public_attestations
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can read attestations"
ON public.public_attestations
FOR SELECT
TO public
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.public_attestations;
