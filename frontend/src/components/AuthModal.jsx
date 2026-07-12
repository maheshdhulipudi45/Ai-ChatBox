import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Loader2, Sparkles, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LogoIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="38" stroke="url(#logoGrad)" strokeWidth="6" />
    <line x1="50" y1="12" x2="50" y2="20" stroke="url(#logoGrad)" strokeWidth="4" strokeLinecap="round" />
    <line x1="50" y1="80" x2="50" y2="88" stroke="url(#logoGrad)" strokeWidth="4" strokeLinecap="round" />
    <line x1="12" y1="50" x2="20" y2="50" stroke="url(#logoGrad)" strokeWidth="4" strokeLinecap="round" />
    <line x1="80" y1="50" x2="88" y2="50" stroke="url(#logoGrad)" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 50 L35 65 L43 43 Z" fill="url(#logoGrad)" />
    <path d="M50 50 L65 35 L43 43 Z" fill="url(#logoGrad)" opacity="0.8" />
    <path d="M50 50 L65 35 L57 57 Z" fill="url(#logoGrad)" />
    <path d="M50 50 L35 65 L57 57 Z" fill="url(#logoGrad)" opacity="0.8" />
    <path d="M75 25 L77 18 L79 25 L86 27 L79 29 L77 36 L75 29 L68 27 Z" fill="#06B6D4" />
    <path d="M86 12 L87 8 L88 12 L92 13 L88 14 L87 18 L86 14 L82 13 Z" fill="#A855F7" />
  </svg>
);

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    if (isRegister && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    let res;
    if (isRegister) {
      res = await register(name, email, password);
    } else {
      res = await login(email, password);
    }

    setLoading(false);

    if (res.success) {
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setErrorMsg(res.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setErrorMsg('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-sm bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-xl z-10 font-sans"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Logo */}
            <div className="text-center mb-6">
              <img src="/favicon.svg" className="h-10 w-10 mx-auto mb-3 select-none" alt="Logo" />
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {isRegister ? 'Create Account' : 'Welcome to PromptPilot'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                {isRegister ? 'Start navigating ideas and building smarter' : 'Sign in to access your intelligent workspace'}
              </p>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Only on Register) */}
              {isRegister && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-white border border-[#E5E7EB] focus:border-[#2563EB] rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white border border-[#E5E7EB] focus:border-[#2563EB] rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#E5E7EB] focus:border-[#2563EB] rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Submit CTA button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.03 } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 mt-6 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isRegister ? 'Register' : 'Sign In'}</span>
                )}
              </motion.button>
            </form>

            {/* Toggle mode trigger */}
            <div className="text-center mt-5">
              <p className="text-xs text-slate-500">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-bold text-[#2563EB] hover:underline focus:outline-none cursor-pointer"
                >
                  {isRegister ? 'Sign In' : 'Sign up free'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
