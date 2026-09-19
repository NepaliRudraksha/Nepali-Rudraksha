'use client';

import Image from '@/components/ImageKitImage';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

type CustomerReview = {
  name: string;
  city: string;
  quote: string;
  image: string;
};

type ReviewCarouselProps = {
  reviews: CustomerReview[];
};

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const move = useCallback((direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const card = carousel.querySelector<HTMLElement>('[data-review-card]');
    const gap = Number.parseFloat(window.getComputedStyle(carousel).gap) || 0;
    const amount = (card?.offsetWidth ?? carousel.clientWidth) + gap;
    const visibleCards = window.matchMedia('(min-width: 640px)').matches ? 3 : 2;
    const step = amount * visibleCards;
    const cycleWidth = carousel.scrollWidth / 2;
    const currentPosition = carousel.scrollLeft >= cycleWidth
      ? carousel.scrollLeft - cycleWidth
      : carousel.scrollLeft;
    let nextPosition = currentPosition + step * direction;

    if (nextPosition < 0) nextPosition += cycleWidth;
    if (nextPosition >= cycleWidth) nextPosition -= cycleWidth;

    carousel.scrollTo({ left: nextPosition, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationFrame = 0;
    let previousTime = 0;
    const pixelsPerSecond = 26;

    const animate = (time: number) => {
      if (previousTime) {
        const cycleWidth = carousel.scrollWidth / 2;
        carousel.scrollLeft += ((time - previousTime) / 1000) * pixelsPerSecond;

        if (carousel.scrollLeft >= cycleWidth) {
          carousel.scrollLeft -= cycleWidth;
        }
      }

      previousTime = time;
      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="group relative mt-6 overflow-visible">
      <div
        ref={carouselRef}
        className="mx-0 flex gap-2 overflow-x-auto sm:mx-12 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Customer testimonials"
      >
        {[...reviews, ...reviews].map((review, index) => (
          <article
            key={`${review.name}-${review.city}-${index}`}
            data-review-card
            className="min-h-[151px] w-[calc((100%-0.5rem)/2)] shrink-0 rounded-lg border border-[#eee8dd] bg-white p-2.5 shadow-sm sm:flex sm:min-h-[148px] sm:w-[calc((100%-2rem)/3)] sm:gap-3 sm:p-4"
          >
            <div className="sm:hidden">
              <div className="flex items-center justify-center gap-2">
                <Image src={review.image} alt={review.name} width={40} height={40} className="size-10 shrink-0 rounded-full object-cover" />
                <div className="flex gap-0.5 text-[#f4a30b]" aria-label="Five stars">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={11} className="fill-current" aria-hidden="true" />)}
                </div>
              </div>
              <p className="mt-1.5 line-clamp-3 text-center text-[10px] leading-[1.3] text-[#536359]">&ldquo;{review.quote}&rdquo;</p>
              <p className="mt-2 text-center text-[10px] font-extrabold leading-tight text-[#173b2d]">{review.name}</p>
              <p className="mt-0.5 text-center text-[9px] font-medium text-[#6a746d]">{review.city}</p>
            </div>

            <div className="hidden min-h-0 flex-1 items-start gap-3 text-left sm:flex">
              <Image src={review.image} alt={review.name} width={52} height={52} className="size-12 shrink-0 rounded-full object-cover" />
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex gap-0.5 text-[#f4a30b]" aria-label="Five stars">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={13} className="fill-current" aria-hidden="true" />)}
                </div>
                <p className="mt-1.5 line-clamp-4 text-[11px] leading-[1.35] text-[#536359] xl:text-[12px]">&ldquo;{review.quote}&rdquo;</p>
                <p className="mt-auto pt-2 text-[11px] font-extrabold leading-tight text-[#173b2d] xl:text-[12px]">{review.name}</p>
                <p className="mt-0 text-[10px] font-medium text-[#6a746d]">{review.city}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => move(-1)}
        className="absolute -left-4 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#d5cbbd] bg-[#fffdf8] text-[#173b2d] shadow-sm transition-colors hover:bg-[#173b2d] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173b2d] sm:left-7 sm:size-10"
        aria-label="Show previous testimonials"
      >
        <ChevronLeft size={17} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        className="absolute -right-4 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#d5cbbd] bg-[#fffdf8] text-[#173b2d] shadow-sm transition-colors hover:bg-[#173b2d] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173b2d] sm:right-7 sm:size-10"
        aria-label="Show next testimonials"
      >
        <ChevronRight size={17} aria-hidden="true" />
      </button>
    </div>
  );
}
