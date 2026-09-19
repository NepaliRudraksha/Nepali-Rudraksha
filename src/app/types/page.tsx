'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ChevronDown, Filter, Heart, Leaf, RotateCcw, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import Image from '@/components/ImageKitImage';
import { ShoppingBag } from 'lucide-react';

type SortOption = 'popular' | 'price-low' | 'price-high' | 'mukhi';

const types = [
  { mukhi: 1, title: '1 Mukhi', desc: 'Symbol of Lord Shiva. Brings super consciousness and enlightenment.', price: 1500, benefits: ['Spiritual Growth', 'Peace & Positivity'] },
  { mukhi: 2, title: '2 Mukhi', desc: 'Symbol of Ardhanarishvara. Brings harmony in relationships.', price: 2500, benefits: ['Relationships', 'Peace & Positivity'] },
  { mukhi: 3, title: '3 Mukhi', desc: 'Symbol of Agni. Burns past karmas and frees from stress.', price: 1800, benefits: ['Health & Healing', 'Peace & Positivity'] },
  { mukhi: 4, title: '4 Mukhi', desc: 'Symbol of Lord Brahma. Enhances intelligence and creativity.', price: 1500, benefits: ['Spiritual Growth', 'Health & Healing'] },
  { mukhi: 5, title: '5 Mukhi', desc: 'Symbol of Kalagni Rudra. Supports everyday health and peace.', price: 500, benefits: ['Health & Healing', 'Peace & Positivity'] },
  { mukhi: 6, title: '6 Mukhi', desc: 'Symbol of Lord Kartikeya. Gives wisdom, learning and willpower.', price: 1200, benefits: ['Spiritual Growth', 'Health & Healing'] },
  { mukhi: 7, title: '7 Mukhi', desc: 'Symbol of Goddess Mahalaxmi. Brings wealth and prosperity.', price: 1800, benefits: ['Wealth & Prosperity', 'Peace & Positivity'] },
  { mukhi: 8, title: '8 Mukhi', desc: 'Symbol of Lord Ganesha. Helps remove obstacles and brings success.', price: 1500, benefits: ['Wealth & Prosperity', 'Spiritual Growth'] },
  { mukhi: 9, title: '9 Mukhi', desc: 'Symbol of Goddess Durga. Supports strength, courage and protection.', price: 2300, benefits: ['Health & Healing', 'Peace & Positivity'] },
  { mukhi: 10, title: '10 Mukhi', desc: 'Symbol of Lord Vishnu. Offers protection and a peaceful mind.', price: 2800, benefits: ['Peace & Positivity', 'Relationships'] },
  { mukhi: 11, title: '11 Mukhi', desc: 'Symbol of Lord Hanuman. Encourages confidence and wisdom.', price: 3500, benefits: ['Spiritual Growth', 'Health & Healing'] },
  { mukhi: 12, title: '12 Mukhi', desc: 'Symbol of Lord Surya. Brings vitality, leadership and radiance.', price: 4500, benefits: ['Wealth & Prosperity', 'Health & Healing'] },
];

const benefits = ['Spiritual Growth', 'Health & Healing', 'Wealth & Prosperity', 'Peace & Positivity', 'Relationships'];
const beadImage = '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.53%20PMd.jpeg';

