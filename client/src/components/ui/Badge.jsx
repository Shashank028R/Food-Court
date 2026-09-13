import React from 'react';
import { Sparkles, Flame } from 'lucide-react';

export const SpecialBadge = ({ className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/15 text-[#927415] border border-gold/30 tracking-wide ${className}`}
  >
    <Sparkles className="w-3 h-3 text-gold" />
    <span>Chef's Special</span>
  </span>
);

export const PopularBadge = ({ className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-terracotta/10 text-terracotta border border-terracotta/20 tracking-wide ${className}`}
  >
    <span>★ Most Popular</span>
  </span>
);

export const VegIndicator = ({ isVeg, className = '' }) => (
  <div
    className={`inline-flex items-center justify-center w-4 h-4 border rounded-sm p-[2px] ${
      isVeg ? 'border-olive' : 'border-red-700'
    } ${className}`}
    title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
  >
    <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-olive' : 'bg-red-700'}`} />
  </div>
);

export const SpiceBadge = ({ level, className = '' }) => {
  if (!level || level === 'NONE') return null;

  const count = level === 'MILD' ? 1 : level === 'MEDIUM' ? 2 : 3;

  return (
    <div
      className={`inline-flex items-center gap-0.5 text-xs text-terracotta/80 font-medium ${className}`}
      title={`Spice Level: ${level}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Flame key={i} className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
      ))}
      <span className="text-[10px] ml-0.5 uppercase tracking-wider font-semibold">
        {level.toLowerCase()}
      </span>
    </div>
  );
};
