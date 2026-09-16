import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { getProducts, getSettings } from '@/lib/api';
import { Award, Brain, Check, Heart, Mountain, PlayCircle, RotateCcw, ShieldCheck, Sparkles, Star, ArrowRight, Truck } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import { MotionHeroWrapper, MotionHeroContent, MotionHeroImage, MotionSection } from '@/components/animations/MotionWrappers';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  // Admin-added products are marked as New by default. Show marked products
  // first, then fill the remaining homepage slots with highly rated products.
  const highlightedProducts = products.filter((product) => product.isNew || product.isBestseller);
  const featuredProducts = [
    ...highlightedProducts,
    ...products.filter(
      (product) =>
        product.rating === 5 &&
        !highlightedProducts.some((highlighted) => highlighted.id === product.id)
    ),
  ].slice(0, 4);

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero Section */}
      <MotionHeroWrapper>
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-60">
          <Image 
            src="/images/hero_rudraksha_himalayas_1789219738482.jpg" 
            alt="Himalayan Temple Background" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-20 flex flex-col md:flex-row justify-between items-center">
          <MotionHeroContent>
            <p className="text-brand-accent tracking-[0.2em] text-xs font-bold uppercase">Sacred by Nature. Blessed for Life.</p>
            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight">
              Nepali Rudraksha <br/>
              <span className="text-brand-accent font-bold italic">A Divine Companion</span>
            </h1>
            <p className="text-lg text-gray-200">
              Original Rudraksha from the Himalayas, bringing peace, protection and positive energy to your life.
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <Link href="/shop" className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold px-8 py-3 rounded-md transition-colors shadow-lg hover:scale-105 active:scale-95 transform duration-200">
                Shop Now
              </Link>
            </div>
          </MotionHeroContent>
          <MotionHeroImage>
            {/* Rudraksha Hero Image */}
            <Image 
              src="/images/rudraksha_bead_close_1789219796219.jpg"
              alt="Premium Rudraksha Bead"
              fill
              className="object-cover rounded-full shadow-2xl border-4 border-brand-accent/30 drop-shadow-2xl mix-blend-luminosity hover:mix-blend-normal hover:scale-105 transition-all duration-700"
            />
          </MotionHeroImage>
        </div>
      </MotionHeroWrapper>

      {/* 2. Trust Badges */}
      <MotionSection className="w-full bg-brand-light border-y border-brand-border py-4 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-4 text-sm font-medium text-brand-primary">
          {[
            { label: '100% Authentic', icon: ShieldCheck },
            { label: 'Lab Certified', icon: Award },
            { label: 'Direct from Nepal', icon: Mountain },
            { label: 'Free Shipping in India', icon: Truck },
            { label: 'Easy Returns', icon: RotateCcw },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <badge.icon size={20} className="text-brand-accent" aria-hidden="true" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </MotionSection>

      {/* 3. Shop by Category */}
      <MotionSection className="w-full max-w-7xl mx-auto py-16 px-4 md:px-10 lg:px-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-2">Explore Our Collections</p>
            <h2 className="text-3xl font-serif font-bold text-brand-primary">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-brand-secondary hover:text-brand-accent flex items-center">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: 'All Rudraksha', img: '/images/rudraksha_bead_close_1789219796219.jpg', href: '/shop' },
            { name: 'Rudraksha Malas', img: '/images/hero_rudraksha_himalayas_1789219738482.jpg', href: '/shop?category=mala' },
            { name: 'Rudraksha Pendants', img: '/images/rudraksha_pendant_1789219809886.jpg', href: '/shop' },
            { name: 'Bracelets', img: '/images/rudraksha_bead_close_1789219796219.jpg', href: '/shop' },
            { name: 'Puja Accessories', img: '/images/meditating_sadhu_mountains_1789219782503.jpg', href: '/shop' },
            { name: 'Gift Sets', img: '/images/rudraksha_pendant_1789219809886.jpg', href: '/shop' },
            { name: 'Special Beads', img: '/images/rudraksha_bead_close_1789219796219.jpg', href: '/shop?category=special' },
          ].map((cat, i) => (
            <Link key={i} href={cat.href} className="flex flex-col items-center group cursor-pointer">
              <div className="w-32 h-32 rounded-2xl bg-brand-light overflow-hidden mb-3 border border-brand-border group-hover:border-brand-accent transition-colors relative shadow-sm">
                <Image src={cat.img} alt={cat.name} fill className="object-cover" />
              </div>
              <span className="text-xs font-semibold text-center text-brand-primary group-hover:text-brand-accent transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </MotionSection>

      {/* 4. Ancient Wisdom Section */}
      <MotionSection className="w-full bg-brand-primary relative py-20 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <Image src="/images/meditating_sadhu_mountains_1789219782503.jpg" alt="Meditating" fill className="object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-accent text-xs tracking-[0.2em] font-bold uppercase mb-4">The Power of Rudraksha</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ancient Wisdom<br/>Modern Life</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Rudraksha is not just a bead; it is a symbol of inner peace, protection and higher consciousness. Let its divine energy guide you towards a healthier, happier and more balanced life.
            </p>
            <Link href="/about" className="inline-block bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold px-8 py-3 rounded-md transition-colors">
              Discover More
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'Enhances Focus & Clarity', desc: 'Activates the mind, sharpens concentration and improves decision-making abilities.', icon: Brain },
              { title: 'Brings Positivity & Peace', desc: 'Creates a positive aura around the wearer, repelling negativity and promoting inner peace.', icon: ShieldCheck },
              { title: 'Supports Health & Well-being', desc: 'Known to regulate blood pressure, reduce stress and boost overall physical health.', icon: Heart },
              { title: 'Attracts Prosperity & Success', desc: 'Opens the doors to financial growth, career success and abundant living.', icon: Sparkles },
            ].map((benefit, i) => (
              <div key={i} className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-brand-accent/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-xl flex-shrink-0">
                  <benefit.icon size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold mb-1">{benefit.title}</p>
                  <p className="text-xs text-gray-400">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* 5. Featured Products */}
      <MotionSection className="w-full max-w-7xl mx-auto py-16 px-4 md:px-10 lg:px-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-2">Featured Products</p>
            <h2 className="text-3xl font-serif font-bold text-brand-primary">Handpicked for Your Spiritual Journey</h2>
          </div>
          <Link href="/shop" className="hidden md:flex text-sm font-semibold text-brand-secondary hover:text-brand-accent items-center">
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white border border-brand-border rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <Link href={`/shop/${product.id}`}>
                <div className="relative h-40 md:h-48 bg-brand-light flex-shrink-0">
                  <div className="absolute z-10 top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 items-start">
                    {settings.show_bestseller === 'true' && product.isBestseller && (
                      <span className="bg-green-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">Bestseller</span>
                    )}
                    {settings.show_new_arrivals === 'true' && product.isNew && (
                      <span className="bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">New</span>
                    )}
                  </div>
                  <Image 
                    src={product.image || "/images/rudraksha_bead_close_1789219796219.jpg"} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
              </Link>
              <div className="p-3 md:p-5 flex flex-col flex-grow justify-between gap-3">
                <div>
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="font-bold text-brand-primary text-xs md:text-base leading-tight mb-1 md:mb-2 h-8 md:h-10 hover:text-brand-accent transition-colors line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="flex items-center space-x-1 mb-1 md:mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={10} className={`md:w-3.5 md:h-3.5 ${star <= Math.round(product.rating ?? 0) ? "fill-brand-accent text-brand-accent" : "text-gray-300"}`} />
                    ))}
                    <span className="text-[10px] md:text-xs text-brand-muted ml-1">({product.reviewsCount ?? 0})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm md:text-xl text-brand-secondary">₹ {product.price > 0 ? product.price.toLocaleString() : 'Enquire'}</span>
                  <AddToCartButton product={product} iconOnly={true} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </MotionSection>

      {/* 6. A Small Bead A Bigger Purpose */}
      <MotionSection className="w-full bg-[#19251D] py-16 px-4 md:px-10 lg:px-20 text-white relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 relative h-80 w-full rounded-2xl overflow-hidden border-2 border-brand-accent/30">
            <Image src="/images/rudraksha_pendant_1789219809886.jpg" alt="Small Bead" fill className="object-cover" />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-serif font-bold text-brand-accent mb-4">A Small Bead<br/>A Bigger Purpose</h2>
            <p className="text-gray-300 mb-8">Stay grounded. Stay positive. Let the divine energy of Rudraksha be with you in every step of life.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Natural & Untreated', icon: <Check size={20}/> },
                { label: 'Lab Certified', icon: <ShieldCheck size={20}/> },
                { label: 'Sourced from Nepal', icon: <Check size={20}/> },
                { label: 'Wide Variety', icon: <Check size={20}/> },
                { label: 'Custom Malas', icon: <Check size={20}/> },
                { label: 'Worldwide Shipping', icon: <Check size={20}/> },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-brand-accent/40 transition-colors">
                  <div className="text-brand-accent mb-2">{item.icon}</div>
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
              ))}
            </div>
            <Link href="/shop" className="inline-block bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold px-8 py-3 rounded-md transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </MotionSection>

      {/* 7. Testimonials */}
      <MotionSection className="w-full max-w-7xl mx-auto py-16 px-4 md:px-10 lg:px-20">
        <div className="text-center mb-12">
          <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-2">What Our Customers Say</p>
          <h2 className="text-3xl font-serif font-bold text-brand-primary">Testimonials</h2>
        </div>
        <TestimonialCarousel
          reviews={[
            { name: 'Rahul Sharma', location: 'Delhi', rating: 5, text: 'I have been wearing the 5 Mukhi Rudraksha for 6 months. My stress levels have reduced dramatically and I feel more peaceful than ever. Highly authentic beads!', product: '5 Mukhi Rudraksha' },
            { name: 'Priya Patel', location: 'Mumbai', rating: 5, text: 'Ordered the Gaurishankar Rudraksha as a wedding anniversary gift. The quality is exceptional and it came beautifully packaged with the lab certificate. Very happy!', product: 'Gaurishankar Rudraksha' },
            { name: 'Suresh Kumar', location: 'Bangalore', rating: 5, text: 'The 7 Mukhi Rudraksha has been a game changer for my business. Things have been looking up ever since I started wearing it. Truly a divine bead!', product: '7 Mukhi Rudraksha' },
            { name: 'Ananya Mehta', location: 'Pune', rating: 5, text: 'My 4 Mukhi Rudraksha arrived quickly and the certification gave me complete confidence. It is beautiful, genuine, and has become part of my daily prayer.', product: '4 Mukhi Rudraksha' },
            { name: 'Vikram Singh', location: 'Jaipur', rating: 5, text: 'Excellent guidance before purchase and a very premium mala. The beads are perfectly selected and the packaging made it feel truly special.', product: '5 Mukhi Rudraksha Mala' },
            { name: 'Neha Verma', location: 'Chandigarh', rating: 5, text: 'I bought this as a gift for my mother and she loved it. The authenticity certificate and thoughtful presentation were both outstanding.', product: 'Gauri Shankar Rudraksha' },
            { name: 'Arjun Nair', location: 'Kochi', rating: 5, text: 'The whole experience was seamless—from choosing the right bead to delivery. The quality is exactly as described and I would happily recommend it.', product: '7 Mukhi Rudraksha' },
          ]}
        />
      </MotionSection>

    </div>
  );
}
