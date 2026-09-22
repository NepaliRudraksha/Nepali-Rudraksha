import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { BadgeCheck, Brain, Check, CreditCard, Heart, Mountain, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import ReviewCarousel from '@/components/ReviewCarousel';
import { MotionHeroWrapper, MotionHeroContent, MotionSection } from '@/components/animations/MotionWrappers';
import SpiritualProductCard, { SpiritualProduct } from '@/components/SpiritualProductCard';
import InstagramMarquee from '@/components/InstagramMarquee';
import { getCategories, getHomepageReviews, getSettings, getFeaturedProducts, parseHomepageInstagramImages } from '@/lib/api';

const testimonialAvatars = [
  '/images/what_our_customer/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2012_36_11%20AM.png',
  '/images/what_our_customer/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2012_38_35%20AM.png',
  '/images/what_our_customer/ChatGPT%20Image%20Sep%2019%2C%202026%2C%2012_37_41%20AM.png',
];

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

export default async function Home() {
  const [settings, featuredProductsData, categories, approvedReviews] = await Promise.all([
    getSettings(),
    getFeaturedProducts(),
    getCategories(),
    getHomepageReviews(),
  ]);

  // Transform Product[] to SpiritualProduct[] for the SpiritualProductCard component
  const featuredProducts: SpiritualProduct[] = featuredProductsData.map((p) => ({
    id: p.id,
    name: p.name,
    detail: p.mukhi ? `${p.mukhi} Mukhi` : undefined,
    price: p.price,
    reviewsCount: p.reviewsCount,
    rating: p.rating,
    badges: [
      p.isBestseller ? 'Bestseller' : null,
      p.isNew ? 'New Arrival' : null,
    ].filter((badge): badge is string => Boolean(badge)),
    image: p.image || '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg',
    category: p.category,
  }));

  const homepageInstagram = parseHomepageInstagramImages(settings.homepage_instagram)
    .map((image) => image.url);
  const homepageReviews = approvedReviews.map((review, index) => ({
    name: review.name,
    subtitle: review.productName,
    quote: review.comment,
    image: testimonialAvatars[index % testimonialAvatars.length],
    rating: review.rating,
  }));

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
              <p className="mb-3 text-[9px] font-extrabold tracking-[0.24em] text-[#564332] uppercase sm:text-[10px]">
                Sacred by Nature. Blessed for Life.
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-[43px] font-bold leading-[0.9] tracking-[-0.035em] text-[#082b20] sm:text-[52px] md:text-[48px] lg:text-[55px]">
                Nepali Rudraksha
                <span className="mt-4 block text-[#70462f]">A Divine Companion</span>
              </h1>
              <p className="mt-5 max-w-[25rem] text-[12px] font-semibold leading-[1.42] text-[#132f24] sm:text-[13px]">
                Original Rudraksha from the Himalayas, bringing peace, protection and positive energy to your life.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/shop" className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-[#0e3729] via-[#104532] to-[#0d2e23] px-6 text-[12px] font-bold text-white shadow-[0_10px_18px_rgba(10,48,36,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_23px_rgba(10,48,36,0.32)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173b2d] focus-visible:ring-offset-2">
                  Shop Now
                </Link>
                <Link href="/about" className="inline-flex h-11 items-center rounded-full border border-[#0e4937]/25 bg-white/75 px-5 text-[12px] font-extrabold text-[#07513d] shadow-[0_4px_10px_rgba(31,46,36,0.08)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_8px_16px_rgba(31,46,36,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173b2d] focus-visible:ring-offset-2">
                  Watch Our Story
                </Link>
          </div>

              <div className="relative mt-6 max-w-[39rem] sm:mt-7">
                <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_92%_76%_at_46%_50%,rgba(255,253,246,0.76)_0%,rgba(255,253,246,0.42)_38%,rgba(255,253,246,0.12)_58%,transparent_76%)] blur-2xl" />
                <div className="relative grid grid-cols-2 gap-x-7 gap-y-5 sm:grid-cols-4 sm:gap-x-0 sm:gap-y-0">
                  {[
                    { title: '100% Authentic', subtitle: 'Nepali Origin', icon: BadgeCheck },
                    { title: 'Lab Certified', subtitle: '& Tested', icon: ShieldCheck },
                    { title: 'Free Shipping', subtitle: 'Across India', icon: Truck },
                    { title: 'Easy Returns', subtitle: 'Hassle Free', icon: CreditCard },
                  ].map((badge, index) => (
                    <div key={badge.title} className={`flex min-w-0 items-center gap-2 text-[#062b20] sm:px-3 ${index > 0 ? 'sm:border-l sm:border-[#173b2d]/25' : 'sm:pl-0'}`}>
                      <badge.icon size={27} strokeWidth={2.35} className="shrink-0" aria-hidden="true" />
                      <span className="min-w-0 text-[11px] font-extrabold leading-[1.1] sm:text-[12px] sm:leading-[1.12]">
                        <span className="block whitespace-nowrap">{badge.title}</span>
                        <span className="block whitespace-nowrap text-[#173d2f]">{badge.subtitle}</span>
                      </span>
                    </div>
                  ))}
                </div>
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

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-3">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} name={category.name} description={category.description} img={category.image} href={category.href} index={index} />
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {featuredProducts.map((product, idx) => (
            <SpiritualProductCard
              key={product.id}
              product={product}
              priority={idx < 2}
            />
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_92%_72%_at_13%_22%,rgba(255,253,246,0.92)_0%,rgba(255,253,246,0.72)_45%,rgba(255,253,246,0.22)_70%,transparent_90%)]" />
          <div className="relative mx-auto flex min-h-[430px] max-w-7xl items-start px-6 pb-12 pt-8 sm:min-h-[390px] sm:items-center sm:px-10 sm:py-12 lg:h-full lg:min-h-0 lg:px-20">
            <div className="max-w-[19rem] text-[#082d21] sm:max-w-[32rem] lg:max-w-[39rem]">
              <p className="mb-2 text-[10px] font-extrabold tracking-[0.22em] text-[#5d3d2c] uppercase sm:text-[11px] lg:text-[13px]">Sourced from the Himalayas</p>
              <h2 className="font-[family-name:var(--font-display)] text-[38px] font-bold leading-[0.9] tracking-[-0.025em] text-balance sm:text-[52px] lg:text-[62px]">Pure. Natural. Authentic.</h2>
              <p className="mt-3 max-w-[35rem] text-[13px] font-extrabold leading-[1.35] text-[#082d21] sm:text-[15px] lg:text-[17px]">
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
        <div className="mx-auto min-w-0 max-w-7xl px-5 py-9 sm:px-10 sm:py-11 lg:px-12 xl:px-16 xl:py-12">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.22em] text-[#6b6257] uppercase sm:text-[11px]">Testimonials</p>
              <h2 className="mt-2 max-w-[19rem] font-[family-name:var(--font-display)] text-[33px] font-bold leading-none tracking-[-0.03em] text-[#102e22] text-balance sm:max-w-none sm:text-[43px] xl:text-[48px]">What Our Customers Say</h2>
            </div>

            <ReviewCarousel
              reviews={homepageReviews}
            />

            <section className="mt-12 border-y border-[#eee8dd] py-8 sm:mt-14 sm:py-10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#6b6257] uppercase sm:text-[11px]">Our Instagram</p>
                  <p className="mt-1.5 text-[15px] font-bold text-[#173b2d] sm:text-[17px]">@nepalirudraksha</p>
                </div>
                <Link href="/" className="border-b border-[#85523b] pb-1.5 text-[11px] font-bold text-[#70462f] sm:text-[12px]">Follow Us</Link>
          </div>
<div className="mt-6">
                <InstagramMarquee images={homepageInstagram} />
              </div>
            </section>
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

    </div>
  );
}

