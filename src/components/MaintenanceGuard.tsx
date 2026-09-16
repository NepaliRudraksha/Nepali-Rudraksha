'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getSettings } from '@/lib/api';
import { Settings, Loader2 } from 'lucide-react';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkMaintenance() {
      // Don't block admin routes
      if (pathname.startsWith('/admin')) {
        setIsLoading(false);
        return;
      }
      
      try {
        const settings = await getSettings();
        if (settings?.maintenance_mode === 'true') {
          setIsMaintenance(true);
        } else {
          setIsMaintenance(false);
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkMaintenance();
  }, [pathname]);

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-light">
        <Loader2 className="animate-spin text-brand-accent w-12 h-12" />
      </div>
    );
  }

  if (isMaintenance) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-light text-brand-primary px-4 text-center">
        <Settings className="w-20 h-20 text-brand-accent mb-8 animate-[spin_4s_linear_infinite]" />
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Store Under Maintenance</h1>
        <p className="text-brand-muted text-lg max-w-lg mb-8">
          We are currently updating our store to serve you better. We'll be back online shortly. Thank you for your patience!
        </p>
        <div className="w-16 h-1 bg-brand-accent rounded-full mb-8"></div>
        <p className="text-sm font-bold text-brand-primary uppercase tracking-widest">
          Nepali Rudraksha
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
