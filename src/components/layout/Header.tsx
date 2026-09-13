import Link from 'next/link';
import { Search, CheckCircle2, Truck, RefreshCcw, Phone, Mail } from 'lucide-react';
import HeaderCartIcon from '@/components/HeaderCartIcon';
import UserNav from '@/components/layout/UserNav';
import MotionHeader from '@/components/MotionHeader';
import { getSettings } from '@/lib/api';

export default async function Header() {
  const settings = await getSettings();

  return (
    <MotionHeader>
      {/* Top Bar */}
      <div className="bg-brand-primary text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center overflow-x-auto">
        <div className="flex items-center space-x-6 min-w-max">
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
        <div className="hidden md:flex items-center space-x-6 min-w-max">
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

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-white">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-brand-accent font-serif font-bold text-xl">
            NR
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl text-brand-primary leading-tight">NEPALI</h1>
            <h1 className="font-serif font-bold text-xl text-brand-primary leading-tight">RUDRAKSHA</h1>
            <p className="text-[10px] text-brand-muted tracking-widest">DIVINE BEADS. BETTER LIFE.</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 font-medium text-sm text-brand-text">
          <Link href="/" className="text-brand-secondary border-b-2 border-brand-accent pb-1">Home</Link>
          <Link href="/shop" className="hover:text-brand-secondary transition-colors">Shop</Link>
          <Link href="/types" className="hover:text-brand-secondary transition-colors">Rudraksha Types</Link>
          <Link href="/accessories" className="hover:text-brand-secondary transition-colors">Accessories</Link>
          <Link href="/about" className="hover:text-brand-secondary transition-colors">About Us</Link>
          <Link href="/blog" className="hover:text-brand-secondary transition-colors">Blog</Link>
          <Link href="/contact" className="hover:text-brand-secondary transition-colors">Contact</Link>
        </nav>

        {/* Icons & Search */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-brand-bg rounded-full px-3 py-1.5 border border-brand-border">
            <Search size={16} className="text-brand-muted mr-2" />
            <input
              type="text"
              placeholder="Search Rudraksha..."
              className="bg-transparent border-none outline-none text-sm w-32 xl:w-48 placeholder:text-brand-muted"
            />
          </div>
          <button className="md:hidden text-brand-primary">
            <Search size={20} />
          </button>
          <UserNav />
          <HeaderCartIcon />
        </div>
      </div>
    </MotionHeader>
  );
}
