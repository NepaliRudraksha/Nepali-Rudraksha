'use client';

import { useState, Suspense } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const query = searchParams.get('q') || '';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    if (q) {
      router.push(`/shop?q=${encodeURIComponent(q)}`);
      setIsMobileOpen(false);
    } else {
      router.push('/shop');
    }
  };

  return (
    <>
      {/* Desktop Search */}
      <form onSubmit={handleSubmit} className="hidden md:flex items-center bg-brand-bg rounded-full px-3 py-1.5 border border-brand-border">
        <button type="submit" aria-label="Search" className="text-brand-muted mr-2 hover:text-brand-accent transition-colors">
          <Search size={16} />
        </button>
        <input
          name="q"
          type="text"
          defaultValue={query}
          placeholder="Search Rudraksha..."
          className="bg-transparent border-none outline-none text-sm w-32 xl:w-48 placeholder:text-brand-muted"
        />
      </form>

      {/* Mobile Search Toggle */}
      <button 
        className="md:hidden text-brand-primary p-2 -mr-2"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open search"
      >
        <Search size={20} />
      </button>

      {/* Mobile Search Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-brand-border">
            <h2 className="font-serif font-bold text-brand-primary text-lg">Search</h2>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="p-2 text-brand-muted hover:text-brand-primary"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-4">
            <form onSubmit={handleSubmit} className="flex items-center bg-brand-bg rounded-full px-4 py-3 border border-brand-border">
              <input
                name="q"
                type="text"
                autoFocus
                defaultValue={query}
                placeholder="Search for beads, malas..."
                className="bg-transparent border-none outline-none text-base flex-1 placeholder:text-brand-muted"
              />
              <button type="submit" aria-label="Search" className="text-brand-primary ml-2 bg-brand-light p-2 rounded-full">
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function HeaderSearch() {
  return (
    <Suspense fallback={
      <div className="hidden md:flex items-center bg-brand-bg rounded-full px-3 py-1.5 border border-brand-border opacity-50">
        <Search size={16} className="text-brand-muted mr-2" />
        <div className="w-32 xl:w-48 h-5 bg-transparent"></div>
      </div>
    }>
      <SearchBar />
    </Suspense>
  );
}
