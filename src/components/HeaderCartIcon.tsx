'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export default function HeaderCartIcon() {
  const { cartCount } = useCart();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  return (
    <Link
      href="/cart"
      aria-label={`Cart with ${cartCount} items`}
      className="relative flex h-7 w-7 items-center justify-center rounded-lg text-brand-primary transition-colors hover:bg-brand-light hover:text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
    >
      <ShoppingCart size={20} />
      {mounted && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-brand-primary">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
