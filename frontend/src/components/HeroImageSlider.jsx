import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage from '../assets/hero.png';

const defaultSlides = [
  {
    id: 'milk-and-honey',
    src: heroImage,
    alt: 'Milk and Honey book on a wooden table',
    caption: 'Poetry, reflection, and quiet reading moments.',
  },
  {
    id: 'open-book',
    src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1200',
    alt: 'Open book beside coffee on a table',
    caption: 'Find your next shared read with immersive recommendations.',
  },
  {
    id: 'stacked-books',
    src: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=1200',
    alt: 'Stack of books in a cozy reading space',
    caption: 'Move from solo reading to meaningful book club discussion.',
  },
  {
    id: 'night-reading',
    src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200',
    alt: 'Reader holding a book in a softly lit room',
    caption: 'Track progress, discover highlights, and grow together.',
  },
];

const clampInterval = (value) => Math.min(Math.max(value, 3000), 5000);

const HeroImageSlider = ({ images = defaultSlides, interval = 4000, className = '' }) => {
  const slides = useMemo(() => (images.length ? images : defaultSlides), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = (index) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length <= 1 || isPaused) {
      return undefined;
    }

    const timer = window.setInterval(goToNext, clampInterval(interval));
    return () => window.clearInterval(timer);
  }, [activeIndex, interval, isPaused, slides.length]);

  return (
    <div
      className={`group relative mx-auto w-full max-w-[34rem] ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-[#1f3b26] bg-[#06110a] shadow-[0_30px_90px_rgba(0,0,0,0.4)]">
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#020617]/85 via-transparent to-[#dcfce7]/5" />

        <div className="relative aspect-[4/5] w-full">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <img
                key={slide.id ?? slide.src}
                src={slide.src}
                alt={slide.alt}
                loading={isActive ? 'eager' : 'lazy'}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                  isActive
                    ? 'scale-105 opacity-100'
                    : 'scale-[1.02] opacity-0'
                }`}
              />
            );
          })}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6">
          <div className="rounded-2xl border border-white/10 bg-[#06110a]/72 p-4 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4ade80]">
              ReadTogether Spotlight
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#dcfce7]">
              {slides[activeIndex]?.caption}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#06110a]/75 text-[#dcfce7] backdrop-blur transition-all hover:border-[#4ade80]/60 hover:text-white"
          aria-label="Previous hero image"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={goToNext}
          className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#06110a]/75 text-[#dcfce7] backdrop-blur transition-all hover:border-[#4ade80]/60 hover:text-white"
          aria-label="Next hero image"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={slide.id ?? `${slide.src}-dot`}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isActive ? 'w-8 bg-[#4ade80]' : 'w-2.5 bg-[#1f3b26] hover:bg-[#86efac]'
              }`}
            />
          );
        })}
      </div>

      <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-[#dcfce7]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-52 w-52 rounded-full bg-[#22c55e]/15 blur-3xl" />
    </div>
  );
};

export default HeroImageSlider;
