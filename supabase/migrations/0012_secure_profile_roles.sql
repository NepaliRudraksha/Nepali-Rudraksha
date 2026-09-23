-- A profile role is an authorization boundary. Browser clients may read and
-- update only their own profile, but may never set or change that role.

CREATE OR REPLACE FUNCTION public.current_profile_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = auth.uid()::text
$$;

DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow update profiles" ON public.profiles;

CREATE POLICY "Users can read their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()::text
    OR public.current_profile_role() = 'admin'
  );

CREATE POLICY "Users can create their own customer profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    id = auth.uid()::text
    AND role = 'customer'
  );

CREATE POLICY "Users can update their own profile without changing roles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid()::text)
  WITH CHECK (
    id = auth.uid()::text
    AND role = public.current_profile_role()
  );
