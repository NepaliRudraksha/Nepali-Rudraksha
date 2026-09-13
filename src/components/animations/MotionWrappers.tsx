'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function MotionHeroWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full h-[600px] lg:h-[700px] flex items-center bg-black overflow-hidden"
    >
      {children}
    </motion.section>
  );
}

export function MotionHeroContent({ children }: { children: ReactNode }) {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
      className="max-w-xl text-white space-y-6"
    >
      {children}
    </motion.div>
  );
}

export function MotionHeroImage({ children }: { children: ReactNode }) {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
      className="hidden lg:block relative w-[400px] h-[400px]"
    >
      {children}
    </motion.div>
  );
}

export function MotionSection({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
