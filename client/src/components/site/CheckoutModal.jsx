import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldAlert, ArrowRight, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Pre-fill user profile info if logged in
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setPhone(user.phone || '');
      setDeliveryAddress(user.address || '');
    }
  }, [user]);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in to place your order and track your history.', 'info');
      return;
    }

    if (!phone.trim() || !deliveryAddress.trim()) {
      showToast('Please provide your phone number and delivery address.', 'error');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        items: items.map((i) => ({
          foodItemId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        customerName: customerName || user.name,
        phone,
        deliveryAddress,
        notes,
      };

      const result = await api.createOrder(payload);
      setCompletedOrder(result.order);
      clearCart();

      // Confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B3492B', '#C9A227', '#5B6E3A'],
      });

      showToast('Order confirmed! The kitchen has received your request.', 'success');
    } catch (err) {
      console.error('Order error:', err);
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative bg-surface rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-elevated border border-soft-border z-10 animate-scale-in text-left">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-warm-gray hover:text-charcoal hover:bg-base transition-colors"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Confirmation Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-olive/15 border border-olive/30 flex items-center justify-center mx-auto text-olive">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-olive font-semibold block mb-1">
                Order Confirmed
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal">
                Thank You, {completedOrder.customerName}!
              </h2>
              <p className="text-xs sm:text-sm text-warm-gray mt-1">
                Order reference: <span className="font-mono font-bold text-charcoal">#{completedOrder._id.slice(-6).toUpperCase()}</span>
              </p>
            </div>

            {/* Summary card */}
            <div className="bg-base rounded-xl p-4 border border-soft-border text-left text-xs space-y-2.5">
              <div className="flex justify-between font-medium text-charcoal">
                <span>Total Amount Paid</span>
                <span className="font-serif font-bold text-terracotta text-sm">
                  ${completedOrder.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-warm-gray">
                <span>Delivery Address</span>
                <span className="text-charcoal text-right max-w-[220px] truncate">
                  {completedOrder.deliveryAddress}
                </span>
              </div>
              <div className="flex justify-between text-warm-gray">
                <span>Contact Phone</span>
                <span className="text-charcoal">{completedOrder.phone}</span>
              </div>
              <div className="flex justify-between text-warm-gray">
                <span>Estimated Time</span>
                <span className="text-olive font-semibold">25 - 35 mins</span>
              </div>
            </div>

            <p className="text-xs text-warm-gray font-light">
              Our culinary team is preparing your selection with the finest seasonal ingredients.
            </p>

            <button
              onClick={handleClose}
              className="w-full inline-flex items-center justify-center py-3 px-6 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
            >
              Return to Dining
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block mb-1">
                Final Step
              </span>
              <h2 className="font-serif text-2xl font-medium text-charcoal">Order & Delivery Details</h2>
            </div>

            {!user ? (
              <div className="mb-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-left">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-amber-900">Sign in to complete order</h4>
                    <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                      Signing in allows us to save your address for seamless re-ordering and kitchen updates.
                    </p>
                    <a
                      href="/login?redirect=checkout"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-terracotta hover:underline"
                    >
                      <span>Sign In or Create Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 text-xs text-warm-gray bg-base p-2.5 rounded-lg border border-soft-border flex items-center justify-between">
                <span>
                  Ordering as: <strong className="text-charcoal">{user.name}</strong> ({user.email})
                </span>
                <span className="text-olive font-medium">Verified Account</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-soft-border bg-base/40 text-sm text-charcoal focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 349-2810"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-soft-border bg-base/40 text-sm text-charcoal focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Delivery Address</label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street address, building, apartment/suite number..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-soft-border bg-base/40 text-sm text-charcoal focus:bg-white transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">
                  Kitchen Notes & Dietary Preferences (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra napkins, sauce on the side, ring doorbell..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-soft-border bg-base/40 text-sm text-charcoal focus:bg-white transition-colors"
                />
              </div>

              {/* Order total review */}
              <div className="pt-4 border-t border-soft-border flex items-center justify-between">
                <div>
                  <span className="text-xs text-warm-gray block">Total Amount</span>
                  <span className="font-serif text-xl font-bold text-terracotta">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || !user}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-terracotta hover:bg-terracotta-hover disabled:bg-stone-300 text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-lifted hover:scale-[1.01]"
                >
                  {loading ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
