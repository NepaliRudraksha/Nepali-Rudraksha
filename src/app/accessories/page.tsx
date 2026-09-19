'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ChevronDown, Heart, Leaf, ShieldCheck, Truck } from 'lucide-react';
import Image from '@/components/ImageKitImage';
import { ShoppingBag } from 'lucide-react';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name';

const images = {
  bracelet: '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg',
  pendant: '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.52%20PM.jpeg',
  beads: '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.53%20PMd.jpeg',
  temple: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.48%20PM.jpeg',
  gift: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.51%20PM.jpeg',
  mountain: '/images/insight_for_better/WhatsApp%20Image%202026-09-18%20at%205.16.00%20PM.jpeg',
};

const categories = [
  { id: 'all', label: 'All Accessories', image: images.bracelet },
  { id: 'chains', label: 'Chains', image: images.pendant },
  { id: 'jalheris', label: 'Jalheris', image: images.temple },
  { id: 'pendants', label: 'Pendants', image: images.pendant },
  { id: 'cords', label: 'Cords & Threads', image: images.beads },
  { id: 'pouches', label: 'Pouches', image: images.gift },
  { id: 'boxes', label: 'Boxes', image: images.gift },
  { id: 'pastes', label: 'Pastes & Oils', image: images.mountain },
  { id: 'cleaning', label: 'Cleaning Kits', image: images.temple },
];

const accessories = [
  { name: 'Copper Jalheri', category: 'jalheris', desc: 'Traditional copper vessel for offering water to the Shiva Linga.', price: 850, badge: 'Bestseller', image: images.temple },
  { name: 'Silver Chain (Pure 925)', category: 'chains', desc: 'Premium silver chain to wear your Rudraksha pendant.', price: 1200, badge: 'Premium', image: images.pendant },
  { name: 'Sandalwood Paste', category: 'pastes', desc: 'Pure sandalwood paste for daily rituals and applying on Rudraksha.', price: 350, badge: 'Natural', image: images.mountain },
  { name: 'Rudraksha Pendant', category: 'pendants', desc: 'A sacred pendant designed for your daily spiritual practice.', price: 1100, badge: 'Sacred', image: images.pendant },
  { name: 'Red Prayer Thread', category: 'cords', desc: 'Durable sacred thread for malas, rituals and daily wear.', price: 150, badge: 'Essential', image: images.beads },
  { name: 'Puja Pouch', category: 'pouches', desc: 'A soft protective pouch for your sacred beads and accessories.', price: 450, badge: 'Handcrafted', image: images.gift },
  { name: 'Wooden Storage Box', category: 'boxes', desc: 'A thoughtful storage box for preserving your spiritual essentials.', price: 900, badge: 'Natural', image: images.gift },
  { name: 'Rudraksha Cleaning Kit', category: 'cleaning', desc: 'Soft brush and nourishing oil to care for your sacred beads.', price: 400, badge: 'Care', image: images.temple },
];

