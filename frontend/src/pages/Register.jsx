import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Loader2, Compass, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await register(name, email, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.message || 'Registration failed. Email might already exist.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative transition-colors duration-300">
      {/* Clean White Background */}
      <div className="gradient-bg bg-white" />

      <div className="w-full max-w-md z-10">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex mb-4">
            <img src="/favicon.svg" className="h-14 w-14 select-none" alt="Logo" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-555 dark:text-slate-450 mt-1.5 font-medium">
            Get started with PromptPilot today
          </p>
        </div>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-8 shadow-xl"
        >
          {errorMsg && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs font-semibold text-red-650 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Your Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-505">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 focus:border-accent rounded-xl py-3 pl-11 pr-4 text-sm text-slate-850 dark:text-white placeholder-slate-405 focus:outline-none transition-all duration-200 focus:ring-4 focus:ring-accent/10"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 focus:border-accent rounded-xl py-3 pl-11 pr-4 text-sm text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none transition-all duration-200 focus:ring-4 focus:ring-accent/10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 focus:border-accent rounded-xl py-3 pl-11 pr-4 text-sm text-slate-850 dark:text-white placeholder-slate-450 focus:outline-none transition-all duration-200 focus:ring-4 focus:ring-accent/10"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-white shadow-lg hover:bg-accent-hover disabled:bg-slate-400 dark:disabled:bg-slate-800 disabled:cursor-not-allowed transition-all duration-200 mt-6 shadow-accent/20 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </motion.button>
          </form>

          {/* Redirect to Login */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-accent hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
