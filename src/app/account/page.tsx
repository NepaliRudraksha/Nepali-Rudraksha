'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  User, Package, Settings, LogOut, ShieldCheck, Sparkles, 
  Clock, MapPin, CheckCircle, ArrowRight, Loader2, Save, ShoppingBag, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getOrdersByEmail, Order } from '@/lib/api';

function AccountDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';

  const { user, signOut, isLoading, updateProfile, demoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'settings' | 'benefits'>(
    (initialTab as any) || 'dashboard'
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Settings form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Guest order lookup
  const [guestOrderId, setGuestOrderId] = useState('');
  const [lookupMsg, setLookupMsg] = useState<string | null>(null);

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'orders', 'settings', 'benefits'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Sync user profile with form
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      });
    }
  }, [user]);

  // Fetch orders when user is present
  useEffect(() => {
    async function loadOrders() {
      if (!user?.email) return;
      setIsLoadingOrders(true);
      try {
        const userOrders = await getOrdersByEmail(user.email);
        setOrders(userOrders);
      } catch (err) {
        console.error('Failed to load orders for user:', err);
      } finally {
        setIsLoadingOrders(false);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const res = await updateProfile(formData);
    setIsSaving(false);
    if (!res.error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } else {
      alert(res.error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleGuestLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestOrderId.trim()) return;
    setLookupMsg(`Searching record for ${guestOrderId}... Status: Processing / In Transit from Kathmandu Valley.`);
  };

  // Loading indicator
  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary mb-3" size={36} />
        <p className="text-sm font-serif text-brand-muted">Connecting to Sacred Sanctuary...</p>
      </div>
    );
  }

  // Unauthenticated View
  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 px-4 md:px-8">
        <div className="bg-white rounded-3xl border border-brand-border p-8 md:p-12 shadow-sm text-center">
          <div className="w-16 h-16 bg-brand-light rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-primary border border-brand-border">
            <Sparkles size={32} className="text-brand-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-3">
            Welcome to Your Sanctuary
          </h1>
          <p className="text-brand-muted max-w-lg mx-auto text-sm md:text-base mb-8">
            Please sign in to track your consecrated orders, review lifetime authenticity certificates, and access personalized astrological consultations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/login?redirect=/account"
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-primary text-brand-accent hover:bg-[#16221a] rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Sign In to Account</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/signup?redirect=/account"
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-light text-brand-primary hover:bg-[#eae5d0] border border-brand-border rounded-xl font-semibold text-sm transition-all flex items-center justify-center"
            >
              Create New Account
            </Link>
          </div>

          {/* Quick Demo Option */}
          <div className="mt-8 pt-8 border-t border-brand-border/70 max-w-md mx-auto text-center">
            <p className="text-xs text-brand-muted mb-3 font-medium uppercase tracking-wider">
              Testing or Reviewing the Platform?
            </p>
            <button
              onClick={() => demoLogin('customer')}
              className="text-xs py-2 px-4 rounded-lg bg-brand-bg hover:bg-brand-light border border-brand-border text-brand-secondary font-semibold transition-colors"
            >
              ⚡ Instant 1-Click Customer Demo Login
            </button>
          </div>

          {/* Guest Order Tracker */}
          <div className="mt-12 pt-8 border-t border-brand-border/60 max-w-lg mx-auto text-left">
            <h3 className="font-serif font-bold text-brand-primary text-lg mb-1">
              Guest Order Lookup
            </h3>
            <p className="text-xs text-brand-muted mb-4">
              Placed an order as a guest? Enter your Order Reference ID below to check live status.
            </p>
            <form onSubmit={handleGuestLookup} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. NR-2026-0091"
                value={guestOrderId}
                onChange={(e) => setGuestOrderId(e.target.value)}
                className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-accent"
              />
              <button
                type="submit"
                className="bg-brand-primary text-brand-accent px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#16221a] transition-colors"
              >
                Track
              </button>
            </form>
            {lookupMsg && (
              <div className="mt-3 p-3 rounded-lg bg-brand-light text-xs text-brand-primary border border-brand-border">
                {lookupMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Authenticated View
  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'NR';
  const isAdmin = user.role === 'admin' || user.email.includes('admin');

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/4">
          {/* User Profile Card */}
          <div className="bg-brand-light border border-brand-border rounded-3xl p-6 flex flex-col items-center mb-6 text-center shadow-sm">
            <div className="w-20 h-20 bg-brand-primary text-brand-accent rounded-full flex items-center justify-center mb-4 border-2 border-brand-accent/40 shadow-inner font-serif font-bold text-2xl">
              {initials}
            </div>
            <h2 className="font-serif font-bold text-xl text-brand-primary">
              {user.fullName || 'Sacred Devotee'}
            </h2>
            <p className="text-xs text-brand-muted mt-0.5 mb-3">{user.email}</p>
            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white text-brand-secondary border border-brand-border text-xs font-semibold">
              <ShieldCheck size={14} className="text-brand-accent" />
              <span>{isAdmin ? 'Temple Administrator' : 'Verified Devotee'}</span>
            </div>
          </div>
          
          {/* Nav Links */}
          <div className="bg-white border border-brand-border rounded-3xl overflow-hidden shadow-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 p-4 text-sm font-medium transition-colors text-left border-l-4 ${
                activeTab === 'dashboard'
                  ? 'bg-brand-light border-brand-accent text-brand-primary font-bold'
                  : 'text-brand-text hover:bg-brand-light/60 border-transparent'
              }`}
            >
              <User size={18} className="text-brand-primary" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-4 text-sm font-medium transition-colors text-left border-l-4 ${
                activeTab === 'orders'
                  ? 'bg-brand-light border-brand-accent text-brand-primary font-bold'
                  : 'text-brand-text hover:bg-brand-light/60 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Package size={18} className="text-brand-primary" />
                <span>My Orders</span>
              </div>
              <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 p-4 text-sm font-medium transition-colors text-left border-l-4 ${
                activeTab === 'settings'
                  ? 'bg-brand-light border-brand-accent text-brand-primary font-bold'
                  : 'text-brand-text hover:bg-brand-light/60 border-transparent'
              }`}
            >
              <Settings size={18} className="text-brand-primary" />
              <span>Delivery & Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('benefits')}
              className={`w-full flex items-center space-x-3 p-4 text-sm font-medium transition-colors text-left border-l-4 ${
                activeTab === 'benefits'
                  ? 'bg-brand-light border-brand-accent text-brand-primary font-bold'
                  : 'text-brand-text hover:bg-brand-light/60 border-transparent'
              }`}
            >
              <Sparkles size={18} className="text-brand-accent" />
              <span>Spiritual Privileges</span>
            </button>

            {isAdmin && (
              <Link
                href="/admin"
                className="w-full flex items-center space-x-3 p-4 text-sm font-semibold text-amber-800 hover:bg-amber-50 border-l-4 border-amber-600 transition-colors"
              >
                <ShieldCheck size={18} className="text-amber-700" />
                <span>Admin Portal</span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 p-4 text-sm text-red-600 hover:bg-red-50 transition-colors border-l-4 border-transparent text-left"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content Pane */}
        <div className="w-full lg:w-3/4">

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h1 className="text-3xl font-serif font-bold text-brand-primary">
                  Namaste, {user.fullName || 'Seeker'}
                </h1>
                <p className="text-sm text-brand-muted mt-1">
                  Welcome back to your sacred account. Here is a summary of your spiritual items and active journey.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center text-brand-secondary">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-brand-primary">{orders.length}</h3>
                    <p className="text-xs text-brand-muted">Total Orders</p>
                  </div>
                </div>

                <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center text-brand-secondary">
                    <Sparkles size={24} className="text-brand-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-brand-primary">100%</h3>
                    <p className="text-xs text-brand-muted">Lab Certified</p>
                  </div>
                </div>

                <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center text-brand-secondary">
                    <CheckCircle size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-brand-primary">Active</h3>
                    <p className="text-xs text-brand-muted">Sanctuary Member</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div className="bg-white border border-brand-border rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-serif font-bold text-brand-primary">Recent Orders</h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-brand-secondary hover:text-brand-primary flex items-center space-x-1"
                  >
                    <span>View All Orders</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {isLoadingOrders ? (
                  <div className="py-8 text-center text-brand-muted">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    <p className="text-xs">Fetching your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-brand-bg rounded-2xl border border-dashed border-brand-border">
                    <ShoppingBag size={36} className="text-brand-muted mx-auto mb-3" />
                    <h4 className="font-serif font-bold text-brand-primary text-base">No Orders Placed Yet</h4>
                    <p className="text-xs text-brand-muted max-w-sm mx-auto mt-1 mb-4">
                      Bring spiritual balance and divine consciousness to your life with our energized Nepali Rudraksha beads.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-primary text-brand-accent rounded-xl text-xs font-semibold hover:bg-[#16221a] transition-colors"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-brand-border">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-serif font-bold text-brand-primary text-sm">{order.id}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-brand-text mt-1">{order.product_description}</p>
                          <p className="text-[11px] text-brand-muted mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-brand-primary text-base">₹ {order.amount.toLocaleString('en-IN')}</p>
                          <span className="text-[11px] text-brand-muted uppercase tracking-wider">{order.payment_method || 'Online'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Spiritual Advisory Card */}
              <div className="bg-brand-primary text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-accent/30 shadow-md">
                <div>
                  <span className="text-xs text-brand-accent font-semibold uppercase tracking-wider">
                    Complimentary Sacred Guidance
                  </span>
                  <h3 className="text-xl md:text-2xl font-serif font-bold mt-1 text-white">
                    Need Astrological Rudraksha Recommendation?
                  </h3>
                  <p className="text-xs text-white/80 max-w-lg mt-1.5 leading-relaxed">
                    Our Vedic scholars analyze your date, time, and place of birth to recommend the precise Mukhi combination for planetary alignment and spiritual protection.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="whitespace-nowrap px-6 py-3 bg-brand-accent text-brand-primary hover:bg-brand-accent-hover font-bold text-sm rounded-xl transition-colors shadow-sm"
                >
                  Consult Astrologer
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h1 className="text-3xl font-serif font-bold text-brand-primary">Order History</h1>
                <p className="text-sm text-brand-muted mt-1">
                  View and track all certified items dispatched from our sanctum.
                </p>
              </div>

              {isLoadingOrders ? (
                <div className="py-16 text-center text-brand-muted bg-white rounded-3xl border border-brand-border">
                  <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                  <p className="text-sm font-serif">Loading your sacred purchases...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-brand-border p-12 text-center">
                  <Package size={48} className="text-brand-muted mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-bold text-brand-primary mb-2">No Orders Found</h3>
                  <p className="text-sm text-brand-muted max-w-md mx-auto mb-6">
                    You haven’t ordered any Rudraksha yet under {user.email}. Explore our lab-tested collection today.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-primary text-brand-accent rounded-xl text-sm font-semibold hover:bg-[#16221a] transition-colors"
                  >
                    <ShoppingBag size={16} />
                    <span>Browse Rudraksha Beads</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border pb-4 mb-4">
                        <div>
                          <p className="text-xs text-brand-muted">Order Reference</p>
                          <p className="font-serif font-bold text-brand-primary text-base">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-brand-muted">Order Date</p>
                          <p className="text-xs font-semibold text-brand-text">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-brand-muted">Total Amount</p>
                          <p className="font-bold text-brand-primary text-base">₹ {order.amount.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">
                            Items in this package
                          </p>
                          <p className="text-sm text-brand-text font-medium">{order.product_description}</p>
                          {order.city && (
                            <p className="text-xs text-brand-muted mt-1 flex items-center space-x-1">
                              <MapPin size={12} />
                              <span>Destination: {order.city}, {order.state || 'India'}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => alert(`Certificate of Authenticity for ${order.id} is verified and sealed.`)}
                            className="px-4 py-2 border border-brand-border hover:bg-brand-light rounded-xl text-xs font-semibold text-brand-primary transition-colors flex items-center space-x-1"
                          >
                            <ShieldCheck size={14} className="text-brand-accent" />
                            <span>Digital Certificate</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS & PROFILE */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h1 className="text-3xl font-serif font-bold text-brand-primary">Profile & Delivery Address</h1>
                <p className="text-sm text-brand-muted mt-1">
                  Keep your sacred delivery details updated for swift consecrated dispatch.
                </p>
              </div>

              {saveSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
                  <CheckCircle size={18} className="text-emerald-600" />
                  <span>Your profile details have been saved successfully!</span>
                </div>
              )}

              <div className="bg-white border border-brand-border rounded-3xl p-6 md:p-8 shadow-sm">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-accent"
                        placeholder="e.g. Aarav Sharma"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full bg-gray-100 border border-brand-border rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed outline-none"
                      />
                      <p className="text-[11px] text-brand-muted mt-1">Email is locked to your authenticated session.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-accent"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
                        PIN / Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-accent"
                        placeholder="e.g. 221001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-accent"
                      placeholder="Flat, House number, Building, Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-accent"
                        placeholder="Varanasi"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-accent"
                        placeholder="Uttar Pradesh"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-3 bg-brand-primary hover:bg-[#16221a] text-brand-accent rounded-xl font-semibold text-sm transition-all shadow-md flex items-center space-x-2 disabled:opacity-60"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Delivery Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: SPIRITUAL PRIVILEGES */}
          {activeTab === 'benefits' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h1 className="text-3xl font-serif font-bold text-brand-primary">Spiritual Privileges</h1>
                <p className="text-sm text-brand-muted mt-1">
                  Sacred benefits unlocked with your Nepali Rudraksha devotee profile.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary mb-4">
                    <Sparkles size={24} className="text-brand-accent" />
                  </div>
                  <h3 className="font-serif font-bold text-brand-primary text-lg mb-2">Prana Pratishtha Puja</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Prior to dispatch, Vedic pandits perform traditional consecration chanting 108 Gayatri and Shiva mantras on your behalf.
                  </p>
                </div>

                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary mb-4">
                    <ShieldCheck size={24} className="text-brand-accent" />
                  </div>
                  <h3 className="font-serif font-bold text-brand-primary text-lg mb-2">Permanent Lab Certificate</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Every bead includes a verifiable physical and digital X-ray certificate verifying compartment integrity and genuine Nepalese origin.
                  </p>
                </div>

                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary mb-4">
                    <Clock size={24} className="text-brand-accent" />
                  </div>
                  <h3 className="font-serif font-bold text-brand-primary text-lg mb-2">Re-Energization Reminders</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Receive automated auspicious calendar alerts for Mahashivratri and Shravan Somwar cleansing, oiling, and mantra chanting.
                  </p>
                </div>

                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary mb-4">
                    <ExternalLink size={24} className="text-brand-accent" />
                  </div>
                  <h3 className="font-serif font-bold text-brand-primary text-lg mb-2">Priority Temple Sourcing</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Early access to rare collector mukhis (14 Mukhi to 21 Mukhi, Trijuti, and Gauri Shankar) harvested directly from eastern Nepal foothills.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-brand-muted font-serif">Loading Sacred Account...</div>}>
      <AccountDashboard />
    </Suspense>
  );
}
