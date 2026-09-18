'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function MotionHeader({ children }: { children: ReactNode }) {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 flex w-full flex-col bg-white shadow-sm"
    >
      {children}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden" aria-hidden="true">
        <span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-brand-accent to-transparent shadow-[0_0_8px_rgba(212,184,114,0.8)] animate-navbar-sheen" />
      </div>
    </motion.header>
  );
}
