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
      {/* Top Bar */}
      <div className="bg-brand-primary text-white text-xs border-b border-brand-accent/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-hidden px-3 py-1.5 md:px-10 md:py-2 lg:px-20">
          <div className="flex flex-1 overflow-hidden relative group mr-4 md:mr-8">
            <div className="flex items-center space-x-6 min-w-max animate-marquee group-hover:[animation-play-state:paused]">
              {/* First Set */}
              <div className="flex items-center space-x-1">
                <CheckCircle2 size={14} className="text-brand-accent" />
                <span>100% Authentic</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 size={14} className="text-brand-accent" />
                <span>Lab Tested</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck size={14} className="text-brand-accent" />
                <span>Free Shipping Across India</span>
              </div>
              <div className="flex items-center space-x-1">
                <RefreshCcw size={14} className="text-brand-accent" />
                <span>Easy Returns</span>
              </div>
              {/* Duplicate Set for Seamless Loop */}
              <div className="flex items-center space-x-1">
                <CheckCircle2 size={14} className="text-brand-accent" />
                <span>100% Authentic</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 size={14} className="text-brand-accent" />
                <span>Lab Tested</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck size={14} className="text-brand-accent" />
                <span>Free Shipping Across India</span>
              </div>
              <div className="flex items-center space-x-1">
                <RefreshCcw size={14} className="text-brand-accent" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Phone size={14} className="text-brand-accent" />
              <span>{settings.store_phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={14} className="text-brand-accent" />
              <span>{settings.store_email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-sm">
        <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-2 px-2 py-3 sm:px-3 md:px-10 lg:px-20">
          
          <div className="flex min-w-0 items-center">
            {/* Mobile Menu */}
            <MobileMenu />
            
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center space-x-1 md:space-x-2">
              <div className="relative h-12 w-12 shrink-0 md:h-14 md:w-14">
                <Image
                  src="/logo.png"
                  alt="Nepali Rudraksha"
                  fill
                  sizes="(max-width: 768px) 48px, 56px"
                  className="object-contain"
                  loading="eager"
                />
              </div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center md:static md:translate-x-0 md:translate-y-0 md:text-left">
                <h1 className="font-serif text-[13px] font-bold leading-[1.05] tracking-[0.02em] text-brand-primary md:text-xl md:leading-tight md:tracking-normal">NEPALI</h1>
                <h1 className="font-serif text-[13px] font-bold leading-[1.05] tracking-[0.02em] text-brand-primary md:text-xl md:leading-tight md:tracking-normal">RUDRAKSHA</h1>
                <p className="hidden whitespace-nowrap text-[10px] tracking-widest text-brand-muted md:block">DIVINE BEADS. BETTER LIFE.</p>
              </div>
            </Link>
          </div>

        {/* Navigation */}
        <HeaderNav />

        {/* Icons & Search */}
        <div className="flex shrink-0 items-center gap-0 md:gap-4">
          <HeaderSearch />
          <UserNav />
          <HeaderCartIcon />
        </div>
        </div>
      </div>
    </MotionHeader>
  );
}
