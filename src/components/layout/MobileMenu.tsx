'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'SHOP', href: '/shop' },
    { name: 'ABOUT', href: '/about' },
    { name: 'CONTACT', href: '/contact' },
  ];

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full border border-brand-accent flex items-center justify-center text-brand-primary hover:bg-brand-accent/10 transition-colors mr-3"
        aria-label="Open menu"
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
              <nav className="space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-5 rounded-xl border border-brand-accent/30 bg-black/20 hover:bg-brand-accent hover:text-brand-primary text-brand-accent font-bold tracking-widest transition-all"
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={20} />
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
