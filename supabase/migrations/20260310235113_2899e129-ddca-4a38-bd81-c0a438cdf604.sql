
-- Add sequence_number and ed25519_signature columns to gallows_ledger
ALTER TABLE public.gallows_ledger ADD COLUMN IF NOT EXISTS sequence_number BIGINT;
ALTER TABLE public.gallows_ledger ADD COLUMN IF NOT EXISTS ed25519_signature TEXT;

-- Create sequence for monotonic counter
CREATE SEQUENCE IF NOT EXISTS gallows_sequence_counter START 1;

-- Create trigger to auto-assign sequence numbers
CREATE OR REPLACE FUNCTION public.assign_gallows_sequence()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.sequence_number := nextval('gallows_sequence_counter');
  RETURN NEW;
END;
$$;

CREATE TRIGGER gallows_auto_sequence
  BEFORE INSERT ON public.gallows_ledger
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_gallows_sequence();

-- Backfill existing rows with sequence numbers
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.gallows_ledger
  WHERE sequence_number IS NULL
)
UPDATE public.gallows_ledger gl
SET sequence_number = n.rn
FROM numbered n
WHERE gl.id = n.id;

-- Set sequence to continue from max
SELECT setval('gallows_sequence_counter', COALESCE((SELECT MAX(sequence_number) FROM public.gallows_ledger), 0));

-- Update the public view to include new columns
DROP VIEW IF EXISTS public.gallows_public_ledger;
CREATE VIEW public.gallows_public_ledger AS
SELECT
  id, commit_id, action, predicate_id, phase, status,
  commit_hash, merkle_leaf_hash, challenge_hash, proof_hash,
  merkle_root, merkle_proof, violation_found,
  verification_time_ms, challenged_at, proven_at, created_at,
  sequence_number, ed25519_signature
FROM public.gallows_ledger;
