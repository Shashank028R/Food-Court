import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, User, ShieldCheck } from 'lucide-react';
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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-base/95 backdrop-blur-md shadow-subtle border-b border-soft-border py-3.5'
          : 'bg-base border-b border-soft-border/60 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo / Wordmark */}
        <Link to="/" className="flex items-center gap-3 group">
          {siteSettings.logoUrl ? (
            <img
              src={siteSettings.logoUrl}
              alt={siteSettings.siteName}
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-charcoal group-hover:text-terracotta transition-colors">
                {siteSettings.siteName || 'Food Court'}
              </span>
            </div>
          )}
        </Link>

        {/* Center: Desktop Navigation */}
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

        {/* Right: Actions (Cart, Account, Admin, Mobile Toggle) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Admin shortcut if logged in as admin */}
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

          {/* User Account / Login */}
          {user ? (
            <Link
              to="/account"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-soft-border bg-surface hover:border-terracotta/40 transition-colors text-xs font-medium text-charcoal"
            >
              <div className="w-5 h-5 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center font-semibold text-[10px]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-soft-border bg-surface hover:border-terracotta/40 transition-colors text-xs font-medium text-charcoal"
            >
              <User className="w-3.5 h-3.5 text-warm-gray" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-lg bg-surface border border-soft-border hover:border-terracotta text-charcoal hover:text-terracotta transition-all duration-200"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-terracotta text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-charcoal hover:bg-surface border border-soft-border"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-soft-border bg-surface px-4 pt-4 pb-6 mt-3 space-y-3 animate-slide-down">
          <Link
            to="/"
            className="block py-2 text-base font-medium text-charcoal hover:text-terracotta"
          >
            Home
          </Link>
          <Link
            to="/menu"
            className="block py-2 text-base font-medium text-charcoal hover:text-terracotta"
          >
            Full Menu
          </Link>
          <a
            href="/#specials"
            className="block py-2 text-base font-medium text-charcoal hover:text-terracotta"
          >
            Chef's Specials
          </a>
          <a
            href="/#about"
            className="block py-2 text-base font-medium text-charcoal hover:text-terracotta"
          >
            Our Story
          </a>

          <div className="pt-4 border-t border-soft-border flex flex-col gap-2">
            {user ? (
              <Link
                to="/account"
                className="flex items-center justify-between py-2 text-sm font-medium text-charcoal"
              >
                <span>My Account ({user.name})</span>
                <User className="w-4 h-4 text-warm-gray" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-between py-2 text-sm font-medium text-terracotta"
              >
                <span>Sign In / Create Account</span>
                <User className="w-4 h-4" />
              </Link>
            )}

            <Link
              to="/admin"
              className="flex items-center justify-between py-2 text-sm font-medium text-warm-gray hover:text-charcoal"
            >
              <span>Restaurant Management (Admin)</span>
              <ShieldCheck className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
