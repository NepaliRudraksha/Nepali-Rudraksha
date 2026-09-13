'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/products';
import { getProductById } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { Star, ShieldCheck, Truck, Check, ArrowLeft, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProduct() {
      const data = await getProductById(resolvedParams.id);
      setProduct(data || null);
      setIsLoading(false);
    }
    fetchProduct();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-accent w-12 h-12" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-serif font-bold text-brand-primary mb-4">Product Not Found</h1>
        <p className="text-brand-muted mb-8">The Rudraksha you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="bg-brand-accent text-brand-primary px-6 py-2 rounded font-bold hover:bg-brand-accent-hover transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/cart');
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-8">
      <Link href="/shop" className="inline-flex items-center text-brand-muted hover:text-brand-accent transition-colors mb-8 text-sm font-medium">
        <ArrowLeft size={16} className="mr-2" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Image */}
        <div className="bg-brand-light rounded-2xl overflow-hidden relative aspect-square border border-brand-border shadow-sm">
          {product.isBestseller && (
            <span className="absolute z-10 top-6 left-6 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded">Bestseller</span>
          )}
          <Image 
            src={product.image || "/images/rudraksha_bead_close_1789219796219.jpg"} 
            alt={product.name} 
            fill 
            className="object-cover" 
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-brand-accent text-sm tracking-widest uppercase font-bold mb-2">
            {product.category === 'beads' ? 'Single Bead' : product.category === 'mala' ? 'Rudraksha Mala' : 'Special Bead'}
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-primary mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} className={star <= (product.rating || 5) ? "fill-brand-accent text-brand-accent" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-sm text-brand-muted">({product.reviewsCount || Math.floor(Math.random() * 50) + 10} customer reviews)</span>
          </div>

          <div className="text-3xl font-serif font-bold text-brand-secondary mb-8 pb-8 border-b border-brand-border">
            {product.price > 0 ? `₹ ${product.price.toLocaleString()}` : 'Price on Request'}
          </div>

          <div className="space-y-4 mb-8 text-brand-text">
            <p>Experience the divine energy of this authentic {product.name}. Carefully sourced from the Himalayas, this powerful bead brings peace, focus, and prosperity to its wearer.</p>
            <ul className="space-y-2 mt-4 text-sm">
              <li className="flex items-center"><Check size={16} className="text-brand-accent mr-2" /> 100% Original and Authentic</li>
              <li className="flex items-center"><Check size={16} className="text-brand-accent mr-2" /> Lab Certified (Certificate included)</li>
              <li className="flex items-center"><Check size={16} className="text-brand-accent mr-2" /> Energized with Vedic Mantras before shipping</li>
              {product.origin && (
                <li className="flex items-center"><Check size={16} className="text-brand-accent mr-2" /> Origin: <span className="capitalize ml-1 font-semibold">{product.origin}</span></li>
              )}
            </ul>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border border-brand-border rounded-md bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-brand-muted hover:text-brand-primary transition-colors focus:outline-none"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-bold text-brand-primary">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 text-brand-muted hover:text-brand-primary transition-colors focus:outline-none"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-brand-primary hover:bg-[#1a251d] text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center shadow-lg"
            >
              <ShoppingCart size={18} className="mr-2" /> Add to Cart
            </button>
            
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-3 px-6 rounded-md transition-colors text-center shadow-lg"
            >
              Buy Now
            </button>
          </div>

          {/* Guarantees */}
          <div className="bg-brand-light p-6 rounded-xl flex flex-col sm:flex-row gap-6 sm:gap-0 justify-between items-center text-center sm:text-left border border-brand-border">
            <div className="flex items-center flex-col sm:flex-row">
              <ShieldCheck size={28} className="text-brand-accent mb-2 sm:mb-0 sm:mr-3" />
              <div>
                <h4 className="font-bold text-sm text-brand-primary">Secure Payment</h4>
                <p className="text-xs text-brand-muted">100% secure processing</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-brand-border"></div>
            <div className="flex items-center flex-col sm:flex-row">
              <Truck size={28} className="text-brand-accent mb-2 sm:mb-0 sm:mr-3" />
              <div>
                <h4 className="font-bold text-sm text-brand-primary">Fast Delivery</h4>
                <p className="text-xs text-brand-muted">Ships within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
