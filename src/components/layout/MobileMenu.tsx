'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from '@/components/ImageKitImage';
import {
  ArrowRight,
  ChevronRight,
  Flower2,
  FlaskConical,
  Heart,
  House,
  Leaf,
  Menu,
  Phone,
  RotateCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Truck,
  UsersRound,
  X,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/', icon: House },
  { name: 'Shop', href: '/shop', icon: ShoppingBag },
  { name: 'Rudraksha Types', href: '/types', icon: Flower2 },
  { name: 'Accessories', href: '/accessories', icon: Sprout },
  { name: 'About Us', href: '/about', icon: UsersRound },
  { name: 'Contact', href: '/contact', icon: Phone },
];

const assurances = [
  { icon: ShieldCheck, title: '100% Authentic', detail: 'Certified & Original' },
  { icon: FlaskConical, title: 'Lab Tested', detail: 'Quality Assured' },
  { icon: Truck, title: 'Free Shipping', detail: 'Across India' },
  { icon: RotateCw, title: 'Easy Returns', detail: 'Hassle Free' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();

    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
    setIsOpen(false);
  };

  const closeMenuAndScrollTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-accent/30 bg-white text-brand-primary transition-all duration-200 hover:bg-brand-light hover:border-brand-accent/50 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
        aria-label="Open menu"
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
      >
        <Menu size={20} />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-in slide-in-from-left-4 duration-300">
            <div className="relative flex items-center justify-between overflow-hidden border-b border-brand-border/60 bg-[#fbfaf4] px-3 py-2.5">
              <div className="pointer-events-none absolute right-2 top-0 flex gap-1 text-[#bdc5a7]/55" aria-hidden="true">
                <Leaf size={34} className="rotate-[25deg]" />
                <Leaf size={44} className="-mt-2 rotate-[55deg]" />
              </div>

              <Link href="/" onClick={() => setIsOpen(false)} className="relative z-10 flex min-w-0 items-center gap-2">
                <div className="relative h-12 w-12 shrink-0 rounded-full border border-brand-accent/50 bg-white p-1 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="Nepali Rudraksha"
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                    loading="eager"
                  />
                </div>
                <div className="leading-none text-brand-primary">
                  <p className="font-serif text-sm font-bold">NEPALI</p>
                  <p className="font-serif text-[15px] font-bold">RUDRAKSHA</p>
                  <p className="mt-1 whitespace-nowrap text-[7px] font-medium tracking-[0.08em] text-brand-muted">DIVINE BEADS &middot; BETTER LIFE.</p>
                </div>
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border/60 bg-white text-brand-text shadow-sm transition-colors hover:bg-brand-light hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              <form onSubmit={handleSearch} className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-brand-primary">
                  <Search size={17} />
                </div>
                <input
                  type="text"
                  placeholder="Search products, rudraksha..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-9 w-full rounded-xl border border-brand-border/60 bg-[#fbfaf4] py-2 pl-10 pr-12 text-xs text-brand-text outline-none placeholder:text-brand-muted focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-lg bg-[#a6945d] text-white transition-colors hover:bg-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  aria-label="Search products"
                >
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/shop"
                  onClick={closeMenuAndScrollTop}
                  className="flex items-center gap-2 rounded-lg border border-brand-border/60 bg-[#fbfaf4] p-2.5 transition-colors hover:border-brand-accent/50"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-primary">
                    <Search size={15} />
                  </div>
                  <div className="min-w-0 text-left leading-tight">
                    <span className="block text-[11px] font-semibold text-brand-text">Search</span>
                    <span className="block whitespace-nowrap text-[8px] text-brand-muted">Find your sacred item</span>
                  </div>
                  <ChevronRight size={14} className="ml-auto shrink-0 text-brand-muted" />
                </Link>
                <Link
                  href="/account?tab=wishlist"
                  onClick={closeMenuAndScrollTop}
                  className="flex items-center gap-2 rounded-lg border border-brand-border/60 bg-[#fbfaf4] p-2.5 transition-colors hover:border-brand-accent/50"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-primary">
                    <Heart size={15} />
                  </div>
                  <div className="min-w-0 text-left leading-tight">
                    <span className="block text-[11px] font-semibold text-brand-text">Wishlist</span>
                    <span className="block whitespace-nowrap text-[8px] text-brand-muted">Your saved products</span>
                  </div>
                  <ChevronRight size={14} className="ml-auto shrink-0 text-brand-muted" />
                </Link>
              </div>

              <nav id="mobile-navigation" className="border-y border-brand-border/60" aria-label="Mobile navigation">
                {navLinks.map((link) => {
                  const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      scroll
                      onClick={closeMenuAndScrollTop}
                      className={`flex items-center gap-3 border-b border-brand-border/50 px-3 py-2.5 text-[11px] font-semibold transition-colors last:border-b-0 ${
                        isActive
                          ? 'border-l-2 border-l-[#a6945d] bg-[#f6f2e7] text-brand-primary'
                          : 'border-l-2 border-l-transparent bg-white text-brand-text hover:bg-brand-light'
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.8} className="shrink-0 text-brand-primary" />
                      <span className="flex-1">{link.name}</span>
                      <ChevronRight size={15} className="shrink-0 text-brand-muted" />
                    </Link>
                  );
                })}
              </nav>

              <div className="grid grid-cols-2 divide-x divide-y divide-brand-border/50 border-y border-brand-border/60">
                {assurances.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex items-center gap-2 p-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-primary">
                        <Icon size={15} strokeWidth={1.8} />
                      </div>
                      <div className="leading-tight">
                        <span className="block text-[9px] font-semibold text-brand-text">{item.title}</span>
                        <span className="block whitespace-nowrap text-[8px] text-brand-muted">{item.detail}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/about"
                onClick={closeMenuAndScrollTop}
                className="flex items-center gap-3 rounded-lg bg-[#f8f5ec] px-3 py-3 text-brand-primary transition-colors hover:bg-brand-light"
              >
                <Sprout size={23} className="shrink-0 text-[#b39b50]" />
                <span className="flex-1 font-serif text-[11px] italic">Sacred Beads for a Better Tomorrow</span>
                <ChevronRight size={15} className="text-brand-muted" />
              </Link>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
