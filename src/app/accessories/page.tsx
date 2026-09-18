'use client';

import Link from 'next/link';
import Image from '@/components/ImageKitImage';
import { ShoppingCart } from 'lucide-react';

function AccessoryCard({ item, index }: { item: typeof accessories[0]; index: number }) {
  return (
    <article className="group relative bg-white border border-brand-border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-accent/30 flex flex-col h-full">
      <Link href="/shop" className="block">
        <div className="relative aspect-square flex-shrink-0 overflow-hidden">
          <div className="absolute z-10 top-3 left-3 flex flex-col gap-1.5 items-start">
            <span className="bg-gradient-to-r from-brand-accent to-yellow-600 text-white text-[9px] md:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-brand-accent/30 animate-fade-in-up">Accessory</span>
          </div>
          
          <Image 
            src="/images/rudraksha_pendant_1789219809886.jpg" 
            alt={item.name} 
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
            priority={index < 3}
          />
        </div>
      </Link>
      
      <div className="p-4 md:p-5 flex flex-col flex-grow justify-between gap-3 relative">
        <div className="relative z-10">
          <Link href="/shop" className="block">
            <h3 className="font-semibold text-brand-primary text-base leading-tight mb-2 hover:text-brand-accent transition-colors duration-300 line-clamp-2 group-hover:text-brand-accent">
              {item.name}
            </h3>
          </Link>
          
          <p className="text-sm text-brand-muted mb-4 line-clamp-2">{item.desc}</p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-brand-border/50 mt-auto relative z-10">
          <span className="font-serif font-bold text-lg md:text-xl text-brand-secondary">
            {item.price}
          </span>
          
          <Link 
            href="/shop" 
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center hover:from-brand-secondary hover:to-brand-primary transition-all duration-300 shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-accent/30 hover:-translate-y-0.5 focus:ring-2 focus:ring-brand-accent focus:outline-none group-hover:scale-105"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </Link>
        </div>
      </div>
      
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none" />
    </article>
  );
}

const accessories = [
  { name: 'Copper Jalheri', desc: 'Traditional copper vessel for offering water to the Shiva Linga.', price: '₹ 850' },
  { name: 'Silver Chain (Pure 925)', desc: 'Premium silver chain to wear your Rudraksha pendant.', price: '₹ 1,200' },
  { name: 'Sandalwood Paste', desc: 'Pure sandalwood paste for daily rituals and applying on Rudraksha.', price: '₹ 350' },
  { name: 'Puja Thali Set', desc: 'Complete brass puja thali with all essential items for prayers.', price: '₹ 2,400' },
  { name: 'Rudraksha Cleaning Kit', desc: 'Soft brush and special oils to maintain your beads.', price: '₹ 450' },
  { name: 'Incense Sticks (Premium)', desc: 'Hand-rolled natural incense sticks for meditation.', price: '₹ 250' },
];

export default function AccessoriesPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full bg-[#19251D] py-20 text-center text-white relative">
        <div className="absolute inset-0 opacity-30">
          <Image src="/images/meditating_sadhu_mountains_1789219782503.jpg" alt="Background" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-accent mb-4">Spiritual Accessories</h1>
          <p className="text-lg text-gray-300">
            Enhance your spiritual practice with our curated collection of authentic, high-quality puja items and accessories.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accessories.map((item, i) => (
            <AccessoryCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}