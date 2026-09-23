-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT 'NR-' || to_char(now(), 'YYYY') || '-' || LPAD(floor(random() * 9000 + 1000)::text, 4, '0'),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  state TEXT,
  address TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  product_description TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT DEFAULT 'upi',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add an auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (place an order)
CREATE POLICY "Allow order placement" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read orders (admin is not auth-gated in this project)
CREATE POLICY "Allow reading orders" ON orders
  FOR SELECT USING (true);

-- Allow anyone to update order status (for admin)
CREATE POLICY "Allow updating order status" ON orders
  FOR UPDATE USING (true);

-- Seed with some sample orders
INSERT INTO orders (id, customer_name, email, phone, city, state, product_description, amount, status, created_at) VALUES
('NR-2026-0091', 'Rahul Sharma', 'rahul@example.com', '+91 9142960749', 'Delhi', 'Delhi', '5 Mukhi Rudraksha (x2)', 1000, 'delivered', now() - interval '2 days'),
('NR-2026-0090', 'Priya Patel', 'priya@example.com', '+91 87654 32109', 'Mumbai', 'Maharashtra', 'Gaurishankar Ganesh Rudraksha', 25000, 'shipped', now() - interval '1 day'),
('NR-2026-0089', 'Suresh Kumar', 'suresh@example.com', '+91 76543 21098', 'Bangalore', 'Karnataka', '7 Mukhi Rudraksha', 500, 'processing', now() - interval '1 day'),
('NR-2026-0088', 'Anita Gupta', 'anita@example.com', '+91 65432 10987', 'Kolkata', 'West Bengal', '2 Mukhi Rudraksha (Nepali)', 15000, 'pending', now()),
('NR-2026-0087', 'Vikram Singh', 'vikram@example.com', '+91 54321 09876', 'Jaipur', 'Rajasthan', '14 Mukhi Rudraksha', 25000, 'delivered', now() - interval '4 days'),
('NR-2026-0086', 'Meena Nair', 'meena@example.com', '+91 43210 98765', 'Kochi', 'Kerala', '1 to 14 Mukhi SidhMala', 45000, 'shipped', now() - interval '3 days'),
('NR-2026-0085', 'Arun Reddy', 'arun@example.com', '+91 32109 87654', 'Hyderabad', 'Telangana', '9 Mukhi Rudraksha', 2500, 'cancelled', now() - interval '5 days'),
('NR-2026-0084', 'Sunita Joshi', 'sunita@example.com', '+91 21098 76543', 'Pune', 'Maharashtra', '12 Mukhi Rudraksha (x3)', 7500, 'delivered', now() - interval '7 days');
