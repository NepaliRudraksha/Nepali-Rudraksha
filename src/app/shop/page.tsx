'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { Product } from '@/data/products';
import { getProducts } from '@/lib/api';
import { Star, ShoppingCart, Filter, Loader2, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSearchParams } from 'next/navigation';

function ShopContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => {
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
              {query && <span className="ml-2 font-bold text-brand-primary">for "{query}"</span>}
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
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-brand-border rounded-xl overflow-hidden group hover:shadow-xl transition-all">
                <Link href={`/shop/${product.id}`}>
                  <div className="relative h-40 md:h-56 bg-brand-light">
                    <div className="absolute z-10 top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 items-start">
                      {product.isBestseller && (
                        <span className="bg-green-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">Bestseller</span>
                      )}
                      {product.isNew && (
                        <span className="bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">New</span>
                      )}
                    </div>
                    <Image 
                      src={product.image || "/images/rudraksha_bead_close_1789219796219.jpg"} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                </Link>
                <div className="p-3 md:p-5 flex flex-col h-[140px] md:h-[180px] justify-between">
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="font-bold text-brand-primary text-xs md:text-base leading-tight mb-1 md:mb-2 hover:text-brand-accent transition-colors line-clamp-2">{product.name}</h3>
                    <div className="flex items-center space-x-1 mb-1 md:mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={10} className={`md:w-3.5 md:h-3.5 ${star <= (product.rating || 5) ? "fill-brand-accent text-brand-accent" : "text-gray-300"}`} />
                      ))}
                      <span className="text-[10px] md:text-xs text-brand-muted ml-1">({product.reviewsCount || 0})</span>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-serif font-bold text-sm md:text-xl text-brand-secondary">
                      {product.price > 0 ? `₹ ${product.price.toLocaleString()}` : 'Enquire'}
                    </span>
                    <button 
                      onClick={() => addToCart(product, 1)}
                      className="bg-brand-primary text-white p-1.5 md:p-2 rounded-full hover:bg-brand-accent hover:text-brand-primary transition-colors focus:ring-2 focus:ring-brand-accent focus:outline-none"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={14} className="md:w-[18px] md:h-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
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
