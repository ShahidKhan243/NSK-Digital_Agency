import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';
import { store } from '../lib/store';
import { api } from '../lib/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = (location.state as any)?.returnUrl || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const { user, error: loginError } = await api.signIn(trimmedEmail, password.trim());

      if (loginError || !user) {
        setError(loginError || 'Invalid email or password.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      navigate(returnUrl);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-gradient-to-b from-slate-50 via-white to-white min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-card space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="NSK" className="h-11 w-auto object-contain mx-auto" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Client Portal Sign In</h1>
          <p className="text-xs text-slate-500">Sign in to track your project requests, review quotes, and communicate with the team.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" state={{ returnUrl }} className="font-bold text-blue-600 hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};