function TypeCard({ type }: { type: typeof types[number] }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const originalPrice = Math.round(type.price * 1.2);
  const savings = Math.max(0, originalPrice - type.price);
  const discountPercent = Math.round(((originalPrice - type.price) / originalPrice) * 100);

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#ede6da] bg-white p-2 sm:p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cfb57a] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)]">
      <Link href={`/shop?category=beads`} className="relative block aspect-[1.12/1] overflow-hidden bg-[#f5efe6]">
        <Image src={beadImage} alt={type.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-2 top-2 z-10">
          <span className="inline-flex items-center rounded bg-[#9c7a38] px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold text-white shadow-sm tracking-tight">
            {discountPercent > 0 ? `${discountPercent}%` : ''}
          </span>
        </div>
      </Link>
      <div className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95">
        <Heart size={14} className="text-[#9c7a38]" />
      </div>
      <div className="mt-1.5 flex flex-col">
        <h3 className="font-[family-name:var(--font-display)] text-[16px] sm:text-[17px] font-bold text-[#1f2421] transition-colors line-clamp-1">
          {type.title}
        </h3>
        <p className="mt-1 text-[12px] sm:text-[13px] font-normal text-[#6f7571] line-clamp-1">
          {type.desc}
        </p>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[17px] sm:text-[18px] font-bold text-[#1a211e]">₹{type.price.toLocaleString('en-IN')}</span>
          {discountPercent > 0 && (
            <span className="text-[12.5px] sm:text-[13.5px] font-normal text-[#8c8c8c] line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
          )}
          {savings > 0 && (
            <span className="text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wide text-[#9c7a38]">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
      <div className="mt-2.5 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => addToCart({ id: type.mukhi.toString(), name: type.title, price: type.price, category: 'beads', image: beadImage, rating: 4, reviewsCount: 0 }, 1)}
          className="flex h-8 sm:h-8.5 w-full items-center justify-center gap-1.5 rounded-full bg-[#9c7a38] px-2.5 text-[12px] sm:text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#866629] active:scale-[0.98]"
        >
          <ShoppingBag size={13} className="text-white" />
          <span>Add to Cart</span>
        </button>
        <button
          type="button"
          onClick={() => {
            router.push('/checkout');
          }}
          className="flex h-7.5 sm:h-8 w-full items-center justify-center rounded-full border border-[#cfc7bc] bg-transparent px-2.5 text-[12px] sm:text-[13px] font-semibold text-[#454545] transition-all duration-200 hover:bg-neutral-100/70 hover:text-[#1c221e] active:scale-[0.98]"
        >
          Buy Now
        </button>
      </div>
    </article>
  );
}

export default function TypesPage() {
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const displayedTypes = useMemo(() => {
    const matched = types.filter((type) => type.price <= maxPrice && (selectedBenefits.length === 0 || selectedBenefits.some((benefit) => type.benefits.includes(benefit))));
    return [...matched].sort((first, second) => {
      if (sortBy === 'price-low') return first.price - second.price;
      if (sortBy === 'price-high') return second.price - first.price;
      if (sortBy === 'mukhi') return first.mukhi - second.mukhi;
      return first.mukhi - second.mukhi;
    });
  }, [maxPrice, selectedBenefits, sortBy]);

  const toggleBenefit = (benefit: string) => setSelectedBenefits((current) => current.includes(benefit) ? current.filter((item) => item !== benefit) : [...current, benefit]);
  const clearFilters = () => { setMaxPrice(50000); setSelectedBenefits([]); setSortBy('popular'); };

  return (
    <main className="min-h-screen w-full bg-[#fbfaf7]">
      <section className="relative isolate overflow-hidden border-y border-[#18392c]/35 bg-[#16382a]">
        <Image src="/images/banner/ChatGPT%20Image%20Sep%2018%2C%202026%2C%2007_01_56%20PM.png" alt="" fill sizes="100vw" className="-z-10 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#082d21]/80 via-[#123a2d]/55 to-[#112b20]/40" />
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-16">
          <p className="text-[10px] font-medium text-white/75"><Link href="/" className="hover:text-white">Home</Link><span className="mx-2">›</span>Rudraksha Types</p>
          <div className="mt-4 flex items-end justify-between gap-5">
            <div><h1 className="font-[family-name:var(--font-display)] text-[40px] font-bold leading-none text-white sm:text-[52px]">Rudraksha Types</h1><p className="mt-2 max-w-xl text-[14px] leading-relaxed text-white/85 sm:text-[16px]">Each Mukhi has a unique energy and meaning. Discover the sacred power within.</p></div>
            <p className="hidden max-w-44 border-b border-[#e8c783]/70 pb-2 font-[family-name:var(--font-display)] text-[19px] italic leading-tight text-[#f3d996] md:block">Ancient Wisdom for a Better Tomorrow</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/25 pt-5 sm:grid-cols-4 sm:gap-6">
            {[{ icon: ShieldCheck, title: '100% Authentic', text: 'Certified & Original' }, { icon: Sparkles, title: 'Lab Tested', text: 'Quality Assured' }, { icon: Truck, title: 'Free Shipping', text: 'Across India' }, { icon: RotateCcw, title: 'Easy Returns', text: 'Hassle Free' }].map((item) => <div key={item.title} className="flex items-center gap-2"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#866d40] shadow-sm"><item.icon size={14} /></span><span className="text-[10px] font-bold leading-[1.12] text-white sm:text-[11px]"><span className="block">{item.title}</span><span className="block font-medium text-white/75">{item.text}</span></span></div>)}
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-10 sm:py-10 lg:flex-row lg:gap-8 lg:px-12 xl:px-16">
        <aside className="w-full shrink-0 lg:w-[260px]">
          <div className="rounded-xl border border-[#eae4d9] bg-white p-4 shadow-[0_7px_18px_rgba(42,48,38,0.04)] lg:sticky lg:top-28 lg:p-5">
            <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-[18px] font-bold text-[#24372e]"><Filter size={19} /> Filters</h2><button type="button" onClick={() => setFiltersOpen((open) => !open)} className="flex items-center gap-1 text-[12px] font-bold text-[#81643b] lg:hidden" aria-expanded={filtersOpen}>Options <ChevronDown size={14} className={filtersOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /></button></div>
            <div className={`${filtersOpen ? 'mt-4' : 'hidden'} lg:mt-5 lg:block`}>
              <div className="border-t border-[#eee8dd] pt-4"><div className="flex items-center justify-between"><h3 className="text-[14px] font-extrabold text-[#303a33]">Price Range</h3><ChevronDown size={15} /></div><input aria-label="Maximum type price" type="range" min="0" max="50000" step="500" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#d3bf90] accent-[#947743]" /><div className="mt-2 flex justify-between text-[11px] text-[#777d75]"><span>₹0</span><span>{maxPrice >= 50000 ? '₹50,000+' : `₹${maxPrice.toLocaleString('en-IN')}`}</span></div></div>
              <div className="mt-5 border-t border-[#eee8dd] pt-4"><div className="flex items-center justify-between"><h3 className="text-[14px] font-extrabold text-[#303a33]">Benefits</h3><ChevronDown size={15} /></div><div className="mt-3 space-y-2.5">{benefits.map((benefit) => <label key={benefit} className="flex cursor-pointer items-center gap-2 text-[12px] text-[#697269]"><input type="checkbox" checked={selectedBenefits.includes(benefit)} onChange={() => toggleBenefit(benefit)} className="size-3.5 rounded border-[#b8b5aa] accent-[#947743]" />{benefit}</label>)}</div></div>
              <button type="button" onClick={clearFilters} className="mt-5 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#f4f1eb] text-[12px] font-bold text-[#58534a] hover:bg-[#ebe5db]"><RotateCcw size={14} /> Clear Filters</button>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-[13px] font-bold text-[#626a61] sm:text-[14px] lg:text-[15px]"><span className="text-[#314337]">{displayedTypes.length} Rudraksha Types</span><span className="mx-2 text-[#b0a798]">|</span><span className="font-medium italic text-[#938677]">Different Energies. A More Mindful You.</span></p><label className="relative"><span className="sr-only">Sort types</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className="h-9 appearance-none rounded-lg border border-[#e2dbd0] bg-white py-1.5 pl-3 pr-8 text-[12px] font-medium text-[#626a61] outline-none lg:h-10 lg:text-[13px]"><option value="popular">Sort by: Popular</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option><option value="mukhi">Mukhi: Low to high</option></select><ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6d736d]" /></label></div>
          {displayedTypes.length === 0 ? <div className="rounded-xl border border-dashed border-[#d9d0c2] py-16 text-center"><Leaf className="mx-auto size-8 text-[#a69c8b]" /><p className="mt-3 text-sm text-[#697269]">No Rudraksha types match these filters.</p><button type="button" onClick={clearFilters} className="mt-4 text-sm font-bold text-[#795e37]">Clear filters</button></div> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{displayedTypes.map((type) => <TypeCard key={type.mukhi} type={type} />)}</div>}
        </section>
      </div>
    </main>
  );
}
