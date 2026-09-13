import Link from 'next/link';
import Image from '@/components/ImageKitImage';
import { ArrowRight } from 'lucide-react';

export default function TypesPage() {
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full bg-[#19251D] py-20 text-center text-white relative">
        <div className="absolute inset-0 opacity-30">
          <Image src="/images/hero_rudraksha_himalayas_1789219738482.jpg" alt="Background" fill className="object-cover" />
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
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((type, i) => (
            <div key={i} className="bg-white border border-brand-border rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative h-64 bg-brand-light">
                <Image 
                  src="/images/rudraksha_bead_close_1789219796219.jpg" 
                  alt={type.mukhi} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl text-brand-primary mb-2">{type.mukhi}</h3>
                  <p className="text-sm text-brand-text mb-4 line-clamp-3">{type.desc}</p>
                </div>
                <div className="flex items-center justify-between border-t border-brand-border pt-4 mt-auto">
                  <span className="font-bold text-brand-secondary">{type.price}</span>
                  <Link href="/shop" className="text-xs font-bold text-brand-primary hover:text-brand-accent flex items-center transition-colors">
                    Shop <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-brand-light rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">Need help choosing?</h2>
          <p className="text-brand-text mb-6 max-w-2xl mx-auto">
            Our experts can recommend the right Rudraksha based on your astrological chart and current life situation.
          </p>
          <Link href="/contact" className="inline-block bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold px-8 py-3 rounded-md transition-colors shadow-sm">
            Get Expert Advice
          </Link>
        </div>
      </div>
    </div>
  );
}
