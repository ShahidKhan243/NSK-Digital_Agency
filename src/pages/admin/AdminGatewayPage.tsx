import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  KeyRound, 
  ShieldAlert, 
  Lock, 
  ArrowRight, 
  Mail, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { store, VALID_ADMIN_ACCESS_KEYS } from '../../lib/store';

export const AdminGatewayPage: React.FC = () => {
  const [accessKey, setAccessKey] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);

  const navigate = useNavigate();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accessKey.trim()) {
      setError('Administrative Access Key is required.');
      return;
    }

    if (!store.verifyAdminAccessKey(accessKey)) {
      setError('Invalid Access Key. Access attempt logged.');
      return;
    }

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setError('Please provide administrative credentials.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Unlock gateway in store
      store.setAdminGatewayUnlocked(true, rememberMe);
      // Authenticate as admin
      store.loginAdmin(adminEmail.trim().toLowerCase(), 'NSK Administrator');
      setUnlockedSuccess(true);
      
      setTimeout(() => {
        navigate('/admin');
      }, 600);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Top Agency Identifier */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block p-2 rounded-2xl bg-white shadow-xl">
            <img src="/logo.png" alt="NSK" className="h-10 w-auto object-contain mx-auto" />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Restricted Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            NSK Management Gateway
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Authorized agency personnel only. An active administrative access token is required.
          </p>
        </div>

        {/* Gateway Card */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6">
          
          {unlockedSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Gateway Verified</h3>
              <p className="text-xs text-slate-400">Redirecting to Admin Control Center...</p>
            </div>
          ) : (
            <form onSubmit={handleUnlock} className="space-y-4">
              
              {/* Access Key Input */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Admin Access Key</span>
                  <span className="text-[10px] text-blue-400">Security Gate</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-gateway-key"
                    type="password"
                    value={accessKey}
                    onChange={e => { setAccessKey(e.target.value); setError(''); }}
                    placeholder="Enter Security Key"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono tracking-widest"
                  />
                </div>
              </div>

              {/* Admin Email */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-email"
                    type="email"
                    value={adminEmail}
                    onChange={e => { setAdminEmail(e.target.value); setError(''); }}
                    placeholder="nskdigitalagency1906@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Admin Password */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={e => { setAdminPassword(e.target.value); setError(''); }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Remember Session */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="remember-session"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-session" className="text-xs text-slate-400 select-none cursor-pointer">
                  Remember session on this device
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="admin-gateway-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Authenticate & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Return to Public Website */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Return to public website
          </Link>
        </div>

      </div>
    </div>
  );
};
