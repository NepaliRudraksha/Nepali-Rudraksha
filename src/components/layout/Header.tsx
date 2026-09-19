import Link from 'next/link';
import { CheckCircle2, Truck, RefreshCcw, Phone, Mail } from 'lucide-react';
import Image from '@/components/ImageKitImage';
import HeaderCartIcon from '@/components/HeaderCartIcon';
import UserNav from '@/components/layout/UserNav';
import HeaderSearch from '@/components/layout/HeaderSearch';
import HeaderNav from '@/components/layout/HeaderNav';
import MotionHeader from '@/components/MotionHeader';
import MobileMenu from '@/components/layout/MobileMenu';
import { getSettings } from '@/lib/api';

export default async function Header() {
  const settings = await getSettings();

  return (
    <MotionHeader>
      {/* Top Bar - Modern subtle announcement bar */}
      <div className="bg-brand-primary text-white text-xs border-b border-brand-accent/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 py-1.5 md:px-10 md:py-2 lg:px-20">
          <div className="flex items-center justify-between gap-4 relative">
            {/* Marquee */}
            <div className="flex-1 overflow-hidden relative group min-w-0 mr-4 md:mr-8">
              <div className="flex items-center space-x-8 min-w-max animate-marquee group-hover:[animation-play-state:paused]">
                {/* First Set */}
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <CheckCircle2 size={12} className="text-brand-accent flex-shrink-0" />
                  <span className="font-medium tracking-tight">100% Authentic</span>
                </div>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <CheckCircle2 size={12} className="text-brand-accent flex-shrink-0" />
                  <span className="font-medium tracking-tight">Lab Tested</span>
                </div>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <Truck size={12} className="text-brand-accent flex-shrink-0" />
                  <span className="font-medium tracking-tight">Free Shipping Across India</span>
                </div>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <RefreshCcw size={12} className="text-brand-accent flex-shrink-0" />
                  <span className="font-medium tracking-tight">Easy Returns</span>
                </div>
                {/* Duplicate Set for Seamless Loop */}
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <CheckCircle2 size={12} className="text-brand-accent flex-shrink-0" />
                  <span className="font-medium tracking-tight">100% Authentic</span>
                </div>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <CheckCircle2 size={12} className="text-brand-accent flex-shrink-0" />
                  <span className="font-medium tracking-tight">Lab Tested</span>
                </div>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <Truck size={12} className="text-brand-accent flex-shrink-0" />
                  <span className="font-medium tracking-tight">Free Shipping Across India</span>
                </div>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <RefreshCcw size={12} className="text-brand-accent flex-shrink-0" />
                  <span className="font-medium tracking-tight">Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Contact Info - Modern compact */}
            <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
              <div className="flex items-center space-x-1.5">
                <Phone size={12} className="text-brand-accent/80" />
                <span className="font-medium tracking-wide">{settings.store_phone}</span>
              </div>
              <div className="w-px h-4 bg-brand-accent/20" />
              <div className="flex items-center space-x-1.5">
                <Mail size={12} className="text-brand-accent/80" />
                <span className="font-medium tracking-wide">{settings.store_email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - Modern elevated design */}
      <div className="bg-white/95 backdrop-blur-md sticky top-[32px] z-40 border-b border-brand-border/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-2 py-2.5 md:px-10 lg:px-20">
          {/* Mobile Layout: Hamburger | Centered Logo | Search, account, cart */}
          <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_6rem] items-center gap-1 md:hidden">
            {/* Left: Hamburger Menu */}
            <MobileMenu />
            
            {/* Center: Compact brand lockup, sized to keep the store name visible. */}
            <Link 
              href="/" 
              className="flex min-w-0 items-center justify-center gap-1.5 group"
              aria-label="Nepali Rudraksha Home"
            >
              <div className="relative h-6 w-6 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Nepali Rudraksha"
                  fill
                  sizes="24px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                />
              </div>
              <div className="min-w-0">
                <h1 className="whitespace-nowrap font-sans text-[11px] font-bold leading-none tracking-tight text-brand-primary min-[360px]:text-xs">
                  NEPALI RUDRAKSHA
                </h1>
                <p className="mt-1 hidden whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.08em] text-brand-muted min-[360px]:block">
                  DIVINE BEADS · BETTER LIFE
                </p>
              </div>
            </Link>
            
            {/* Right: Shopping actions */}
            <div className="relative flex items-center justify-end gap-0">
              <HeaderSearch />
              <UserNav />
              <HeaderCartIcon />
            </div>
          </div>

          {/* Desktop Layout: 3-column grid */}
          <div className="hidden md:grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6">
            {/* Left Column - Logo */}
            <div className="flex items-center gap-3 md:gap-4 shrink-0 min-w-0">
              <MobileMenu />
              <Link 
                href="/" 
                className="flex shrink-0 items-center gap-2 md:gap-3 group min-w-0"
                aria-label="Nepali Rudraksha Home"
              >
                <div className="relative h-10 w-10 md:h-11 md:w-11 shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Nepali Rudraksha"
                    fill
                    sizes="(max-width: 768px) 40px, 44px"
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="eager"
                  />
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <h1 className="font-serif text-lg font-bold leading-tight tracking-normal text-brand-primary truncate max-w-[160px]">
                    NEPALI RUDRAKSHA
                  </h1>
                  <p className="text-[10px] tracking-wider text-brand-muted font-medium uppercase truncate max-w-[160px]">
                    DIVINE BEADS · BETTER LIFE
                  </p>
                </div>
              </Link>
            </div>

            {/* Center Column - Navigation (perfectly centered) */}
            <div className="flex justify-center min-w-0">
              <HeaderNav />
            </div>

            {/* Right Column - Search, User, Cart */}
            <div className="flex shrink-0 items-center gap-1.5 md:gap-2.5 min-w-0">
              <HeaderSearch />
              <UserNav />
              <HeaderCartIcon />
            </div>
          </div>
        </div>
      </div>
    </MotionHeader>
  );
}
