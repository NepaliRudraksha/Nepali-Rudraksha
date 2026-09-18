'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Package, Settings, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserNav() {
  const { user, signOut, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    router.push('/');
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'NR';

  const isAdmin = user?.role === 'admin' || user?.email.includes('admin');

  return (
    <div className="relative" ref={dropdownRef}>
      {user ? (
        // Authenticated State Button
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-7 w-7 items-center justify-center space-x-1 rounded-full p-0 transition-all hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent sm:h-auto sm:w-auto sm:justify-start sm:space-x-2 sm:p-1"
          aria-expanded={isOpen}
          aria-label="User account menu"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-accent/40 bg-brand-primary font-serif text-xs font-bold text-brand-accent shadow-sm sm:h-8 sm:w-8">
            {initials}
          </div>
          <ChevronDown size={14} className={`hidden text-brand-muted transition-transform duration-200 sm:block ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        // Unauthenticated State Button
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-primary transition-colors hover:bg-brand-light hover:text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent"
          aria-expanded={isOpen}
          aria-label="Account sign in or register"
        >
          <User size={20} />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-brand-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {user ? (
            // Authenticated Menu Items
            <>
              <div className="px-4 py-3 border-b border-brand-border/60 bg-brand-bg/50">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-primary text-brand-accent font-serif font-bold text-sm flex items-center justify-center border border-brand-accent/40">
                    {initials}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-serif font-bold text-sm text-brand-primary truncate">
                      {user.fullName || 'Seeker'}
                    </p>
                    <p className="text-xs text-brand-muted truncate">{user.email}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-light text-brand-secondary border border-brand-border">
                    {isAdmin ? 'Temple Admin' : 'Sacred Seeker'}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm text-brand-text hover:bg-brand-light/70 transition-colors"
                >
                  <User size={16} className="text-brand-primary" />
                  <span>My Dashboard</span>
                </Link>

                <Link
                  href="/account?tab=orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm text-brand-text hover:bg-brand-light/70 transition-colors"
                >
                  <Package size={16} className="text-brand-primary" />
                  <span>My Orders</span>
                </Link>

                <Link
                  href="/account?tab=settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm text-brand-text hover:bg-brand-light/70 transition-colors"
                >
                  <Settings size={16} className="text-brand-primary" />
                  <span>Profile & Delivery</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-amber-800 bg-amber-50/70 hover:bg-amber-100/70 transition-colors"
                  >
                    <ShieldCheck size={16} className="text-amber-700" />
                    <span>Admin Portal</span>
                  </Link>
                )}
              </div>

              <div className="border-t border-brand-border/60 pt-1 mt-1">
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            // Unauthenticated Menu Items
            <div className="p-4">
              <div className="text-center mb-4">
                <div className="w-10 h-10 bg-brand-light text-brand-primary rounded-full flex items-center justify-center mx-auto mb-2 border border-brand-border">
                  <Sparkles size={20} className="text-brand-accent" />
                </div>
                <h4 className="font-serif font-bold text-brand-primary text-base">Sacred Sanctuary</h4>
                <p className="text-xs text-brand-muted mt-0.5">Sign in to track orders, save favorites & consultations</p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 px-4 bg-brand-primary text-brand-accent hover:bg-[#152019] rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 px-4 bg-brand-light text-brand-primary hover:bg-[#eae5d0] border border-brand-border rounded-xl text-sm font-semibold transition-colors"
                >
                  Create Account
                </Link>
              </div>


            </div>
          )}
        </div>
      )}
    </div>
  );
}
