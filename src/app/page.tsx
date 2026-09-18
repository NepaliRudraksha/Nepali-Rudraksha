import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { BadgeCheck, Brain, Check, CreditCard, Heart, Mountain, Play, ShieldCheck, ShoppingCart, Sparkles, Star, Truck } from 'lucide-react';
import ReviewCarousel from '@/components/ReviewCarousel';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import { MotionHeroWrapper, MotionHeroContent, MotionSection } from '@/components/animations/MotionWrappers';

function CategoryCard({ name, description, img, href, index }: { name: string; description: string; img: string; href: string; index: number }) {
  return (
    <Link href={href} className="group block h-full">
      <article className="flex h-full min-h-[172px] flex-col rounded-b-xl border-b border-[#e4ddcf] bg-[#faf8f2] px-2.5 pb-3 pt-1.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#b79757] hover:bg-white sm:min-h-[184px]">
        <div className="relative mx-auto h-[112px] w-full overflow-hidden sm:h-[122px]">
          <Image
            src={img}
            alt={name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 23vw, 14vw"
            className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
            priority={index < 4}
          />
        </div>
        <h3 className="mt-1 text-[11px] font-bold leading-tight text-[#173b2d] sm:text-[12px]">{name}</h3>
        <p className="mt-0.5 text-[9px] font-medium leading-tight text-[#6d756b] sm:text-[10px]">{description}</p>
      </article>
    </Link>
  );
}

export const dynamic = 'force-dynamic';

export default function Home() {
  const featuredProducts = [
    { id: 'five-mukhi-mala', name: '5 Mukhi Rudraksha Mala', detail: '(108 Beads)', price: 1500, reviewsCount: 124, rating: 5, badge: 'Bestseller', image: '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg' },
    { id: 'one-mukhi-pendant', name: '1 Mukhi Rudraksha Pendant', detail: '(With Silver Capping)', price: 20000, reviewsCount: 76, rating: 5, badge: 'New', image: '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.52%20PM.jpeg' },
    { id: 'two-mukhi', name: '2 Mukhi Rudraksha', detail: '(Nepal)', price: 15000, reviewsCount: 58, rating: 4, image: '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.53%20PMd.jpeg' },
    { id: 'gaurishankar', name: 'Gaurishankar Rudraksha', detail: '(2 Beads Naturally Joined)', price: 25000, reviewsCount: 41, rating: 4, image: '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.56%20PM.jpeg' },
    { id: 'seven-mukhi-mala', name: '7 Mukhi Rudraksha Mala', detail: '', price: 2500, reviewsCount: 53, rating: 4, image: '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.57%20PM.jpeg' },
  ].map((product) => ({ ...product, category: '', mukhi: '', origin: '', isBestseller: false, isNew: false }));

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero Section */}
      <MotionHeroWrapper>
        <Image
          src="/images/banner/ChatGPT%20Image%20Sep%2018%2C%202026%2C%2007_01_56%20PM.png"
          alt="Rudraksha in the Himalayan temple landscape"
          fill
          className="object-cover object-[62%_center] md:object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_54%_94%_at_17%_53%,rgba(255,253,246,0.86)_0%,rgba(255,253,246,0.68)_39%,rgba(255,253,246,0.2)_67%,transparent_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[inherit] w-full max-w-7xl items-center px-5 py-16 sm:px-8 md:items-start md:px-10 md:pb-0 md:pt-[clamp(7rem,17vh,10rem)] lg:px-20">
          <MotionHeroContent>
            <div className="max-w-[39rem] text-brand-primary">
              <p className="mb-2 text-[9px] font-extrabold tracking-[0.24em] text-[#564332] uppercase sm:text-[10px]">
                Sacred by Nature. Blessed for Life.
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-[43px] font-bold leading-[0.82] tracking-[-0.035em] text-[#082b20] sm:text-[52px] md:text-[48px] lg:text-[55px]">
                Nepali Rudraksha
                <span className="mt-3 block text-[#70462f]">A Divine Companion</span>
              </h1>
              <p className="mt-4 max-w-[25rem] text-[12px] font-semibold leading-[1.35] text-[#132f24] sm:text-[13px]">
                Original Rudraksha from the Himalayas, bringing peace, protection and positive energy to your life.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3.5">
                <Link href="/shop" className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-[#0e3729] via-[#104532] to-[#0d2e23] px-6 text-[12px] font-bold text-white shadow-[0_10px_18px_rgba(10,48,36,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_23px_rgba(10,48,36,0.32)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173b2d] focus-visible:ring-offset-2">
                  Shop Now
                </Link>
                <Link href="/about" className="inline-flex h-11 items-center gap-2.5 rounded-full border border-[#193d2f]/20 bg-white/55 py-1.5 pl-2 pr-5 text-[12px] font-bold text-[#263d33] shadow-[0_4px_10px_rgba(31,46,36,0.06)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-[0_8px_16px_rgba(31,46,36,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173b2d] focus-visible:ring-offset-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#0e4937] text-white shadow-sm shadow-[#0e4937]/30">
                    <Play size={11} className="ml-0.5 fill-current" aria-hidden="true" />
                  </span>
                  Watch Our Story
                </Link>
              </div>

              <div className="mt-20 grid max-w-[39rem] grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4 sm:gap-x-0">
                {[
                  { title: '100% Authentic', subtitle: 'Nepali Origin', icon: BadgeCheck },
                  { title: 'Lab Certified', subtitle: '& Tested', icon: ShieldCheck },
                  { title: 'Free Shipping', subtitle: 'Across India', icon: Truck },
                  { title: 'Easy Returns', subtitle: 'Hassle Free', icon: CreditCard },
                ].map((badge, index) => (
                  <div key={badge.title} className={`flex items-center gap-2 text-[#082e21] drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)] sm:px-3 ${index > 0 ? 'sm:border-l sm:border-[#173b2d]/20' : 'sm:pl-0'}`}>
                    <badge.icon size={27} strokeWidth={2.25} className="shrink-0" aria-hidden="true" />
                    <span className="text-[11px] font-extrabold leading-[1.12]">
                      <span className="block whitespace-nowrap">{badge.title}</span>
                      <span className="block whitespace-nowrap text-[#254c3d]">{badge.subtitle}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </MotionHeroContent>
        </div>

      </MotionHeroWrapper>

      {/* 2. Shop by Category */}
      <MotionSection className="w-full bg-[#fffdf7] px-4 py-12 sm:py-14 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
              <p className="mb-1 text-[9px] font-extrabold tracking-[0.22em] text-[#6b6257] uppercase sm:text-[10px]">Explore Our Collections</p>
              <h2 className="font-[family-name:var(--font-display)] text-[32px] font-bold leading-none tracking-[-0.03em] text-[#102e22] sm:text-[36px]">Shop by Category</h2>
          </div>
            <Link href="/shop" className="border-b border-[#85523b] pb-1 text-[11px] font-bold text-[#70462f] transition-colors hover:text-[#173b2d] sm:text-[12px]">
              View All Categories
          </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-3">
          {[
            { name: 'Rudraksha Beads', description: 'Sacred Origin', img: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.42%20PM.jpeg', href: '/shop' },
            { name: 'Rudraksha Malas', description: 'For Meditation', img: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg', href: '/shop?category=mala' },
            { name: 'Pendants', description: 'Divine Energy', img: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.44%20PM.jpeg', href: '/shop' },
            { name: 'Bracelets', description: 'Wear Your Belief', img: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.45%20PM.jpeg', href: '/shop' },
            { name: 'Puja Accessories', description: 'Ritual Essentials', img: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.48%20PM.jpeg', href: '/shop' },
            { name: 'Gift Sets', description: 'Meaningful Gifting', img: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.51%20PM.jpeg', href: '/shop' },
            { name: 'Spiritual Essentials', description: 'For a Balanced Life', img: '/images/shop_by_category/WhatsApp%20Image%202026-09-18%20at%205.15.53%20PM.jpeg', href: '/shop?category=special' },
          ].map((cat, i) => (
            <CategoryCard key={cat.name} name={cat.name} description={cat.description} img={cat.img} href={cat.href} index={i} />
          ))}
        </div>
        </div>
      </MotionSection>

      {/* 3. Ancient Wisdom Section */}
      <MotionSection className="w-full overflow-hidden bg-[#062e23] text-white">
        <div className="grid min-h-[300px] grid-cols-1 lg:grid-cols-[1.02fr_1.38fr]">
          <div className="relative min-h-[260px] lg:min-h-full">
            <Image
              src="/images/ancient_wisdom/WhatsApp%20Image%202026-09-18%20at%205.15.40%20PM.jpeg"
              alt="Meditating sage in the Himalayas"
              fill
              sizes="(max-width: 1024px) 100vw, 43vw"
              className="object-cover object-[28%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#062e23]/70 lg:to-[#062e23]" />
          </div>

          <div className="grid gap-8 bg-[#062e23] px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:px-12 lg:py-9 xl:px-16">
            <div className="flex flex-col justify-center">
              <p className="mb-2 text-[9px] font-extrabold tracking-[0.22em] text-[#d6bc7a] uppercase sm:text-[10px]">
                The Essence of Rudraksha
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-[38px] font-bold leading-[0.86] tracking-[-0.03em] text-[#fffdf5] sm:text-[46px] lg:text-[42px] xl:text-[48px]">
                Ancient Wisdom<br />for Modern Life
              </h2>
              <p className="mt-4 max-w-[29rem] text-[12px] font-medium leading-[1.45] text-white/80 sm:text-[13px]">
                Rudraksha is not just a bead; it is a symbol of inner peace, protection and higher consciousness. Let Nepali Rudraksha bring you authentic divine energy from the Himalayas to help you live a healthier, happier and more meaningful life.
              </p>
              <Link href="/about" className="mt-5 inline-flex h-10 w-fit items-center rounded-full bg-[#f3cf83] px-5 text-[11px] font-bold text-[#15382b] shadow-[0_6px_14px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3cf83] focus-visible:ring-offset-2 focus-visible:ring-offset-[#062e23]">
                Discover Our Story
              </Link>
            </div>

            <div className="flex flex-col justify-center gap-3 border-l border-white/15 pl-6 sm:pl-8">
              {[
                { title: 'Enhances Focus', subtitle: '& Clarity', icon: Brain },
                { title: 'Brings Positivity', subtitle: '& Peace', icon: Sparkles },
                { title: 'Supports Health', subtitle: '& Well-being', icon: Heart },
                { title: 'Attracts Prosperity', subtitle: '& Success', icon: Mountain },
                { title: 'Aids in Meditation', subtitle: '& Spiritual Growth', icon: Check },
              ].map((benefit) => (
                <div key={benefit.title} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#dfe8d7] text-[#174638]">
                    <benefit.icon size={19} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <p className="text-[11px] font-bold leading-[1.08] text-white/90">
                    <span className="block">{benefit.title}</span>
                    <span className="block text-white/75">{benefit.subtitle}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 4. Handpicked for Your Spiritual Journey */}
      <MotionSection className="w-full bg-[#fffdf7] px-4 py-12 sm:py-14 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-[9px] font-extrabold tracking-[0.22em] text-[#6b6257] uppercase sm:text-[10px]">Featured Products</p>
            <h2 className="font-[family-name:var(--font-display)] text-[32px] font-bold leading-none tracking-[-0.03em] text-[#102e22] sm:text-[36px]">Handpicked for Your Spiritual Journey</h2>
          </div>
          <Link href="/shop" className="border-b border-[#85523b] pb-1 text-[11px] font-bold text-[#70462f] transition-colors hover:text-[#173b2d] sm:text-[12px]">View All Products</Link>
        </div>

<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {featuredProducts.map((product) => (
            <article key={product.id} className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-[#ece5d9] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d4b872] hover:shadow-lg">
              <Link href="/shop" className="block">
                <div className="relative aspect-[1.35/1] flex-shrink-0 overflow-hidden bg-[#faf7ef]">
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <Image 
                    src={product.image}
                    alt={product.name} 
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  
                  {product.badge && <span className={`absolute left-2 top-2 rounded-sm px-2 py-1 text-[9px] font-extrabold text-white ${product.badge === 'Bestseller' ? 'bg-[#08784d]' : 'bg-[#b71822]'}`}>{product.badge}</span>}
                  <Heart size={18} className="absolute right-2 top-2 text-[#8c4538] drop-shadow-sm" strokeWidth={2} aria-label="Add to wishlist" />
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
                  
                  <Link href="/shop" className="block">
                    <h3 className="font-semibold text-brand-primary text-sm leading-tight mb-1.5 hover:text-brand-accent transition-colors duration-300 line-clamp-2 group-hover:text-brand-accent">
                      {product.name}
                    </h3>
                    {product.detail && <p className="-mt-1 mb-1.5 text-[11px] font-semibold leading-tight text-[#46594f]">{product.detail}</p>}
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
                
                <div className="mt-auto border-t border-brand-border/50 pt-2 relative z-10">
                  <span className="font-serif text-base font-bold text-brand-secondary md:text-lg">
                    {product.price > 0 ? `₹${product.price.toLocaleString()}` : 'On request'}
                  </span>
                  
                  <Link href="/shop" className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-sm bg-[#063b2b] px-3 text-[11px] font-bold text-white transition-colors hover:bg-[#0c513d]">
                    <ShoppingCart size={15} aria-hidden="true" />
                    Add to Cart
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        </div>
      </MotionSection>

      {/* 5. A Small Bead, A Bigger Purpose */}
      <MotionSection className="w-full overflow-hidden">
        <div className="relative min-h-[390px] overflow-hidden text-white sm:min-h-[410px] lg:min-h-0 lg:aspect-[2103/748]">
          <Image
            src="/images/a_small_bead/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2012_28_06%20AM.png"
            alt="A hand selecting sacred Rudraksha beads in the Himalayas"
            fill
            sizes="100vw"
            className="object-cover object-[58%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 via-[52%] to-black/65" />

          <div className="relative mx-auto flex min-h-[390px] max-w-7xl items-center px-6 py-10 sm:min-h-[410px] sm:px-10 lg:h-full lg:min-h-0 lg:px-20">
            <div className="max-w-[20rem]">
              <h2 className="font-[family-name:var(--font-display)] text-[36px] font-bold leading-[0.84] tracking-[-0.03em] text-[#fff7df] sm:text-[44px]">
                A Small Bead.<br />A Bigger Purpose.
              </h2>
              <p className="mt-3 text-[12px] font-medium leading-[1.3] text-white/90 sm:text-[13px]">
                Stay grounded. Stay positive. Let the divine energy of Rudraksha guide you in every step of life.
              </p>
              <Link href="/about" className="mt-5 inline-flex h-10 items-center rounded-full bg-[#f3cf83] px-5 text-[11px] font-bold text-[#15382b] shadow-[0_6px_14px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3cf83] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                Watch Our Video
              </Link>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-[#e4ddd0] bg-white sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: 'Natural & Authentic', icon: BadgeCheck },
            { label: 'Lab Certified', icon: ShieldCheck },
            { label: 'Sourced from Nepal', icon: Mountain },
            { label: 'Wide Variety', icon: Sparkles },
            { label: 'Secure Payments', icon: CreditCard },
            { label: 'Worldwide Shipping', icon: Truck },
          ].map((item, index) => (
            <div key={item.label} className={`flex min-h-[76px] flex-col items-center justify-center gap-1.5 px-3 text-center text-[#764b36] ${index > 0 ? 'border-l border-[#e9e3d9]' : ''}`}>
              <item.icon size={23} strokeWidth={1.9} aria-hidden="true" />
              <span className="text-[10px] font-bold leading-tight text-[#536359]">{item.label}</span>
            </div>
          ))}
        </div>
      </MotionSection>

      {/* 6. Pure, Natural, Authentic */}
      <MotionSection className="w-full overflow-hidden">
        <div className="relative min-h-[430px] overflow-hidden sm:min-h-[390px] lg:aspect-[3/1] lg:min-h-0">
          <Image
            src="/images/pure_natural_authentic/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2012_31_18%20AM.png"
            alt="Himalayan temples beneath snow-capped mountains"
            fill
            sizes="100vw"
            className="object-cover object-[60%_center] lg:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fffdf6]/95 via-[#fffdf6]/72 via-[32%] to-transparent to-[62%]" />

          <div className="relative mx-auto flex min-h-[430px] max-w-7xl items-center px-6 py-12 sm:min-h-[390px] sm:px-10 lg:h-full lg:min-h-0 lg:px-20">
            <div className="max-w-[19rem] text-[#112f24] sm:max-w-[32rem] lg:max-w-[39rem]">
              <p className="mb-2 text-[10px] font-extrabold tracking-[0.22em] text-[#655342] uppercase sm:text-[11px] lg:text-[13px]">Sourced from the Himalayas</p>
              <h2 className="font-[family-name:var(--font-display)] text-[38px] font-bold leading-[0.9] tracking-[-0.025em] text-balance sm:text-[52px] lg:text-[62px]">Pure. Natural. Authentic.</h2>
              <p className="mt-3 max-w-[35rem] text-[13px] font-semibold leading-[1.35] text-[#243e33] sm:text-[15px] lg:text-[17px]">
                Our Rudraksha beads are collected from the pristine Himalayan region of Nepal, where nature and spirituality coexist in perfect harmony.
              </p>
              <Link href="/about" className="mt-6 inline-flex h-12 items-center rounded-full bg-[#f3cf83] px-7 text-[12px] font-bold text-[#17392c] shadow-[0_5px_12px_rgba(72,49,16,0.16)] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17392c] focus-visible:ring-offset-2 lg:text-[14px]">
                Explore Our Heritage
              </Link>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 7. Community, Insights, and Instagram */}
      <MotionSection className="w-full overflow-hidden bg-[#fffdf8]">
        <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.7fr)_minmax(24rem,1fr)]">
          <div className="min-w-0 px-5 py-9 sm:px-10 sm:py-11 lg:px-12 xl:px-16 xl:py-12">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.22em] text-[#6b6257] uppercase sm:text-[11px]">Testimonials</p>
              <h2 className="mt-2 max-w-[19rem] font-[family-name:var(--font-display)] text-[33px] font-bold leading-none tracking-[-0.03em] text-[#102e22] text-balance sm:max-w-none sm:text-[43px] xl:text-[48px]">What Our Customers Say</h2>
            </div>

            <ReviewCarousel
              reviews={[
                { name: 'Rahul Sharma', city: 'New Delhi', quote: 'Excellent quality and authentic Rudraksha. I feel more positive each day.', image: '/images/what_our_customer/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2012_36_11%20AM.png' },
                { name: 'Priya Verma', city: 'Bangalore', quote: 'Beautiful mala, packed with care and delivered quickly.', image: '/images/what_our_customer/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2012_38_35%20AM.png' },
                { name: 'Amit Khan', city: 'Mumbai', quote: 'Genuine products with a lab certificate. Highly recommended.', image: '/images/what_our_customer/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2012_37_41%20AM.png' },
                { name: 'Ananya Mehta', city: 'Pune', quote: 'A beautiful, genuine bead for my daily prayer.', image: '/images/what_our_customer/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2012_38_35%20AM.png' },
                { name: 'Vikram Singh', city: 'Jaipur', quote: 'Thoughtful guidance and a premium mala, beautifully packed.', image: '/images/what_our_customer/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2012_36_11%20AM.png' },
                { name: 'Neha Verma', city: 'Chandigarh', quote: 'The authenticity certificate gave me complete confidence.', image: '/images/what_our_customer/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2012_38_35%20AM.png' },
              ]}
            />

            <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.22em] text-[#6b6257] uppercase sm:text-[11px]">From Our Blog</p>
                <h2 className="mt-2 max-w-[19rem] font-[family-name:var(--font-display)] text-[31px] font-bold leading-none tracking-[-0.03em] text-[#102e22] text-balance sm:max-w-none sm:text-[40px] xl:text-[44px]">Insights for a Better Life</h2>
              </div>
              <Link href="/blog" className="border-b border-[#85523b] pb-1.5 text-[11px] font-bold text-[#70462f] transition-colors hover:text-[#173b2d] xl:text-[12px]">View All Articles</Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Benefits of 5 Mukhi Rudraksha', date: '15 Sep 2026', image: '/images/insight_for_better/WhatsApp%20Image%202026-09-18%20at%205.15.41%20PM.jpeg', imageFit: 'object-cover' },
                { title: 'How to Identify Original Rudraksha', date: '08 Sep 2026', image: '/images/insight_for_better/WhatsApp%20Image%202026-09-18%20at%205.15.58%20PM.jpeg', imageFit: 'object-cover' },
                { title: 'The Spiritual Significance of Rudraksha in Hinduism', date: '01 Sep 2026', image: '/images/insight_for_better/WhatsApp%20Image%202026-09-18%20at%205.16.00%20PM.jpeg', imageFit: 'object-cover' },
              ].map((article) => (
                <Link key={article.title} href="/blog" className="group flex overflow-hidden rounded-lg bg-white shadow-[0_3px_10px_rgba(35,49,39,0.08)] transition-shadow hover:shadow-md sm:block">
                  <div className="relative aspect-[8/3] w-[42%] shrink-0 overflow-hidden bg-white sm:w-full">
                    <Image src={article.image} alt={article.title} fill sizes="(max-width: 640px) 42vw, 25vw" className={`${article.imageFit} transition-transform duration-300 group-hover:scale-[1.02]`} />
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-[12px] font-bold leading-[1.2] text-[#18352a] xl:text-[13px]">{article.title}</h3>
                    <p className="mt-1.5 text-[10px] font-semibold text-[#758178] xl:text-[11px]">{article.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="w-full min-w-0 self-start border-t border-[#eee8dd] bg-white lg:border-l lg:border-t-0">
            <div className="min-w-0 px-5 py-9 sm:px-10 sm:py-11 lg:px-12 xl:px-16 xl:py-12">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#6b6257] uppercase sm:text-[11px]">Our Instagram</p>
                  <p className="mt-1.5 text-[15px] font-bold text-[#173b2d] sm:text-[17px]">@nepalirudraksha</p>
                </div>
                <Link href="/" className="border-b border-[#85523b] pb-1.5 text-[11px] font-bold text-[#70462f] sm:text-[12px]">Follow Us</Link>
              </div>
              <div className="mt-8 grid min-w-0 grid-cols-3 gap-2.5 sm:mt-10 sm:gap-3 lg:mt-14">
                {[
                  'WhatsApp%20Image%202026-09-18%20at%205.16.01%20PM.jpeg',
                  'WhatsApp%20Image%202026-09-18%20at%205.16.03%20PM.jpeg',
                  'WhatsApp%20Image%202026-09-18%20at%205.16.04%20PM.jpeg',
                  'WhatsApp%20Image%202026-09-18%20at%205.16.11%20PM.jpeg',
                  'WhatsApp%20Image%202026-09-18%20at%205.16.11%20PMd.jpeg',
                  'WhatsApp%20Image%202026-09-18%20at%205.16.12%20PM.jpeg',
                ].map((image, index) => (
                  <Link key={image} href="/" className="group relative min-w-0 aspect-square overflow-hidden rounded-sm">
                    <Image src={`/images/nepaliraksha/${image}`} alt={`Nepali Rudraksha Instagram post ${index + 1}`} fill sizes="(max-width: 1024px) 33vw, 10vw" className="object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </MotionSection>

      {/* 8. Spiritual Community */}
      <MotionSection className="w-full overflow-hidden">
        <section className="relative isolate min-h-[210px] overflow-hidden sm:min-h-[205px] lg:min-h-[174px]">
          <Image
            src="/images/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2001_49_22%20AM.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#003a2a]/20" />

          <div className="relative mx-auto grid min-h-[210px] max-w-7xl items-center gap-4 px-6 py-6 sm:min-h-[205px] sm:px-10 sm:py-7 lg:min-h-[174px] lg:grid-cols-[minmax(0,1fr)_minmax(23rem,1.05fr)] lg:gap-10 lg:px-20 lg:py-5">
            <div className="max-w-[20rem] text-[#fffdf5] sm:max-w-none sm:pl-20 lg:pl-24">
              <p className="font-[family-name:var(--font-display)] text-[25px] font-semibold leading-[0.9] sm:text-[29px]">Join Our Spiritual Community</p>
              <p className="mt-1.5 max-w-md text-[11px] font-medium leading-snug text-white/85 sm:mt-2 sm:text-[12px]">Get updates on new arrivals, exclusive offers and spiritual insights.</p>
            </div>

            <form className="flex w-full overflow-hidden rounded-lg border border-white/30 bg-white shadow-[0_10px_25px_rgba(0,0,0,0.16)] sm:mx-auto sm:max-w-[29rem]">
              <label htmlFor="community-email" className="sr-only">Email address</label>
              <input
                id="community-email"
                type="email"
                placeholder="Enter your email address"
                className="min-w-0 flex-1 bg-white px-4 text-[11px] font-medium text-[#14372a] outline-none placeholder:text-[#8b918b]"
              />
              <button type="button" className="min-h-11 shrink-0 bg-[#f2ca7c] px-5 text-[11px] font-extrabold text-[#17382b] transition-colors hover:bg-[#f8db9c] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </MotionSection>

      {/* Legacy A Small Bead section */}
      <MotionSection className="hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Image Column */}
          <div className="lg:w-1/2 flex-shrink-0 max-w-md md:max-w-lg mx-auto lg:mx-0">
            <div className="relative aspect-[4/3] md:aspect-[5/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 group">
              <Image 
                src="/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.52%20PM.jpeg"
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
      <MotionSection className="hidden">
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
