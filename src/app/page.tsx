import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { getProducts, getSettings } from '@/lib/api';
import { Award, ArrowRight, Brain, Check, Heart, Mountain, RotateCcw, ShieldCheck, Sparkles, Star, Truck, ShoppingCart } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import { MotionHeroWrapper, MotionHeroContent, MotionHeroImage, MotionSection } from '@/components/animations/MotionWrappers';
import { unstable_noStore as noStore } from 'next/cache';

function CategoryCard({ name, img, href, index }: { name: string; img: string; href: string; index: number }) {
  return (
    <Link 
      href={href} 
      className="group flex flex-col items-center transition-transform duration-500 hover:-translate-y-1.5"
    >
      <article className="relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl w-full aspect-square mb-3">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <Image 
          src={img} 
          alt={name} 
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 14vw, 12vw"
          className="object-contain p-4 transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
          priority={index < 4}
        />
        
        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none" />
      </article>
      <span className="text-sm font-semibold text-center text-brand-primary group-hover:text-brand-accent transition-colors w-full">{name}</span>
    </Link>
  );
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  noStore();
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
              <Link href="/shop" className="premium-button--bordered inline-flex items-center justify-center rounded-lg px-8 py-3">
                Buy Now
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
        <div className="flex flex-wrap justify-between items-end mb-8 gap-2">
          <div>
            <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-2">Explore Our Collections</p>
            <h2 className="text-3xl font-serif font-bold text-brand-primary">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-brand-secondary hover:text-brand-accent flex items-center whitespace-nowrap shrink-0">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
          {[
            { name: 'All Rudraksha', img: '/images/rudraksha_bead_close_1789219796219.jpg', href: '/shop' },
            { name: 'Rudraksha Malas', img: '/images/hero_rudraksha_himalayas_1789219738482.jpg', href: '/shop?category=mala' },
            { name: 'Rudraksha Pendants', img: '/images/rudraksha_pendant_1789219809886.jpg', href: '/shop' },
            { name: 'Bracelets', img: '/images/rudraksha_bead_close_1789219796219.jpg', href: '/shop' },
            { name: 'Puja Accessories', img: '/images/meditating_sadhu_mountains_1789219782503.jpg', href: '/shop' },
            { name: 'Gift Sets', img: '/images/rudraksha_pendant_1789219809886.jpg', href: '/shop' },
            { name: 'Special Beads', img: '/images/rudraksha_bead_close_1789219796219.jpg', href: '/shop?category=special' },
          ].map((cat, i) => (
            <CategoryCard key={i} name={cat.name} img={cat.img} href={cat.href} index={i} />
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
<Link href="/about" className="premium-button--bordered inline-flex items-center justify-center rounded-lg px-6 py-3 font-bold">
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
            <article key={product.id} className="group relative bg-white border border-brand-border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-accent/30 flex flex-col h-full">
              <Link href={`/shop/${product.id}`} className="block">
                <div className="relative aspect-square bg-brand-light flex-shrink-0 overflow-hidden">
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <Image 
                    src={product.image || "/images/rudraksha_bead_close_1789219796219.jpg"} 
                    alt={product.name} 
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-contain transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
                    priority={product.isBestseller || product.isNew}
                  />
                  
                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none" />
                </div>
              </Link>
              
              <div className="p-3 md:p-4 flex flex-col flex-grow justify-between gap-2.5 relative">
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    {product.category === 'beads' && (
                      <span className="text-[8px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Beads</span>
                    )}
                    {product.category === 'mala' && (
                      <span className="text-[8px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Mala</span>
                    )}
                    {product.category === 'special' && (
                      <span className="text-[8px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Special</span>
                    )}
                    {product.mukhi && (
                      <span className="text-[8px] font-medium text-brand-muted px-2 py-0.5 rounded-full bg-brand-light">
                        {product.mukhi} Mukhi
                      </span>
                    )}
                  </div>
                  
                  <Link href={`/shop/${product.id}`} className="block">
                    <h3 className="font-semibold text-brand-primary text-sm leading-tight mb-1.5 hover:text-brand-accent transition-colors duration-300 line-clamp-2 group-hover:text-brand-accent">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-1 mb-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={11} 
                        className={`transition-colors duration-200 ${star <= Math.round(product.rating ?? 0) ? "fill-brand-accent text-brand-accent" : "text-brand-border group-hover:text-brand-accent/50"}`} 
                      />
                    ))}
                    <span className="text-[9px] md:text-xs text-brand-muted ml-1">({product.reviewsCount ?? 0})</span>
                  </div>
                  
                  {product.origin && (
                    <div className="flex items-center gap-1 text-[9px] text-brand-muted mb-1.5">
                      <span className="flex items-center gap-0.5">
                        {product.origin === 'nepali' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span>Nepali Origin</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span>Indonesian Origin</span>
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-[minmax(0,1fr)_2.25rem] items-center gap-2 border-t border-brand-border/50 pt-2 mt-auto relative z-10 md:grid-cols-[minmax(0,1fr)_2.5rem]">
                  <span className={`truncate font-serif font-bold text-brand-secondary ${product.price > 0 ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
                    {product.price > 0 ? `₹${product.price.toLocaleString()}` : 'On request'}
                  </span>
                  
                  <AddToCartButton 
                    product={product} 
                    iconOnly={true} 
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center hover:from-brand-secondary hover:to-brand-primary transition-all duration-300 shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-accent/30 hover:-translate-y-0.5 focus:ring-2 focus:ring-brand-accent focus:outline-none group-hover:scale-105 flex-shrink-0"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </MotionSection>

{/* 6. A Small Bead A Bigger Purpose */}
      <MotionSection className="w-full bg-[#19251D] py-10 md:py-14 px-4 md:px-10 lg:px-20 text-white relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Image Column */}
          <div className="lg:w-1/2 flex-shrink-0 max-w-md md:max-w-lg mx-auto lg:mx-0">
            <div className="relative aspect-[4/3] md:aspect-[5/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 group">
              <Image 
                src="/images/rudraksha_pendant_1789219809886.jpg" 
                alt="Premium Rudraksha Pendant" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-xs text-white/80 text-center">Authentic Himalayan Rudraksha</p>
              </div>
            </div>
          </div>
          
          {/* Content Column */}
          <div className="lg:w-1/2 w-full">
            <div className="text-center lg:text-left">
              <p className="text-brand-accent text-xs tracking-[0.2em] font-bold uppercase mb-2">Our Promise</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-tight mb-4">
                A Small Bead<br/>
                <span className="text-brand-accent">A Bigger Purpose</span>
              </h2>
              
              <p className="text-gray-300 mb-6 text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                Stay grounded. Stay positive. Let the divine energy of authentic Nepali Rudraksha guide you in every step of life.
              </p>
            </div>
            
            {/* Features Grid - 2 columns on mobile */}
            <div className="grid grid-cols-2 gap-2.5 md:gap-3 mb-8">
              {[
                { label: 'Natural & Untreated', icon: Check },
                { label: 'Lab Certified', icon: ShieldCheck },
                { label: 'Sourced from Nepal', icon: Mountain },
                { label: 'Wide Variety', icon: Sparkles },
                { label: 'Custom Malas', icon: Heart },
                { label: 'Worldwide Shipping', icon: Truck },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 p-2.5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-brand-accent/40 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-7 h-7 flex-shrink-0 rounded-lg bg-brand-accent/15 flex items-center justify-center text-brand-accent">
                    <item.icon size={14} aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-white leading-snug">{item.label}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
              <Link 
                href="/shop" 
                className="premium-button--bordered inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-bold text-sm w-full sm:w-auto min-w-[140px] text-center"
              >
                Shop Collection
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 font-semibold text-sm text-white hover:bg-white/20 hover:border-brand-accent/50 transition-all duration-300"
              >
                Get Expert Advice
              </Link>
            </div>
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
