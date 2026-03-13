
-- Industry Silos table
CREATE TABLE public.industry_silos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Shield',
  color TEXT DEFAULT '#D4AF37',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Silo Assignments: maps users to specific silos
CREATE TABLE public.silo_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  silo_id UUID NOT NULL REFERENCES public.industry_silos(id) ON DELETE CASCADE,
  access_level TEXT NOT NULL DEFAULT 'viewer',
  granted_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, silo_id)
);

-- Silo Data: industry-specific records within each silo
CREATE TABLE public.silo_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  silo_id UUID NOT NULL REFERENCES public.industry_silos(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  compliance_score INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Revenue Splits: tracks 50/50 partner revenue
CREATE TABLE public.revenue_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  silo_id UUID NOT NULL REFERENCES public.industry_silos(id),
  partner_user_id UUID NOT NULL REFERENCES auth.users(id),
  deal_name TEXT NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  partner_share NUMERIC NOT NULL DEFAULT 50,
  master_share NUMERIC NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Kill Switch Log: tracks process halts
CREATE TABLE public.kill_switch_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  silo_id UUID NOT NULL REFERENCES public.industry_silos(id),
  triggered_by UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'warning',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.industry_silos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.silo_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.silo_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kill_switch_log ENABLE ROW LEVEL SECURITY;

-- Industry Silos: admins can do everything, authenticated can read
CREATE POLICY "Admins manage silos" ON public.industry_silos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated read silos" ON public.industry_silos
  FOR SELECT TO authenticated
  USING (true);

-- Silo Assignments: admins manage, users read own
CREATE POLICY "Admins manage silo assignments" ON public.silo_assignments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own assignments" ON public.silo_assignments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Silo Data: admins see all, users see only their assigned silos
CREATE POLICY "Admins manage silo data" ON public.silo_data
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read assigned silo data" ON public.silo_data
  FOR SELECT TO authenticated
  USING (silo_id IN (
    SELECT sa.silo_id FROM public.silo_assignments sa
    WHERE sa.user_id = auth.uid() AND sa.is_active = true
  ));

-- Revenue Splits: admins see all, partners see own
CREATE POLICY "Admins manage revenue splits" ON public.revenue_splits
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners read own revenue" ON public.revenue_splits
  FOR SELECT TO authenticated
  USING (partner_user_id = auth.uid());

-- Kill Switch Log: admins manage, assigned users read
CREATE POLICY "Admins manage kill switch" ON public.kill_switch_log
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Assigned users read kill switch" ON public.kill_switch_log
  FOR SELECT TO authenticated
  USING (silo_id IN (
    SELECT sa.silo_id FROM public.silo_assignments sa
    WHERE sa.user_id = auth.uid() AND sa.is_active = true
  ));

-- Trigger for updated_at on silo_data
CREATE TRIGGER update_silo_data_updated_at
  BEFORE UPDATE ON public.silo_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the 4 industry silos
INSERT INTO public.industry_silos (name, display_name, description, icon, color) VALUES
  ('ndis', 'NDIS Integrity', 'Sovereign Care Protocol — Audit-Ready Ledger mapped to NDIS Practice Standards. July 2026 registration crackdown.', 'Heart', '#22C55E'),
  ('mining', 'Mining Integrity', 'Graticular Gap Verification securing Exploration Licences under Victorian critical mineral expenditure rules.', 'Mountain', '#F59E0B'),
  ('pharma', 'Pharma Sniper', 'ZK-Compliance Docket for fast-track TGA generic entry. Regulatory signal monitoring for pharmaceutical deadlines.', 'Pill', '#8B5CF6'),
  ('ai', 'EU AI Act', 'Protocol LDSL — compliance without IP loss. ZK-SNARK verification for August 2026 EU AI Act fines.', 'Brain', '#D4AF37');
