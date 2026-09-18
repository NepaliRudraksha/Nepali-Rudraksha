'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HeaderNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Rudraksha Types', href: '/types' },
    { name: 'Accessories', href: '/accessories' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className="hidden lg:flex items-center gap-7 whitespace-nowrap text-sm font-medium text-brand-text xl:gap-8"
    >
      {links.map((link) => {
        // active if exact match for home, or starts with href for others
        const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        
        return (
          <Link 
            key={link.name}
            href={link.href}
            scroll
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-brand-accent after:transition-transform hover:after:scale-x-100 ${
              isActive 
                ? 'text-brand-secondary after:scale-x-100'
                : 'hover:text-brand-secondary after:scale-x-0'
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
