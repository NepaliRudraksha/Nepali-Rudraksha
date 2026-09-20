'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Package, Settings, ShieldCheck, ChevronDown, Sparkles, Heart, Truck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserNav() {
  const { user, signOut, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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

  const dropdownContent = (
    <div 
      ref={dropdownRef}
      className="fixed left-1/2 -translate-x-1/2 top-20 w-full max-w-[320px] sm:max-w-[360px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-brand-border/60 py-2 z-[100] animate-in fade-in-2 slide-in-from-top-4 duration-200"
      style={{ animation: 'fadeInUp 0.25s ease-out' }}
    >
      {user ? (
        // Authenticated Menu Items
        <>
          {/* User Header */}
          <div className="px-4 py-4 border-b border-brand-border/60 bg-brand-bg/50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 shrink-0 rounded-full bg-brand-primary text-brand-accent font-serif font-bold text-lg flex items-center justify-center border-2 border-brand-accent/40 shadow-md">
                {initials}
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="font-serif font-bold text-brand-primary truncate">
                  {user.fullName || 'Seeker'}
                </p>
                <p className="text-xs text-brand-muted truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-light text-brand-secondary border border-brand-border/60">
                {isAdmin ? 'Temple Admin' : 'Sacred Seeker'}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 space-y-1">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-brand-text rounded-xl mx-2 transition-all duration-200 hover:bg-brand-light hover:shadow-sm group"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center group-hover:bg-brand-accent/20 group-hover:text-brand-primary transition-all">
                <User size={17} />
              </div>
              <span>My Dashboard</span>
            </Link>

            <Link
              href="/account?tab=orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-brand-text rounded-xl mx-2 transition-all duration-200 hover:bg-brand-light hover:shadow-sm group"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center group-hover:bg-brand-accent/20 group-hover:text-brand-primary transition-all">
                <Package size={17} />
              </div>
              <span>My Orders</span>
            </Link>

            <Link
              href="/account?tab=wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-brand-text rounded-xl mx-2 transition-all duration-200 hover:bg-brand-light hover:shadow-sm group"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center group-hover:bg-brand-accent/20 group-hover:text-brand-primary transition-all">
                <Heart size={17} />
              </div>
              <span>Wishlist</span>
            </Link>

            <Link
              href="/account?tab=settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-brand-text rounded-xl mx-2 transition-all duration-200 hover:bg-brand-light hover:shadow-sm group"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center group-hover:bg-brand-accent/20 group-hover:text-brand-primary transition-all">
                <Settings size={17} />
              </div>
              <span>Profile & Delivery</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-amber-800 bg-amber-50/70 rounded-xl mx-2 border border-amber-200 transition-all duration-200 hover:bg-amber-100/70 hover:shadow-sm group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-200 transition-all">
                  <ShieldCheck size={17} />
                </div>
                <span>Admin Portal</span>
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-brand-border/60 my-2" />

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-red-600 rounded-xl mx-2 transition-all duration-200 hover:bg-red-50 hover:shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-100 transition-all">
              <LogOut size={17} />
            </div>
            <span>Sign Out</span>
          </button>
        </>
      ) : (
        // Unauthenticated Menu Items - Modern card design
        <div className="p-4 space-y-4">
          {/* Welcome Card */}
          <div className="text-center p-4 bg-brand-bg/50 rounded-2xl border border-brand-border/60">
            <div className="w-14 h-14 bg-brand-light text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-3 border border-brand-border">
              <Sparkles size={24} className="text-brand-accent" />
            </div>
            <h4 className="font-serif font-bold text-brand-primary text-lg">Sacred Sanctuary</h4>
            <p className="text-xs text-brand-muted mt-1.5">Sign in to track orders, save favorites & consultations</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center py-3 px-4 bg-brand-primary text-brand-accent hover:bg-brand-secondary rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center py-3 px-4 bg-white text-brand-primary border border-brand-border rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-brand-light hover:border-brand-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
            >
              Create Account
            </Link>
          </div>

          {/* Benefits */}
          <div className="pt-2 border-t border-brand-border/60 space-y-2">
            {[
              { icon: Heart, text: 'Save favorites' },
              { icon: Truck, text: 'Track orders' },
              { icon: Sparkles, text: 'Spiritual guidance' },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-2.5 text-sm text-brand-muted">
                <div className="w-6 h-6 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
                  <item.icon size={14} />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      {user ? (
        // Authenticated State Button - Modern avatar button
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-0 rounded-xl p-1 transition-all duration-200 hover:bg-brand-light/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 sm:gap-2 sm:pr-3"
          aria-expanded={isOpen}
          aria-label="User account menu"
        >
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary font-serif text-sm font-bold text-brand-accent shadow-sm border border-brand-accent/30 group-hover:ring-2 group-hover:ring-brand-accent/50 transition-all">
            {initials}
          </div>
          <span className="hidden sm:block font-medium text-sm text-brand-text truncate max-w-[140px]">
            {user.fullName || 'Seeker'}
          </span>
          <ChevronDown size={14} className="hidden sm:block text-brand-muted transition-transform duration-200 group-hover:text-brand-primary" />
        </button>
      ) : (
        // Unauthenticated State Button - Modern icon button
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-brand-primary transition-all duration-200 hover:bg-brand-light hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 md:h-9 md:w-9"
          aria-expanded={isOpen}
          aria-label="Account sign in or register"
        >
          <User size={20} />
        </button>
      )}

      {/* Dropdown Menu - Modern glassmorphism (rendered via portal) */}
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
}
