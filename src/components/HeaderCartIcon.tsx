'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

export default function HeaderCartIcon() {
  const { cartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link href="/cart" className="text-brand-primary hover:text-brand-secondary transition-colors relative">
      <ShoppingCart size={20} />
      {mounted && (
        <span className="absolute -top-2 -right-2 bg-brand-accent text-brand-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
