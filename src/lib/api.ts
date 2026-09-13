import { supabase } from './supabaseClient';
import { Product, products as mockProducts } from '@/data/products';

// ─── Types ─────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  address?: string;
  pincode?: string;
  country?: string;
  product_description: string;
  amount: number;
  status: OrderStatus;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  store_name: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  currency: string;
  tax_rate: string;
  free_shipping_min: string;
  shipping_rate: string;
  show_bestseller: string;
  show_new_arrivals: string;
  maintenance_mode: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns true only when both Supabase env vars are set (not placeholders). */
export const isSupabaseConfigured = (): boolean =>
  !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );

/** Map a raw Supabase DB row → Product type */
function rowToProduct(item: Record<string, unknown>): Product {
  return {
    id: item.id as string,
    name: item.name as string,
    price: item.price as number,
    category: item.category as Product['category'],
    origin: (item.origin as Product['origin']) ?? undefined,
    rating: (item.rating as number) ?? undefined,
    reviewsCount: (item.reviews_count as number) ?? undefined,
    isBestseller: (item.is_bestseller as boolean) ?? false,
    isNew: (item.is_new as boolean) ?? false,
    image: (item.image as string) ?? undefined,
    description: (item.description as string) ?? undefined,
    benefits: (item.benefits as string[]) ?? undefined,
    mukhi: (item.mukhi as number) ?? undefined,
  };
}

// ─── Products ───────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured – using mock data.');
      return mockProducts;
    }

    const { data, error } = await supabase.from('products').select('*').order('name');
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return mockProducts;
    }
    return (data as Record<string, unknown>[]).map(rowToProduct);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return mockProducts;
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    if (!isSupabaseConfigured()) {
      return mockProducts.find((p) => p.id === id);
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return mockProducts.find((p) => p.id === id);
    }
    if (!data) return undefined;
    return rowToProduct(data as Record<string, unknown>);
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return mockProducts.find((p) => p.id === id);
  }
}

export async function createProduct(product: Product): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured.' };

  const { error } = await supabase.from('products').insert([
    {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      origin: product.origin ?? null,
      rating: product.rating ?? 5,
      reviews_count: product.reviewsCount ?? 0,
      is_bestseller: product.isBestseller ?? false,
      is_new: product.isNew ?? false,
      image: product.image ?? null,
      description: product.description ?? null,
      benefits: product.benefits ?? null,
      mukhi: product.mukhi ?? null,
    },
  ]);

  if (error) {
    console.error('Error creating product:', error);
    return { error: error.message };
  }
  return { error: null };
}

export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured.' };

  const { error } = await supabase
    .from('products')
    .update({
      name: product.name,
      price: product.price,
      category: product.category,
      origin: product.origin ?? null,
      rating: product.rating,
      reviews_count: product.reviewsCount,
      is_bestseller: product.isBestseller,
      is_new: product.isNew,
      image: product.image ?? null,
      description: product.description ?? null,
      benefits: product.benefits ?? null,
      mukhi: product.mukhi ?? null,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    return { error: error.message };
  }
  return { error: null };
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured.' };

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('Error deleting product:', error);
    return { error: error.message };
  }
  return { error: null };
}

// ─── Orders ─────────────────────────────────────────────────────────────────

const mockOrders: Order[] = [
  { id: 'NR-2026-0091', customer_name: 'Rahul Sharma', email: 'rahul@example.com', city: 'Delhi', product_description: '5 Mukhi Rudraksha (x2)', amount: 1000, status: 'delivered', created_at: new Date(Date.now() - 2 * 86400000).toISOString(), updated_at: new Date().toISOString() },
  { id: 'NR-2026-0090', customer_name: 'Priya Patel', email: 'priya@example.com', city: 'Mumbai', product_description: 'Gaurishankar Ganesh Rudraksha', amount: 25000, status: 'shipped', created_at: new Date(Date.now() - 1 * 86400000).toISOString(), updated_at: new Date().toISOString() },
  { id: 'NR-2026-0089', customer_name: 'Suresh Kumar', email: 'suresh@example.com', city: 'Bangalore', product_description: '7 Mukhi Rudraksha', amount: 500, status: 'processing', created_at: new Date(Date.now() - 1 * 86400000).toISOString(), updated_at: new Date().toISOString() },
  { id: 'NR-2026-0088', customer_name: 'Anita Gupta', email: 'anita@example.com', city: 'Kolkata', product_description: '2 Mukhi Rudraksha (Nepali)', amount: 15000, status: 'pending', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'NR-2026-0087', customer_name: 'Vikram Singh', email: 'vikram@example.com', city: 'Jaipur', product_description: '14 Mukhi Rudraksha', amount: 25000, status: 'delivered', created_at: new Date(Date.now() - 4 * 86400000).toISOString(), updated_at: new Date().toISOString() },
  { id: 'NR-2026-0086', customer_name: 'Meena Nair', email: 'meena@example.com', city: 'Kochi', product_description: '1 to 14 Mukhi SidhMala', amount: 45000, status: 'shipped', created_at: new Date(Date.now() - 3 * 86400000).toISOString(), updated_at: new Date().toISOString() },
  { id: 'NR-2026-0085', customer_name: 'Arun Reddy', email: 'arun@example.com', city: 'Hyderabad', product_description: '9 Mukhi Rudraksha', amount: 2500, status: 'cancelled', created_at: new Date(Date.now() - 5 * 86400000).toISOString(), updated_at: new Date().toISOString() },
  { id: 'NR-2026-0084', customer_name: 'Sunita Joshi', email: 'sunita@example.com', city: 'Pune', product_description: '12 Mukhi Rudraksha (x3)', amount: 7500, status: 'delivered', created_at: new Date(Date.now() - 7 * 86400000).toISOString(), updated_at: new Date().toISOString() },
];

