'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

const WHATSAPP_URL = 'https://wa.me/919142960749';

export default function FloatingWhatsAppButton() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Nepali Rudraksha on WhatsApp"
      className="whatsapp-float fixed bottom-5 right-5 z-[60] flex size-10 items-center justify-center rounded-full shadow-[0_7px_16px_rgba(18,92,50,0.32)] transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] sm:bottom-7 sm:right-7 sm:size-12"
    >
      <Image
        src="/whatsapp.png"
        alt=""
        width={64}
        height={64}
        className="relative z-10 size-full"
      />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}
