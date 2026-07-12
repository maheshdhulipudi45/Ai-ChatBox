import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, ArrowLeft, Loader2, Edit3, Save, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getInitials = (fullName) => {
    return fullName ? fullName.charAt(0).toUpperCase() : '';
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMsg('Name and email are required');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await updateProfile(name, email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setPassword('');
    } else {
      setErrorMsg(res.message || 'Profile update failed.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative">
      {/* Clean White Background */}
      <div className="gradient-bg bg-white" />

      {/* Header Bar */}
      <div className="border-b border-[#E5E7EB] bg-white px-6 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Chat</span>
          </Link>
          <span className="text-xs font-extrabold tracking-wider text-slate-900 uppercase select-none">
            User Profile
          </span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-sm"
        >
          {/* Avatar and Welcome Header */}
          <div className="flex flex-col items-center border-b border-slate-100 pb-6 mb-6 text-center">
            <div className="relative mb-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-[#2563EB] text-2xl font-black select-none">
                {getInitials(user?.name)}
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>

          {/* Success / Error notification */}
          {successMsg && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-600">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-650">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-5">
            
            {/* Name Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                <span>Full Name</span>
              </label>
              <div className="md:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                    required
                  />
                ) : (
                  <span className="text-xs font-bold text-slate-850 pl-1">{user?.name}</span>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span>Email</span>
              </label>
              <div className="md:col-span-2">
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                    required
                  />
                ) : (
                  <span className="text-xs font-bold text-slate-800 pl-1">{user?.email}</span>
                )}
              </div>
            </div>

            {/* Joined Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined Date</span>
              </label>
              <div className="md:col-span-2">
                <span className="text-xs font-bold text-slate-800 pl-1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </span>
              </div>
            </div>

            {/* Password edit (only shows when editing) */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-1 md:grid-cols-3 gap-2 md:items-center pt-2"
              >
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-3.5 w-3.5 font-bold flex items-center justify-center">***</span>
                  <span>New Password</span>
                </label>
                <div className="md:col-span-2">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full bg-white border border-[#E5E7EB] focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Actions Grid */}
            <div className="flex flex-wrap items-center justify-end gap-3.5 pt-5 border-t border-slate-100">
              {isEditing ? (
                <>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-500 transition-colors cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.03 } : {}}
                    whileTap={!loading ? { scale: 0.97 } : {}}
                    className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4.5 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                  >
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    <span>Save Changes</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Profile</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-red-500 border border-red-200 px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                  </motion.button>
                </>
              )}
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
