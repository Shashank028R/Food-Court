import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, User, ShieldCheck, Home, Utensils, Sparkles, BookOpen } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export const Header = () => {
  const [siteSettings, setSiteSettings] = useState({ siteName: 'Food Court', logoUrl: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    api.getSettings()
      .then((data) => setSiteSettings(data))
      .catch((err) => console.error('Failed to load settings in header:', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change & restore scroll
  useEffect(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, [location]);

  // Lock body scroll when mobile menu is active
  const toggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      setMobileMenuOpen(true);
    } else {
      document.body.style.overflow = '';
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${
          scrolled
            ? 'bg-base/95 backdrop-blur-md shadow-subtle border-b border-soft-border py-2.5 sm:py-3.5'
            : 'bg-base border-b border-soft-border/60 py-3 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Logo / Wordmark */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            {siteSettings.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings.siteName}
                className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <span className="font-serif text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-charcoal group-hover:text-terracotta transition-colors">
                {siteSettings.siteName || 'Food Court'}
              </span>
            )}
          </Link>

          {/* Center: Desktop Navigation (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-terracotta ${
                location.pathname === '/' ? 'text-terracotta font-semibold' : 'text-charcoal/80'
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`text-sm font-medium transition-colors hover:text-terracotta ${
                location.pathname === '/menu' ? 'text-terracotta font-semibold' : 'text-charcoal/80'
              }`}
            >
              Full Menu
            </Link>
            <a
              href="/#specials"
              className="text-sm font-medium text-charcoal/80 hover:text-terracotta transition-colors"
            >
              Chef's Specials
            </a>
            <a
              href="/#about"
              className="text-sm font-medium text-charcoal/80 hover:text-terracotta transition-colors"
            >
              Our Story
            </a>
          </nav>

          {/* Right: Actions (Cart, Account, Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin shortcut on desktop */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-charcoal text-base hover:bg-charcoal/90 transition-all shadow-sm"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Account / Login Button */}
            {user ? (
              <Link
                to="/account"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-soft-border bg-surface hover:border-terracotta/40 transition-colors text-xs font-medium text-charcoal"
                title="My Account"
              >
                <div className="w-5 h-5 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center font-semibold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-soft-border bg-surface hover:border-terracotta/40 transition-colors text-xs font-medium text-charcoal"
              >
                <User className="w-3.5 h-3.5 text-warm-gray" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Cart Trigger Button - Enhanced for Touch */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg bg-surface border border-soft-border hover:border-terracotta text-charcoal hover:text-terracotta active:scale-95 transition-all duration-150 min-h-[42px] min-w-[42px] flex items-center justify-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-white font-bold text-[10px] sm:text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle (Min 42px touch target) */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2.5 rounded-lg text-charcoal hover:bg-surface active:bg-surface border border-soft-border min-h-[42px] min-w-[42px] flex items-center justify-center transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
            onClick={toggleMobileMenu}
          />

          {/* Slide-Down Navigation Content */}
          <div className="relative z-50 bg-surface border-b border-soft-border px-5 pt-4 pb-8 space-y-4 shadow-elevated animate-slide-down">
            <div className="flex items-center justify-between pb-3 border-b border-soft-border">
              <span className="font-serif text-lg font-medium text-charcoal">
                {siteSettings.siteName} Navigation
              </span>
              <button
                onClick={toggleMobileMenu}
                className="p-1.5 rounded-lg text-warm-gray hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1 text-sm font-medium">
              <Link
                to="/"
                className={`flex items-center gap-3 py-3 px-3 rounded-xl transition-colors ${
                  location.pathname === '/'
                    ? 'bg-terracotta/10 text-terracotta font-semibold'
                    : 'text-charcoal hover:bg-base'
                }`}
              >
                <Home className="w-4 h-4 text-warm-gray" />
                <span>Home</span>
              </Link>
              <Link
                to="/menu"
                className={`flex items-center gap-3 py-3 px-3 rounded-xl transition-colors ${
                  location.pathname === '/menu'
                    ? 'bg-terracotta/10 text-terracotta font-semibold'
                    : 'text-charcoal hover:bg-base'
                }`}
              >
                <Utensils className="w-4 h-4 text-warm-gray" />
                <span>Full Artisanal Menu</span>
              </Link>
              <a
                href="/#specials"
                onClick={toggleMobileMenu}
                className="flex items-center gap-3 py-3 px-3 rounded-xl text-charcoal hover:bg-base transition-colors"
              >
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Chef's Specials</span>
              </a>
              <a
                href="/#about"
                onClick={toggleMobileMenu}
                className="flex items-center gap-3 py-3 px-3 rounded-xl text-charcoal hover:bg-base transition-colors"
              >
                <BookOpen className="w-4 h-4 text-warm-gray" />
                <span>Our Story</span>
              </a>
            </nav>

            <div className="pt-3 border-t border-soft-border space-y-2">
              {user ? (
                <Link
                  to="/account"
                  className="flex items-center justify-between py-3 px-3 rounded-xl bg-base text-sm font-medium text-charcoal"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-warm-gray" />
                    <span>My Account ({user.name})</span>
                  </div>
                  <span className="text-xs text-olive font-semibold">Active</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-terracotta text-white text-xs font-semibold tracking-wider uppercase shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                </Link>
              )}

              <Link
                to="/admin"
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-medium text-warm-gray hover:text-charcoal"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>Restaurant Management (Admin)</span>
                </div>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
