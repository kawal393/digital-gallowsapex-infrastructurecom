
-- Fix remaining linter warning: gallows_ledger UPDATE policy is permissive for user_id match, that's fine.
-- The assessment_leads INSERT WITH CHECK (true) is intentional for anonymous lead capture.
-- No additional changes needed.
SELECT 1;
