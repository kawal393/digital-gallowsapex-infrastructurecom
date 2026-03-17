-- Fix lattice_config: restrict to admin only
DROP POLICY IF EXISTS "Authenticated users can insert lattice config" ON public.lattice_config;
DROP POLICY IF EXISTS "Authenticated users can read lattice config" ON public.lattice_config;
DROP POLICY IF EXISTS "Authenticated users can update lattice config" ON public.lattice_config;

CREATE POLICY "Admins can manage lattice config"
ON public.lattice_config
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Authenticated users can still read lattice config (non-sensitive operational data)
CREATE POLICY "Authenticated users can read lattice config"
ON public.lattice_config
FOR SELECT
TO authenticated
USING (true);
