-- Create site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add update trigger
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow reading settings (public)
CREATE POLICY "Allow reading settings" ON site_settings
  FOR SELECT USING (true);

-- Allow updating settings (admin - not auth gated in this project)
CREATE POLICY "Allow updating settings" ON site_settings
  FOR ALL USING (true);

-- Seed with default settings
INSERT INTO site_settings (key, value) VALUES
('store_name', 'Nepali Rudraksha'),
('store_email', 'nepalirudraksha21@gmail.com'),
('store_phone', '+91 9142960749'),
('store_address', 'Kathmandu, Nepal'),
('currency', 'INR'),
('tax_rate', '0'),
('free_shipping_min', '500'),
('shipping_rate', '0'),
('show_bestseller', 'true'),
('show_new_arrivals', 'true'),
('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;
