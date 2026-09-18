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
      left: direction * (carouselRef.current?.clientWidth ?? 0) * 0.95,
      behavior: 'smooth',
    });
  };

  const goToSlide = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cardWidth = carousel.clientWidth;
    carousel.scrollTo({ left: index * cardWidth * 0.95, behavior: 'smooth' });
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

      const cardWidth = carousel.clientWidth;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const nextScroll = carousel.scrollLeft + cardWidth * 0.95;
      carousel.scrollTo({ left: nextScroll >= maxScroll ? 0 : nextScroll, behavior: 'smooth' });
    }, 5000);
  }, [stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  const visibleCount = reviews.length <= 3 ? 1 : reviews.length <= 6 ? 2 : 3;
  const totalSlides = Math.ceil(reviews.length / visibleCount);

  return (
    <div className="relative">
      <div
        ref={carouselRef}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Customer testimonials"
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        onTouchStart={stopAutoplay}
        onTouchEnd={startAutoplay}
      >
        {reviews.map((review) => (
          <article
            key={review.name}
            className="w-full shrink-0 snap-center md:snap-start bg-white border border-brand-border rounded-2xl p-3.5 md:p-4 hover:shadow-xl transition-all duration-300 
              md:w-[calc((100%-0rem)/1)] lg:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-2rem)/3)]
              flex flex-col"
          >
            <div className="flex items-center gap-1 mb-2" aria-label={`${review.rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} className={star <= review.rating ? 'fill-brand-accent text-brand-accent' : 'text-gray-300'} />
              ))}
            </div>
            <p className="text-brand-text text-sm leading-relaxed mb-3 flex-1">&ldquo;{review.text}&rdquo;</p>
            <div className="border-t border-brand-border pt-2 mt-auto">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-brand-accent/15 flex items-center justify-center text-brand-accent text-xs font-bold flex-shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-brand-primary text-sm">{review.name}</p>
                  <p className="text-xs text-brand-muted">{review.location}</p>
                </div>
              </div>
              <p className="text-[11px] text-brand-muted font-medium">{review.product}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Navigation Indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="w-2 h-2 rounded-full bg-brand-border hover:bg-brand-accent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent"
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows - Desktop only */}
      <button
        type="button"
        onClick={() => move(-1)}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        className="absolute -left-5 top-[42%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white text-brand-primary shadow-lg transition-all hover:border-brand-accent hover:text-brand-accent hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 md:flex"
        aria-label="Show previous testimonials"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        className="absolute -right-5 top-[42%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white text-brand-primary shadow-lg transition-all hover:border-brand-accent hover:text-brand-accent hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 md:flex"
        aria-label="Show next testimonials"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
