import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { VegIndicator } from '../ui/Badge';

export const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    itemCount,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Full width drawer on mobile, bounded on desktop */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-surface shadow-elevated border-l border-soft-border flex flex-col animate-slide-in-right text-left">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-soft-border flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <ShoppingBag className="w-5 h-5 text-terracotta" />
              <h2 className="font-serif text-lg sm:text-xl font-medium text-charcoal">Your Order</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-base text-warm-gray border border-soft-border">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-warm-gray hover:text-charcoal hover:bg-base active:scale-95 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 rounded-full bg-base border border-soft-border flex items-center justify-center mb-3 text-warm-gray/60">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-medium text-charcoal mb-1">Your order is empty</h3>
                <p className="text-xs text-warm-gray max-w-xs mb-6 font-light">
                  Explore our artisanal dishes and add your favorites to start your dining experience.
                </p>
                <Link
                  to="/menu"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-hover active:scale-95 text-white text-xs font-semibold tracking-wide shadow-sm transition-all"
                >
                  <span>Browse Full Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-soft-border/60">
                  <span className="text-[11px] font-medium text-warm-gray uppercase tracking-wider">
                    Dishes Selected
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-warm-gray hover:text-terracotta transition-colors flex items-center gap-1 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                </div>

                <div className="divide-y divide-soft-border/60 space-y-3">
                  {items.map((item) => (
                    <div key={item._id} className="pt-3 flex gap-3">
                      {/* Thumbnail */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                      />

                      {/* Info & Quantity */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <VegIndicator isVeg={item.isVeg} />
                              <h4 className="text-xs sm:text-sm font-medium text-charcoal line-clamp-1">
                                {item.name}
                              </h4>
                            </div>
                            <span className="text-[11px] text-warm-gray">${item.price.toFixed(2)} each</span>
                          </div>

                          <span className="text-xs sm:text-sm font-semibold text-charcoal">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity adjuster */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-soft-border rounded bg-base">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-warm-gray hover:text-charcoal active:bg-surface"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold text-charcoal">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-warm-gray hover:text-charcoal active:bg-surface"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="p-1.5 text-warm-gray/60 hover:text-terracotta active:scale-95 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer Subtotal & Checkout Button */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-soft-border bg-base/60 space-y-3">
              <div className="space-y-1.5 text-xs text-warm-gray">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-charcoal font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Hospitality & Packaging</span>
                  <span className="text-olive font-medium">Complimentary</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-soft-border text-sm font-semibold text-charcoal">
                  <span>Total Due</span>
                  <span className="font-serif text-lg text-terracotta">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-terracotta hover:bg-terracotta-hover active:scale-98 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-lifted transition-all duration-150 min-h-[46px]"
              >
                <span>Proceed to Confirmation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
