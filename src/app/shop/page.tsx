'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, ChevronDown, Filter, Heart, Leaf, Loader2, MapPin, RotateCcw, Search, ShoppingBag, Star, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import Image from '@/components/ImageKitImage';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';
import { getProducts, getSettings, SiteSettings } from '@/lib/api';

type Category = Product['category'] | 'all' | 'types' | 'pendants' | 'gift-sets' | 'spiritual-essentials';
type SortOption = 'featured' | 'price-low' | 'price-high' | 'name' | 'mukhi';
type ViewMode = 'grid' | 'list';

const categoryOptions: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'beads', label: 'Rudraksha Beads' },
  { id: 'mala', label: 'Rudraksha Malas' },
  { id: 'pendants', label: 'Pendants' },
  { id: 'gift-sets', label: 'Gift Sets' },
  { id: 'spiritual-essentials', label: 'Spiritual Essentials' },
  { id: 'types', label: 'Rudraksha Types (1-12 Mukhi)' },
];

const categoryLabel: Record<Product['category'], string> = { beads: 'Beads', mala: 'Mala', special: 'Special' };
const categoryBadgeStyles: Record<Product['category'], string> = {
  beads: 'bg-[#edf3e8] text-[#31533d]',
  mala: 'bg-[#f3edf8] text-[#70438a]',
  special: 'bg-[#f9eee0] text-[#8b592e]',
};

const rudrakshaTypes = [
  { mukhi: 1, title: '1 Mukhi', desc: 'Symbol of Lord Shiva. Brings super consciousness and enlightenment.', price: 1500, benefits: ['Spiritual Growth', 'Peace & Positivity'] },
  { mukhi: 2, title: '2 Mukhi', desc: 'Symbol of Ardhanarishvara. Brings harmony in relationships.', price: 2500, benefits: ['Relationships', 'Peace & Positivity'] },
  { mukhi: 3, title: '3 Mukhi', desc: 'Symbol of Agni. Burns past karmas and frees from stress.', price: 1800, benefits: ['Health & Healing', 'Peace & Positivity'] },
  { mukhi: 4, title: '4 Mukhi', desc: 'Symbol of Lord Brahma. Enhances intelligence and creativity.', price: 1500, benefits: ['Spiritual Growth', 'Health & Healing'] },
  { mukhi: 5, title: '5 Mukhi', desc: 'Symbol of Kalagni Rudra. Supports everyday health and peace.', price: 500, benefits: ['Health & Healing', 'Peace & Positivity'] },
  { mukhi: 6, title: '6 Mukhi', desc: 'Symbol of Lord Kartikeya. Gives wisdom, learning and willpower.', price: 1200, benefits: ['Spiritual Growth', 'Health & Healing'] },
  { mukhi: 7, title: '7 Mukhi', desc: 'Symbol of Goddess Mahalaxmi. Brings wealth and prosperity.', price: 1800, benefits: ['Wealth & Prosperity', 'Peace & Positivity'] },
  { mukhi: 8, title: '8 Mukhi', desc: 'Symbol of Lord Ganesha. Helps remove obstacles and brings success.', price: 1500, benefits: ['Wealth & Prosperity', 'Spiritual Growth'] },
  { mukhi: 9, title: '9 Mukhi', desc: 'Symbol of Goddess Durga. Supports strength, courage and protection.', price: 2300, benefits: ['Health & Healing', 'Peace & Positivity'] },
  { mukhi: 10, title: '10 Mukhi', desc: 'Symbol of Lord Vishnu. Offers protection and a peaceful mind.', price: 2800, benefits: ['Peace & Positivity', 'Relationships'] },
  { mukhi: 11, title: '11 Mukhi', desc: 'Symbol of Lord Hanuman. Encourages confidence and wisdom.', price: 3500, benefits: ['Spiritual Growth', 'Health & Healing'] },
  { mukhi: 12, title: '12 Mukhi', desc: 'Symbol of Lord Surya. Brings vitality, leadership and radiance.', price: 4500, benefits: ['Wealth & Prosperity', 'Health & Healing'] },
];

