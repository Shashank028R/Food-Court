import React from 'react';
import { Plus, Check } from 'lucide-react';
import { SpecialBadge, PopularBadge, VegIndicator, SpiceBadge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const FoodCard = ({ item, onSelect }) => {
  const { addToCart, items } = useCart();
  const { showToast } = useToast();

  const cartItem = items.find((i) => i._id === item._id);
  const inCartCount = cartItem?.quantity || 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(item, 1);
    showToast(`Added "${item.name}" to your order`, 'success');
  };

  return (
    <article
      onClick={() => onSelect?.(item)}
      className="group relative bg-surface rounded-xl border border-soft-border overflow-hidden transition-all duration-200 hover:shadow-lifted hover:border-soft-border/80 active:scale-[0.99] flex flex-col cursor-pointer text-left select-none"
    >
      {/* Food Photo Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {item.isTodaysSpecial && <SpecialBadge />}
          {item.isPopular && !item.isTodaysSpecial && <PopularBadge />}
        </div>

        {/* Veg Indicator Badge */}
        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm p-1 rounded shadow-sm z-10">
          <VegIndicator isVeg={item.isVeg} />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Header Row: Category & Spice */}
          <div className="flex items-center justify-between mb-1 gap-2">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-warm-gray truncate">
              {item.category?.name || 'Specialty'}
            </span>
            <SpiceBadge level={item.spiceLevel} />
          </div>

          {/* Dish Title */}
          <h3 className="font-serif text-base sm:text-xl font-medium text-charcoal leading-snug group-hover:text-terracotta transition-colors line-clamp-1 mb-1.5">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-warm-gray line-clamp-2 leading-relaxed mb-3 sm:mb-4 font-light">
            {item.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2.5 sm:pt-3 border-t border-soft-border/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs text-warm-gray block font-light">Price</span>
            <span className="font-serif text-base sm:text-lg font-bold text-terracotta">
              ${item.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 min-h-[38px] active:scale-95 ${
              inCartCount > 0
                ? 'bg-olive text-white shadow-sm'
                : 'bg-terracotta text-white hover:bg-terracotta-hover shadow-sm'
            }`}
            aria-label={`Add ${item.name} to order`}
          >
            {inCartCount > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{inCartCount} in Order</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
