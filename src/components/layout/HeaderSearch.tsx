'use client';

import { useState, Suspense, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const query = searchParams.get('q') || '';
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isExpanded && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    if (q) {
      router.push(`/shop?q=${encodeURIComponent(q)}`);
      setIsExpanded(false);
    } else {
      router.push('/shop');
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(true);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/shop');
    setIsExpanded(false);
  };

  return (
    <>
      {/* Search Icon Button (always rendered, hidden when expanded via CSS) */}
      <button
        onClick={handleExpand}
        className={`flex h-8 w-8 items-center justify-center rounded-xl text-brand-primary transition-all duration-200 hover:bg-brand-light hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 md:h-9 md:w-9 ${isExpanded ? 'hidden' : ''}`}
        aria-label="Open search"
        aria-expanded={isExpanded}
      >
        <Search size={20} />
      </button>

      {/* Expanded Search Form (hidden by default, shown when expanded) */}
      <form 
        onSubmit={handleSubmit} 
        className={`absolute right-0 top-full mt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${isExpanded ? 'block' : 'hidden'}`}
      >
        <div className="premium-search-field flex items-center rounded-2xl border shadow-xl w-56 md:w-64" ref={wrapperRef}>
          <button
            type="submit"
            aria-label="Search"
            className="premium-search-button flex h-9 w-9 shrink-0 items-center justify-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            <Search size={18} aria-hidden="true" />
          </button>
          <input
            ref={inputRef}
            name="q"
            type="text"
            defaultValue={query}
            placeholder="Search Rudraksha..."
            className="h-full w-full rounded-2xl bg-transparent py-2.5 pl-3 pr-10 text-sm font-medium tracking-[0.01em] text-brand-text outline-none placeholder:font-normal placeholder:text-brand-muted"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-1 flex h-7 w-7 items-center justify-center rounded-xl text-brand-muted hover:text-brand-primary hover:bg-brand-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default function HeaderSearch() {
  return (
    <Suspense fallback={
      <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-brand-border/60 opacity-50 md:h-9 md:w-9">
        <Search size={20} className="text-brand-muted" />
      </button>
    }>
      <SearchBar />
    </Suspense>
  );
}
