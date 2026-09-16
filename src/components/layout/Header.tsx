import Link from 'next/link';
import { Search, CheckCircle2, Truck, RefreshCcw, Phone, Mail } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto py-2 px-4 md:px-10 lg:px-20 flex justify-between items-center overflow-hidden">
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
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-10 lg:px-20 py-4">
          
          <div className="flex items-center">
            {/* Mobile Menu */}
            <MobileMenu />
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-brand-accent font-serif font-bold text-xl">
                NR
              </div>
              <div>
                <h1 className="font-serif font-bold text-xl text-brand-primary leading-tight">NEPALI</h1>
                <h1 className="font-serif font-bold text-xl text-brand-primary leading-tight">RUDRAKSHA</h1>
                <p className="text-[10px] text-brand-muted tracking-widest hidden md:block">DIVINE BEADS. BETTER LIFE.</p>
              </div>
            </Link>
          </div>

        {/* Navigation */}
        <HeaderNav />

        {/* Icons & Search */}
        <div className="flex items-center space-x-4">
          <HeaderSearch />
          <UserNav />
          <HeaderCartIcon />
        </div>
        </div>
      </div>
    </MotionHeader>
  );
}
