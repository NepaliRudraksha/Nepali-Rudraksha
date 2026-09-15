'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

export function ClientHeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <>{children}</>;
}

export function ClientFooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <>{children}</>;
}
