'use client';

import { use } from 'react';
import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/products';
import { getProductById, getProducts, getApprovedReviews, submitReview, Review, getSettings, SiteSettings } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { Star, ShieldCheck, Truck, Check, ArrowLeft, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import AddToCartButton from '@/components/AddToCartButton';
import { useAuth } from '@/context/AuthContext';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  
  // Review Form State
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      const [data, fetchedReviews, settingsData] = await Promise.all([
        getProductById(resolvedParams.id),
        getApprovedReviews(resolvedParams.id),
        getSettings()
      ]);
      setProduct(data || null);
      setReviews(fetchedReviews);
      setSettings(settingsData);
      
      if (data) {
        // Fetch related products
        const allProducts = await getProducts();
        const related = allProducts
          .filter(p => p.category === data.category && p.id !== data.id)
          .slice(0, 3);
          
        // Fill with bestsellers if not enough related products
        if (related.length < 3) {
          const bestsellers = allProducts.filter(p => p.isBestseller && p.id !== data.id && !related.some(r => r.id === p.id));
          related.push(...bestsellers.slice(0, 3 - related.length));
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

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;
  const totalReviewsCount = reviews.length;

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    addToCart(product, quantity);
    router.push('/cart');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsSubmittingReview(true);
    const res = await submitReview({
      product_id: product.id,
      name: user.fullName || user.email.split('@')[0] || 'Anonymous',
      rating: reviewForm.rating,
      comment: reviewForm.text
    });
    
    setIsSubmittingReview(false);
    if (!res.error) {
      setReviewSubmitted(true);
      setReviewForm({ name: '', rating: 5, text: '' });
    } else {
      alert('Failed to submit review: ' + res.error);
    }
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
            {settings?.show_bestseller === 'true' && product.isBestseller && (
              <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">Bestseller</span>
            )}
            {settings?.show_new_arrivals === 'true' && product.isNew && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">New</span>
            )}
          </div>
          <Image 
            src={product.image || "/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg"}
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
                <Star key={star} size={18} className={star <= Math.round(averageRating) ? "fill-brand-accent text-brand-accent" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-sm text-brand-muted">({totalReviewsCount} customer {totalReviewsCount === 1 ? 'review' : 'reviews'})</span>
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
          <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-3 sm:gap-4">
            <div className="flex h-12 w-full items-center justify-between rounded-md border border-brand-border bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-full w-10 items-center justify-center text-brand-muted transition-colors hover:bg-brand-light hover:text-brand-primary focus:outline-none"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-bold text-brand-primary">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-full w-10 items-center justify-center text-brand-muted transition-colors hover:bg-brand-light hover:text-brand-primary focus:outline-none"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex h-12 w-full items-center justify-center whitespace-nowrap rounded-md bg-brand-primary px-2 py-3 font-bold text-white shadow-lg transition-colors hover:bg-[#1a251d]"
            >
              <ShoppingCart size={18} className="mr-2" /> Add to Cart
            </button>
            
            <button 
              onClick={handleBuyNow}
              className="premium-button--bordered col-span-2 flex min-h-12 w-full items-center justify-center rounded-lg px-4 py-3 sm:col-span-1"
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
            {reviews.length === 0 ? (
              <div className="text-brand-muted text-sm italic py-8 text-center bg-brand-light/50 rounded-xl border border-brand-border border-dashed">
                No reviews yet. Be the first to review this product!
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-b border-brand-border pb-8 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-brand-primary">{review.name}</span>
                    <span className="text-xs text-brand-muted">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} className={star <= review.rating ? "fill-brand-accent text-brand-accent" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className="text-sm text-brand-text italic">&ldquo;{review.comment}&rdquo;</p>
                </div>
              ))
            )}
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
            ) : !user ? (
              <div className="text-center py-8">
                <p className="text-brand-muted mb-4">You must be logged in to write a review.</p>
                <Link href="/login" className="inline-flex items-center justify-center bg-brand-primary hover:bg-[#1a251d] text-white font-bold py-2.5 px-6 rounded-lg transition-colors">
                  Log In to Review
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
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
                  disabled={isSubmittingReview}
                  className="w-full flex justify-center items-center bg-brand-primary hover:bg-[#1a251d] text-white font-bold py-3 rounded-lg transition-colors mt-2 disabled:opacity-70"
                >
                  {isSubmittingReview ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
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
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white border border-brand-border rounded-xl overflow-hidden group hover:shadow-xl transition-all flex flex-col h-full">
                <Link href={`/shop/${relatedProduct.id}`}>
                  <div className="relative h-40 md:h-48 bg-brand-light flex-shrink-0">
                    <div className="absolute z-10 top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 items-start">
                      {settings?.show_bestseller === 'true' && relatedProduct.isBestseller && (
                        <span className="bg-green-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">Bestseller</span>
                      )}
                      {settings?.show_new_arrivals === 'true' && relatedProduct.isNew && (
                        <span className="bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">New</span>
                      )}
                    </div>
                    <Image 
                      src={relatedProduct.image || "/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg"}
                      alt={relatedProduct.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                </Link>
                <div className="p-3 md:p-5 flex flex-col flex-grow justify-between gap-3">
                  <div>
                    <Link href={`/shop/${relatedProduct.id}`}>
                      <h3 className="font-bold text-brand-primary text-xs md:text-base leading-tight mb-1 md:mb-2 h-8 md:h-10 hover:text-brand-accent transition-colors line-clamp-2">{relatedProduct.name}</h3>
                    </Link>
                    <div className="flex items-center space-x-1 mb-1 md:mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={10} className={`md:w-3.5 md:h-3.5 ${star <= Math.round(relatedProduct.rating ?? 0) ? "fill-brand-accent text-brand-accent" : "text-gray-300"}`} />
                      ))}
                      <span className="text-[10px] md:text-xs text-brand-muted ml-1">({relatedProduct.reviewsCount ?? 0})</span>
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
