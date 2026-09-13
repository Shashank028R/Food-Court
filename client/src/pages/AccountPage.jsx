import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Mail, LogOut, PackageCheck, Clock, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';

export const AccountPage = () => {
  const { user, logout, updateProfile, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setName(user.name || '');
    setPhone(user.phone || '');
    setAddress(user.address || '');

    // Fetch user order history
    api.getMyOrders()
      .then((data) => setOrders(data))
      .catch((err) => console.error('Failed to load orders:', err))
      .finally(() => setLoadingOrders(false));
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({ name, phone, address });
      showToast('Profile and delivery details updated.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('You have been logged out.', 'info');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-10 border-b border-soft-border gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block mb-1">
            Guest Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
            Welcome, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-warm-gray font-light mt-1">
            Manage your saved delivery address and track past dining orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-charcoal text-white text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-soft-border bg-surface hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-medium text-warm-gray transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col: Edit Profile */}
        <div className="lg:col-span-5">
          <div className="bg-surface rounded-2xl border border-soft-border p-6 sm:p-7 shadow-subtle">
            <h2 className="font-serif text-xl font-medium text-charcoal mb-4">Saved Contact Details</h2>
            <p className="text-xs text-warm-gray mb-6 font-light">
              These details will automatically populate your order confirmation for rapid ordering.
            </p>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-stone-100 cursor-not-allowed opacity-75"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Default Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-warm-gray" />
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter street, unit/apt number..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
              >
                {saving ? <span>Saving...</span> : <span>Save Details</span>}
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Order History */}
        <div className="lg:col-span-7">
          <div className="bg-surface rounded-2xl border border-soft-border p-6 sm:p-7 shadow-subtle">
            <h2 className="font-serif text-xl font-medium text-charcoal mb-4">Past Dining Orders</h2>

            {loadingOrders ? (
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="h-28 rounded-xl bg-stone-100 skeleton-shimmer" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-warm-gray space-y-3">
                <PackageCheck className="w-12 h-12 mx-auto text-warm-gray/40" />
                <h3 className="font-serif text-lg text-charcoal">No orders yet</h3>
                <p className="text-xs max-w-xs mx-auto">
                  You haven't placed any dining orders with Food Court yet.
                </p>
                <button
                  onClick={() => navigate('/menu')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-terracotta text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:scale-105 mt-2"
                >
                  Order From Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="p-4 rounded-xl border border-soft-border bg-base/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-charcoal">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[11px] text-warm-gray flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          order.status === 'CONFIRMED' || order.status === 'DELIVERED'
                            ? 'bg-olive/15 text-olive border border-olive/30'
                            : 'bg-gold/15 text-gold border border-gold/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Items snapshot */}
                    <div className="divide-y divide-soft-border/50 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex justify-between text-charcoal">
                          <span>
                            {item.quantity} × {item.name}
                          </span>
                          <span className="font-medium text-warm-gray">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-soft-border/70 flex justify-between items-center text-xs">
                      <span className="text-warm-gray">Delivery: {order.deliveryAddress}</span>
                      <span className="font-serif text-sm font-bold text-terracotta">
                        Total: ${order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
