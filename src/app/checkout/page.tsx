'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/api';
import { ShieldCheck, ChevronRight, CheckCircle, Loader2, ArrowLeft, Sparkles, UserCheck } from 'lucide-react';

type Step = 'shipping' | 'payment' | 'confirmation';

export default function Checkout() {
  const { cart, cartTotal, cartCount } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState(`NR-${Date.now().toString().slice(-6)}`);

  const [shippingData, setShippingData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '', country: 'India',
  });

  // Pre-fill user profile if authenticated
  useEffect(() => {
    if (user) {
      const names = (user.fullName || '').trim().split(' ');
      const first = names[0] || '';
      const last = names.slice(1).join(' ') || '';

      setShippingData((prev) => ({
        ...prev,
        firstName: prev.firstName || first,
        lastName: prev.lastName || last,
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || '',
        pincode: prev.pincode || user.pincode || '',
      }));
    }
  }, [user]);

  const [paymentData, setPaymentData] = useState({
    method: 'upi',
    upiId: '',
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Build a human-readable product description from the cart
    const productDescription = cart
      .map((item) => `${item.product.name}${item.quantity > 1 ? ` (x${item.quantity})` : ''}`)
      .join(', ');

    const result = await createOrder({
      customerName: `${shippingData.firstName} ${shippingData.lastName}`.trim(),
      email: shippingData.email,
      phone: shippingData.phone,
      city: shippingData.city,
      state: shippingData.state,
      address: shippingData.address,
      pincode: shippingData.pincode,
      country: shippingData.country,
      productDescription,
      amount: cartTotal,
      paymentMethod: paymentData.method,
    });

    if (result.id) {
      setOrderId(result.id);
    }

    setIsProcessing(false);
    setStep('confirmation');
    window.scrollTo(0, 0);
  };

  const inputClass = "w-full border border-brand-border rounded-lg px-3.5 py-3 text-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors bg-brand-bg";
  const labelClass = "block text-sm font-bold text-brand-primary mb-1.5";

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="w-full max-w-2xl mx-auto py-24 px-4 text-center">
        <h1 className="text-3xl font-serif font-bold text-brand-primary mb-4">Your Cart is Empty</h1>
        <p className="text-brand-muted mb-8">Add some products to your cart before checking out.</p>
        <Link href="/shop" className="bg-brand-primary text-white font-bold px-8 py-3 rounded-md hover:bg-[#1a251d] transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-brand-bg">
      {/* Progress Steps */}
      <div className="w-full bg-white border-b border-brand-border sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            {(['shipping', 'payment', 'confirmation'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 text-sm font-bold ${step === s ? 'text-brand-secondary' : step === 'confirmation' || (step === 'payment' && s === 'shipping') ? 'text-brand-muted' : 'text-brand-muted'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s ? 'bg-brand-primary text-white' : 
                    (s === 'shipping' && (step === 'payment' || step === 'confirmation')) || (s === 'payment' && step === 'confirmation')
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {(s === 'shipping' && (step === 'payment' || step === 'confirmation')) || (s === 'payment' && step === 'confirmation')
                      ? '✓' : i + 1}
                  </div>
                  <span className="capitalize hidden sm:block">{s}</span>
                </div>
                {i < 2 && <ChevronRight size={16} className="mx-2 text-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        
        {step === 'confirmation' ? (
          /* Order Confirmed */
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-brand-primary mb-3">Order Placed! 🙏</h1>
            <p className="text-brand-muted mb-2">Your order has been confirmed and is being prepared.</p>
            <p className="text-brand-secondary font-bold text-lg mb-8">Order ID: {orderId}</p>
            
            <div className="bg-white border border-brand-border rounded-2xl p-6 text-left mb-8">
              <h2 className="font-bold text-brand-primary mb-4">Order Summary</h2>
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-brand-text">{item.product.name} × {item.quantity}</span>
                    <span className="font-bold text-brand-primary">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-brand-border pt-3 flex justify-between font-bold">
                  <span>Total Paid</span>
                  <span className="text-brand-secondary font-serif text-lg">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-light border border-brand-border rounded-xl p-5 text-sm text-brand-muted mb-8">
              <p>A confirmation email has been sent to <strong className="text-brand-primary">{shippingData.email || 'your email'}</strong>. Your Rudraksha will be energized with Vedic mantras before being shipped. Expected delivery: <strong className="text-brand-primary">3-7 business days</strong>.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/shop" className="bg-brand-primary text-white font-bold px-8 py-3 rounded-md hover:bg-[#1a251d] transition-colors">
                Continue Shopping
              </Link>
              <Link href="/" className="border border-brand-border text-brand-primary font-bold px-8 py-3 rounded-md hover:bg-brand-light transition-colors">
                Go to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left: Form */}
            <div className="lg:col-span-2">
              {step === 'shipping' && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-serif font-bold text-brand-primary">Shipping Information</h2>
                    </div>

                    {user ? (
                      <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
                        <UserCheck size={16} className="text-emerald-600 flex-shrink-0" />
                        <span>Signed in as <strong>{user.fullName || user.email}</strong>. Shipping details pre-filled from your profile.</span>
                      </div>
                    ) : (
                      <div className="mb-5 p-3 bg-brand-light border border-brand-border rounded-xl flex items-center justify-between text-xs text-brand-text">
                        <span className="flex items-center space-x-1.5">
                          <Sparkles size={14} className="text-brand-accent" />
                          <span>Have an account?</span>
                        </span>
                        <Link href="/login?redirect=/checkout" className="text-brand-secondary font-bold hover:underline">
                          Sign in for saved address →
                        </Link>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass} htmlFor="firstName">First Name *</label>
                        <input id="firstName" type="text" name="firstName" value={shippingData.firstName} onChange={handleShippingChange} required placeholder="Ravi" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="lastName">Last Name *</label>
                        <input id="lastName" type="text" name="lastName" value={shippingData.lastName} onChange={handleShippingChange} required placeholder="Sharma" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="email">Email Address *</label>
                        <input id="email" type="email" name="email" value={shippingData.email} onChange={handleShippingChange} required placeholder="ravi@example.com" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="phone">Phone Number *</label>
                        <input id="phone" type="tel" name="phone" value={shippingData.phone} onChange={handleShippingChange} required placeholder="+91 xxxxx xxxxx" className={inputClass} />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass} htmlFor="address">Street Address *</label>
                        <input id="address" type="text" name="address" value={shippingData.address} onChange={handleShippingChange} required placeholder="123, Main Street, Sector 5" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="city">City *</label>
                        <input id="city" type="text" name="city" value={shippingData.city} onChange={handleShippingChange} required placeholder="Delhi" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="state">State *</label>
                        <input id="state" type="text" name="state" value={shippingData.state} onChange={handleShippingChange} required placeholder="Delhi" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="pincode">PIN Code *</label>
                        <input id="pincode" type="text" name="pincode" value={shippingData.pincode} onChange={handleShippingChange} required placeholder="110001" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="country">Country</label>
                        <select id="country" name="country" value={shippingData.country} onChange={handleShippingChange} className={inputClass}>
                          <option value="India">India</option>
                          <option value="Nepal">Nepal</option>
                          <option value="USA">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Canada">Canada</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-[#1a251d] transition-colors shadow-lg text-base">
                    Continue to Payment →
                  </button>
                </form>
              )}

              {step === 'payment' && (
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  <button type="button" onClick={() => setStep('shipping')} className="flex items-center gap-1 text-sm text-brand-muted hover:text-brand-primary transition-colors mb-4">
                    <ArrowLeft size={16} />
                    Back to Shipping
                  </button>

                  <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-serif font-bold text-brand-primary mb-5">Payment Method</h2>
                    <div className="space-y-3 mb-6">
                      {[
                        { value: 'upi', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
                        { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                        { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order' },
                      ].map(opt => (
                        <label key={opt.value} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentData.method === opt.value ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border hover:border-brand-accent/40'}`}>
                          <input type="radio" name="method" value={opt.value} checked={paymentData.method === opt.value} onChange={handlePaymentChange} className="accent-brand-accent" />
                          <div>
                            <p className="font-bold text-brand-primary text-sm">{opt.label}</p>
                            <p className="text-xs text-brand-muted">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {paymentData.method === 'upi' && (
                      <div>
                        <label className={labelClass} htmlFor="upiId">UPI ID *</label>
                        <input id="upiId" type="text" name="upiId" value={paymentData.upiId} onChange={handlePaymentChange} required placeholder="yourname@upi" className={inputClass} />
                      </div>
                    )}

                    {paymentData.method === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass} htmlFor="cardNumber">Card Number *</label>
                          <input id="cardNumber" type="text" name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange} required placeholder="1234 5678 9012 3456" maxLength={19} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass} htmlFor="cardName">Name on Card *</label>
                          <input id="cardName" type="text" name="cardName" value={paymentData.cardName} onChange={handlePaymentChange} required placeholder="RAVI SHARMA" className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass} htmlFor="expiry">Expiry *</label>
                            <input id="expiry" type="text" name="expiry" value={paymentData.expiry} onChange={handlePaymentChange} required placeholder="MM/YY" maxLength={5} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass} htmlFor="cvv">CVV *</label>
                            <input id="cvv" type="password" name="cvv" value={paymentData.cvv} onChange={handlePaymentChange} required placeholder="•••" maxLength={3} className={inputClass} />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentData.method === 'cod' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                        <p><strong>Note:</strong> Cash on Delivery is available for orders up to ₹5,000. An additional COD fee of ₹50 will be charged at the time of delivery.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 text-sm text-brand-muted">
                    <ShieldCheck size={20} className="text-brand-accent flex-shrink-0 mt-0.5" />
                    <p>Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-4 rounded-xl transition-colors shadow-lg text-base flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>Place Order (₹{cartTotal.toLocaleString()})</>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="font-serif font-bold text-xl text-brand-primary mb-4 pb-4 border-b border-brand-border">Order Summary</h2>
                <div className="space-y-4 mb-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-start gap-3">
                      <div className="w-14 h-14 bg-brand-light rounded-lg overflow-hidden flex-shrink-0 relative border border-brand-border">
                        <Image
                          src={item.product.image || 'https://images.unsplash.com/photo-1620857908861-1c3905007328?q=80&w=100&auto=format&fit=crop'}
                          alt={item.product.name}
                          fill
                          className="object-contain p-1"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-primary leading-tight line-clamp-2">{item.product.name}</p>
                        <p className="text-sm font-bold text-brand-secondary mt-1">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-brand-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-brand-muted">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-muted">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-primary text-base border-t border-brand-border pt-2 mt-2">
                    <span>Total</span>
                    <span className="font-serif text-brand-secondary text-xl">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs text-brand-muted">
                  <ShieldCheck size={14} className="text-brand-accent mt-0.5 flex-shrink-0" />
                  <span>100% secure checkout. All products are lab certified and energized before shipping.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
