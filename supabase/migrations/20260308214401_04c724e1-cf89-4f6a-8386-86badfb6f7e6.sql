
-- Drop the FK constraint on chat_feedback.message_id so feedback works with client-side IDs
ALTER TABLE public.chat_feedback DROP CONSTRAINT IF EXISTS chat_feedback_message_id_fkey;

-- Add conversation_id to feedback for better correlation
ALTER TABLE public.chat_feedback ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE CASCADE;
ALTER TABLE public.chat_feedback ADD COLUMN IF NOT EXISTS message_content text;

-- Make message_id nullable (no longer FK-dependent)
ALTER TABLE public.chat_feedback ALTER COLUMN message_id DROP NOT NULL;
