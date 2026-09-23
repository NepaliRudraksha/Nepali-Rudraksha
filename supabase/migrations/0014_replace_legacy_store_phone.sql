-- Replace the public store contact number retained by existing databases.
UPDATE public.site_settings
SET value = '+91 9142960749'
WHERE key = 'store_phone'
  AND value = '+91 98765 43210';
