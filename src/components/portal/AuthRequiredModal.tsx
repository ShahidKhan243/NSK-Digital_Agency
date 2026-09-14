import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceSlug?: string;
  serviceTitle?: string;
  returnUrl?: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  serviceSlug,
  serviceTitle,
  returnUrl
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const targetUrl = returnUrl || (serviceSlug ? `/start-project?service=${serviceSlug}` : '/start-project');

  const handleLogin = () => {
    onClose();
    navigate('/login', { state: { returnUrl: targetUrl } });
  };

  const handleRegister = () => {
    onClose();
    navigate('/register', { state: { returnUrl: targetUrl } });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 transform animate-in zoom-in-95 duration-200 text-center space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-7 h-7" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900">
            Login Required
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Please log in or create an account to continue with your booking{serviceTitle ? ` for ${serviceTitle}` : ''}.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            id="auth-required-login-btn"
            onClick={handleLogin}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            id="auth-required-register-btn"
            onClick={handleRegister}
            className="w-full py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>Create Account</span>
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Your request will be linked directly to your secure customer dashboard.
        </div>
      </div>
    </div>
  );
};
