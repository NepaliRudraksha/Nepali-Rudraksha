'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  iconOnly?: boolean;
}

export default function AddToCartButton({ product, quantity = 1, className, iconOnly = false }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product, quantity)}
      className={className || 'bg-brand-primary text-white p-2 rounded-full hover:bg-brand-accent hover:text-brand-primary transition-colors'}
      aria-label={`Add ${product.name} to cart`}
    >
      {iconOnly ? (
        <ShoppingCart size={18} />
      ) : (
        <span className="flex items-center gap-2">
          <ShoppingCart size={18} />
          Add to Cart
        </span>
      )}
    </button>
  );
}
