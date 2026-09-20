'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HeaderNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Primary navigation"
      className="hidden lg:flex items-center gap-10 whitespace-nowrap"
    >
      {links.map((link, index) => {
        const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={scrollToTop}
            className={`relative px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive
                ? 'text-brand-primary'
                : 'text-brand-text hover:text-brand-primary'
            }`}
            style={{ transitionDelay: `${index * 20}ms` }}
          >
            {link.name}
            {/* Underline hover/active effect */}
            <span 
              className={`absolute bottom-1.5 left-0 right-0 h-0.5 bg-brand-accent origin-left transition-transform duration-300 ease-out ${
                isActive ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'
              }`}
              aria-hidden="true"
            />
          </Link>
        );
      })}
    </nav>
  );
}