import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/site/Header';
import { Footer } from './components/site/Footer';
import { CartDrawer } from './components/site/CartDrawer';
import { CheckoutModal } from './components/site/CheckoutModal';
import { OpeningIntro } from './components/ui/OpeningIntro';

import { LandingPage } from './pages/LandingPage';
import { MenuPage } from './pages/MenuPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';
import { api } from './lib/api';

// Scroll to top upon navigating
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const AppContent = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    api.getSettings()
      .then((data) => setSiteSettings(data))
      .catch((err) => console.error('Failed to load global site settings:', err));
  }, []);

  const handleReplayIntro = () => {
    sessionStorage.removeItem('food_court_intro_seen');
    setShowIntro(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-base text-charcoal">
      {/* Editorial Opening Cinema Animation */}
      {showIntro && <OpeningIntro onComplete={() => setShowIntro(false)} />}

      <ScrollToTop />
      <Header />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage settings={siteSettings} />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <CartDrawer />
      <CheckoutModal />
      <Footer settings={siteSettings} onReplayIntro={handleReplayIntro} />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
