CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  href TEXT NOT NULL DEFAULT '/shop',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.categories (id, name, description, image, href, display_order, is_visible)
VALUES
  ('uncategorized', 'Uncategorized', '', '', '/shop', 0, false),
  ('beads', 'Rudraksha Beads', 'Sacred Origin', '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.42%20PM.jpeg', '/shop?category=beads', 1, true),
  ('mala', 'Rudraksha Malas', 'For Meditation', '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg', '/shop?category=mala', 2, true),
  ('special', 'Pendants', 'Divine Energy', '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.44%20PM.jpeg', '/shop?category=special', 3, true),
  ('gift-sets', 'Gift Sets', 'Meaningful Gifting', '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.51%20PM.jpeg', '/shop?category=gift-sets', 4, true),
  ('spiritual-essentials', 'Spiritual Essentials', 'For a Balanced Life', '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.53%20PM.jpeg', '/shop?category=spiritual-essentials', 5, true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.products
  ALTER COLUMN category DROP NOT NULL,
  ALTER COLUMN category SET DEFAULT 'uncategorized';

UPDATE public.products
SET category = 'uncategorized'
WHERE category IS NULL
   OR NOT EXISTS (SELECT 1 FROM public.categories WHERE categories.id = products.category);

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_category_fkey;

ALTER TABLE public.products
  ADD CONSTRAINT products_category_fkey
  FOREIGN KEY (category)
  REFERENCES public.categories(id)
  ON UPDATE CASCADE
  ON DELETE SET DEFAULT;

CREATE OR REPLACE FUNCTION public.update_categories_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE PROCEDURE public.update_categories_updated_at();

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;

CREATE POLICY "Public category reads" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins manage categories" ON public.categories
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()::text
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()::text
        AND profiles.role = 'admin'
    )
  );
