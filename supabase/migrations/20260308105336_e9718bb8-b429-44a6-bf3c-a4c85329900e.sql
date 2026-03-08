-- Create gallows_ledger table for persistent cryptographic audit trail
CREATE TABLE public.gallows_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commit_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  predicate_id TEXT NOT NULL,
  phase TEXT NOT NULL DEFAULT 'COMMITTED',
  status TEXT,
  commit_hash TEXT NOT NULL,
  merkle_leaf_hash TEXT NOT NULL,
  challenge_hash TEXT,
  proof_hash TEXT,
  merkle_root TEXT,
  merkle_proof JSONB,
  violation_found TEXT,
  verification_time_ms NUMERIC,
  challenged_at TIMESTAMPTZ,
  proven_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for fast hash lookups
CREATE INDEX idx_gallows_ledger_hashes ON public.gallows_ledger (commit_hash, merkle_leaf_hash, proof_hash, challenge_hash);

-- Create index for user queries
CREATE INDEX idx_gallows_ledger_user ON public.gallows_ledger (user_id);

-- Enable RLS
ALTER TABLE public.gallows_ledger ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read (public audit trail for transparency)
CREATE POLICY "Public read access for transparency"
ON public.gallows_ledger FOR SELECT
TO authenticated, anon
USING (true);

-- Policy: Authenticated users can insert their own entries
CREATE POLICY "Authenticated users can insert"
ON public.gallows_ledger FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can update their own entries (for phase progression)
CREATE POLICY "Users can update own entries"
ON public.gallows_ledger FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallows_ledger;