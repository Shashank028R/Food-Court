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

  // Auto advance every 5s unless paused by mouse hover
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

  // Touch swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
  };

  return (
    <section
      className="relative w-full h-[75vh] min-h-[520px] max-h-[760px] overflow-hidden bg-charcoal select-none"
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
              className="w-full h-full object-cover object-center filter brightness-[0.62]"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Cinematic dark subtle vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-charcoal/50" />
          </div>
        );
      })}

      {/* Hero Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-left">
        <div className="max-w-2xl text-white">
          {/* Subtle Tagline */}
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-surface/15 backdrop-blur-sm border border-white/20 text-xs font-medium text-gold tracking-widest uppercase animate-fade-in">
            <span>Wood-Fired & Artisanal</span>
          </div>

          {/* Headline in Fraunces serif */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.08] mb-5 animate-fade-in-up">
            {tagline || 'An Epicurean Sanctuary of Crafted Delicacies.'}
          </h1>

          {/* Subheadline */}
          <p className="font-sans text-base sm:text-lg text-white/80 font-light leading-relaxed mb-8 max-w-xl animate-fade-in-up animate-delay-100">
            {subheadline ||
              'Immerse your palate in timeless recipes, wood-fired traditions, and farm-to-table culinary artistry.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 animate-fade-in-up animate-delay-200">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-sm font-semibold tracking-wide shadow-lifted transition-all duration-200 hover:scale-[1.02]"
            >
              <span>Explore Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#specials"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white text-sm font-medium tracking-wide transition-all duration-200"
            >
              Chef's Specials
            </a>
          </div>
        </div>
      </div>

      {/* Prev / Next Controls */}
      <div className="absolute inset-y-0 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto w-11 h-11 rounded-full bg-charcoal/40 hover:bg-charcoal/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto w-11 h-11 rounded-full bg-charcoal/40 hover:bg-charcoal/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {heroList.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex ? 'w-8 h-2 bg-gold' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
