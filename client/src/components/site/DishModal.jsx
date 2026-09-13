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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-surface rounded-2xl max-w-2xl w-full overflow-hidden shadow-elevated border border-soft-border z-10 animate-scale-in my-8 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-charcoal/60 hover:bg-charcoal text-white flex items-center justify-center backdrop-blur-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/10] bg-stone-100 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

          {/* Floating Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
            <div className="flex flex-wrap gap-2">
              {item.isTodaysSpecial && <SpecialBadge />}
              {item.isPopular && !item.isTodaysSpecial && <PopularBadge />}
            </div>
            <div className="bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-2 shadow-sm">
              <VegIndicator isVeg={item.isVeg} />
              <span className="text-xs font-medium text-charcoal">
                {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8">
          {/* Header Category & Title */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-terracotta">
              {item.category?.name || 'Artisanal Dish'}
            </span>
            <div className="flex items-center gap-4 text-xs text-warm-gray">
              {item.preparationTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.preparationTime}</span>
                </div>
              )}
              {item.calories > 0 && <span>{item.calories} kcal</span>}
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal leading-snug mb-3">
            {item.name}
          </h2>

          <p className="text-sm sm:text-base text-warm-gray leading-relaxed mb-6 font-light">
            {item.description}
          </p>

          {/* Meta Indicators */}
          {item.spiceLevel && item.spiceLevel !== 'NONE' && (
            <div className="mb-6 p-3 rounded-lg bg-base border border-soft-border flex items-center gap-3">
              <span className="text-xs font-medium text-charcoal">Spice Profile:</span>
              <SpiceBadge level={item.spiceLevel} />
            </div>
          )}

          {/* Action Row */}
          <div className="pt-6 border-t border-soft-border flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Price */}
            <div>
              <span className="text-xs text-warm-gray block">Unit Price</span>
              <span className="font-serif text-2xl font-bold text-terracotta">
                ${(item.price * quantity).toFixed(2)}
              </span>
              {quantity > 1 && (
                <span className="text-xs text-warm-gray ml-2 font-normal">
                  (${item.price.toFixed(2)} each)
                </span>
              )}
            </div>

            {/* Stepper & Add Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center border border-soft-border rounded-lg bg-base p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface text-charcoal transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium text-sm text-charcoal">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface text-charcoal transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-lifted hover:scale-[1.02]"
              >
                <span>Add to Order</span>
                <span>•</span>
                <span>${(item.price * quantity).toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
