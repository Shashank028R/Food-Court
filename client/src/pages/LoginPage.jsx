import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Utensils, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password });
      showToast(`Welcome back, ${res.user.name}!`, 'success');

      if (res.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (redirect === 'checkout') {
        navigate('/menu');
      } else {
        navigate('/account');
      }
    } catch (err) {
      console.error('Login failure:', err);
      setErrorMessage(err.message || 'Invalid email or password.');
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@foodcourt.com');
      setPassword('Admin@12345');
    } else {
      setEmail('alexander@example.com');
      setPassword('Customer@123');
    }
  };

  return (
    <div className="min-h-[75vh] sm:min-h-[80vh] flex items-center justify-center px-4 py-8 sm:py-12 text-left">
      <div className="max-w-md w-full bg-surface rounded-2xl border border-soft-border p-5 sm:p-10 shadow-lifted animate-scale-in">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-terracotta font-semibold block mb-1">
            Sign In
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-warm-gray mt-1 font-light">
            Access your orders, saved delivery addresses, or administrative portal.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 sm:mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-xs font-medium text-charcoal mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-soft-border text-base sm:text-sm text-charcoal bg-base/40 focus:bg-white focus:border-terracotta transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-charcoal">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-soft-border text-base sm:text-sm text-charcoal bg-base/40 focus:bg-white focus:border-terracotta transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-terracotta hover:bg-terracotta-hover active:scale-98 text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm mt-1 disabled:bg-stone-400 min-h-[46px]"
          >
            {loading ? <span>Signing In...</span> : <span>Sign In</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Fill Shortcut */}
        <div className="mt-6 pt-5 border-t border-soft-border">
          <span className="text-[11px] uppercase tracking-wider text-warm-gray font-semibold block mb-2.5 text-center">
            One-Click Test Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="px-3 py-2 rounded-lg border border-soft-border bg-base hover:border-gold active:scale-95 text-xs font-medium text-charcoal flex items-center justify-center gap-1.5 transition-all min-h-[40px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('customer')}
              className="px-3 py-2 rounded-lg border border-soft-border bg-base hover:border-terracotta active:scale-95 text-xs font-medium text-charcoal flex items-center justify-center transition-all min-h-[40px]"
            >
              Customer Demo
            </button>
          </div>
        </div>

        {/* Signup Redirect */}
        <div className="mt-6 text-center text-xs text-warm-gray">
          <span>Don't have an account yet? </span>
          <Link to="/signup" className="text-terracotta font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
