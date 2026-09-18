'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  const closeMenuAndScrollTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Rudraksha Types', href: '/types' },
    { name: 'Accessories', href: '/accessories' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-accent text-brand-primary transition-colors hover:bg-brand-accent/10"
        aria-label="Open menu"
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
      >
        <Menu size={20} />
      </button>

      {/* Overlay & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 transition-opacity" 
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-[85%] max-w-sm bg-brand-primary h-full shadow-2xl flex flex-col transform transition-transform duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-accent/20">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-primary font-serif font-bold text-xl shadow-md border-2 border-brand-accent">
                  NR
                </div>
              </Link>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full border border-brand-accent/50 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-accent">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-16 py-3 bg-black/20 border border-brand-accent/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-brand-accent"
                />
                <button
                  type="submit"
                  className="absolute inset-y-2 right-2 bg-brand-accent text-brand-primary font-bold px-4 rounded-lg text-sm hover:bg-brand-accent-hover transition-colors"
                >
                  GO
                </button>
              </form>

              {/* Navigation Links */}
              <nav id="mobile-navigation" className="space-y-2" aria-label="Mobile navigation">
                {navLinks.map((link) => {
                  const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      scroll
                      onClick={closeMenuAndScrollTop}
                      className={`flex items-center justify-between rounded-xl border p-4 text-sm font-semibold transition-all ${
                        isActive
                          ? 'border-brand-accent bg-brand-accent text-brand-primary'
                          : 'border-brand-accent/30 bg-black/20 text-brand-accent hover:bg-brand-accent hover:text-brand-primary'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={20} />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
