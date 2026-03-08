
-- 1. Chat conversations
CREATE TABLE public.chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  user_id uuid,
  lead_name text,
  lead_email text,
  lead_company text,
  message_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Visitors can read own conversations"
  ON public.chat_conversations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update conversations"
  ON public.chat_conversations FOR UPDATE
  USING (true);

-- 2. Chat messages
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read messages"
  ON public.chat_messages FOR SELECT
  USING (true);

-- 3. Chat feedback
CREATE TABLE public.chat_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.chat_messages(id) ON DELETE CASCADE NOT NULL,
  rating text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback"
  ON public.chat_feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "No public read on feedback"
  ON public.chat_feedback FOR SELECT
  USING (false);

-- 4. Chat knowledge gaps
CREATE TABLE public.chat_knowledge_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_knowledge_gaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert knowledge gaps"
  ON public.chat_knowledge_gaps FOR INSERT
  WITH CHECK (true);

CREATE POLICY "No public read on knowledge gaps"
  ON public.chat_knowledge_gaps FOR SELECT
  USING (false);
