'use client';

import { use } from 'react';
import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/products';
import { getProductById, getProducts } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { Star, ShieldCheck, Truck, Check, ArrowLeft, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import AddToCartButton from '@/components/AddToCartButton';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Review Form State
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      const data = await getProductById(resolvedParams.id);
      setProduct(data || null);
      
      if (data) {
        // Fetch related products
        const allProducts = await getProducts();
        const related = allProducts
          .filter(p => p.category === data.category && p.id !== data.id)
          .slice(0, 4);
          
        // Fill with bestsellers if not enough related products
        if (related.length < 4) {
          const bestsellers = allProducts.filter(p => p.isBestseller && p.id !== data.id && !related.some(r => r.id === p.id));
          related.push(...bestsellers.slice(0, 4 - related.length));
        }
        setRelatedProducts(related);
      }
      
      setIsLoading(false);
    }
    fetchData();
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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setReviewForm({ name: '', rating: 5, text: '' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-10 lg:px-20">
      <Link href="/shop" className="inline-flex items-center text-brand-muted hover:text-brand-accent transition-colors mb-8 text-sm font-medium">
        <ArrowLeft size={16} className="mr-2" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-16">
        {/* Product Image */}
        <div className="bg-brand-light rounded-2xl overflow-hidden relative aspect-square border border-brand-border shadow-sm">
          <div className="absolute z-10 top-4 left-4 md:top-6 md:left-6 flex flex-col gap-2 items-start">
            {product.isBestseller && (
              <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">Bestseller</span>
            )}
            {product.isNew && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">New</span>
            )}
          </div>
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
                <Star key={star} size={18} className={star <= (product.rating || 0) ? "fill-brand-accent text-brand-accent" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-sm text-brand-muted">({product.reviewsCount || 0} customer reviews)</span>
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

      {/* Customer Reviews Section */}
      <div className="w-full border-t border-brand-border pt-16 mb-16">
        <h2 className="text-3xl font-serif font-bold text-brand-primary mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-8">
            {[
              { id: 1, name: 'Sanjay Kumar', rating: 5, date: 'October 12, 2025', text: 'Very authentic product. I received the lab certificate along with the bead. It has brought a lot of peace to my daily life.' },
              { id: 2, name: 'Priya Sharma', rating: 4, date: 'September 28, 2025', text: 'Good quality Rudraksha. Packaging was excellent and customer service helped me choose the right mukhi for my needs.' },
              { id: 3, name: 'Amit Desai', rating: 5, date: 'August 15, 2025', text: 'I have been buying from Nepali Rudraksha for years. The energy of these beads is unmatched. Highly recommended to all spiritual seekers.' }
            ].map(review => (
              <div key={review.id} className="border-b border-brand-border pb-8 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-brand-primary">{review.name}</span>
                  <span className="text-xs text-brand-muted">{review.date}</span>
                </div>
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className={star <= review.rating ? "fill-brand-accent text-brand-accent" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-sm text-brand-text italic">&ldquo;{review.text}&rdquo;</p>
              </div>
            ))}
          </div>

          {/* Write a Review Form */}
          <div className="bg-brand-light p-6 md:p-8 rounded-xl border border-brand-border h-fit">
            <h3 className="text-xl font-serif font-bold text-brand-primary mb-6">Write a Review</h3>
            
            {reviewSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-green-600" />
                </div>
                <h4 className="font-bold text-green-800 mb-2">Thank you!</h4>
                <p className="text-sm text-green-700">Your review has been submitted successfully and is awaiting admin approval.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-brand-primary mb-1.5" htmlFor="review-name">Your Name</label>
                  <input
                    id="review-name"
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-white"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-brand-primary mb-1.5">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className="focus:outline-none"
                      >
                        <Star size={24} className={star <= reviewForm.rating ? "fill-brand-accent text-brand-accent hover:scale-110 transition-transform" : "text-gray-300 hover:text-brand-accent hover:scale-110 transition-transform"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-primary mb-1.5" htmlFor="review-text">Your Review</label>
                  <textarea
                    id="review-text"
                    required
                    rows={4}
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                    className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-white resize-none"
                    placeholder="Share your experience with this product..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-[#1a251d] text-white font-bold py-3 rounded-lg transition-colors mt-2"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <div className="w-full border-t border-brand-border pt-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-2">Similar Products</p>
              <h2 className="text-3xl font-serif font-bold text-brand-primary">You May Also Like</h2>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-brand-secondary hover:text-brand-accent flex items-center">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white border border-brand-border rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                <Link href={`/shop/${relatedProduct.id}`}>
                  <div className="relative h-40 md:h-64 bg-brand-light">
                    <div className="absolute z-10 top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 items-start">
                      {relatedProduct.isBestseller && (
                        <span className="bg-green-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">Bestseller</span>
                      )}
                      {relatedProduct.isNew && (
                        <span className="bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">New</span>
                      )}
                    </div>
                    <Image 
                      src={relatedProduct.image || "/images/rudraksha_bead_close_1789219796219.jpg"} 
                      alt={relatedProduct.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                </Link>
                <div className="p-3 md:p-5 flex flex-col h-[140px] md:h-[180px] justify-between">
                  <div>
                    <Link href={`/shop/${relatedProduct.id}`}>
                      <h3 className="font-bold text-brand-primary text-xs md:text-base leading-tight mb-1 md:mb-2 h-8 md:h-10 hover:text-brand-accent transition-colors line-clamp-2">{relatedProduct.name}</h3>
                    </Link>
                    <div className="flex items-center space-x-1 mb-1 md:mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={10} className={`md:w-3.5 md:h-3.5 ${star <= (relatedProduct.rating || 5) ? "fill-brand-accent text-brand-accent" : "text-gray-300"}`} />
                      ))}
                      <span className="text-[10px] md:text-xs text-brand-muted ml-1">({relatedProduct.reviewsCount || 0})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm md:text-xl text-brand-secondary">₹ {relatedProduct.price > 0 ? relatedProduct.price.toLocaleString() : 'Enquire'}</span>
                    <AddToCartButton product={relatedProduct} iconOnly={true} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
