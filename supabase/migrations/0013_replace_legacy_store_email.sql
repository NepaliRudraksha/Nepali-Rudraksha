-- Existing databases retain the old value because the original seed migration
-- only inserts settings when a key is missing.
UPDATE public.site_settings
SET value = 'nepalirudraksha21@gmail.com'
WHERE key = 'store_email'
  AND value = 'info@nepalirudraksha.com';
