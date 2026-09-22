'use client';

import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const defaultInstagramImages = [
  '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.01%20PM.jpeg',
  '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.03%20PM.jpeg',
  '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.04%20PM.jpeg',
  '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.11%20PM.jpeg',
  '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.11%20PMd.jpeg',
  '/images/nepaliraksha/WhatsApp%20Image%202026-09-18%20at%205.16.12%20PM.jpeg',
];

export default function InstagramMarquee({ images }: { images?: string[] }) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // An explicit empty list is a valid admin choice and must not restore demo images.
  const displayImages = images ?? defaultInstagramImages;

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let animationFrame = 0;
    let previousTime = 0;
    const pixelsPerSecond = 50;

    const animate = (time: number) => {
      if (!isPaused) {
        if (previousTime) {
          const scrollWidth = marquee.scrollWidth / 2;
          marquee.scrollLeft += ((time - previousTime) / 1000) * pixelsPerSecond;

          if (marquee.scrollLeft >= scrollWidth) {
            marquee.scrollLeft -= scrollWidth;
          }
        }

        previousTime = time;
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  return (
    <div className="relative w-full" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)}>
      <div
        ref={marqueeRef}
        className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Instagram feed"
      >
        {/* Duplicate images for seamless loop */}
        {[...displayImages, ...displayImages].map((image, index) => (
          <Link key={`${image}-${index}`} href="/" className="group relative shrink-0 w-[220px] sm:w-[240px] aspect-square overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={`Nepali Rudraksha Instagram post ${index + 1}`}
              fill
              sizes="240px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-xs font-medium">@nepalirudraksha</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
