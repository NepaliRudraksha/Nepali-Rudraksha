'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, ArrowLeft, CircleAlert } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await signIn(email, password);
    if (res.error) {
      setErrorMsg(res.error);
      setIsSubmitting(false);
    } else {
      // Check role
      if (res.role !== 'admin') {
        setErrorMsg('Access Denied: This account does not possess administrator credentials.');
        setIsSubmitting(false);
        return;
      }
      router.push('/admin');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-brand-border p-8 md:p-10">
      {/* Admin Badge */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-accent shadow-lg border border-brand-accent/40">
          <ShieldCheck size={32} />
        </div>
        <span className="text-[11px] font-bold text-brand-accent bg-brand-primary px-3 py-1 rounded-full uppercase tracking-wider">
          Internal Console
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-primary mt-2">
          Administrator Login
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Authorized temple staff and management credentials required
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
            <CircleAlert size={16} className="shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
            Admin Email
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nepalirudraksha.com"
              className="w-full pl-10 pr-4 py-3 bg-brand-bg rounded-xl border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-sm transition-colors text-brand-text placeholder:text-brand-muted/70"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
            Admin Password
          </label>
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
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Access Admin Console</span>
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
          <span>Return to Storefront</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="w-full min-h-screen bg-brand-primary/95 py-16 px-4 flex items-center justify-center">
      <Suspense fallback={<div className="text-white text-sm">Loading security portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
