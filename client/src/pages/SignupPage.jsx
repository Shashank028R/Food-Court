import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !email || !password) {
      setErrorMessage('Please provide your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await signup({ name, email, password, phone, address });
      showToast(`Welcome to Food Court, ${res.user.name}!`, 'success');
      navigate('/account');
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMessage(err.message || 'Failed to create account.');
      showToast(err.message || 'Signup failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 text-left">
      <div className="max-w-md w-full bg-surface rounded-2xl border border-soft-border p-8 sm:p-10 shadow-lifted animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block mb-1">
            New Guest
          </span>
          <h1 className="font-serif text-3xl font-medium text-charcoal">Create an Account</h1>
          <p className="text-xs sm:text-sm text-warm-gray mt-1 font-light">
            Save your delivery details and view your dining order history.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-charcoal mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white focus:border-terracotta transition-colors"
              />
            </div>
          </div>

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
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white focus:border-terracotta transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1">Password (min. 6 characters)</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white focus:border-terracotta transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white focus:border-terracotta transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1">Default Delivery Address (Optional)</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-warm-gray" />
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, apartment, suite..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white focus:border-terracotta transition-colors resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:scale-[1.01] mt-2 disabled:bg-stone-400"
          >
            {loading ? <span>Creating Account...</span> : <span>Complete Registration</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Login Redirect */}
        <div className="mt-6 text-center text-xs text-warm-gray">
          <span>Already have an account? </span>
          <Link to="/login" className="text-terracotta font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
