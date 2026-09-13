import React, { useState, useEffect } from 'react';
import { Sparkles, UtensilsCrossed } from 'lucide-react';

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
    }, 600);

    const t2 = setTimeout(() => {
      setPhase('exit');
    }, 2800);

    const t3 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('food_court_intro_seen', 'true');
      onComplete?.();
    }, 3600);

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
    }, 500);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1917] text-[#FBF9F6] transition-all duration-1000 ease-out overflow-hidden ${
        phase === 'exit' ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(179,73,43,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* Culinary Crest & Typography */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 max-w-xl transition-all duration-1000 transform ${
          phase === 'enter'
            ? 'opacity-0 translate-y-8 scale-95'
            : phase === 'revealed'
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-6 scale-105'
        }`}
      >
        {/* Emblem */}
        <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mb-6 bg-charcoal/80 shadow-2xl relative">
          <UtensilsCrossed className="w-7 h-7 text-gold animate-pulse-subtle" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-gold animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Brand Title */}
        <span className="text-xs uppercase tracking-[0.35em] text-gold/90 font-medium mb-3">
          Culinary Excellence Since 2026
        </span>
        <h1 className="font-serif text-5xl sm:text-7xl font-normal tracking-tight text-base mb-4">
          Food Court
        </h1>

        {/* Dividing Hairline */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent mb-5" />

        {/* Tagline */}
        <p className="font-sans text-sm sm:text-base text-stone-300 font-light tracking-wide max-w-md mb-8">
          An epicurean sanctuary of wood-fired craftsmanship and artisanal dining.
        </p>

        {/* Enter Button */}
        <button
          onClick={handleSkip}
          className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-medium tracking-widest uppercase transition-all duration-300 hover:scale-105"
        >
          <span>Enter Experience</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Subtle bottom skip note */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 text-stone-400/60 hover:text-stone-300 text-xs tracking-wider uppercase transition-colors"
      >
        Skip Intro
      </button>
    </div>
  );
};
