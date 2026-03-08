
-- Fix security definer views by making them SECURITY INVOKER
ALTER VIEW public.compliance_pulse SET (security_invoker = on);
ALTER VIEW public.gallows_public_ledger SET (security_invoker = on);

-- Grant anon/authenticated SELECT on the views  
GRANT SELECT ON public.compliance_pulse TO anon, authenticated;
GRANT SELECT ON public.gallows_public_ledger TO anon, authenticated;

-- Grant execute on the assessment function to anon
GRANT EXECUTE ON FUNCTION public.get_assessment_by_share_id(text) TO anon, authenticated;

-- The gallows_ledger already has public SELECT via RLS (true) which is intentional for transparency.
-- The view just strips user_id. The remaining WARN about RLS always-true are:
-- 1. assessment_leads INSERT (true) - needed for anon form submissions
-- 2. chat_conversations INSERT (true) - needed for anon chat
-- 3. chat_feedback INSERT (true) - needed for anon feedback
-- 4. gallows_ledger SELECT (true) - intentional for transparency
-- These are acceptable for the business logic.