export async function getOrders(): Promise<Order[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured – using mock orders.');
      return mockOrders;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return mockOrders;
    }
    return (data as Order[]) ?? [];
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return mockOrders;
  }
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  try {
    if (!email) return [];
    if (!isSupabaseConfigured()) {
      return mockOrders.filter(
        (o) => o.email.toLowerCase() === email.toLowerCase() || email === 'bhakt@nepalirudraksha.com'
      );
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .ilike('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders by email:', error);
      return mockOrders.filter(
        (o) => o.email.toLowerCase() === email.toLowerCase() || email === 'bhakt@nepalirudraksha.com'
      );
    }
    return (data as Order[]) ?? [];
  } catch (error) {
    console.error('Failed to fetch orders by email:', error);
    return [];
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured.' };

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating order status:', error);
    return { error: error.message };
  }
  return { error: null };
}

export async function createOrder(order: {
  customerName: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  address?: string;
  pincode?: string;
  country?: string;
  productDescription: string;
  amount: number;
  paymentMethod?: string;
}): Promise<{ id: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    // Return a generated ID without persisting
    return { id: `NR-${Date.now().toString().slice(-7)}`, error: null };
  }

  const orderId = `NR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        id: orderId,
        customer_name: order.customerName,
        email: order.email,
        phone: order.phone ?? null,
        city: order.city ?? null,
        state: order.state ?? null,
        address: order.address ?? null,
        pincode: order.pincode ?? null,
        country: order.country ?? 'India',
        product_description: order.productDescription,
        amount: order.amount,
        status: 'pending',
        payment_method: order.paymentMethod ?? 'upi',
      },
    ])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return { id: null, error: error.message };
  }
  return { id: (data as { id: string }).id, error: null };
}

// ─── Settings ────────────────────────────────────────────────────────────────

const defaultSettings: SiteSettings = {
  store_name: 'Nepali Rudraksha',
  store_email: 'info@nepalirudraksha.com',
  store_phone: '+91 98765 43210',
  store_address: 'Kathmandu, Nepal',
  currency: 'INR',
  tax_rate: '0',
  free_shipping_min: '500',
  shipping_rate: '0',
  show_bestseller: 'true',
  show_new_arrivals: 'true',
  maintenance_mode: 'false',
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    if (!isSupabaseConfigured()) {
      return defaultSettings;
    }

    const { data, error } = await supabase.from('site_settings').select('key, value');

    if (error) {
      console.error('Error fetching settings:', error);
      return defaultSettings;
    }

    const settings = { ...defaultSettings };
    for (const row of (data as { key: string; value: string }[]) ?? []) {
      if (row.key in settings) {
        (settings as Record<string, string>)[row.key] = row.value;
      }
    }
    return settings;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return defaultSettings;
  }
}

export async function saveSettings(settings: SiteSettings): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured.' };

  const rows = Object.entries(settings).map(([key, value]) => ({ key, value }));

  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });

  if (error) {
    console.error('Error saving settings:', error);
    return { error: error.message };
  }
  return { error: null };
}

// ─── Profiles & User Management ─────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role: 'customer' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    return data as UserProfile | null;
  } catch (err) {
    console.error('Failed to get user profile:', err);
    return null;
  }
}

export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string; email: string }): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: null };

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        role: profile.role || 'customer',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      console.error('Error upserting user profile:', error);
      return { error: error.message };
    }
    return { error: null };
  } catch (err: unknown) {
    console.error('Failed to upsert user profile:', err);
    return { error: err instanceof Error ? err.message : 'Failed to update profile in database' };
  }
}

export async function getAllProfiles(): Promise<UserProfile[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }
    return (data as UserProfile[]) ?? [];
  } catch (err) {
    console.error('Failed to get all profiles:', err);
    return [];
  }
}

