'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllProfiles, UserProfile, isSupabaseConfigured } from '@/lib/api';
import { Users, Search, RefreshCw, Loader2, ShieldCheck, UserCheck, MapPin, Phone, Mail } from 'lucide-react';

const mockProfiles: UserProfile[] = [
  {
    id: 'demo-cust-108',
    email: 'bhakt@nepalirudraksha.com',
    full_name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    address: 'Flat 402, Kailash Heights, Temple Road',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221001',
    role: 'customer',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-admin-001',
    email: 'admin@nepalirudraksha.com',
    full_name: 'Temple Administrator',
    phone: '+91 98765 00000',
    address: 'Headquarters, Nepali Rudraksha Trust',
    city: 'Haridwar',
    state: 'Uttarakhand',
    pincode: '249401',
    role: 'admin',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cust-1092',
    email: 'rahul@example.com',
    full_name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    address: 'B-12, Green Park',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110016',
    role: 'customer',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cust-1091',
    email: 'priya@example.com',
    full_name: 'Priya Patel',
    phone: '+91 87654 32109',
    address: '404, Sea Breeze Apt, Bandra',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    role: 'customer',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function AdminCustomersPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'admin'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const supabaseReady = isSupabaseConfigured();

  const loadProfiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllProfiles();
      if (data.length > 0) {
        setProfiles(data);
      } else {
        setProfiles(mockProfiles);
      }
    } catch {
      setProfiles(mockProfiles);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      (p.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.city?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (p.phone?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || p.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalCustomers = profiles.filter((p) => p.role === 'customer').length;
  const totalAdmins = profiles.filter((p) => p.role === 'admin').length;
  const withAddress = profiles.filter((p) => p.address && p.address.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-800">
            Devotees & User Accounts
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Registered customer and administrator profiles stored in Supabase table <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">profiles</code>.
          </p>
        </div>
        <button
          onClick={loadProfiles}
          disabled={isLoading}
          className="inline-flex items-center space-x-1.5 px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Registered</p>
            <h3 className="text-xl font-bold text-gray-800 mt-0.5">{profiles.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Active Devotees</p>
            <h3 className="text-xl font-bold text-gray-800 mt-0.5">{totalCustomers}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Administrators</p>
            <h3 className="text-xl font-bold text-gray-800 mt-0.5">{totalAdmins}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Saved Addresses</p>
            <h3 className="text-xl font-bold text-gray-800 mt-0.5">{withAddress}</h3>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, city, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-accent bg-gray-50/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-gray-500 font-medium">Role:</span>
          {(['all', 'customer', 'admin'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                roleFilter === role
                  ? 'bg-brand-primary text-brand-accent'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {role === 'all' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Loader2 className="animate-spin mb-2" size={28} />
            <p className="text-xs font-serif">Loading user directory from Supabase...</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users size={36} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No users found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Delivery Address</th>
                  <th className="py-3 px-4">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredProfiles.map((profile) => {
                  const initials = profile.full_name
                    ? profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                    : profile.email.slice(0, 2).toUpperCase();

                  const isAdmin = profile.role === 'admin';

                  return (
                    <tr key={profile.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                              isAdmin
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-brand-primary text-brand-accent'
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{profile.full_name || 'Anonymous Seeker'}</p>
                            <p className="text-xs text-gray-400 flex items-center space-x-1 mt-0.5">
                              <Mail size={12} />
                              <span>{profile.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isAdmin
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {profile.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        {profile.phone ? (
                          <div className="flex items-center space-x-1 text-gray-700 font-medium">
                            <Phone size={12} className="text-gray-400" />
                            <span>{profile.phone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">Not provided</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs max-w-xs">
                        {profile.address || profile.city ? (
                          <div>
                            <p className="font-medium text-gray-800 truncate">{profile.address || '—'}</p>
                            <p className="text-gray-400 text-[11px] mt-0.5">
                              {[profile.city, profile.state, profile.pincode].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">No address saved</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                        {profile.created_at
                          ? new Date(profile.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
