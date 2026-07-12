import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
  Plus,
  Compass,
  Sparkles,
  Search,
  PanelLeftClose,
  Pencil,
  Trash2,
  Check,
  X,
  Settings,
  User,
  LogOut,
  MessageSquare
} from 'lucide-react';
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

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, toggleCollapse, onOpenAuth }) => {
  const {
    conversations,
    activeConversationId,
    loadConversation,
    startNewChat,
    renameChat,
    deleteChat
  } = useChat();

  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartRename = (e, id, currentTitle) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = async (e, id) => {
    e.stopPropagation();
    if (editTitle.trim() !== '') {
      await renameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      await deleteChat(id);
    }
  };

  const handleSelectConversation = (id) => {
    loadConversation(id);
    if (window.innerWidth < 768 && toggleSidebar) {
      toggleSidebar();
    }
  };

  const handleNewChat = () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    startNewChat();
    if (window.innerWidth < 768 && toggleSidebar) {
      toggleSidebar();
    }
  };

  const formatMessageTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const filteredConversations = conversations.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return <span className="truncate block">{text}</span>;
    }
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span className="truncate block">
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-amber-100 text-amber-800 rounded-[3px] px-0.5 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div
      className={`flex flex-col h-full bg-white border-r border-[#E5E7EB] text-slate-600 transition-all duration-200 z-45 w-64
        fixed md:relative inset-y-0 left-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-0 md:overflow-hidden md:border-r-0' : 'md:w-64'}
      `}
    >
      {/* Sidebar Header */}
      <div className="flex flex-col px-5 pt-5 pb-3 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/favicon.svg" className="h-7 w-7 select-none" alt="Logo" />
            <span className="font-extrabold text-slate-900 text-sm tracking-tight select-none">
              PromptPilot
            </span>
          </Link>
          
          <div className="flex items-center gap-1">
            {isAuthenticated && (
              <button
                onClick={toggleCollapse}
                className="hidden md:flex p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={toggleSidebar}
              className="md:hidden flex p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* New Chat Button Area */}
      <div className="p-3.5">
        <button
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>New Chat</span>
        </button>
      </div>


      {/* Search Conversations Input */}
      {isAuthenticated && (
        <div className="px-3.5 mb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-slate-50 border border-[#E5E7EB] focus:border-[#2563EB] rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors duration-150"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conversations History List */}
      {isAuthenticated && (
        <div className="flex-grow overflow-y-auto px-2 py-1 space-y-1 scrollbar-thin">
          <div className="text-[9px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider select-none">
            History
          </div>
          
          <AnimatePresence initial={false}>
            {filteredConversations.length === 0 ? (
              <div className="text-center py-10 px-4 text-xs text-slate-400 italic select-none">
                {searchQuery ? 'No matching conversations' : 'No history yet'}
              </div>
            ) : (
              filteredConversations.map((chat) => {
                const isActive = chat._id === activeConversationId;
                const isEditing = chat._id === editingId;
                const lastMsgContent = chat.lastMessage?.content || 'No messages yet';
                const lastMsgTime = chat.lastMessage?.timestamp || chat.updatedAt;

                return (
                  <motion.div
                    key={chat._id}
                    layoutId={chat._id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    onClick={() => !isEditing && handleSelectConversation(chat._id)}
                    className={`group relative flex items-start gap-2.5 rounded-xl p-2.5 text-xs font-semibold transition-all duration-150 cursor-pointer border ${
                      isActive
                        ? 'bg-slate-50 border-[#E5E7EB] text-slate-900 shadow-sm'
                        : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800 border-transparent'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r bg-[#2563EB]" />
                    )}
                    {isEditing ? (
                      /* Rename Input Form */
                      <div className="flex items-center gap-1.5 w-full">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(e, chat._id);
                            if (e.key === 'Escape') handleCancelRename(e);
                          }}
                          className="bg-white text-slate-900 text-[11px] px-2 py-1 rounded border border-[#2563EB] focus:outline-none w-full font-sans"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => handleSaveRename(e, chat._id)}
                          className="p-1 rounded bg-[#2563EB] text-white cursor-pointer"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                        <button
                          onClick={handleCancelRename}
                          className="p-1 rounded bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      /* Conversation Card Content */
                      <>
                        <div className="mt-0.5 shrink-0">
                          <MessageSquare className={`h-3.5 w-3.5 ${isActive ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                        </div>

                        <div className="flex-grow min-w-0 pr-5">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold truncate block pr-1.5 max-w-[120px]">
                              {highlightText(chat.title, searchQuery)}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono shrink-0 select-none">
                              {formatMessageTime(lastMsgTime)}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate leading-relaxed">
                            {lastMsgContent}
                          </p>
                        </div>

                        {/* Action buttons on hover */}
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={(e) => handleStartRename(e, chat._id, chat.title)}
                            className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-[#2563EB] transition-colors cursor-pointer"
                            title="Rename"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, chat._id)}
                            className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#E5E7EB] bg-white space-y-1 mt-auto">
        <Link
          to={isAuthenticated ? "/profile" : "#"}
          onClick={(e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              onOpenAuth();
            }
          }}
          className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
            location.pathname === '/profile' && isAuthenticated
              ? 'bg-slate-50 text-slate-900 border border-[#E5E7EB]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="h-4 w-4 text-slate-405" />
          <span>Profile</span>
        </Link>
        <Link
          to={isAuthenticated ? "/settings" : "#"}
          onClick={(e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              onOpenAuth();
            }
          }}
          className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
            location.pathname === '/settings' && isAuthenticated
              ? 'bg-slate-50 text-slate-900 border border-[#E5E7EB]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="h-4 w-4 text-slate-405" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
