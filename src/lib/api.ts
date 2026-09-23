import { supabase } from './supabaseClient';
import { Product, products as mockProducts } from '@/data/products';

export type { Product };

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
  homepage_instagram: string;
}

export interface StoreCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
  display_order: number;
}

export interface HomepageInstagramImage {
  url: string;
  fileId?: string;
}

export function parseHomepageInstagramImages(value: string): HomepageInstagramImage[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((image): HomepageInstagramImage[] => {
      if (typeof image === 'string') {
        return image ? [{ url: image }] : [];
      }

      if (typeof image !== 'object' || image === null) return [];
      const candidate = image as Record<string, unknown>;
      if (typeof candidate.url !== 'string' || !candidate.url) return [];

      return [{
        url: candidate.url,
        fileId: typeof candidate.fileId === 'string' ? candidate.fileId : undefined,
      }];
    });
  } catch {
    return [];
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns true only when both Supabase env vars are set (not placeholders). */
export const isSupabaseConfigured = (): boolean =>
  !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );

interface SupabaseErrorDetails {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

function getSupabaseErrorDetails(error: unknown): SupabaseErrorDetails {
  if (typeof error !== 'object' || error === null) {
    return { message: String(error) };
  }

  const candidate = error as Record<string, unknown>;

  return {
    code: typeof candidate.code === 'string' ? candidate.code : undefined,
    message: typeof candidate.message === 'string' ? candidate.message : undefined,
    details: typeof candidate.details === 'string' ? candidate.details : undefined,
    hint: typeof candidate.hint === 'string' ? candidate.hint : undefined,
  };
}

function getSupabaseErrorMessage(error: unknown): string {
  const { code, message, details, hint } = getSupabaseErrorDetails(error);
  const parts = [code, message, details, hint].filter(
    (value): value is string => Boolean(value),
  );

  return parts.join(' — ') || 'The database request failed without an error message.';
}

/** Map a raw Supabase DB row → Product type */
function rowToProduct(item: Record<string, unknown>): Product {
  return {
    id: item.id as string,
    name: item.name as string,
    price: item.price as number,
    category: item.category as string,
    origin: (item.origin as Product['origin']) ?? undefined,
    rating: (item.rating as number) ?? 0,
    reviewsCount: (item.reviews_count as number) ?? 0,
    isBestseller: (item.is_bestseller as boolean) ?? false,
    isNew: (item.is_new as boolean) ?? false,
    isFeatured: (item.is_featured as boolean) ?? false,
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

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured – using mock data for featured products.');
      return mockProducts.filter(p => p.isFeatured);
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('name');

    if (error) {
      console.error('Error fetching featured products:', error);
      return mockProducts.filter(p => p.isFeatured);
    }
    return (data as Record<string, unknown>[]).map(rowToProduct);
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return mockProducts.filter(p => p.isFeatured);
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
      is_featured: product.isFeatured ?? false,
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
      is_featured: product.isFeatured,
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
  store_email: 'nepalirudraksha21@gmail.com',
  store_phone: '+91 9142960749',
  store_address: 'Kathmandu, Nepal',
  currency: 'INR',
  tax_rate: '0',
  free_shipping_min: '500',
  shipping_rate: '0',
  show_bestseller: 'true',
  show_new_arrivals: 'true',
  maintenance_mode: 'false',
  homepage_instagram: JSON.stringify([
    '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.01%20PM.jpeg',
    '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.03%20PM.jpeg',
    '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.04%20PM.jpeg',
    '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.11%20PM.jpeg',
    '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.11%20PMd.jpeg',
    '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.12%20PM.jpeg',
  ]),
};

const fallbackCategories: StoreCategory[] = [
  { id: 'beads', name: 'Rudraksha Beads', description: 'Sacred Origin', image: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.42%20PM.jpeg', href: '/shop?category=beads', display_order: 1 },
  { id: 'mala', name: 'Rudraksha Malas', description: 'For Meditation', image: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg', href: '/shop?category=mala', display_order: 2 },
  { id: 'special', name: 'Pendants', description: 'Divine Energy', image: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.44%20PM.jpeg', href: '/shop?category=special', display_order: 3 },
  { id: 'gift-sets', name: 'Gift Sets', description: 'Meaningful Gifting', image: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.51%20PM.jpeg', href: '/shop?category=gift-sets', display_order: 4 },
  { id: 'spiritual-essentials', name: 'Spiritual Essentials', description: 'For a Balanced Life', image: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.53%20PM.jpeg', href: '/shop?category=spiritual-essentials', display_order: 5 },
];

export async function getCategories(): Promise<StoreCategory[]> {
  if (!isSupabaseConfigured()) return fallbackCategories;

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, description, image, href, display_order')
      .eq('is_visible', true)
      .order('display_order');

    if (error) {
      console.warn(
        'Categories could not be loaded from Supabase. Apply supabase/migrations/0011_create_categories.sql to the connected database.',
        getSupabaseErrorDetails(error),
      );
      return fallbackCategories;
    }

    return (data as StoreCategory[]) ?? [];
  } catch (error) {
    console.warn(
      'Categories request failed. Using the temporary fallback category list.',
      getSupabaseErrorDetails(error),
    );
    return fallbackCategories;
  }
}

export async function saveCategories(categories: StoreCategory[]): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured.' };
  if (categories.some((category) => !category.name.trim())) {
    return { error: 'Each category needs a name.' };
  }

  const categoriesToSave = categories.map((category, index) => ({
    ...category,
    display_order: index + 1,
    is_visible: true,
  }));

  const { data: existingCategories, error: existingCategoriesError } = await supabase
    .from('categories')
    .select('id')
    .eq('is_visible', true);

  if (existingCategoriesError) {
    return { error: getSupabaseErrorMessage(existingCategoriesError) };
  }

  if (categoriesToSave.length > 0) {
    const { error: upsertError } = await supabase
      .from('categories')
      .upsert(categoriesToSave, { onConflict: 'id' });

    if (upsertError) return { error: getSupabaseErrorMessage(upsertError) };
  }

  const categoryIds = new Set(categories.map((category) => category.id));
  const deletedCategoryIds = ((existingCategories as { id: string }[]) ?? [])
    .map((category) => category.id)
    .filter((categoryId) => !categoryIds.has(categoryId));

  if (deletedCategoryIds.length === 0) return { error: null };

  const { error: deleteError } = await supabase
    .from('categories')
    .delete()
    .in('id', deletedCategoryIds);

  return { error: deleteError ? getSupabaseErrorMessage(deleteError) : null };
}

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
        (settings as Record<string, string>)[row.key] =
          row.key === 'store_email' && row.value === 'info@nepalirudraksha.com'
            ? defaultSettings.store_email
            : row.key === 'store_phone' && row.value === '+91 98765 43210'
              ? defaultSettings.store_phone
            : row.value;
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

// ─── Reviews ───────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface ReviewSubmission {
  product_id: string;
  name: string;
  rating: number;
  comment: string;
}

export interface HomepageReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  productName: string;
}

interface HomepageReviewRow {
  id: string;
  name: string;
  rating: number;
  comment: string;
  products: { name: string } | { name: string }[] | null;
}

export async function getHomepageReviews(): Promise<HomepageReview[]> {
  try {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select('id, name, rating, comment, products(name)')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) {
      console.error('Error fetching homepage reviews:', error);
      return [];
    }

    return ((data as HomepageReviewRow[]) ?? []).map((review) => {
      const product = Array.isArray(review.products)
        ? review.products[0]
        : review.products;

      return {
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        productName: product?.name ?? 'Verified Customer',
      };
    });
  } catch (error) {
    console.error('Failed to fetch homepage reviews:', error);
    return [];
  }
}

export async function getApprovedReviews(productId: string): Promise<Review[]> {
  try {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
    return (data as Review[]) ?? [];
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return [];
  }
}

export async function submitReview(review: ReviewSubmission): Promise<{ error: string | null }> {
  try {
    if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };

    const { error } = await supabase
      .from('reviews')
      .insert([
        {
          product_id: review.product_id,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          is_approved: false
        }
      ]);

    if (error) {
      console.error('Error submitting review:', error);
      return { error: error.message };
    }
    return { error: null };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function getPendingReviews(): Promise<Review[]> {
  try {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending reviews:', error);
      return [];
    }
    return (data as Review[]) ?? [];
  } catch (error) {
    console.error('Failed to fetch pending reviews:', error);
    return [];
  }
}

export async function getApprovedReviewsForAdmin(): Promise<Review[]> {
  try {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching approved reviews:', error);
      return [];
    }
    return (data as Review[]) ?? [];
  } catch (error) {
    console.error('Failed to fetch approved reviews:', error);
    return [];
  }
}

export async function updateReview(
  id: string,
  review: Pick<Review, 'name' | 'rating' | 'comment'>,
): Promise<{ error: string | null }> {
  try {
    if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };

    const { error } = await supabase
      .from('reviews')
      .update({
        name: review.name,
        rating: review.rating,
        comment: review.comment,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating review:', error);
      return { error: error.message };
    }
    return { error: null };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function approveReview(id: string): Promise<{ error: string | null }> {
  try {
    if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };

    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id);

    if (error) {
      console.error('Error approving review:', error);
      return { error: error.message };
    }
    return { error: null };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function deleteReview(id: string): Promise<{ error: string | null }> {
  try {
    if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting review:', error);
      return { error: error.message };
    }
    return { error: null };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ─── Contact Messages ────────────────────────────────────────────────────────

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export type MessageSubmission = Omit<ContactMessage, 'id' | 'status' | 'created_at'>;

export async function submitContactMessage(message: MessageSubmission): Promise<{ error: string | null }> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured – simulating message submission:', message);
      return { error: null };
    }

    const { error } = await supabase
      .from('contact_messages')
      .insert([message]);

    if (error) {
      console.error('Error submitting message:', error);
      return { error: error.message };
    }
    return { error: null };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return (data as ContactMessage[]) ?? [];
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
}

export async function updateMessageStatus(id: string, status: 'unread' | 'read' | 'replied'): Promise<{ error: string | null }> {
  try {
    if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };

    const { error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating message status:', error);
      return { error: error.message };
    }
    return { error: null };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

