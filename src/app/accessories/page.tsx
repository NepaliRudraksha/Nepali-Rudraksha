import Link from 'next/link';
import Image from '@/components/ImageKitImage';
import { ArrowRight } from 'lucide-react';

export default function AccessoriesPage() {
  const accessories = [
    { name: 'Copper Jalheri', desc: 'Traditional copper vessel for offering water to the Shiva Linga.', price: '₹ 850' },
    { name: 'Silver Chain (Pure 925)', desc: 'Premium silver chain to wear your Rudraksha pendant.', price: '₹ 1,200' },
    { name: 'Sandalwood Paste', desc: 'Pure sandalwood paste for daily rituals and applying on Rudraksha.', price: '₹ 350' },
    { name: 'Puja Thali Set', desc: 'Complete brass puja thali with all essential items for prayers.', price: '₹ 2,400' },
    { name: 'Rudraksha Cleaning Kit', desc: 'Soft brush and special oils to maintain your beads.', price: '₹ 450' },
    { name: 'Incense Sticks (Premium)', desc: 'Hand-rolled natural incense sticks for meditation.', price: '₹ 250' },
  ];

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
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accessories.map((item, i) => (
            <div key={i} className="bg-white border border-brand-border rounded-xl p-6 group hover:shadow-lg transition-all">
              <div className="relative h-48 bg-brand-light rounded-lg mb-6 overflow-hidden">
                <Image 
                  src="/images/rudraksha_pendant_1789219809886.jpg" 
                  alt={item.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h3 className="font-serif font-bold text-xl text-brand-primary mb-2">{item.name}</h3>
              <p className="text-sm text-brand-text mb-6 line-clamp-2">{item.desc}</p>
              
              <div className="flex items-center justify-between border-t border-brand-border pt-4">
                <span className="font-bold text-lg text-brand-secondary">{item.price}</span>
                <Link href="/shop" className="bg-brand-primary hover:bg-brand-secondary text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
                  Add to Cart
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
