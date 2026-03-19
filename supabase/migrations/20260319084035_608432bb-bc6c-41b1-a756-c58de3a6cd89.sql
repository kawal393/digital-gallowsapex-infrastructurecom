CREATE TABLE public.harvest_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  queries_run integer NOT NULL DEFAULT 0,
  results_found integer NOT NULL DEFAULT 0,
  entries_qualified integer NOT NULL DEFAULT 0,
  entries_inserted integer NOT NULL DEFAULT 0,
  errors text[],
  status text NOT NULL DEFAULT 'running'
);

ALTER TABLE public.harvest_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage harvest log" ON public.harvest_log
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));