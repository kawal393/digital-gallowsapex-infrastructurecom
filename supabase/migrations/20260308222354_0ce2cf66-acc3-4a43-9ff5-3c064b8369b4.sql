
CREATE TABLE IF NOT EXISTS public.drip_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_email text NOT NULL,
  lead_name text,
  lead_company text,
  conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE SET NULL,
  drip_index integer NOT NULL DEFAULT 0,
  send_at timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (lead_email, drip_index)
);

ALTER TABLE public.drip_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to drip_queue" ON public.drip_queue FOR SELECT USING (false);
