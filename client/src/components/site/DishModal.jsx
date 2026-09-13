import React, { useState } from 'react';
import { X, Plus, Minus, Clock, Flame, Sparkles } from 'lucide-react';
import { VegIndicator, SpiceBadge, SpecialBadge, PopularBadge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const DishModal = ({ item, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!item) return null;

  const handleAddToCart = () => {
    addToCart(item, quantity);
    showToast(`Added ${quantity} × "${item.name}" to your order`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog: Full-width bottom sheet on mobile, centered modal on desktop */}
      <div className="relative bg-surface rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden shadow-elevated border-t sm:border border-soft-border z-10 animate-slide-up sm:animate-scale-in text-left flex flex-col">
        {/* Mobile Pull Bar Indicator */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-soft-border" />
        </div>

        {/* Close Button - 40x40 touch target */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-charcoal/70 active:bg-charcoal text-white flex items-center justify-center backdrop-blur-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Image */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-stone-100 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

            {/* Badges Overlay */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between z-10">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {item.isTodaysSpecial && <SpecialBadge />}
                {item.isPopular && !item.isTodaysSpecial && <PopularBadge />}
              </div>
              <div className="bg-surface/95 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <VegIndicator isVeg={item.isVeg} />
                <span className="text-[11px] font-medium text-charcoal">
                  {item.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
              </div>
            </div>
          </div>

          {/* Content Details */}
          <div className="p-4 sm:p-8 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-terracotta">
                {item.category?.name || 'Artisanal Dish'}
              </span>
              <div className="flex items-center gap-3 text-xs text-warm-gray">
                {item.preparationTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.preparationTime}</span>
                  </div>
                )}
                {item.calories > 0 && <span>{item.calories} kcal</span>}
              </div>
            </div>

            <h2 className="font-serif text-xl sm:text-3xl font-medium text-charcoal leading-snug">
              {item.name}
            </h2>

            <p className="text-xs sm:text-base text-warm-gray leading-relaxed font-light">
              {item.description}
            </p>

            {item.spiceLevel && item.spiceLevel !== 'NONE' && (
              <div className="p-2.5 rounded-lg bg-base border border-soft-border flex items-center gap-2.5">
                <span className="text-xs font-medium text-charcoal">Spice Profile:</span>
                <SpiceBadge level={item.spiceLevel} />
              </div>
            )}
          </div>
        </div>

        {/* Sticky Action Row at bottom - Thumb-friendly ergonomics on mobile */}
        <div className="p-3.5 sm:p-6 border-t border-soft-border bg-surface/95 backdrop-blur-sm flex items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
          {/* Price */}
          <div>
            <span className="text-[10px] sm:text-xs text-warm-gray block">Total Price</span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-terracotta leading-none">
              ${(item.price * quantity).toFixed(2)}
            </span>
          </div>

          {/* Quantity Stepper & Add Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center border border-soft-border rounded-lg bg-base p-0.5">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface active:bg-surface text-charcoal transition-colors disabled:opacity-30"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-semibold text-xs sm:text-sm text-charcoal">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface active:bg-surface text-charcoal transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-terracotta hover:bg-terracotta-hover active:scale-95 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-150 shadow-lifted min-h-[42px]"
            >
              <span>Add to Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
