-- Add is_featured column to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update existing featured products
UPDATE products SET is_featured = true 
WHERE id IN (
  '1-mukhi-nepali',
  '2-mukhi-nepali',
  '5-mukhi',
  '1-14-mukhi-sawar-sidhmala',
  'gaurishankar-ganesh'
);