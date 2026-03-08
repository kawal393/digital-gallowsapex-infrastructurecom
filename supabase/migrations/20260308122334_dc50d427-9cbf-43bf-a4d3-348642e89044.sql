DROP POLICY "Service role can manage translations" ON public.translation_cache;

CREATE POLICY "Allow insert for service role"
  ON public.translation_cache FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update for service role"
  ON public.translation_cache FOR UPDATE
  USING (true);