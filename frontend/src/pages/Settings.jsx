import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import * as api from '../services/api';
import { ArrowLeft, Moon, Sun, Monitor, Trash2, ShieldAlert, Loader2, Check, Download, Type } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const { 
    theme, 
    setTheme, 
    fontSize, 
    setFontSize 
  } = useTheme();

  const { conversations, deleteChat, startNewChat } = useChat();
  const navigate = useNavigate();

  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleClearAll = async () => {
    if (conversations.length === 0) return;
    if (
      window.confirm(
        'WARNING: This will permanently delete all your conversation history. This action cannot be undone. Are you sure?'
      )
    ) {
      setClearing(true);
      try {
        // Delete all conversations in parallel
        await Promise.all(conversations.map((chat) => deleteChat(chat._id)));
        startNewChat(); // Reset active chat state
        setCleared(true);
        setTimeout(() => setCleared(false), 3000);
      } catch (err) {
        console.error('Failed to clear conversations:', err);
        alert('An error occurred while deleting conversations. Please try again.');
      } finally {
        setClearing(false);
      }
    }
  };

  const handleExportChats = async () => {
    if (conversations.length === 0) return;
    setExporting(true);
    try {
      const fullHistoryData = await Promise.all(
        conversations.map(async (chat) => {
          const res = await api.getConversationById(chat._id);
          return res.success ? res.data : null;
        })
      );
      
      const cleanData = fullHistoryData.filter((d) => d !== null);
      
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(cleanData, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `promptpilot_chats_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Could not export conversations. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-805 font-sans relative">
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
            Settings
          </span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-sm space-y-7"
        >
          {/* Section 1: Appearance */}
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
              Appearance
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor }
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = theme === t.value;
                return (
                  <motion.button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-50 border-[#2563EB] text-[#2563EB] shadow-sm'
                        : 'bg-white border-[#E5E7EB] text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 mb-1" />
                    <span className="text-[10px] font-bold">{t.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Font Size */}
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
              Font Size
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ].map((sz) => {
                const isSelected = fontSize === sz.value;
                return (
                  <motion.button
                    key={sz.value}
                    onClick={() => setFontSize(sz.value)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-50 border-[#2563EB] text-[#2563EB] shadow-sm'
                        : 'bg-white border-[#E5E7EB] text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Type className="h-4 w-4 mr-1.5" />
                    <span>{sz.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Data Controls */}
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
              Data & Archives
            </h3>
            
            <div className="space-y-3.5">
              {/* Export Chats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Download className="h-4 w-4 text-[#2563EB]" />
                    <span>Export Conversations</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Download complete conversation logs as a JSON archive.
                  </p>
                </div>
                <motion.button
                  onClick={handleExportChats}
                  disabled={exporting || conversations.length === 0}
                  whileHover={!(exporting || conversations.length === 0) ? { scale: 1.03 } : {}}
                  whileTap={!(exporting || conversations.length === 0) ? { scale: 0.97 } : {}}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer ${
                    conversations.length === 0
                      ? 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed'
                      : exported
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {exporting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Exporting...</span>
                    </>
                  ) : exported ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      <span>Export ({conversations.length})</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Clear All Chats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-red-100 bg-red-500/[0.02]">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldAlert className="h-4.5 w-4.5 text-red-500 shrink-0" />
                    <span>Clear All Chats</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Irreversibly erase all conversations logs from the database.
                  </p>
                </div>
                <motion.button
                  onClick={handleClearAll}
                  disabled={clearing || conversations.length === 0}
                  whileHover={!(clearing || conversations.length === 0) ? { scale: 1.03 } : {}}
                  whileTap={!(clearing || conversations.length === 0) ? { scale: 0.97 } : {}}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    conversations.length === 0
                      ? 'bg-slate-105 text-slate-400 border border-transparent cursor-not-allowed'
                      : cleared
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-red-500 border border-red-200'
                  }`}
                >
                  {clearing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Clearing...</span>
                    </>
                  ) : cleared ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Cleared</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete All</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
