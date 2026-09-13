'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif font-bold text-brand-primary mb-4">Your Shopping Cart</h1>
        <div className="w-24 h-1 bg-brand-accent mx-auto"></div>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-brand-border shadow-sm text-center px-4">
          <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center text-brand-muted mb-6">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">Your cart is empty</h2>
          <p className="text-brand-muted mb-8 max-w-md">Looks like you haven't added any spiritual items to your cart yet. Discover our authentic Rudraksha collection.</p>
          <Link href="/shop" className="bg-brand-primary hover:bg-[#1a251d] text-white font-bold py-3 px-8 rounded-md transition-colors shadow-lg">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <div className="hidden md:flex justify-between pb-4 border-b border-brand-border text-xs font-bold text-brand-muted uppercase tracking-wider">
              <div className="w-2/3">Product</div>
              <div className="w-1/6 text-center">Quantity</div>
              <div className="w-1/6 text-right">Total</div>
            </div>

            {cart.map((item) => (
              <div key={item.product.id} className="flex flex-col md:flex-row items-start md:items-center py-6 border-b border-brand-border gap-4 md:gap-0">
                <div className="flex items-center w-full md:w-2/3 gap-6">
                  <div className="relative w-24 h-24 bg-brand-light rounded-lg overflow-hidden border border-brand-border flex-shrink-0">
                    <Image 
                      src={item.product.image || "https://images.unsplash.com/photo-1620857908861-1c3905007328?q=80&w=200&auto=format&fit=crop"} 
                      alt={item.product.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <Link href={`/shop/${item.product.id}`} className="font-bold text-brand-primary hover:text-brand-accent transition-colors text-lg mb-1">
                      {item.product.name}
                    </Link>
                    <span className="text-sm text-brand-secondary font-serif font-bold">₹ {item.product.price.toLocaleString()}</span>
                    
                    {/* Mobile quantity controls */}
                    <div className="flex items-center md:hidden mt-4 gap-4">
                      <div className="flex items-center border border-brand-border rounded-md bg-white h-8">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 text-brand-muted hover:text-brand-primary focus:outline-none"><Minus size={14} /></button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 text-brand-muted hover:text-brand-primary focus:outline-none"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700 text-sm flex items-center">
                        <Trash2 size={14} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop quantity controls */}
                <div className="hidden md:flex flex-col items-center justify-center w-1/6">
                  <div className="flex items-center border border-brand-border rounded-md bg-white">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-2 text-brand-muted hover:text-brand-primary focus:outline-none"><Minus size={14} /></button>
                    <span className="w-8 text-center font-bold text-brand-primary">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-2 text-brand-muted hover:text-brand-primary focus:outline-none"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-brand-muted hover:text-red-500 text-xs mt-2 underline transition-colors">
                    Remove
                  </button>
                </div>

                <div className="hidden md:block w-1/6 text-right font-serif font-bold text-brand-primary text-lg">
                  ₹ {(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-[#fcfbf7] border border-brand-border rounded-2xl p-6 md:p-8 sticky top-32">
              <h2 className="font-serif font-bold text-2xl text-brand-primary mb-6 border-b border-brand-border pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-brand-text">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-bold">₹ {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-brand-text">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-brand-text">
                  <span>Estimated Tax</span>
                  <span className="font-bold">₹ 0</span>
                </div>
              </div>

              <div className="border-t border-brand-border pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-brand-primary">Total</span>
                  <span className="font-serif font-bold text-3xl text-brand-secondary">₹ {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout" className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-4 rounded-md transition-colors flex items-center justify-center shadow-lg mb-4">
                Proceed to Checkout <ArrowRight size={18} className="ml-2" />
              </Link>

              <div className="flex items-start justify-center space-x-2 text-xs text-brand-muted mt-6 text-center">
                <ShieldCheck size={16} className="text-brand-accent flex-shrink-0" />
                <p>Secure checkout powered by Stripe. 100% authentic products with lab certificates.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
