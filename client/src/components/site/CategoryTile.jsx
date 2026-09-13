import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const CategoryTile = ({ category }) => {
  return (
    <Link
      to={`/menu?category=${category.slug}`}
      className="group relative block rounded-xl overflow-hidden aspect-[4/3] bg-charcoal border border-soft-border/80 shadow-subtle hover:shadow-lifted active:scale-[0.98] transition-all duration-200"
    >
      {/* Background Image */}
      <img
        src={category.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'}
        alt={category.name}
        loading="lazy"
        className="w-full h-full object-cover object-center filter brightness-[0.62] transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/45 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-3.5 sm:p-5 flex flex-col justify-end text-left z-10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold text-gold block mb-0.5 sm:mb-1">
              Course
            </span>
            <h3 className="font-serif text-base sm:text-xl md:text-2xl font-medium text-white tracking-tight leading-snug group-hover:text-gold transition-colors">
              {category.name}
            </h3>
          </div>

          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white group-hover:bg-gold group-hover:text-charcoal transition-colors flex-shrink-0 ml-2">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        {category.description && (
          <p className="text-[11px] sm:text-xs text-white/70 font-light mt-1 line-clamp-1 hidden sm:block">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
};
