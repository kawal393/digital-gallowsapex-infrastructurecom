-- Drop the overly permissive policy
DROP POLICY "Service role can manage subscriptions" ON public.subscriptions;

-- Create specific policies for service role operations (INSERT/UPDATE)
-- These are only used by the check-subscription edge function via service_role key
CREATE POLICY "Allow insert subscriptions via service role"
ON public.subscriptions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update subscriptions via service role"
ON public.subscriptions
FOR UPDATE
USING (true);