function AccessoryCard({ item }: { item: typeof accessories[number] }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const originalPrice = Math.round(item.price * 1.2);
  const savings = Math.max(0, originalPrice - item.price);
  const discountPercent = Math.round(((originalPrice - item.price) / originalPrice) * 100);

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#ede6da] bg-white p-2 sm:p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cfb57a] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)]">
      <Link href="/shop" className="relative block aspect-[1.12/1] overflow-hidden bg-[#f5efe6]">
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-2 top-2 z-10">
          <span className="inline-flex items-center rounded bg-[#9c7a38] px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold text-white shadow-sm tracking-tight">
            {discountPercent > 0 ? `${discountPercent}%` : item.badge || ''}
          </span>
        </div>
      </Link>
      <div className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95">
        <Heart size={14} className="text-[#9c7a38]" />
      </div>
      <div className="mt-1.5 flex flex-col">
        <h2 className="font-[family-name:var(--font-display)] text-[14px] sm:text-[15px] font-bold text-[#1f2421] transition-colors line-clamp-1">
          {item.name}
        </h2>
        <p className="mt-1 text-[10px] sm:text-[11px] font-normal text-[#6f7571] line-clamp-1">
          {item.desc}
        </p>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[15px] sm:text-[16.5px] font-bold text-[#1a211e]">₹{item.price.toLocaleString('en-IN')}</span>
          {discountPercent > 0 && (
            <span className="text-[11.5px] sm:text-[12.5px] font-normal text-[#8c8c8c] line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
          )}
          {savings > 0 && (
            <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wide text-[#9c7a38]">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
      <div className="mt-2.5 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => addToCart({ id: item.name, name: item.name, price: item.price, category: 'special', image: item.image, rating: 4, reviewsCount: 0 }, 1)}
          className="flex h-8 sm:h-8.5 w-full items-center justify-center gap-1.5 rounded-full bg-[#9c7a38] px-2.5 text-[11px] sm:text-[12px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#866629] active:scale-[0.98]"
        >
          <ShoppingBag size={13} className="text-white" />
          <span>Add to Cart</span>
        </button>
        <button
          type="button"
          onClick={() => router.push('/checkout')}
          className="flex h-7.5 sm:h-8 w-full items-center justify-center rounded-full border border-[#cfc7bc] bg-transparent px-2.5 text-[11px] sm:text-[12px] font-semibold text-[#454545] transition-all duration-200 hover:bg-neutral-100/70 hover:text-[#1c221e] active:scale-[0.98]"
        >
          Buy Now
        </button>
      </div>
    </article>
  );
}

export default function AccessoriesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const visibleAccessories = useMemo(() => {
    const matched = accessories.filter((item) => activeCategory === 'all' || item.category === activeCategory);
    return [...matched].sort((first, second) => {
      if (sortBy === 'price-low') return first.price - second.price;
      if (sortBy === 'price-high') return second.price - first.price;
      if (sortBy === 'name') return first.name.localeCompare(second.name);
      return 0;
    });
  }, [activeCategory, sortBy]);

  return (
    <main className="min-h-screen w-full bg-[#fbfaf7]">
      <section className="relative isolate overflow-hidden border-y border-[#e5dacb] bg-[#f4ede0]">
        <Image src={images.bracelet} alt="Rudraksha accessories" fill sizes="100vw" className="-z-10 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b3023]/82 via-[#164434]/52 to-[#183b2d]/22" />
        <div className="mx-auto max-w-7xl px-5 py-9 sm:px-10 sm:py-10 lg:px-12 xl:px-16">
          <div className="flex items-end justify-between gap-6"><div><p className="text-[9px] font-extrabold tracking-[0.16em] text-[#f0cc86] uppercase sm:text-[10px]">Complete your spiritual journey</p><h1 className="mt-2 font-[family-name:var(--font-display)] text-[37px] font-bold leading-none text-white sm:text-[48px]">Rudraksha Accessories</h1><p className="mt-2 max-w-lg text-[12px] leading-relaxed text-white/85 sm:text-[14px]">Thoughtfully crafted accessories to enhance, protect and showcase your sacred Rudraksha.</p></div><p className="hidden max-w-44 border-b border-[#e8c783]/70 pb-2 font-[family-name:var(--font-display)] text-[18px] italic leading-tight text-[#f3d996] md:block">More than Accessories, A Deeper Connection</p></div>
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/25 pt-5 sm:grid-cols-3 sm:gap-6"><div className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-full bg-white/90 text-[#926e3c] shadow-sm"><Leaf size={14} /></span><span className="text-[9px] font-bold leading-[1.1] text-white"><span className="block">Premium Quality</span><span className="block font-medium text-white/75">Durable & Long Lasting</span></span></div><div className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-full bg-white/90 text-[#926e3c] shadow-sm"><ShieldCheck size={14} /></span><span className="text-[9px] font-bold leading-[1.1] text-white"><span className="block">Safe for Daily Use</span><span className="block font-medium text-white/75">Skin Friendly Materials</span></span></div><div className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-full bg-white/90 text-[#926e3c] shadow-sm"><Truck size={14} /></span><span className="text-[9px] font-bold leading-[1.1] text-white"><span className="block">Pan India Delivery</span><span className="block font-medium text-white/75">Fast & Secure</span></span></div></div>
        </div>
      </section>

      <section className="border-b border-[#eee7dc] bg-white"><div className="mx-auto max-w-7xl overflow-x-auto px-5 py-4 sm:px-10 lg:px-12 xl:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><div className="flex min-w-max gap-2 sm:justify-between sm:gap-3">{categories.map((category) => <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)} className={`w-[78px] shrink-0 rounded-lg p-1.5 text-center transition-colors sm:w-[88px] ${activeCategory === category.id ? 'border border-[#d9bc80] bg-[#fffdf8]' : 'border border-transparent hover:bg-[#faf7f1]'}`}><span className="relative block aspect-square overflow-hidden rounded-md bg-[#f4f0e7]"><Image src={category.image} alt="" fill sizes="88px" className="object-cover" /></span><span className="mt-1 block line-clamp-1 text-[8px] font-bold text-[#3d473f] sm:text-[9px]">{category.label}</span></button>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-7 sm:px-10 sm:py-9 lg:px-12 xl:px-16"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-[11px] font-bold text-[#4d5a50] sm:text-[13px]"><span>{visibleAccessories.length} Accessories</span><span className="mx-2 text-[#b5a894]">|</span><span className="font-medium italic text-[#948576]">Sacred Additions for Everyday Life</span></p><label className="relative"><span className="sr-only">Sort accessories</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className="h-9 appearance-none rounded-lg border border-[#e2dbd0] bg-white py-1.5 pl-3 pr-8 text-[10px] font-medium text-[#626a61] outline-none sm:text-[11px]"><option value="featured">Sort by: Featured</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option><option value="name">Name: A to Z</option></select><ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6d736d]" /></label></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">{visibleAccessories.map((item) => <AccessoryCard key={item.name} item={item} />)}</div></section>
    </main>
  );
}
