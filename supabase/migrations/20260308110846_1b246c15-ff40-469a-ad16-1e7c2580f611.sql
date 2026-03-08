-- Drop existing INSERT policy that requires authentication
DROP POLICY IF EXISTS "Authenticated users can insert" ON public.gallows_ledger;

-- New policy: Allow anyone to insert commits (user_id can be null for anonymous users)
CREATE POLICY "Anyone can insert commits" 
ON public.gallows_ledger FOR INSERT 
WITH CHECK (true);