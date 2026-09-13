import React, { useState, useEffect } from 'react';
import { Sparkles, UtensilsCrossed, ArrowRight } from 'lucide-react';

export const OpeningIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('enter'); // 'enter' | 'revealed' | 'exit'
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if user already saw intro during this session
    const hasSeenIntro = sessionStorage.getItem('food_court_intro_seen');
    if (hasSeenIntro) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const t1 = setTimeout(() => {
      setPhase('revealed');
    }, 500);

    const t2 = setTimeout(() => {
      setPhase('exit');
    }, 2900);

    const t3 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('food_court_intro_seen', 'true');
      onComplete?.();
    }, 3700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setPhase('exit');
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('food_court_intro_seen', 'true');
      onComplete?.();
    }, 450);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1917] text-[#FBF9F6] transition-all duration-1000 ease-out overflow-hidden px-4 ${
        phase === 'exit' ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(179,73,43,0.22)_0%,transparent_75%)] pointer-events-none" />

      {/* Culinary Crest & Typography */}
      <div
        className={`relative z-10 flex flex-col items-center text-center max-w-lg w-full transition-all duration-1000 transform ${
          phase === 'enter'
            ? 'opacity-0 translate-y-6 scale-95'
            : phase === 'revealed'
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-4 scale-105'
        }`}
      >
        {/* Emblem */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-gold/40 flex items-center justify-center mb-5 sm:mb-6 bg-charcoal/90 shadow-2xl relative">
          <UtensilsCrossed className="w-6 h-6 sm:w-7 sm:h-7 text-gold animate-pulse-subtle" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Brand Pre-title */}
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-gold/90 font-medium mb-2.5 sm:mb-3">
          Culinary Excellence Since 2026
        </span>

        {/* Brand Headline - scales gracefully on 320px up to desktop */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-base mb-3 sm:mb-4">
          Food Court
        </h1>

        {/* Dividing Hairline */}
        <div className="w-20 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent mb-4 sm:mb-5" />

        {/* Tagline */}
        <p className="font-sans text-xs sm:text-sm md:text-base text-stone-300 font-light tracking-wide max-w-xs sm:max-w-md mb-6 sm:mb-8 leading-relaxed">
          An epicurean sanctuary of wood-fired craftsmanship and artisanal dining.
        </p>

        {/* Enter Button - minimum 44px height for mobile touch ergonomics */}
        <button
          onClick={handleSkip}
          className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full border border-gold/40 bg-gold/15 active:bg-gold/30 hover:bg-gold/25 text-gold text-xs font-semibold tracking-widest uppercase transition-all duration-200 active:scale-95 shadow-lifted"
        >
          <span>Enter Experience</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Touch-friendly Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-6 sm:bottom-8 py-2 px-4 text-stone-400/70 active:text-white hover:text-stone-300 text-xs tracking-wider uppercase transition-colors"
      >
        Skip Intro
      </button>
    </div>
  );
};
