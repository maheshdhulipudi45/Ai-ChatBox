import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Compass, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MarkdownRenderer from './MarkdownRenderer';

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

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleCopy = async () => {
    if (!message.content) return;
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  // spring-based fade and slide animations
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      x: isUser ? 24 : -24 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: 'spring', 
        stiffness: 260, 
        damping: 22 
      }
    }
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={`flex w-full gap-3 md:gap-4 my-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar Icon */}
      <div className="shrink-0 select-none">
        {isUser ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white font-extrabold text-xs shadow-sm">
            {getInitials(user?.name)}
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#E5E7EB] shadow-sm p-1">
            <img src="/favicon.svg" className="h-full w-full select-none" alt="Logo" />
          </div>
        )}
      </div>

      {/* Message Bubble Container */}
      <div className={`flex flex-col max-w-[85%] md:max-w-[78%] ${isUser ? 'items-end' : 'items-start'} group relative message-bubble-container`}>
        <div
          className={`relative px-5 py-4 rounded-2xl transition-all duration-300 ${
            isUser
              ? 'rounded-tr-none bg-[#2563EB] text-white border border-transparent font-medium text-sm md:text-base leading-relaxed shadow-sm'
              : 'rounded-tl-none bg-white border border-[#E5E7EB] text-slate-800 leading-relaxed font-normal shadow-sm shadow-slate-100/10'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm md:text-base text-white break-words">{message.content}</p>
          ) : (
            <div className="relative">
              <MarkdownRenderer content={message.content} />
              
              {/* Floating Copy Button for Assistant Bubble */}
              <div className="absolute -top-3.5 -right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={handleCopy}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all active:scale-95 cursor-pointer"
                  title="Copy response"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <span className="mt-1.5 text-[9px] text-slate-400 dark:text-slate-505 px-1 font-mono tracking-wider select-none">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