const benefits = ['Spiritual Growth', 'Health & Healing', 'Wealth & Prosperity', 'Peace & Positivity', 'Relationships'];
const beadImage = '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.53%20PMd.jpeg';

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`;
}

function ProductCard({ product, settings }: { product: Product; settings: SiteSettings | null; viewMode?: ViewMode }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const rating = product.rating && product.rating > 0 ? Math.round(product.rating) : 5;
  const originalPrice = Math.round(product.price * 1.22);
  const savings = Math.max(0, originalPrice - product.price);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const badgeText = product.isBestseller && settings?.show_bestseller !== 'false'
    ? 'Bestseller'
    : product.isNew && settings?.show_new_arrivals !== 'false'
      ? 'New'
      : product.origin === 'nepali'
        ? 'Nepali'
        : `${discountPercent}%`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    router.push('/checkout');
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#ede6da] bg-white p-2 sm:p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cfb57a] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)]">
      <div>
        {/* Top Image Container */}
        <div className="relative aspect-[1.12/1] w-full overflow-hidden rounded-lg bg-[#f5efe6]">
          <Link href={`/shop/${product.id}`} className="block h-full w-full">
            <Image
              src={product.image || '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg'}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Badge (Top Left) */}
          <div className="absolute left-2 top-2 z-10">
            <span className="inline-flex items-center rounded bg-[#9c7a38] px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold text-white shadow-sm tracking-tight">
              {badgeText}
            </span>
          </div>

          {/* Wishlist Button (Top Right) */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
          >
            <Heart
              size={14}
              className={`transition-colors duration-200 ${
                isWishlisted
                  ? 'fill-[#b93838] text-[#b93838]'
                  : 'text-[#9c7a38] hover:text-[#7f6128]'
              }`}
              strokeWidth={1.75}
            />
          </button>

          {/* Carousel Dots Indicator (Bottom Left) */}
          <div className="absolute bottom-1.5 left-2.5 z-10 flex items-center gap-1">
            <span className="h-1.5 w-2 rounded-full bg-[#d4a23b]" />
            <span className="h-1 w-1 rounded-full bg-white/80" />
            <span className="h-1 w-1 rounded-full bg-white/80" />
            <span className="h-1 w-1 rounded-full bg-white/80" />
            <span className="h-1 w-1 rounded-full bg-white/80" />
            <span className="h-1 w-1 rounded-full bg-white/80" />
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-1.5 flex flex-col">
          {/* Title */}
          <Link href={`/shop/${product.id}`} className="group/title block">
            <h2 className="font-[family-name:var(--font-display)] text-[14px] sm:text-[15px] font-bold text-[#1f2421] transition-colors line-clamp-1 group-hover/title:text-[#9c7a38] leading-tight">
              {product.name}
            </h2>
          </Link>

          {/* Star Rating & Review Count */}
          <div className="mt-0.5 flex items-center gap-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11.5}
                  className={`${
                    star <= rating
                      ? 'fill-[#d49b28] text-[#d49b28]'
                      : 'text-[#d49b28] fill-transparent'
                  }`}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="ml-0.5 text-[10px] sm:text-[11px] font-normal text-[#6f7571]">
              ({product.reviewsCount ?? 0})
            </span>
          </div>

          {/* Price Row */}
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-[15px] sm:text-[16.5px] font-bold text-[#1a211e] leading-snug">
              {product.price > 0 ? formatPrice(product.price) : 'On request'}
            </span>
            {originalPrice > product.price && product.price > 0 && (
              <span className="text-[11.5px] sm:text-[12.5px] font-normal text-[#8c8c8c] line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Discount & Savings - NO background color */}
          {savings > 0 && product.price > 0 && (
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wide text-[#9c7a38]">
                {discountPercent}% OFF
              </span>
              <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#2e8b57]">
                Save {formatPrice(savings)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-2.5 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex h-8 sm:h-8.5 w-full items-center justify-center gap-1.5 rounded-full bg-[#9c7a38] px-2.5 text-[11px] sm:text-[12px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#866629] active:scale-[0.98]"
        >
          {added ? (
            <>
              <Check size={13} className="text-white" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag size={13} className="text-white" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex h-7.5 sm:h-8 w-full items-center justify-center rounded-full border border-[#cfc7bc] bg-transparent px-2.5 text-[11px] sm:text-[12px] font-semibold text-[#454545] transition-all duration-200 hover:bg-neutral-100/70 hover:text-[#1c221e] active:scale-[0.98]"
        >
          Buy Now
        </button>
      </div>
    </article>
  );
}

function TypeCard({ type }: { type: typeof rudrakshaTypes[number] }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const originalPrice = Math.round(type.price * 1.2);
  const savings = Math.max(0, originalPrice - type.price);
  const discountPercent = Math.round(((originalPrice - type.price) / originalPrice) * 100);

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#ede6da] bg-white p-2 sm:p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cfb57a] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)]">
      <Link href={`/shop?category=beads`} className="relative block aspect-[1.12/1] overflow-hidden bg-[#f5efe6]">
        <Image src={beadImage} alt={type.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-2 top-2 z-10">
          <span className="inline-flex items-center rounded bg-[#9c7a38] px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold text-white shadow-sm tracking-tight">
            {discountPercent > 0 ? `${discountPercent}%` : ''}
          </span>
        </div>
      </Link>
      <div className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95">
        <Heart size={14} className="text-[#9c7a38]" />
      </div>
      <div className="mt-1.5 flex flex-col">
        <h3 className="font-[family-name:var(--font-display)] text-[16px] sm:text-[17px] font-bold text-[#1f2421] transition-colors line-clamp-1">
          {type.title}
        </h3>
        <p className="mt-1 text-[12px] sm:text-[13px] font-normal text-[#6f7571] line-clamp-1">
          {type.desc}
        </p>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[17px] sm:text-[18px] font-bold text-[#1a211e]">₹{type.price.toLocaleString('en-IN')}</span>
          {discountPercent > 0 && (
            <span className="text-[12.5px] sm:text-[13.5px] font-normal text-[#8c8c8c] line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
          )}
          {savings > 0 && (
            <span className="text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wide text-[#9c7a38]">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
      <div className="mt-2.5 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => addToCart({ id: type.mukhi.toString(), name: type.title, price: type.price, category: 'beads', image: beadImage, rating: 4, reviewsCount: 0 }, 1)}
          className="flex h-8 sm:h-8.5 w-full items-center justify-center gap-1.5 rounded-full bg-[#9c7a38] px-2.5 text-[12px] sm:text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#866629] active:scale-[0.98]"
        >
          <ShoppingBag size={13} className="text-white" />
          <span>Add to Cart</span>
        </button>
        <button
          type="button"
          onClick={() => {
            router.push('/checkout');
          }}
          className="flex h-7.5 sm:h-8 w-full items-center justify-center rounded-full border border-[#cfc7bc] bg-transparent px-2.5 text-[12px] sm:text-[13px] font-semibold text-[#454545] transition-all duration-200 hover:bg-neutral-100/70 hover:text-[#1c221e] active:scale-[0.98]"
        >
          Buy Now
        </button>
      </div>
    </article>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedOrigins, setSelectedOrigins] = useState<Product['origin'][]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode] = useState<ViewMode>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [productsData, settingsData] = await Promise.all([getProducts(), getSettings()]);
      setProducts(productsData);
      setSettings(settingsData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Set active category from URL query param
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && ['beads', 'mala', 'special', 'types', 'pendants', 'bracelets', 'puja-accessories', 'gift-sets', 'spiritual-essentials'].includes(categoryParam)) {
      setActiveCategory(categoryParam as Category);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const matchingProducts = products.filter((product) => {
      let matchesCategory = activeCategory === 'all';
      
      if (!matchesCategory) {
        // Map filter categories to actual product categories
        if (activeCategory === 'beads') matchesCategory = product.category === 'beads';
        else if (activeCategory === 'mala') matchesCategory = product.category === 'mala';
        else if (['special', 'pendants', 'gift-sets', 'spiritual-essentials'].includes(activeCategory)) matchesCategory = product.category === 'special';
        else if (['bracelets', 'puja-accessories'].includes(activeCategory)) matchesCategory = false; // These are accessories, not shop products
        else matchesCategory = product.category === activeCategory;
      }
      
      const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query);
      const matchesOrigin = selectedOrigins.length === 0 || (product.origin && selectedOrigins.includes(product.origin));
      return matchesCategory && matchesSearch && matchesOrigin && product.price <= maxPrice;
    });

    return [...matchingProducts].sort((first, second) => {
      if (sortBy === 'price-low') return first.price - second.price;
      if (sortBy === 'price-high') return second.price - first.price;
      if (sortBy === 'name') return first.name.localeCompare(second.name);
      if (sortBy === 'mukhi') return 0;
      return Number(Boolean(second.isBestseller)) - Number(Boolean(first.isBestseller));
    });
  }, [activeCategory, maxPrice, products, query, selectedOrigins, sortBy]);

  const filteredTypes = useMemo(() => {
    const matched = rudrakshaTypes.filter((type) => type.price <= maxPrice && (selectedBenefits.length === 0 || selectedBenefits.some((benefit) => type.benefits.includes(benefit))));
    return [...matched].sort((first, second) => {
      if (sortBy === 'price-low') return first.price - second.price;
      if (sortBy === 'price-high') return second.price - first.price;
      if (sortBy === 'mukhi') return first.mukhi - second.mukhi;
      if (sortBy === 'name') return first.title.localeCompare(second.title);
      return first.mukhi - second.mukhi;
    });
  }, [maxPrice, selectedBenefits, sortBy]);

  const getCategoryCount = (category: Category) => {
    if (category === 'types') return rudrakshaTypes.length;
    if (category === 'all') return products.length + rudrakshaTypes.length;
    if (category === 'beads') return products.filter((p) => p.category === 'beads').length;
    if (category === 'mala') return products.filter((p) => p.category === 'mala').length;
    if (['special', 'pendants', 'gift-sets', 'spiritual-essentials'].includes(category)) return products.filter((p) => p.category === 'special').length;
    return products.filter((product) => product.category === category).length;
  };
  const toggleOrigin = (origin: Product['origin']) => {
    if (!origin) return;
    setSelectedOrigins((current) => current.includes(origin) ? current.filter((value) => value !== origin) : [...current, origin]);
  };
  const toggleBenefit = (benefit: string) => setSelectedBenefits((current) => current.includes(benefit) ? current.filter((item) => item !== benefit) : [...current, benefit]);
  const clearFilters = () => {
    setActiveCategory('all');
    setSelectedOrigins([]);
    setSelectedBenefits([]);
    setMaxPrice(50000);
    setSortBy('featured');
  };

  const isTypesCategory = activeCategory === 'types';
  const displayCount = isTypesCategory ? filteredTypes.length : filteredProducts.length;

  return (
    <main className="min-h-screen w-full bg-[#fbfaf7]">
      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-10 sm:py-10 lg:px-12 xl:px-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-[#e9e2d6] pb-5 sm:mb-8">
          <div><p className="text-[10px] font-extrabold tracking-[0.2em] text-[#8c765c] uppercase">Nepali Rudraksha Collection</p><h1 className="mt-1 font-[family-name:var(--font-display)] text-[31px] font-bold leading-none text-[#173b2d] sm:text-[40px]">Sacred beads for every journey</h1></div>
          <p className="text-[12px] font-medium italic text-[#8c8e86] sm:text-[13px]">Authentic. Lab-certified. Spiritually sourced.</p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="w-full shrink-0 lg:w-[272px]">
            <div className="rounded-2xl border border-[#ebe5da] bg-white p-5 shadow-[0_10px_26px_rgba(45,49,42,0.04)] lg:sticky lg:top-28">
              <div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-[18px] font-bold text-[#24372e]"><Filter size={19} strokeWidth={2.2} /> Filters</h2><button type="button" onClick={() => setFiltersOpen((open) => !open)} className="flex items-center gap-1 text-[12px] font-bold text-[#765c35] lg:hidden" aria-expanded={filtersOpen}>Options <ChevronDown size={15} className={filtersOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /></button></div>
              <div className={`${filtersOpen ? 'mt-5' : 'hidden'} lg:mt-5 lg:block`}>
              <div className="border-t border-[#eee8dd] pt-5"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-extrabold text-[#2d352f]">Categories</h3><ChevronDown size={15} /></div><div className="space-y-1">
                {categoryOptions.map((category) => <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors ${activeCategory === category.id ? 'bg-[#f3f0e9] font-bold text-[#765c35]' : 'text-[#60685f] hover:bg-[#faf8f2]'}`}><span>{category.label}</span><span className="text-[12px] text-[#8b857a]">{getCategoryCount(category.id).toString().padStart(2, '0')}</span></button>)}
              </div></div>
              <div className="mt-5 border-t border-[#eee8dd] pt-5"><div className="flex items-center justify-between"><h3 className="text-sm font-extrabold text-[#2d352f]">Price range</h3><ChevronDown size={15} /></div><input aria-label="Maximum price" type="range" min="0" max="50000" step="500" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#d4c39a] accent-[#9a8350]" /><div className="mt-3 flex justify-between text-[11px] font-medium text-[#7d817a]"><span>₹0</span><span>{maxPrice >= 50000 ? '₹50,000+' : formatPrice(maxPrice)}</span></div></div>
              {!isTypesCategory && (
                <div className="mt-5 border-t border-[#eee8dd] pt-5"><div className="flex items-center justify-between"><h3 className="text-sm font-extrabold text-[#2d352f]">Origin</h3><ChevronDown size={15} /></div><div className="mt-3 space-y-3">
                  {([{ id: 'nepali', label: 'Nepali Origin' }, { id: 'indonesian', label: 'Indonesian Origin' }] as const).map((origin) => <label key={origin.id} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#666e65]"><input type="checkbox" checked={selectedOrigins.includes(origin.id)} onChange={() => toggleOrigin(origin.id)} className="size-4 rounded border-[#b9b5aa] accent-[#8f7747]" />{origin.label}</label>)}
                </div></div>
              )}
              {isTypesCategory && (
                <div className="mt-5 border-t border-[#eee8dd] pt-5"><div className="flex items-center justify-between"><h3 className="text-sm font-extrabold text-[#2d352f]">Benefits</h3><ChevronDown size={15} /></div><div className="mt-3 space-y-2.5">{benefits.map((benefit) => <label key={benefit} className="flex cursor-pointer items-center gap-2 text-[12px] text-[#697269]"><input type="checkbox" checked={selectedBenefits.includes(benefit)} onChange={() => toggleBenefit(benefit)} className="size-3.5 rounded border-[#b8b5aa] accent-[#947743]" />{benefit}</label>)}</div></div>
              )}
              <button type="button" onClick={clearFilters} className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#f3f1ed] text-[12px] font-bold text-[#534d44] transition-colors hover:bg-[#ebe5dc]"><RotateCcw size={14} /> Clear filters</button>
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] font-bold text-[#626860]">
                <span className="text-[#2d3a31]">{displayCount} {isTypesCategory ? 'Rudraksha Types' : 'Products'}</span>
                {query && <span className="ml-2 font-medium text-[#847965]">for “{query}”</span>}
              </p>
              <label className="relative">
                <span className="sr-only">{isTypesCategory ? 'Sort types' : 'Sort products'}</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className="h-10 appearance-none rounded-xl border border-[#ded8cd] bg-white py-2 pl-3 pr-9 text-[12px] font-medium text-[#4d564f] outline-none transition-colors focus:border-[#9a8350]">
                  {!isTypesCategory && <option value="featured">Sort by: Featured</option>}
                  <option value="price-low">Price: Low to high</option>
                  <option value="price-high">Price: High to low</option>
                  <option value="name">Name: A to Z</option>
                  {isTypesCategory && <option value="mukhi">Mukhi: Low to high</option>}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#59645b]" />
              </label>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-24"><Loader2 className="size-10 animate-spin text-[#9a8350]" /></div>
            ) : displayCount === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#dcd4c7] py-20 text-center">
                <Search className="size-10 text-[#a59e90]" />
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-[#26382e]">{isTypesCategory ? 'No Rudraksha types found' : 'No products found'}</h2>
                <p className="mt-2 text-sm text-[#747c73]">Try changing your filters or search.</p>
                <button type="button" onClick={clearFilters} className="mt-5 rounded-full bg-[#173b2d] px-5 py-2.5 text-sm font-bold text-white">Clear filters</button>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-5 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
                {isTypesCategory ? (
                  filteredTypes.map((type) => <TypeCard key={type.mukhi} type={type} />)
                ) : (
                  filteredProducts.map((product) => <ProductCard key={product.id} product={product} settings={settings} viewMode={viewMode} />)
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default function Shop() {
  return <Suspense fallback={<div className="flex w-full justify-center py-32"><Loader2 className="size-10 animate-spin text-[#9a8350]" /></div>}><ShopContent /></Suspense>;
}
