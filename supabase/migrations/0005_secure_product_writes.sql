-- Product catalog is publicly readable, but only authenticated admins may modify it.
-- This replaces the missing write policies that caused Postgres error 42501.

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;

DROP POLICY IF EXISTS "Allow authenticated admins to insert products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated admins to update products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated admins to delete products" ON public.products;

CREATE POLICY "Allow authenticated admins to insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()::text
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Allow authenticated admins to update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()::text
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()::text
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Allow authenticated admins to delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()::text
        AND profiles.role = 'admin'
    )
  );
