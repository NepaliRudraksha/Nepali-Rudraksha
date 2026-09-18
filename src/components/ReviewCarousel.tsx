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
    const atStart = carousel.scrollLeft <= 1;
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1;

    if ((direction === 1 && atEnd) || (direction === -1 && atStart)) {
      carousel.scrollTo({ left: direction === 1 ? 0 : carousel.scrollWidth, behavior: 'smooth' });
      return;
    }

    carousel.scrollBy({ left: amount * direction, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => move(1), 6500);
    return () => window.clearInterval(interval);
  }, [move]);

  return (
    <div className="group relative mt-6 overflow-visible">
      <div
        ref={carouselRef}
        className="mx-0 flex snap-x snap-mandatory gap-2 overflow-x-auto sm:mx-12 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Customer testimonials"
      >
        {reviews.map((review) => (
          <article
            key={`${review.name}-${review.city}`}
            data-review-card
            className="flex min-h-[140px] w-[calc((100%-0.5rem)/2)] shrink-0 snap-start flex-col gap-1.5 rounded-lg border border-[#eee8dd] bg-white p-2.5 shadow-sm sm:min-h-[148px] sm:w-[calc((100%-2rem)/3)] sm:flex-row sm:gap-3 sm:p-4"
          >
            <div className="flex items-center justify-center gap-2 sm:contents sm:justify-start sm:gap-2.5">
              <Image src={review.image} alt={review.name} width={52} height={52} className="size-9 shrink-0 rounded-full object-cover sm:size-12" />
              <div className="flex gap-0.5 text-[#f4a30b] sm:hidden" aria-label="Five stars">
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={11} className="fill-current" aria-hidden="true" />)}
              </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex gap-0.5 text-[#f4a30b]" aria-label="Five stars">
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={13} className="hidden fill-current sm:block" aria-hidden="true" />)}
              </div>
              <p className="mt-1 line-clamp-3 text-[10px] leading-[1.28] text-[#536359] sm:mt-1.5 sm:line-clamp-4 sm:text-[11px] sm:leading-[1.35] xl:text-[12px]">&ldquo;{review.quote}&rdquo;</p>
              <p className="mt-2 text-[10px] font-extrabold leading-tight text-[#173b2d] sm:mt-auto sm:pt-2 sm:text-[11px] xl:text-[12px]">{review.name}</p>
              <p className="mt-0.5 text-[9px] font-medium text-[#6a746d] sm:mt-0 sm:text-[10px]">{review.city}</p>
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
