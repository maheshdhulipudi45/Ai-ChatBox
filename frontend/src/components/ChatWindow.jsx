import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { prompts } from '../constants/prompts';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper component to render icons dynamically
const PromptIcon = ({ name, className }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.Sparkles;
  return <IconComponent className={className} />;
};

const ChatWindow = ({ 
  onToggleSidebar, 
  isSidebarCollapsed, 
  toggleSidebarCollapse,
  onOpenAuth,
  setPendingMessage,
  prefilledInput,
  setPrefilledInput
}) => {
  const { activeConversation, isLoading, error, sendMessage, setError } = useChat();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [randomPrompts, setRandomPrompts] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const messagesEndRef = useRef(null);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load 4 random prompts on mount OR when activeConversation resets to null
  useEffect(() => {
    if (!activeConversation || activeConversation.messages?.length === 0) {
      const shuffled = [...prompts].sort(() => 0.5 - Math.random());
      setRandomPrompts(shuffled.slice(0, 4));
    }
  }, [activeConversation]);

  // Intercept suggestion click from Landing Page
  useEffect(() => {
    if (prefilledInput && prefilledInput.trim() !== '') {
      handleSendMessage(prefilledInput);
      setPrefilledInput('');
    }
  }, [prefilledInput]);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isLoading]);

  const handleSendMessage = (content) => {
    if (!isAuthenticated) {
      setPendingMessage(content);
      onOpenAuth();
      return;
    }
    sendMessage(content);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    const nameStr = user?.name ? `, ${user.name.split(' ')[0]}` : '';
    if (hours < 12) {
      return `Good Morning${nameStr} 👋`;
    } else if (hours < 17) {
      return `Good Afternoon${nameStr} 👋`;
    } else {
      return `Good Evening${nameStr} 👋`;
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-white relative transition-colors duration-200">
      
      {/* Network Offline Alert */}
      <AnimatePresence>
        {!isOnline && (
          <div className="bg-amber-500 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 z-20 shadow-sm">
            <LucideIcons.WifiOff className="h-4 w-4 animate-bounce" />
            <span>Connection lost. Running in offline mode. Checking network status...</span>
          </div>
        )}
      </AnimatePresence>

      {/* Top Bar / Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 z-10">
        
        {/* Left header: menu and active chat title */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 transition-colors cursor-pointer"
          >
            <LucideIcons.Menu className="h-4 w-4" />
          </button>
          
          {/* Desktop restore collapsed sidebar */}
          {isAuthenticated && isSidebarCollapsed && (
            <button
              onClick={toggleSidebarCollapse}
              className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 transition-all hover:bg-slate-100 cursor-pointer"
              title="Show Sidebar"
            >
              <LucideIcons.PanelLeft className="h-4 w-4" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 truncate max-w-[160px] md:max-w-md select-none">
              {activeConversation ? activeConversation.title : 'New Chat'}
            </h2>
            <div className="flex items-center gap-1.5 shrink-0 pl-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium font-mono select-none hidden sm:inline">
                {isOnline ? 'online' : 'offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Right header: Date and Profile Avatar */}
        <div className="flex items-center gap-3">
          {/* Current Date */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-450 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 select-none">
            <LucideIcons.Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{getCurrentDate()}</span>
          </div>

          {/* Profile Dropdown or Sign In CTA */}
          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#2563EB] font-bold text-xs select-none cursor-pointer focus:outline-none"
              >
                {getInitials(user?.name)}
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div onClick={() => setDropdownOpen(false)} className="fixed inset-0 z-20" />
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 5 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-2.5 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg z-30"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed In As</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-[#2563EB] hover:bg-slate-50 transition-colors"
                      >
                        <LucideIcons.User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-[#2563EB] hover:bg-slate-50 transition-colors"
                      >
                        <LucideIcons.Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LucideIcons.LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth()}
              className="px-4 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin chat-content-area">
        <div className="max-w-3xl mx-auto h-full flex flex-col justify-between">
          
          {/* Error Banner */}
          {error && (
            <div className="mb-5 flex items-start justify-between gap-3.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 shadow-sm">
              <div className="flex gap-2.5">
                <LucideIcons.AlertCircle className="h-4.5 w-4.5 text-red-650 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-805">Request Error</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-550 hover:text-red-700 p-1 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
              >
                <LucideIcons.X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Chat Panel vs Welcome Board */}
          {!activeConversation || activeConversation.messages?.length === 0 ? (
            /* Welcome Screen: clean minimalist style */
            <div className="flex flex-col items-center justify-center flex-grow py-12 text-center max-w-2xl mx-auto welcome-screen-container">
              
              {/* Header */}
              <motion.h1
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight welcome-title"
              >
                {getGreeting()}
              </motion.h1>
              
              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
                className="text-slate-400 text-sm md:text-base font-bold mb-10 select-none"
              >
                What is today's agenda?
              </motion.p>

              {/* Shrunk suggestion cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full suggestions-grid">
                {randomPrompts.map((item, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + index * 0.05, ease: 'easeOut' }}
                    whileHover={{ y: -2, border: '1px solid #2563EB', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendMessage(item.title)}
                    className="flex items-start text-left p-4.5 rounded-xl border border-[#E5E7EB] bg-white cursor-pointer shadow-sm shadow-slate-100/50"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-[#2563EB] mr-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
                      <PromptIcon name={item.icon} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <span className="block text-xs font-bold text-slate-800 mb-0.5 group-hover:text-[#2563EB] transition-colors">
                        {item.title}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium line-clamp-1">
                        {item.description}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Developer Portfolio Link Footer */}
              <div className="mt-10 select-none text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                <span>Developed by </span>
                <a
                  href="https://maheshdhulipudi-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:underline font-bold"
                >
                  maheshdhulipudi
                </a>
              </div>
            </div>
          ) : (
            /* Chat Messages List */
            <div className="flex-grow flex flex-col justify-end">
              <div className="w-full">
                <AnimatePresence initial={false}>
                  {activeConversation.messages.map((message) => (
                    <MessageBubble key={message._id} message={message} />
                  ))}
                </AnimatePresence>
                
                {/* AI is writing indicator */}
                {isLoading && (
                  <div className="flex justify-start my-4">
                    <TypingIndicator />
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Input composer floating panel */}
      <div className="border-t border-slate-200 bg-white p-4 md:p-5 z-10 sticky bottom-0 input-composer-container">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          <p className="text-[10px] text-slate-400 text-center mt-2.5 font-mono select-none">
            PromptPilot can make mistakes. Please verify important credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
