import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-surface rounded-2xl border border-soft-border p-8 sm:p-12 shadow-subtle space-y-5">
        <div className="w-16 h-16 rounded-full bg-base border border-soft-border flex items-center justify-center mx-auto text-warm-gray">
          <UtensilsCrossed className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block mb-1">
            404 Error
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
            Course Not Found
          </h1>
          <p className="text-xs sm:text-sm text-warm-gray font-light mt-2 leading-relaxed">
            The page or culinary selection you are looking for has been moved or does not exist in our menu.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
          >
            <span>Return to Hearth</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-soft-border bg-base hover:bg-stone-200 text-xs font-semibold tracking-wider uppercase text-charcoal transition-all"
          >
            <span>Browse Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
