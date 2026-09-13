-- Create the products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  origin TEXT,
  rating INTEGER DEFAULT 5,
  reviews_count INTEGER DEFAULT 0,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  image TEXT
);

-- Insert initial data
INSERT INTO products (id, name, price, category, origin, rating, reviews_count, is_bestseller) VALUES
('1-mukhi-nepali', '1 Mukhi Rudraksha (Nepali with Lab)', 2000, 'beads', 'nepali', 5, 12, false),
('1-mukhi-kaju', '1 Mukhi Rudraksha (Kaju)', 1100, 'beads', null, 5, 8, false),
('2-mukhi-nepali', '2 Mukhi Rudraksha (Nepali)', 15000, 'beads', 'nepali', 5, 58, false),
('3-mukhi', '3 Mukhi Rudraksha', 500, 'beads', null, 5, 24, false),
('4-mukhi', '4 Mukhi Rudraksha', 500, 'beads', null, 5, 31, false),
('5-mukhi', '5 Mukhi Rudraksha', 500, 'beads', null, 5, 124, true),
('6-mukhi', '6 Mukhi Rudraksha', 500, 'beads', null, 5, 45, false),
('7-mukhi', '7 Mukhi Rudraksha', 500, 'beads', null, 5, 53, false),
('8-mukhi', '8 Mukhi Rudraksha', 1500, 'beads', null, 5, 19, false),
('9-mukhi', '9 Mukhi Rudraksha', 2500, 'beads', null, 5, 27, false),
('10-mukhi', '10 Mukhi Rudraksha', 1500, 'beads', null, 5, 14, false),
('11-mukhi', '11 Mukhi Rudraksha', 1500, 'beads', null, 5, 22, false),
('12-mukhi', '12 Mukhi Rudraksha', 2500, 'beads', null, 5, 36, false),
('13-mukhi', '13 Mukhi Rudraksha', 9000, 'beads', null, 5, 11, false),
('14-mukhi', '14 Mukhi Rudraksha', 25000, 'beads', null, 5, 8, false),
('15-mukhi', '15 Mukhi Rudraksha', 25000, 'beads', null, 5, 5, false),
('16-mukhi', '16 Mukhi Rudraksha', 65000, 'beads', null, 5, 3, false),
('1-14-mukhi-sawar-sidhmala', '1 to 14 Mukhi One Face Sawar SidhMala', 0, 'mala', null, 5, 21, true),
('1-14-mukhi-kaju-sidhmala', '1 to 14 Mukhi with One Face Kaju', 0, 'mala', null, 5, 15, false),
('indonesian-sidhmala', 'Indonesian SidhMala', 0, 'mala', 'indonesian', 5, 42, false),
('gaurishankar-ganesh', 'Gaurishankar Ganesh Rudraksha', 25000, 'special', null, 5, 41, true),
('garbh-gauri', 'Garbh Gauri Rudraksha', 0, 'special', null, 5, 18, false),
('ganesh-mukhi', 'Ganesh Mukhi Rudraksha', 0, 'special', null, 5, 33, false);

-- Set up Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT
    USING (true);
