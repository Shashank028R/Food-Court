import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Sparkles } from 'lucide-react';

export const Footer = ({ settings, onReplayIntro }) => {
  const siteName = settings?.siteName || 'Food Court';

  return (
    <footer className="bg-charcoal text-base/90 pt-16 pb-12 border-t border-charcoal/80 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="font-serif text-3xl font-medium tracking-tight text-white">
              {siteName}
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              {settings?.tagline ||
                'An epicurean sanctuary dedicated to wood-fired recipes, seasonal ingredients, and timeless hospitality.'}
            </p>
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="inline-flex items-center gap-1.5 text-xs text-gold/80 hover:text-gold transition-colors pt-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Replay Opening Cinema</span>
              </button>
            )}
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-gold font-semibold">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300 font-light">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition-colors">
                  Artisanal Full Menu
                </Link>
              </li>
              <li>
                <a href="/#specials" className="hover:text-white transition-colors">
                  Chef's Daily Specials
                </a>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Customer Account & Orders
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-gold transition-colors">
                  Restaurant Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours & Service */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-gold font-semibold">
              Dining Hours
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 font-light">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Monday — Sunday</p>
                  <p className="text-stone-400">{settings?.openingHours || '11:00 AM — 11:00 PM'}</p>
                </div>
              </div>
              <p className="text-stone-400 text-xs mt-2">
                Late night tasting menu and cellar pairings available on Friday & Saturday.
              </p>
            </div>
          </div>

          {/* Col 4: Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-gold font-semibold">
              Location & Contact
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-300 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{settings?.contactAddress || '440 Heritage Promenade, Suite 100'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{settings?.contactPhone || '+1 (555) 349-2810'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{settings?.contactEmail || 'concierge@foodcourt.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-light">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Michelin Editorial Inspired Architecture</span>
            <span>•</span>
            <span>Crafted with Pride</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
