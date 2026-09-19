'use client';

import { useState } from 'react';
import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Check, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';

export interface SpiritualProduct {
  id: string;
  name: string;
  detail?: string;
  price: number;
  originalPrice?: number;
  reviewsCount?: number;
  rating?: number;
  badge?: string;
  image: string;
}

interface SpiritualProductCardProps {
  product: SpiritualProduct;
  priority?: boolean;
}

export default function SpiritualProductCard({ product, priority = false }: SpiritualProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  // Calculate original price and savings if not explicitly provided
  const originalPrice = product.originalPrice || Math.round(product.price * 1.2);
  const savings = Math.max(0, originalPrice - product.price);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: 'beads',
      image: product.image,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
    };

    addToCart(cartProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: 'beads',
      image: product.image,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
    };

    addToCart(cartProduct, 1);
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
        {/* Top Image Container - compact aspect ratio */}
        <div className="relative aspect-[1.12/1] w-full overflow-hidden rounded-lg bg-[#f5efe6]">
          <Link href="/shop" className="block h-full w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          </Link>

          {/* Discount Badge (Top Left) */}
          <div className="absolute left-2 top-2 z-10">
            <span className="inline-flex items-center rounded bg-[#9c7a38] px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold text-white shadow-sm tracking-tight">
              {product.badge || `${discountPercent}%`}
            </span>
          </div>

          {/* Wishlist Button (Top Right) */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
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
          <Link href="/shop" className="group/title block">
            <h3 className="font-[family-name:var(--font-display)] text-[14px] sm:text-[15px] font-bold text-[#1f2421] transition-colors line-clamp-1 group-hover/title:text-[#9c7a38] leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating & Review Count */}
          <div className="mt-0.5 flex items-center gap-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11.5}
                  className={`${
                    star <= (product.rating ?? 4)
                      ? 'fill-[#d49b28] text-[#d49b28]'
                      : 'text-[#d49b28] fill-transparent'
                  }`}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="ml-0.5 text-[10px] sm:text-[11px] font-normal text-[#6f7571]">
              ({product.reviewsCount ?? 1})
            </span>
          </div>

          {/* Price Row */}
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-[15px] sm:text-[16.5px] font-bold text-[#1a211e] leading-snug">
              ₹{product.price.toLocaleString()}
            </span>
            {originalPrice > product.price && (
              <span className="text-[11.5px] sm:text-[12.5px] font-normal text-[#8c8c8c] line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Discount & Savings - NO background color */}
          {savings > 0 && (
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wide text-[#9c7a38]">
                {discountPercent}% OFF
              </span>
              <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#2e8b57]">
                Save ₹{savings.toLocaleString()}
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
