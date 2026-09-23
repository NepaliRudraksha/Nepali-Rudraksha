'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Package, ShoppingBag, Settings, LogOut, 
  ShieldAlert, Lock, ArrowLeft, Loader2, ArrowRight, Users, CircleAlert, Star, Mail, Home
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, signOut, signIn } = useAuth();

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If on the /admin/login route itself, allow it to render directly without wrapping in admin dashboard layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // 1. Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-primary text-white flex-col">
        <Loader2 className="animate-spin text-brand-accent mb-4" size={40} />
        <h2 className="font-serif font-bold text-lg text-brand-accent">Nepali Rudraksha Console</h2>
        <p className="text-xs text-white/70 mt-1">Verifying administrative security credentials...</p>
      </div>
    );
  }

  // 2. Unauthenticated: Show Admin Sign In Form
  if (!user) {
    const handleDirectAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError(null);
      setIsAuthenticating(true);

      const res = await signIn(adminEmail, adminPassword);
      if (res.error) {
        setAuthError(res.error);
        setIsAuthenticating(false);
      } else if (res.role !== 'admin') {
        setAuthError('Access Denied: Account lacks administrator permissions.');
        setIsAuthenticating(false);
      } else {
        setIsAuthenticating(false);
      }
    };

    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-brand-accent/40">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-brand-primary text-brand-accent rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-accent/40 shadow-md">
              <Lock size={32} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary bg-brand-light px-3 py-1 rounded-full border border-brand-border">
              Staff & Management Portal
            </span>
            <h1 className="text-2xl font-serif font-bold text-brand-primary mt-2">
              Admin Authentication Required
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Please sign in with administrator credentials to manage temple operations.
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <span className="flex items-center gap-1"><CircleAlert size={14} aria-hidden="true" /> {authError}</span>
            </div>
          )}

          <form onSubmit={handleDirectAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1 uppercase tracking-wider">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@nepalirudraksha.com"
                className="w-full px-4 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm outline-none focus:border-brand-accent text-brand-text"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm outline-none focus:border-brand-accent text-brand-text"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 bg-brand-primary text-brand-accent rounded-xl font-semibold text-sm hover:bg-[#16221a] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 shadow-md"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs text-brand-muted hover:text-brand-primary transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Logged in as Customer (Not Admin): Show Access Denied screen
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-brand-border text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={36} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Access Restricted
          </span>
          <h2 className="text-2xl font-serif font-bold text-brand-primary mt-3 mb-2">
            Administrator Privileges Required
          </h2>
          <p className="text-sm text-brand-muted mb-6 leading-relaxed">
            You are signed in as a seeker (<strong>{user.email}</strong>). The administration console is restricted to certified temple managers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link
              href="/"
              className="px-6 py-3 bg-brand-primary text-brand-accent rounded-xl text-xs font-bold hover:bg-[#16221a] transition-colors"
            >
              Back to Store
            </Link>
            <Link
              href="/account"
              className="px-6 py-3 bg-brand-light text-brand-primary border border-brand-border rounded-xl text-xs font-bold hover:bg-[#eae5d0] transition-colors"
            >
              My Devotee Account
            </Link>
          </div>

          <div className="pt-6 border-t border-brand-border">
            <button
              onClick={async () => {
                await signOut();
                router.push('/admin');
              }}
              className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
            >
              Sign Out & Switch to Administrator Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated Administrator View
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', href: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', href: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Customers', href: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Reviews', href: '/admin/reviews', icon: <Star size={20} /> },
    { name: 'Messages', href: '/admin/messages', icon: <Mail size={20} /> },
    { name: 'Homepage', href: '/admin/homepage', icon: <Home size={20} /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const adminInitials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-primary text-white flex flex-col shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-brand-primary font-serif font-bold text-sm">
              NR
            </div>
            <div>
              <span className="font-serif font-bold text-base text-brand-accent block leading-tight">Admin Console</span>
              <span className="text-[9px] text-white/60 tracking-wider uppercase">Nepali Rudraksha</span>
            </div>
          </Link>
          <button 
            className="md:hidden text-brand-accent hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-brand-accent text-brand-primary font-bold shadow-sm' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <button 
              className="md:hidden p-1 mr-1 text-gray-500 hover:text-brand-primary shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <span className="hidden sm:inline-block text-[10px] font-bold text-brand-accent bg-brand-primary px-2 py-1 rounded-md uppercase tracking-wider shrink-0">
              Admin Area
            </span>
            <h1 className="text-lg md:text-xl font-serif font-bold text-gray-800 capitalize truncate">
              {pathname.split('/').pop() === 'admin' ? 'Dashboard' : pathname.split('/').pop()}
            </h1>
          </div>
          <div className="flex items-center space-x-3 shrink-0 relative">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:block text-xs font-semibold text-brand-primary hover:text-brand-secondary underline"
            >
              View Public Website ↗
            </Link>
            
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 bg-brand-primary text-brand-accent rounded-full flex items-center justify-center text-xs font-bold shadow-sm hover:ring-2 hover:ring-brand-accent/50 transition-all focus:outline-none shrink-0"
            >
              {adminInitials}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-bold text-brand-primary truncate">{user.fullName || 'Admin'}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="px-2 py-2">
                  <button
                    onClick={async () => {
                      await signOut();
                      router.push('/');
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors flex items-center space-x-2 font-semibold"
                  >
                    <LogOut size={16} />
                    <span>Sign Out Console</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="p-4 md:p-8 flex-1 w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

