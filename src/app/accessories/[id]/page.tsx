'use client';

import { use } from 'react';
import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Star, ShieldCheck, Truck, Check, ArrowLeft, Minus, Plus, Loader2, Heart, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Accessory {
  name: string;
  category: string;
  desc: string;
  price: number;
  badge: string;
  image: string;
}

export default function AccessoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const images = {
    bracelet: '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg',
    pendant: '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.52%20PM.jpeg',
    beads: '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.53%20PMd.jpeg',
    temple: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.48%20PM.jpeg',
    gift: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.51%20PM.jpeg',
    mountain: '/images/insight_for_better/WhatsApp%20Image%202026-09-18%20at%205.16.00%20PM.jpeg',
  };

  const allAccessories: Accessory[] = [
    { name: 'Copper Jalheri', category: 'jalheris', desc: 'Traditional copper vessel for offering water to the Shiva Linga.', price: 850, badge: 'Bestseller', image: images.temple },
    { name: 'Silver Chain (Pure 925)', category: 'chains', desc: 'Premium silver chain to wear your Rudraksha pendant.', price: 1200, badge: 'Premium', image: images.pendant },
    { name: 'Sandalwood Paste', category: 'pastes', desc: 'Pure sandalwood paste for daily rituals and applying on Rudraksha.', price: 350, badge: 'Natural', image: images.mountain },
    { name: 'Rudraksha Pendant', category: 'pendants', desc: 'A sacred pendant designed for your daily spiritual practice.', price: 1100, badge: 'Sacred', image: images.pendant },
    { name: 'Red Prayer Thread', category: 'cords', desc: 'Durable sacred thread for malas, rituals and daily wear.', price: 150, badge: 'Essential', image: images.beads },
    { name: 'Puja Pouch', category: 'pouches', desc: 'A soft protective pouch for your sacred beads and accessories.', price: 450, badge: 'Handcrafted', image: images.gift },
    { name: 'Wooden Storage Box', category: 'boxes', desc: 'A thoughtful storage box for preserving your spiritual essentials.', price: 900, badge: 'Natural', image: images.gift },
    { name: 'Rudraksha Cleaning Kit', category: 'cleaning', desc: 'Soft brush and nourishing oil to care for your sacred beads.', price: 400, badge: 'Care', image: images.temple },
  ];

  useEffect(() => {
    const found = allAccessories.find(a => a.name.toLowerCase().replace(/\s+/g, '-') === resolvedParams.id);
    if (found) {
      setAccessory(found);
    }
    setIsLoading(false);
  }, [resolvedParams.id]);

  function formatPrice(price: number) {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  function getDiscountInfo(item: Accessory) {
    const originalPrice = Math.round(item.price * 1.2);
    const savings = Math.max(0, originalPrice - item.price);
    const discountPercent = Math.round(((originalPrice - item.price) / originalPrice) * 100);
    return { originalPrice, savings, discountPercent };
  }

  const handleAddToCart = () => {
    addToCart({ 
      id: accessory?.name || '', 
      name: accessory?.name || '', 
      price: accessory?.price || 0, 
      category: 'special', 
      image: accessory?.image || '', 
      rating: 4, 
      reviewsCount: 0 
    }, quantity);
  };

  const handleBuyNow = () => {
    addToCart({ 
      id: accessory?.name || '', 
      name: accessory?.name || '', 
      price: accessory?.price || 0, 
      category: 'special', 
      image: accessory?.image || '', 
      rating: 4, 
      reviewsCount: 0 
    }, quantity);
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#9a8350] w-12 h-12" />
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-serif font-bold text-[#173b2d] mb-4">Accessory Not Found</h1>
        <p className="text-[#7d817a] mb-8">The accessory you are looking for does not exist.</p>
        <Link href="/accessories" className="bg-[#9c7a38] text-white px-6 py-2 rounded-full font-bold hover:bg-[#866629] transition-colors">
          Return to Accessories
        </Link>
      </div>
    );
  }

  const { originalPrice, savings, discountPercent } = getDiscountInfo(accessory);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-10 lg:px-20">
      <Link href="/accessories" className="inline-flex items-center text-[#6f7571] hover:text-[#9c7a38] transition-colors mb-8 text-sm font-medium">
        <ArrowLeft size={16} className="mr-2" /> Back to Accessories
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-16">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#f5efe6]">
          <Image 
            src={accessory.image} 
            alt={accessory.name} 
            fill 
            className="object-cover" 
          />
          <div className="absolute left-2 top-2 z-10">
            <span className="inline-flex items-center rounded bg-[#9c7a38] px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold text-white shadow-sm tracking-tight">
              {discountPercent > 0 ? `${discountPercent}%` : accessory.badge}
            </span>
          </div>
          <button
            type="button"
            aria-label={`Add ${accessory.name} to wishlist`}
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
          >
            <Heart size={14} className="text-[#9c7a38] hover:text-[#7f6128]" strokeWidth={1.75} />
          </button>
          <div className="absolute bottom-1.5 left-2.5 z-10 flex items-center gap-1">
            <span className="h-1.5 w-2 rounded-full bg-[#d4a23b]" />
            <span className="h-1 w-1 rounded-full bg-white/80" />
            <span className="h-1 w-1 rounded-full bg-white/80" />
            <span className="h-1 w-1 rounded-full bg-white/80" />
            <span className="h-1 w-1 rounded-full bg-white/80" />
            <span className="h-1 w-1 rounded-full bg-white/80" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-[#9c7a38] text-sm tracking-widest uppercase font-bold mb-2">
            {accessory.category.charAt(0).toUpperCase() + accessory.category.slice(1)}
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1f2421] mb-4 leading-tight">{accessory.name}</h1>
          
          <div className="mb-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-serif font-bold text-[#1a211e] leading-snug">
                {formatPrice(accessory.price)}
              </span>
              {originalPrice > accessory.price && (
                <span className="text-xl font-normal text-[#8c8c8c] line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-[13px] font-bold uppercase tracking-wide text-[#9c7a38]">
                  {discountPercent}% OFF
                </span>
                <span className="text-[13px] font-semibold text-[#2e8b57]">
                  Save {formatPrice(savings)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-8 text-[#454545]">
            <p>{accessory.desc}</p>
            <ul className="space-y-2 mt-4 text-sm">
              <li className="flex items-center"><Check size={16} className="text-[#9c7a38] mr-2" /> Premium Quality Materials</li>
              <li className="flex items-center"><Check size={16} className="text-[#9c7a38] mr-2" /> Designed for Daily Spiritual Practice</li>
              <li className="flex items-center"><Check size={16} className="text-[#9c7a38] mr-2" /> Durable & Long Lasting</li>
            </ul>
          </div>

          {/* Add to Cart Actions */}
          <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-3 sm:gap-4">
            <div className="flex h-12 w-full items-center justify-between rounded-md border border-[#e9e2d6] bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-full w-10 items-center justify-center text-[#6f7571] transition-colors hover:bg-[#f5efe6] hover:text-[#1f2421] focus:outline-none"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-bold text-[#1f2421]">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-full w-10 items-center justify-center text-[#6f7571] transition-colors hover:bg-[#f5efe6] hover:text-[#1f2421] focus:outline-none"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex min-h-12 w-full items-center justify-center gap-1.5 rounded-full bg-[#9c7a38] px-2.5 text-[11px] sm:text-[12px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#866629] active:scale-[0.98]"
            >
              <ShoppingBag size={13} className="text-white" />
              <span>Add to Cart</span>
            </button>
            
            <button 
              onClick={handleBuyNow}
              className="col-span-2 flex min-h-12 w-full items-center justify-center rounded-full border border-[#cfc7bc] bg-transparent px-4 py-3 sm:col-span-1 text-[11px] sm:text-[12px] font-semibold text-[#454545] transition-all duration-200 hover:bg-neutral-100/70 hover:text-[#1c221e] active:scale-[0.98]"
            >
              Buy Now
            </button>
          </div>

          {/* Guarantees */}
          <div className="bg-[#f5efe6] p-6 rounded-xl flex flex-col sm:flex-row gap-6 sm:gap-0 justify-between items-center text-center sm:text-left border border-[#e9e2d6]">
            <div className="flex items-center flex-col sm:flex-row">
              <ShieldCheck size={28} className="text-[#9c7a38] mb-2 sm:mb-0 sm:mr-3" />
              <div>
                <h4 className="font-bold text-sm text-[#173b2d]">Secure Payment</h4>
                <p className="text-xs text-[#7d817a]">100% secure processing</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-[#e9e2d6]"></div>
            <div className="flex items-center flex-col sm:flex-row">
              <Truck size={28} className="text-[#9c7a38] mb-2 sm:mb-0 sm:mr-3" />
              <div>
                <h4 className="font-bold text-sm text-[#173b2d]">Fast Delivery</h4>
                <p className="text-xs text-[#7d817a]">Ships within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}