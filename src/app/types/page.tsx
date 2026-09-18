'use client';

import Link from 'next/link';
import Image from '@/components/ImageKitImage';
import { ArrowRight } from 'lucide-react';

function TypeCard({ type, index }: { type: typeof types[0]; index: number }) {
  return (
    <article className="group relative bg-white border border-brand-border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-accent/30 flex flex-col h-full">
      <Link href="/shop" className="block">
        <div className="relative aspect-square flex-shrink-0 overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <Image 
            src="/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.53%20PMd.jpeg"
            alt={type.mukhi} 
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-contain transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
            priority={index < 4}
          />
        </div>
      </Link>
      
      <div className="p-4 md:p-5 flex flex-col flex-grow justify-between gap-3 relative">
        <div className="relative z-10">
          <Link href="/shop" className="block">
            <h3 className="font-semibold text-brand-primary text-base leading-tight mb-2 hover:text-brand-accent transition-colors duration-300 line-clamp-2 group-hover:text-brand-accent">
              {type.mukhi}
            </h3>
          </Link>
          
          <p className="text-sm text-brand-muted mb-4 line-clamp-3">{type.desc}</p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-brand-border/50 mt-auto relative z-10">
          <span className="font-serif font-bold text-lg md:text-xl text-brand-secondary">
            {type.price}
          </span>
          
          <Link href="/shop" className="text-xs font-bold text-brand-primary hover:text-brand-accent flex items-center transition-colors">
            Shop <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
      
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none" />
    </article>
  );
}

const types = [
  { mukhi: '1 Mukhi', desc: 'Symbol of Lord Shiva. Brings super consciousness and enlightenment.', price: '₹ 15,000' },
  { mukhi: '2 Mukhi', desc: 'Symbol of Ardhanarishvara. Brings harmony in relationships.', price: '₹ 2,500' },
  { mukhi: '3 Mukhi', desc: 'Symbol of Agni. Burns past karmas and frees from stress.', price: '₹ 1,800' },
  { mukhi: '4 Mukhi', desc: 'Symbol of Lord Brahma. Enhances intelligence and creativity.', price: '₹ 1,500' },
  { mukhi: '5 Mukhi', desc: 'Symbol of Kalagni Rudra. Good for overall health and peace.', price: '₹ 500' },
  { mukhi: '6 Mukhi', desc: 'Symbol of Lord Kartikeya. Gives wisdom, learning and willpower.', price: '₹ 1,200' },
  { mukhi: '7 Mukhi', desc: 'Symbol of Goddess Mahalaxmi. Brings wealth and prosperity.', price: '₹ 1,800' },
  { mukhi: 'Gaurishankar', desc: 'Symbol of Shiva & Parvati. Expands universe of consciousness.', price: '₹ 4,500' },
];

export default function TypesPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full bg-[#19251D] py-20 text-center text-white relative">
        <div className="absolute inset-0 opacity-30">
          <Image src="/images/banner/ChatGPT%20Image%20Sep%2018%2C%202026%2C%2007_01_56%20PM.png" alt="Himalayan temple and Rudraksha" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-accent mb-4">Types of Rudraksha</h1>
          <p className="text-lg text-gray-300">
            Discover the different faces (Mukhis) of Rudraksha and their divine properties. 
            Find the perfect bead that aligns with your spiritual journey.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((type, i) => (
            <TypeCard key={i} type={type} index={i} />
          ))}
        </div>
        
        <div className="mt-16 bg-brand-light rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">Need help choosing?</h2>
          <p className="text-brand-text mb-6 max-w-2xl mx-auto">
            Our experts can recommend the right Rudraksha based on your astrological chart and current life situation.
          </p>
          <Link href="/contact" className="premium-button--bordered inline-flex items-center justify-center rounded-lg px-8 py-3 font-bold">
            Get Expert Advice
          </Link>
        </div>
      </div>
    </div>
  );
}
