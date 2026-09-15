'use client';

import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

type Review = {
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
};

export default function TestimonialCarousel({ reviews }: { reviews: Review[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const move = (direction: 1 | -1) => {
    carouselRef.current?.scrollBy({
      left: direction * (carouselRef.current.clientWidth * 0.9),
      behavior: 'smooth',
    });
  };

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const isAtEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 8;
      carousel.scrollTo({ left: isAtEnd ? 0 : carousel.scrollLeft + carousel.clientWidth * 0.9, behavior: 'smooth' });
    }, 4500);
  }, [stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  return (
    <div className="flex items-center gap-2 md:gap-4 relative group">
      <button
        type="button"
        onClick={() => move(-1)}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        className="flex-shrink-0 z-10 flex items-center justify-center rounded-full border border-brand-border bg-white p-2 md:p-2.5 text-brand-primary shadow-md transition-colors hover:border-brand-accent hover:text-brand-accent"
        aria-label="Show previous testimonials"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={carouselRef}
        className="flex-1 flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Customer testimonials"
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        onTouchStart={stopAutoplay}
        onTouchEnd={startAutoplay}
      >
        {reviews.map((review) => (
          <article
            key={review.name}
            className="w-full shrink-0 snap-center md:snap-start bg-white border border-brand-border rounded-xl p-6 hover:shadow-lg transition-all md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <div className="flex items-center mb-4" aria-label={`${review.rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} className={star <= review.rating ? 'fill-brand-accent text-brand-accent' : 'text-gray-300'} />
              ))}
            </div>
            <p className="text-brand-text text-sm italic mb-4">&ldquo;{review.text}&rdquo;</p>
            <div className="border-t border-brand-border pt-4">
              <p className="font-bold text-brand-primary text-sm">{review.name}</p>
              <p className="text-xs text-brand-muted">{review.location} · Purchased: {review.product}</p>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => move(1)}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        className="flex-shrink-0 z-10 flex items-center justify-center rounded-full border border-brand-border bg-white p-2 md:p-2.5 text-brand-primary shadow-md transition-colors hover:border-brand-accent hover:text-brand-accent"
        aria-label="Show next testimonials"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
