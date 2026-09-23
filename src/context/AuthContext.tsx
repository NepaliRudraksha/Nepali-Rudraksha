'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { isSupabaseConfigured, getUserProfile, upsertUserProfile } from '@/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role?: 'customer' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; role?: 'customer' | 'admin' }>;
  signUp: (email: string, password: string, metadata?: { fullName?: string; phone?: string }) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<AuthUser>) => Promise<{ error: string | null }>;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CUSTOMER: AuthUser = {
  id: 'demo-cust-108',
  email: 'bhakt@nepalirudraksha.com',
  fullName: 'Aarav Sharma',
  phone: '+91 9142960749',
  address: 'Flat 402, Kailash Heights, Temple Road',
  city: 'Varanasi',
  state: 'Uttar Pradesh',
  pincode: '221001',
  role: 'customer',
};

function isDemoCustomer(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.email === 'string' &&
    candidate.role === 'customer'
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // First check local storage for demo user
      const savedDemo = typeof window !== 'undefined' ? localStorage.getItem('nr_demo_user') : null;
      if (savedDemo) {
        try {
          const parsed: unknown = JSON.parse(savedDemo);
          if (isDemoCustomer(parsed) && mounted) {
            setUser(parsed);
            setIsLoading(false);
            return;
          }
          localStorage.removeItem('nr_demo_user');
        } catch {
          localStorage.removeItem('nr_demo_user');
        }
      }

      if (!isSupabaseConfigured()) {
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const meta = session.user.user_metadata || {};
          // Query user profile from Supabase profiles table
          const dbProfile = await getUserProfile(session.user.id);

          const resolvedUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: dbProfile?.full_name || meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Seeker',
            phone: dbProfile?.phone || meta.phone || '',
            address: dbProfile?.address || meta.address || '',
            city: dbProfile?.city || meta.city || '',
            state: dbProfile?.state || meta.state || '',
            pincode: dbProfile?.pincode || meta.pincode || '',
            role: dbProfile?.role === 'admin' ? 'admin' : 'customer',
          };

          // If not in profiles table yet, sync it
          if (!dbProfile) {
            await upsertUserProfile({
              id: resolvedUser.id,
              email: resolvedUser.email,
              full_name: resolvedUser.fullName,
              phone: resolvedUser.phone,
              role: resolvedUser.role || 'customer',
            });
          }

          setUser(resolvedUser);
        }
      } catch (err) {
        console.error('Error fetching auth session & profile:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    // Listen for Supabase auth state changes
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const meta = session.user.user_metadata || {};
            const dbProfile = await getUserProfile(session.user.id);

            const resolvedUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              fullName: dbProfile?.full_name || meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Seeker',
              phone: dbProfile?.phone || meta.phone || '',
              address: dbProfile?.address || meta.address || '',
              city: dbProfile?.city || meta.city || '',
              state: dbProfile?.state || meta.state || '',
              pincode: dbProfile?.pincode || meta.pincode || '',
              role: dbProfile?.role === 'admin' ? 'admin' : 'customer',
            };

            setUser(resolvedUser);
            if (typeof window !== 'undefined') localStorage.removeItem('nr_demo_user');
          } else {
            const savedDemo = typeof window !== 'undefined' ? localStorage.getItem('nr_demo_user') : null;
            if (!savedDemo) {
              setUser(null);
            }
          }
          setIsLoading(false);
        }
      );

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } else {
      return () => {
        mounted = false;
      };
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null; role?: 'customer' | 'admin' }> => {
    setIsLoading(true);

    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return { error: 'Authentication is unavailable because Supabase is not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      if (data.user) {
        const meta = data.user.user_metadata || {};
        // Retrieve profile from Supabase profiles table
        const dbProfile = await getUserProfile(data.user.id);
        const resolvedRole: 'customer' | 'admin' = dbProfile?.role === 'admin' ? 'admin' : 'customer';

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: dbProfile?.full_name || meta.full_name || meta.name || email.split('@')[0],
          phone: dbProfile?.phone || meta.phone || '',
          address: dbProfile?.address || meta.address || '',
          city: dbProfile?.city || meta.city || '',
          state: dbProfile?.state || meta.state || '',
          pincode: dbProfile?.pincode || meta.pincode || '',
          role: resolvedRole,
        };

        // Ensure user is in profiles table
        if (!dbProfile) {
          await upsertUserProfile({
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.fullName,
            phone: authUser.phone,
            role: authUser.role || 'customer',
          });
        }

        setUser(authUser);
        if (typeof window !== 'undefined') localStorage.removeItem('nr_demo_user');
        setIsLoading(false);
        return { error: null, role: resolvedRole };
      }

      setIsLoading(false);
      return { error: null };
    } catch (err: unknown) {
      setIsLoading(false);
      return { error: err instanceof Error ? err.message : 'An unknown authentication error occurred' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: { fullName?: string; phone?: string }
  ): Promise<{ error: string | null; needsEmailConfirmation?: boolean }> => {
    setIsLoading(true);

    // New public registrations must never be able to grant themselves admin
    // access by choosing a particular email address. Admin access is assigned
    // only by the seeded profile migration or directly in Supabase.
    const initialRole: 'customer' = 'customer';

    if (!isSupabaseConfigured()) {
      const mockUser: AuthUser = {
        id: `user-${Date.now()}`,
        email,
        fullName: metadata?.fullName || email.split('@')[0],
        phone: metadata?.phone || '',
        role: initialRole,
      };
      setUser(mockUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nr_demo_user', JSON.stringify(mockUser));
      }
      setIsLoading(false);
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata?.fullName,
            name: metadata?.fullName,
            phone: metadata?.phone,
            role: initialRole,
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      // Store in profiles table
      if (data.user) {
        await upsertUserProfile({
          id: data.user.id,
          email: data.user.email || email,
          full_name: metadata?.fullName || email.split('@')[0],
          phone: metadata?.phone || '',
          role: initialRole,
        });
      }

      if (data.session && data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: metadata?.fullName || email.split('@')[0],
          phone: metadata?.phone || '',
          role: initialRole,
        };
        setUser(authUser);
        if (typeof window !== 'undefined') localStorage.removeItem('nr_demo_user');
        setIsLoading(false);
        return { error: null, needsEmailConfirmation: false };
      }

      setIsLoading(false);
      return { error: null, needsEmailConfirmation: true };
    } catch (err: unknown) {
      setIsLoading(false);
      return { error: err instanceof Error ? err.message : 'An unknown signup error occurred' };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nr_demo_user');
    }
    setUser(null);

    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error during signOut:', err);
      }
    }
    setIsLoading(false);
  };

  const updateProfile = async (profile: Partial<AuthUser>): Promise<{ error: string | null }> => {
    if (!user) return { error: 'No user is currently signed in.' };

    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);

    // Save to local storage if in demo mode
    if (typeof window !== 'undefined' && localStorage.getItem('nr_demo_user')) {
      localStorage.setItem('nr_demo_user', JSON.stringify(updatedUser));
      return { error: null };
    }

    if (isSupabaseConfigured()) {
      try {
        // Update Supabase profiles table
        await upsertUserProfile({
          id: user.id,
          email: user.email,
          full_name: profile.fullName ?? user.fullName,
          phone: profile.phone ?? user.phone,
          address: profile.address ?? user.address,
          city: profile.city ?? user.city,
          state: profile.state ?? user.state,
          pincode: profile.pincode ?? user.pincode,
          role: user.role || 'customer',
        });

        // Also update Supabase Auth user metadata
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: profile.fullName ?? user.fullName,
            name: profile.fullName ?? user.fullName,
            phone: profile.phone ?? user.phone,
            address: profile.address ?? user.address,
            city: profile.city ?? user.city,
            state: profile.state ?? user.state,
            pincode: profile.pincode ?? user.pincode,
          },
        });

        if (error) return { error: error.message };
      } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : 'Failed to update profile in database' };
      }
    }

    return { error: null };
  };

  const demoLogin = () => {
    setUser(DEMO_CUSTOMER);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nr_demo_user', JSON.stringify(DEMO_CUSTOMER));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
