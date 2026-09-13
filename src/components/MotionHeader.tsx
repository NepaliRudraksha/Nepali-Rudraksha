'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function MotionHeader({ children }: { children: ReactNode }) {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-full flex flex-col z-50 sticky top-0 bg-white shadow-sm"
    >
      {children}
    </motion.header>
  );
}
