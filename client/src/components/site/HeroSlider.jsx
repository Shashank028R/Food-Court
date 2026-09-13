import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const FALLBACK_HEROES = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1600&auto=format&fit=crop',
];

export const HeroSlider = ({ images = [], tagline, subheadline }) => {
  const heroList = images && images.length > 0 ? images : FALLBACK_HEROES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroList.length);
  }, [heroList.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroList.length) % heroList.length);
  }, [heroList.length]);

  // Auto advance every 5.2s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5200);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) nextSlide();
    if (diff < -45) prevSlide();
  };

  return (
    <section
      className="relative w-full h-[78vh] sm:h-[80vh] min-h-[460px] sm:min-h-[540px] max-h-[720px] overflow-hidden bg-charcoal select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured Food Showcase"
    >
      {/* Background Images Carousel */}
      {heroList.map((imgUrl, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
            } transform transition-transform duration-[6000ms]`}
          >
            <img
              src={imgUrl}
              alt="Culinary specialty showcase"
              className="w-full h-full object-cover object-center filter brightness-[0.58]"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Cinematic dark subtle vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/35 to-charcoal/50" />
          </div>
        );
      })}

      {/* Hero Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-left pb-8 sm:pb-0">
        <div className="max-w-2xl text-white w-full">
          {/* Tagline */}
          <div className="inline-flex items-center gap-1.5 mb-3 sm:mb-4 px-2.5 py-1 rounded-full bg-surface/15 backdrop-blur-sm border border-white/20 text-[10px] sm:text-xs font-semibold text-gold tracking-widest uppercase animate-fade-in">
            <span>Wood-Fired & Artisanal</span>
          </div>

          {/* Headline - fluid responsive sizing */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-normal text-white tracking-tight leading-[1.12] mb-3 sm:mb-5 animate-fade-in-up">
            {tagline || 'An Epicurean Sanctuary of Crafted Delicacies.'}
          </h1>

          {/* Subheadline */}
          <p className="font-sans text-xs sm:text-base text-white/80 font-light leading-relaxed mb-6 sm:mb-8 max-w-xl line-clamp-3 sm:line-clamp-none animate-fade-in-up animate-delay-100">
            {subheadline ||
              'Immerse your palate in timeless recipes, wood-fired traditions, and farm-to-table culinary artistry.'}
          </p>

          {/* CTA Buttons - Mobile full-width / stacked touch targets */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fade-in-up animate-delay-200 w-full sm:w-auto">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-terracotta hover:bg-terracotta-hover active:scale-95 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-lifted transition-all duration-150 min-h-[46px]"
            >
              <span>Explore Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#specials"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 backdrop-blur-sm border border-white/25 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-150 min-h-[46px]"
            >
              Chef's Specials
            </a>
          </div>
        </div>
      </div>

      {/* Prev / Next Controls (Hidden on narrow mobile to avoid obscuring text, available via touch swipe) */}
      <div className="hidden sm:flex absolute inset-y-0 left-4 right-4 z-30 items-center justify-between pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto w-10 h-10 rounded-full bg-charcoal/40 hover:bg-charcoal/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto w-10 h-10 rounded-full bg-charcoal/40 hover:bg-charcoal/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Indicator - Touch-friendly padding */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1">
        {heroList.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full p-1.5 ${
              index === currentIndex ? 'w-7 h-2 bg-gold' : 'w-2 h-2 bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
