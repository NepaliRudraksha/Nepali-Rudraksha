'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { Product } from '@/data/products';
import { getProducts, getSettings, SiteSettings } from '@/lib/api';
import { Star, Filter, Loader2, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

function ProductCard({ product, settings }: { product: Product; settings: SiteSettings | null }) {

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-brand-border bg-white transition-all duration-500 hover:border-brand-accent/30 sm:rounded-2xl sm:hover:-translate-y-1.5 sm:hover:shadow-2xl">
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative aspect-square bg-brand-light flex-shrink-0 overflow-hidden">
          <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1 sm:left-3 sm:top-3 md:left-4 md:top-4 md:gap-1.5">
            {settings?.show_bestseller === 'true' && product.isBestseller && (
              <span className="animate-fade-in-up rounded-full bg-gradient-to-r from-green-600 to-emerald-500 px-2 py-0.5 text-[8px] font-bold text-white shadow-lg shadow-green-600/30 sm:px-2.5 sm:py-1 sm:text-[9px] md:text-[11px]">Bestseller</span>
            )}
            {settings?.show_new_arrivals === 'true' && product.isNew && (
              <span className="animate-fade-in-up rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-2 py-0.5 text-[8px] font-bold text-white shadow-lg shadow-red-500/30 sm:px-2.5 sm:py-1 sm:text-[9px] md:text-[11px]">New</span>
            )}
            {product.category === 'special' && (
              <span className="animate-fade-in-up rounded-full bg-gradient-to-r from-brand-accent to-yellow-600 px-2 py-0.5 text-[8px] font-bold text-white shadow-lg shadow-brand-accent/30 sm:px-2.5 sm:py-1 sm:text-[9px] md:text-[11px]">Special</span>
            )}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <Image 
            src={product.image || "/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg"}
            alt={product.name} 
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
            priority={product.isBestseller || product.isNew}
          />
        </div>
      </Link>
      
      <div className="relative flex flex-col gap-2 p-2.5 sm:p-3 md:gap-2.5 md:p-4">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className={`rounded-full px-1.5 py-0.5 text-[7px] font-semibold sm:px-2 sm:text-[8px] ${
              product.category === 'beads' ? 'bg-blue-100 text-blue-700' :
              product.category === 'mala' ? 'bg-purple-100 text-purple-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {product.category === 'beads' ? 'Beads' : product.category === 'mala' ? 'Mala' : 'Special'}
            </span>
            {product.mukhi && (
              <span className="rounded-full bg-brand-light px-1.5 py-0.5 text-[7px] font-medium text-brand-muted sm:px-2 sm:text-[8px]">
                {product.mukhi} Mukhi
              </span>
            )}
          </div>
          
          <Link href={`/shop/${product.id}`} className="block">
            <h3 className="mb-1.5 min-h-[2.5rem] text-[12px] font-semibold leading-tight text-brand-primary transition-colors duration-300 hover:text-brand-accent group-hover:text-brand-accent sm:text-sm">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-1 mb-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={10}
                className={`transition-colors duration-200 ${star <= Math.round(product.rating ?? 0) ? "fill-brand-accent text-brand-accent" : "text-brand-border group-hover:text-brand-accent/50"}`} 
              />
            ))}
            <span className="ml-1 text-[8px] text-brand-muted sm:text-[9px] md:text-xs">({product.reviewsCount ?? 0})</span>
          </div>
          
          {product.origin && (
            <div className="mb-1.5 hidden items-center gap-1 text-[9px] text-brand-muted sm:flex">
              <span className="flex items-center gap-0.5">
                {product.origin === 'nepali' ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>Nepali Origin</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>Indonesian Origin</span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>
        
        <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_2rem] items-center gap-1.5 border-t border-brand-border/50 pt-2 sm:grid-cols-[minmax(0,1fr)_2.25rem] sm:gap-2 md:grid-cols-[minmax(0,1fr)_2.5rem]">
          <span className={`truncate font-serif font-bold text-brand-secondary ${product.price > 0 ? 'text-sm sm:text-base md:text-lg' : 'text-xs sm:text-sm md:text-base'}`}>
            {product.price > 0 ? `₹${product.price.toLocaleString()}` : 'On request'}
          </span>
          
          <AddToCartButton 
            product={product} 
            iconOnly={true} 
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-brand-secondary hover:to-brand-primary hover:shadow-xl hover:shadow-brand-accent/30 focus:outline-none focus:ring-2 focus:ring-brand-accent sm:h-9 sm:w-9 md:h-10 md:w-10 group-hover:scale-105"
          />
</div>
      
      </div>
      
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none" />
    </article>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const [activeCategory, setActiveCategory] = useState<string>('all');
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

  const filteredProducts = products.filter((p: Product) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = !query || 
      p.name.toLowerCase().includes(query) || 
      (p.description && p.description.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col items-center">
      {/* Shop Header */}
      <div className="relative w-full bg-[#19251D] py-10 text-center text-white sm:py-14 md:py-16">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/banner/ChatGPT%20Image%20Sep%2018%2C%202026%2C%2007_01_56%20PM.png" alt="Himalayan temple and Rudraksha" fill className="object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="mb-3 px-4 font-serif text-3xl font-bold text-brand-accent sm:text-4xl md:mb-4 md:text-5xl">Our Sacred Collection</h1>
          <p className="mx-auto max-w-2xl px-5 text-sm leading-relaxed text-gray-300 sm:text-base">Browse our premium selection of authentic, lab-certified Nepali Rudrakshas and Malas to aid in your spiritual journey.</p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:gap-8 md:px-10 md:py-12 lg:px-20">
        
        {/* Sidebar Filters */}
        <aside className="w-full shrink-0 md:w-64">
          <div className="rounded-xl border border-brand-border bg-white p-3 sm:p-4 md:sticky md:top-32 md:p-6">
            <h2 className="mb-3 flex items-center font-serif text-base font-bold text-brand-primary md:mb-6 md:text-lg">
              <Filter size={18} className="mr-2 text-brand-accent" /> Filters
            </h2>
            
            <div>
              <div>
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-brand-secondary md:mb-3 md:text-sm">Categories</h3>
                <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:block md:space-y-2 md:overflow-visible md:pb-0">
                  <li>
                    <button onClick={() => setActiveCategory('all')} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors md:rounded-none md:border-0 md:px-0 md:py-0 md:text-sm ${activeCategory === 'all' ? 'border-brand-accent bg-brand-accent/10 font-bold text-brand-accent' : 'border-brand-border text-brand-muted hover:text-brand-accent'}`}>All Products</button>
                  </li>
                  <li>
                    <button onClick={() => setActiveCategory('beads')} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors md:rounded-none md:border-0 md:px-0 md:py-0 md:text-sm ${activeCategory === 'beads' ? 'border-brand-accent bg-brand-accent/10 font-bold text-brand-accent' : 'border-brand-border text-brand-muted hover:text-brand-accent'}`}>Single Beads (1-16 Mukhi)</button>
                  </li>
                  <li>
                    <button onClick={() => setActiveCategory('mala')} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors md:rounded-none md:border-0 md:px-0 md:py-0 md:text-sm ${activeCategory === 'mala' ? 'border-brand-accent bg-brand-accent/10 font-bold text-brand-accent' : 'border-brand-border text-brand-muted hover:text-brand-accent'}`}>Rudraksha Malas</button>
                  </li>
                  <li>
                    <button onClick={() => setActiveCategory('special')} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors md:rounded-none md:border-0 md:px-0 md:py-0 md:text-sm ${activeCategory === 'special' ? 'border-brand-accent bg-brand-accent/10 font-bold text-brand-accent' : 'border-brand-border text-brand-muted hover:text-brand-accent'}`}>Special Beads</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between text-sm text-brand-muted md:mb-6">
            <p>
              Showing {filteredProducts.length} products
              {query && <span className="ml-2 font-bold text-brand-primary">for &ldquo;{query}&rdquo;</span>}
            </p>
          </div>

          {isLoading ? (
            <div className="w-full flex justify-center py-20">
              <Loader2 className="animate-spin text-brand-accent w-12 h-12" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-16 h-16 text-brand-border mb-4" />
              <h3 className="text-xl font-serif font-bold text-brand-primary mb-2">No products found</h3>
              <p className="text-brand-muted">Try adjusting your search or filter criteria.</p>
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  // To clear query, they can use header search again, or we can just clear active category
                }}
                className="mt-6 px-6 py-2 bg-brand-primary text-white rounded-full hover:bg-brand-secondary transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 md:gap-6">
              {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} settings={settings} />
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="w-full flex justify-center py-32">
        <Loader2 className="animate-spin text-brand-accent w-12 h-12" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
