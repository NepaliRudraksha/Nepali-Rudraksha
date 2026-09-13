'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, User, Phone, Eye, EyeOff, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Loader2, Award, HeartHandshake } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    const res = await signUp(email, password, { fullName, phone });

    if (res.error) {
      setErrorMsg(res.error);
      setIsSubmitting(false);
    } else if (res.needsEmailConfirmation) {
      setSuccessMsg('Account created successfully! Please check your email inbox to confirm your account.');
      setIsSubmitting(false);
    } else {
      setSuccessMsg('Account created successfully! Welcoming you to your sanctuary...');
      setTimeout(() => {
        router.push(redirect);
      }, 800);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      {/* Benefits Showcase (Left Col) */}
      <div className="md:col-span-5 bg-brand-primary text-white rounded-3xl p-8 md:p-10 shadow-xl border border-brand-accent/30 flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent mb-6">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-accent mb-2">
            Sacred Membership
          </h2>
          <p className="text-white/80 text-sm leading-relaxed mb-8">
            Create an account to embark on an authentic spiritual journey with Nepal’s purest divine beads.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <ShieldCheck size={20} className="text-brand-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Digital Authenticity Card</h4>
                <p className="text-xs text-white/70">Lab test records & X-ray certs securely tied to your profile.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Award size={20} className="text-brand-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Free Vedic Puja Blessing</h4>
                <p className="text-xs text-white/70">Every bead is energized in your name before dispatch.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <HeartHandshake size={20} className="text-brand-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Astrological Guidance</h4>
                <p className="text-xs text-white/70">Direct consultation for bead recommendations according to your Kundali.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/60">
          Trusted by over 50,000+ devotees across 40 countries.
        </div>
      </div>

      {/* Signup Form Card (Right Col) */}
      <div className="md:col-span-7 bg-white rounded-3xl shadow-xl border border-brand-border p-8 md:p-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-primary">
            Create Your Account
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Join the sacred circle of authentic Nepali Rudraksha devotees.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-2">
            <span className="text-base leading-none">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start space-x-2">
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full pl-10 pr-4 py-3 bg-brand-bg rounded-xl border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-sm transition-colors text-brand-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-brand-bg rounded-xl border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-sm transition-colors text-brand-text"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 bg-brand-bg rounded-xl border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-sm transition-colors text-brand-text"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-3 bg-brand-bg rounded-xl border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-sm transition-colors text-brand-text"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-3 bg-brand-bg rounded-xl border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-sm transition-colors text-brand-text"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 py-3.5 px-6 bg-brand-primary hover:bg-[#16221a] text-brand-accent rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating Sanctuary Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-brand-muted">
          Already have an account?{' '}
          <Link
            href={`/login${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="text-brand-secondary hover:text-brand-primary font-bold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="w-full min-h-[85vh] py-12 md:py-16 px-4 bg-brand-bg flex items-center justify-center">
      <Suspense fallback={<div className="text-center text-brand-muted py-12">Loading registration...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
