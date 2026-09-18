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
      <form
        onSubmit={handleSubmit}
        className="premium-search-field relative hidden h-10 w-36 items-center rounded-xl border transition-colors md:flex lg:w-40 xl:w-44 2xl:w-48"
      >
        <button
          type="submit"
          aria-label="Search"
          className="premium-search-button absolute left-1 flex h-8 w-8 items-center justify-center rounded-lg focus:outline-none"
        >
          <Search size={18} aria-hidden="true" />
        </button>
        <input
          name="q"
          type="text"
          defaultValue={query}
          placeholder="Search Rudraksha..."
          className="h-full w-full rounded-xl bg-transparent py-2 pl-11 pr-4 text-sm font-medium tracking-[0.01em] text-brand-text outline-none placeholder:font-normal placeholder:text-brand-muted"
        />
      </form>

      {/* Mobile Search Toggle */}
      <button 
        className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-primary transition-colors hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50 md:hidden"
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
            <form onSubmit={handleSubmit} className="premium-search-field flex items-center rounded-full border px-4 py-3">
              <input
                name="q"
                type="text"
                autoFocus
                defaultValue={query}
                placeholder="Search for beads, malas..."
                className="bg-transparent border-none outline-none text-base flex-1 placeholder:text-brand-muted"
              />
              <button type="submit" aria-label="Search" className="premium-search-button ml-2 rounded-full p-2">
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
      <div className="premium-search-field relative hidden h-10 w-36 items-center rounded-xl border opacity-50 md:flex lg:w-40 xl:w-44 2xl:w-48">
        <Search size={18} className="absolute left-4 text-brand-muted" />
        <div className="h-5 w-full"></div>
      </div>
    }>
      <SearchBar />
    </Suspense>
  );
}
