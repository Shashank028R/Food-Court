import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const CategoryTile = ({ category }) => {
  return (
    <Link
      to={`/menu?category=${category.slug}`}
      className="group relative block rounded-xl overflow-hidden aspect-[4/3] bg-charcoal border border-soft-border/80 shadow-subtle hover:shadow-lifted transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Background Image */}
      <img
        src={category.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'}
        alt={category.name}
        loading="lazy"
        className="w-full h-full object-cover object-center filter brightness-[0.65] transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end text-left z-10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-gold block mb-1">
              Category
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight leading-snug group-hover:text-gold transition-colors">
              {category.name}
            </h3>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white group-hover:bg-gold group-hover:text-charcoal transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {category.description && (
          <p className="text-xs text-white/70 font-light mt-1.5 line-clamp-1">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
};
