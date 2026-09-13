import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/api';
import { PlayCircle, ShieldCheck, Star, ArrowRight, Check } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import { MotionHeroWrapper, MotionHeroContent, MotionHeroImage, MotionSection } from '@/components/animations/MotionWrappers';

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.filter(p => p.rating === 5).slice(0, 4);

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
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
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
                Shop Now &rarr;
              </Link>
              <button className="flex items-center space-x-2 text-white hover:text-brand-accent transition-colors">
                <PlayCircle size={24} />
                <span className="font-medium">Watch Video</span>
              </button>
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
            <div className="absolute -right-8 top-1/4 transform rotate-12 text-brand-accent font-serif italic text-2xl drop-shadow-md">
              Faith.<br/>Peace.<br/>Protection.<br/>Prosperity.
            </div>
            <div className="absolute -bottom-4 -left-4 text-brand-accent opacity-50 animate-pulse">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
            </div>
          </MotionHeroImage>
        </div>
      </MotionHeroWrapper>

      {/* 2. Trust Badges */}
      <MotionSection className="w-full bg-brand-light border-y border-brand-border py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-4 text-sm font-medium text-brand-primary">
          {[
            { label: '100% Authentic', icon: '🔮' },
            { label: 'Lab Certified', icon: '🏆' },
            { label: 'Direct from Nepal', icon: '🏔️' },
            { label: 'Free Shipping in India', icon: '🚚' },
            { label: 'Easy Returns', icon: '🔄' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xl">{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </MotionSection>

      {/* 3. Shop by Category */}
      <MotionSection className="w-full max-w-7xl mx-auto py-16 px-4 md:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-2">Explore Our Collections</p>
            <h2 className="text-3xl font-serif font-bold text-brand-primary">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-brand-secondary hover:text-brand-accent flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
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
              <div className="w-24 h-24 rounded-2xl bg-brand-light overflow-hidden mb-3 border border-brand-border group-hover:border-brand-accent transition-colors flex items-center justify-center p-2 relative shadow-sm">
                <Image src={cat.img} alt={cat.name} fill className="object-cover rounded-xl" />
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
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-accent text-xs tracking-[0.2em] font-bold uppercase mb-4">The Power of Rudraksha</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ancient Wisdom<br/>Modern Life</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Rudraksha is not just a bead; it is a symbol of inner peace, protection and higher consciousness. Let its divine energy guide you towards a healthier, happier and more balanced life.
            </p>
            <Link href="/about" className="inline-block bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold px-8 py-3 rounded-md transition-colors">
              Discover More &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'Enhances Focus & Clarity', desc: 'Activates the mind, sharpens concentration and improves decision-making abilities.', icon: '🧠' },
              { title: 'Brings Positivity & Peace', desc: 'Creates a positive aura around the wearer, repelling negativity and promoting inner peace.', icon: '☮️' },
              { title: 'Supports Health & Well-being', desc: 'Known to regulate blood pressure, reduce stress and boost overall physical health.', icon: '💚' },
              { title: 'Attracts Prosperity & Success', desc: 'Opens the doors to financial growth, career success and abundant living.', icon: '✨' },
            ].map((benefit, i) => (
              <div key={i} className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-brand-accent/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-xl flex-shrink-0">
                  {benefit.icon}
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
      <MotionSection className="w-full max-w-7xl mx-auto py-16 px-4 md:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-2">Featured Products</p>
            <h2 className="text-3xl font-serif font-bold text-brand-primary">Handpicked for Your Spiritual Journey</h2>
          </div>
          <Link href="/shop" className="hidden md:flex text-sm font-semibold text-brand-secondary hover:text-brand-accent items-center">
            View All Products <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white border border-brand-border rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300">
              <Link href={`/shop/${product.id}`}>
                <div className="relative h-64 bg-brand-light p-6 flex items-center justify-center">
                  {product.isBestseller && (
                    <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded">Bestseller</span>
                  )}
                  {product.isNew && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">New</span>
                  )}
                  <Image 
                    src={product.image || "/images/rudraksha_bead_close_1789219796219.jpg"} 
                    alt={product.name} 
                    fill 
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
              </Link>
              <div className="p-5 flex flex-col h-[180px] justify-between">
                <div>
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="font-bold text-brand-primary leading-tight mb-2 h-10 hover:text-brand-accent transition-colors line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} className={star <= (product.rating || 5) ? "fill-brand-accent text-brand-accent" : "text-gray-300"} />
                    ))}
                    <span className="text-xs text-brand-muted ml-1">({product.reviewsCount || 10})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xl text-brand-secondary">₹ {product.price > 0 ? product.price.toLocaleString() : 'Enquire'}</span>
                  <AddToCartButton product={product} iconOnly={true} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </MotionSection>

      {/* 6. A Small Bead A Bigger Purpose */}
      <MotionSection className="w-full bg-[#19251D] py-16 px-4 md:px-8 text-white relative">
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
              Shop Now &rarr;
            </Link>
          </div>
        </div>
      </MotionSection>

      {/* 7. Testimonials */}
      <MotionSection className="w-full max-w-7xl mx-auto py-16 px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-2">What Our Customers Say</p>
          <h2 className="text-3xl font-serif font-bold text-brand-primary">Testimonials</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Rahul Sharma', location: 'Delhi', rating: 5, text: 'I have been wearing the 5 Mukhi Rudraksha for 6 months. My stress levels have reduced dramatically and I feel more peaceful than ever. Highly authentic beads!', product: '5 Mukhi Rudraksha' },
            { name: 'Priya Patel', location: 'Mumbai', rating: 5, text: 'Ordered the Gaurishankar Rudraksha as a wedding anniversary gift. The quality is exceptional and it came beautifully packaged with the lab certificate. Very happy!', product: 'Gaurishankar Rudraksha' },
            { name: 'Suresh Kumar', location: 'Bangalore', rating: 5, text: 'The 7 Mukhi Rudraksha has been a game changer for my business. Things have been looking up ever since I started wearing it. Truly a divine bead!', product: '7 Mukhi Rudraksha' },
          ].map((review, i) => (
            <div key={i} className="bg-white border border-brand-border rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} className={s <= review.rating ? 'fill-brand-accent text-brand-accent' : 'text-gray-300'} />
                ))}
              </div>
              <p className="text-brand-text text-sm italic mb-4">"{review.text}"</p>
              <div className="border-t border-brand-border pt-4">
                <p className="font-bold text-brand-primary text-sm">{review.name}</p>
                <p className="text-xs text-brand-muted">{review.location} · Purchased: {review.product}</p>
              </div>
            </div>
          ))}
        </div>
      </MotionSection>

    </div>
  );
}
