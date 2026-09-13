'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { getProducts } from '@/lib/api';
import { Star, ShoppingCart, Filter, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Shop() {
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

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

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

      <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-8 flex flex-col md:flex-row gap-8">
        
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
            <p>Showing {filteredProducts.length} products</p>
          </div>

          {isLoading ? (
            <div className="w-full flex justify-center py-20">
              <Loader2 className="animate-spin text-brand-accent w-12 h-12" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-brand-border rounded-xl overflow-hidden group hover:shadow-xl transition-all">
                <Link href={`/shop/${product.id}`}>
                  <div className="relative h-56 bg-brand-light">
                    <Image 
                      src={product.image || "/images/rudraksha_bead_close_1789219796219.jpg"} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                </Link>
                <div className="p-5 flex flex-col h-[180px] justify-between">
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="font-bold text-brand-primary leading-tight mb-2 hover:text-brand-accent transition-colors line-clamp-2">{product.name}</h3>
                    <div className="flex items-center space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} className={star <= (product.rating || 5) ? "fill-brand-accent text-brand-accent" : "text-gray-300"} />
                      ))}
                      <span className="text-xs text-brand-muted ml-1">({product.reviewsCount || Math.floor(Math.random() * 50) + 10})</span>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-serif font-bold text-xl text-brand-secondary">
                      {product.price > 0 ? `₹ ${product.price.toLocaleString()}` : 'Enquire'}
                    </span>
                    <button 
                      onClick={() => addToCart(product, 1)}
                      className="bg-brand-primary text-white p-2 rounded-full hover:bg-brand-accent hover:text-brand-primary transition-colors focus:ring-2 focus:ring-brand-accent focus:outline-none"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={18} />
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
