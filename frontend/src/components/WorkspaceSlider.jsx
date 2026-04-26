import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import BookWorkspaceCard from './BookWorkspaceCard';

const WorkspaceSlider = ({ books, onOpenBook }) => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [books]);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="group relative">
      {/* Header Info */}
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(212,166,58,0.2)] bg-[rgba(212,166,58,0.1)] text-[#f3d58a]">
            <Sparkles size={16} />
          </div>
          <h2 className="text-xl font-bold text-[#fff8eb]">Active Reading Sessions</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(212,166,58,0.14)] bg-[rgba(8,16,32,0.92)] text-[#f3d58a] transition-all hover:border-[rgba(212,166,58,0.3)] disabled:opacity-30 disabled:cursor-not-allowed`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(212,166,58,0.14)] bg-[rgba(8,16,32,0.92)] text-[#f3d58a] transition-all hover:border-[rgba(212,166,58,0.3)] disabled:opacity-30 disabled:cursor-not-allowed`}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div 
        ref={containerRef}
        className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[300px] md:min-w-[360px] flex-shrink-0"
          >
            <BookWorkspaceCard book={book} onOpen={onOpenBook} />
          </motion.div>
        ))}
        
        {/* Placeholder for "Add more" or "Browse all" */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: books.length * 0.1 }}
          className="min-w-[200px] flex-shrink-0 flex items-center justify-center"
        >
          <button className="flex h-full w-full flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-[rgba(212,166,58,0.2)] bg-[rgba(8,16,32,0.4)] p-8 text-[#8e8164] transition-all hover:border-[rgba(212,166,58,0.4)] hover:bg-[rgba(8,16,32,0.6)] hover:text-[#f3d58a]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,166,58,0.14)] bg-[rgba(15,26,46,0.96)]">
              <ChevronRight size={24} />
            </div>
            <span className="text-sm font-semibold">View Library</span>
          </button>
        </motion.div>
      </div>

      {/* Visual Fade effects */}
      <div className={`pointer-events-none absolute bottom-0 left-0 top-0 w-20 bg-gradient-to-r from-[rgba(6,15,31,0.8)] to-transparent transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`pointer-events-none absolute bottom-0 right-0 top-0 w-20 bg-gradient-to-l from-[rgba(6,15,31,0.8)] to-transparent transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default WorkspaceSlider;
