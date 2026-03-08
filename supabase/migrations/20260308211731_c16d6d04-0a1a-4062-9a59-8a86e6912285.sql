
-- 1. Subscriptions: drop permissive INSERT/UPDATE policies
DROP POLICY IF EXISTS "Allow insert subscriptions via service role" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow update subscriptions via service role" ON public.subscriptions;

-- 2. Gallows ledger: restrict INSERT to authenticated users
DROP POLICY IF EXISTS "Anyone can insert commits" ON public.gallows_ledger;
CREATE POLICY "Authenticated users can insert own commits"
  ON public.gallows_ledger
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Translation cache: drop permissive INSERT/UPDATE policies
DROP POLICY IF EXISTS "Allow insert for service role" ON public.translation_cache;
DROP POLICY IF EXISTS "Allow update for service role" ON public.translation_cache;
