'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, Loader2, CheckCircle2, CircleAlert } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { signIn, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const res = await signIn(email, password);
    if (res.error) {
      setErrorMsg(res.error);
      setIsSubmitting(false);
    } else {
      setSuccessMsg('Welcome back! Redirecting to your sanctuary...');
      setTimeout(() => {
        router.push(redirect);
      }, 700);
    }
  };

  const handleDemoSignIn = (role: 'customer' | 'admin') => {
    demoLogin(role);
    setSuccessMsg(`Welcome! Logged in as ${role === 'admin' ? 'Administrator' : 'Sacred Seeker'}. Redirecting...`);
    setTimeout(() => {
      router.push(role === 'admin' ? '/admin' : redirect);
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-brand-border p-8 md:p-10">
      {/* Sacred Icon & Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-accent shadow-md border border-brand-accent/30">
          <Sparkles size={28} />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-primary">
          Sacred Sanctuary
        </h1>
        <p className="text-sm text-brand-muted mt-1.5">
          Sign in to access your blessed orders, certificates & consultations
        </p>
      </div>

      {/* Status Messages */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-2">
          <CircleAlert size={18} className="shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. bhakt@nepalirudraksha.com"
              className="w-full pl-10 pr-4 py-3 bg-brand-bg rounded-xl border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-sm transition-colors text-brand-text placeholder:text-brand-muted/70"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset link sent to your registered email.')}
              className="text-xs text-brand-secondary hover:text-brand-primary hover:underline transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-3 bg-brand-bg rounded-xl border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-sm transition-colors text-brand-text"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3.5 px-6 bg-brand-primary hover:bg-[#16221a] text-brand-accent rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Enter Sanctuary</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Access for Devotees */}
      <div className="mt-8 pt-6 border-t border-brand-border text-center">
        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">
          Quick Devotee Preview
        </p>
        <button
          type="button"
          onClick={() => handleDemoSignIn('customer')}
          className="w-full py-2.5 px-4 rounded-xl border border-brand-border bg-brand-light/60 hover:bg-brand-light text-brand-primary text-xs font-semibold transition-all text-center"
        >
          ⚡ One-Click Customer Demo Sign-In
        </button>
      </div>

      {/* Link to Signup */}
      <div className="mt-6 text-center text-xs text-brand-muted">
        Are you a new seeker?{' '}
        <Link
          href={`/signup${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
          className="text-brand-secondary hover:text-brand-primary font-bold hover:underline"
        >
          Create an Account
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 pt-6 border-t border-brand-border/60 flex items-center justify-center space-x-4 text-[11px] text-brand-muted">
        <span className="flex items-center space-x-1">
          <ShieldCheck size={14} className="text-brand-accent" />
          <span>Lab Certified</span>
        </span>
        <span>•</span>
        <span className="flex items-center space-x-1">
          <Sparkles size={14} className="text-brand-accent" />
          <span>Vedic Energized</span>
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full min-h-[80vh] py-12 md:py-20 px-4 bg-brand-bg flex items-center justify-center">
      <Suspense fallback={<div className="text-center text-brand-muted py-12">Loading sanctuary...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
