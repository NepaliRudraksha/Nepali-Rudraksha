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
    <article className="group relative bg-white border border-brand-border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-accent/30 flex flex-col h-full">
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative aspect-square bg-brand-light flex-shrink-0 overflow-hidden">
          <div className="absolute z-10 top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1.5 items-start">
            {settings?.show_bestseller === 'true' && product.isBestseller && (
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 text-white text-[9px] md:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-green-600/30 animate-fade-in-up">Bestseller</span>
            )}
            {settings?.show_new_arrivals === 'true' && product.isNew && (
              <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] md:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-red-500/30 animate-fade-in-up">New</span>
            )}
            {product.category === 'special' && (
              <span className="bg-gradient-to-r from-brand-accent to-yellow-600 text-white text-[9px] md:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-brand-accent/30 animate-fade-in-up">Special</span>
            )}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <Image 
            src={product.image || "/images/rudraksha_bead_close_1789219796219.jpg"} 
            alt={product.name} 
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
            priority={product.isBestseller || product.isNew}
          />
        </div>
      </Link>
      
      <div className="p-3 md:p-4 flex flex-col gap-2.5 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className={`text-[8px] font-semibold px-2 py-0.5 rounded-full ${
              product.category === 'beads' ? 'bg-blue-100 text-blue-700' :
              product.category === 'mala' ? 'bg-purple-100 text-purple-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {product.category === 'beads' ? 'Beads' : product.category === 'mala' ? 'Mala' : 'Special'}
            </span>
            {product.mukhi && (
              <span className="text-[8px] font-medium text-brand-muted px-2 py-0.5 rounded-full bg-brand-light">
                {product.mukhi} Mukhi
              </span>
            )}
          </div>
          
          <Link href={`/shop/${product.id}`} className="block">
            <h3 className="font-semibold text-brand-primary text-sm leading-tight mb-1.5 hover:text-brand-accent transition-colors duration-300 line-clamp-2 group-hover:text-brand-accent">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-1 mb-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={11} 
                className={`transition-colors duration-200 ${star <= Math.round(product.rating ?? 0) ? "fill-brand-accent text-brand-accent" : "text-brand-border group-hover:text-brand-accent/50"}`} 
              />
            ))}
            <span className="text-[9px] md:text-xs text-brand-muted ml-1">({product.reviewsCount ?? 0})</span>
          </div>
          
          {product.origin && (
            <div className="flex items-center gap-1 text-[9px] text-brand-muted mb-1.5">
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
        
        <div className="grid grid-cols-[minmax(0,1fr)_2.25rem] items-center gap-2 border-t border-brand-border/50 pt-2 relative z-10 md:grid-cols-[minmax(0,1fr)_2.5rem]">
          <span className={`truncate font-serif font-bold text-brand-secondary ${product.price > 0 ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
            {product.price > 0 ? `₹${product.price.toLocaleString()}` : 'On request'}
          </span>
          
          <AddToCartButton 
            product={product} 
            iconOnly={true} 
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center hover:from-brand-secondary hover:to-brand-primary transition-all duration-300 shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-accent/30 hover:-translate-y-0.5 focus:ring-2 focus:ring-brand-accent focus:outline-none group-hover:scale-105 flex-shrink-0"
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
      <div className="w-full bg-[#19251D] py-16 text-center text-white relative">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/hero_rudraksha_himalayas_1789219738482.jpg" alt="Background" fill className="object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-accent mb-4">Our Sacred Collection</h1>
          <p className="text-gray-300 max-w-2xl mx-auto px-4">Browse our premium selection of authentic, lab-certified Nepali Rudrakshas and Malas to aid in your spiritual journey.</p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-10 lg:px-20 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl border border-brand-border sticky top-32">
            <h2 className="font-serif font-bold text-lg text-brand-primary flex items-center mb-6">
              <Filter size={18} className="mr-2 text-brand-accent" /> Filters
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-sm text-brand-secondary mb-3 uppercase tracking-wider">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => setActiveCategory('all')} className={`text-sm hover:text-brand-accent transition-colors ${activeCategory === 'all' ? 'text-brand-accent font-bold' : 'text-brand-muted'}`}>All Products</button>
                  </li>
                  <li>
                    <button onClick={() => setActiveCategory('beads')} className={`text-sm hover:text-brand-accent transition-colors ${activeCategory === 'beads' ? 'text-brand-accent font-bold' : 'text-brand-muted'}`}>Single Beads (1-16 Mukhi)</button>
                  </li>
                  <li>
                    <button onClick={() => setActiveCategory('mala')} className={`text-sm hover:text-brand-accent transition-colors ${activeCategory === 'mala' ? 'text-brand-accent font-bold' : 'text-brand-muted'}`}>Rudraksha Malas</button>
                  </li>
                  <li>
                    <button onClick={() => setActiveCategory('special')} className={`text-sm hover:text-brand-accent transition-colors ${activeCategory === 'special' ? 'text-brand-accent font-bold' : 'text-brand-muted'}`}>Special Beads</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center text-sm text-brand-muted">
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
