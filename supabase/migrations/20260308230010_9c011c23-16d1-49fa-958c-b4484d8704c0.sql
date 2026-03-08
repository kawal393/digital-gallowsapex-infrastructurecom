
-- 1. Fix compliance_results: restrict public SELECT, create secure view
DROP POLICY IF EXISTS "Public read for pulse widget" ON public.compliance_results;

CREATE POLICY "Users can read own compliance"
ON public.compliance_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE VIEW public.compliance_pulse AS
SELECT id, company_name, overall_score, status, trio_mode, updated_at
FROM public.compliance_results;

-- 2. Fix chat_conversations: restrict to visitor_id match
DROP POLICY IF EXISTS "Visitors can read own conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can update conversations" ON public.chat_conversations;

CREATE POLICY "Visitors can read own conversations"
ON public.chat_conversations
FOR SELECT
TO anon, authenticated
USING (
  visitor_id = coalesce(
    current_setting('request.headers', true)::json->>'x-visitor-id',
    ''
  )
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

CREATE POLICY "Visitors can update own conversations"
ON public.chat_conversations
FOR UPDATE
TO anon, authenticated
USING (
  visitor_id = coalesce(
    current_setting('request.headers', true)::json->>'x-visitor-id',
    ''
  )
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- 3. Fix chat_messages: restrict to own conversation
DROP POLICY IF EXISTS "Anyone can read messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;

CREATE POLICY "Users can read own conversation messages"
ON public.chat_messages
FOR SELECT
TO anon, authenticated
USING (
  conversation_id IN (
    SELECT cc.id FROM public.chat_conversations cc
    WHERE cc.visitor_id = coalesce(
      current_setting('request.headers', true)::json->>'x-visitor-id',
      ''
    )
    OR (auth.uid() IS NOT NULL AND cc.user_id = auth.uid())
  )
);

CREATE POLICY "Users can insert own conversation messages"
ON public.chat_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  conversation_id IN (
    SELECT cc.id FROM public.chat_conversations cc
    WHERE cc.visitor_id = coalesce(
      current_setting('request.headers', true)::json->>'x-visitor-id',
      ''
    )
    OR (auth.uid() IS NOT NULL AND cc.user_id = auth.uid())
  )
);

-- 4. Fix assessment_leads: remove blanket SELECT, create security definer function
DROP POLICY IF EXISTS "Public read by share_id" ON public.assessment_leads;

CREATE OR REPLACE FUNCTION public.get_assessment_by_share_id(p_share_id text)
RETURNS TABLE(company_name text, score integer, status text, industry text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT al.company_name, al.score, al.status, al.industry
  FROM public.assessment_leads al
  WHERE al.share_id = p_share_id
  LIMIT 1;
$$;

-- 5. Create public gallows ledger view (no user_id)
CREATE OR REPLACE VIEW public.gallows_public_ledger AS
SELECT id, action, commit_hash, commit_id, merkle_leaf_hash, merkle_root,
       challenge_hash, proof_hash, predicate_id, phase, status,
       verification_time_ms, violation_found, created_at,
       challenged_at, proven_at, merkle_proof
FROM public.gallows_ledger;
