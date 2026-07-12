import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea to fit content height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const targetHeight = Math.min(textarea.scrollHeight, 180);
    textarea.style.height = `${targetHeight}px`;
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (text.trim() === '' || isLoading) return;

    onSend(text.trim());
    setText('');

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAttachClick = () => {
    alert('File attachment is prepared for production. Full integration coming soon!');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 bg-white border border-[#E5E7EB] focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-500/5 rounded-[24px] p-2 pl-4 pr-3.5 transition-all duration-200 shadow-sm"
    >
      {/* Attach Button */}
      <button
        type="button"
        onClick={handleAttachClick}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-405 hover:text-[#2563EB] hover:bg-slate-50 transition-colors cursor-pointer"
        title="Attach files"
      >
        <Paperclip className="h-4.5 w-4.5" />
      </button>

      {/* Textarea Composer */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isLoading ? 'Thinking...' : 'Message PromptPilot...'}
        disabled={isLoading}
        className="flex-grow resize-none bg-transparent py-2.5 px-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none max-h-[180px] overflow-y-auto scrollbar-none leading-relaxed"
      />

      {/* Send Button */}
      <motion.button
        type="submit"
        disabled={text.trim() === '' || isLoading}
        whileHover={text.trim() !== '' && !isLoading ? { scale: 1.05 } : {}}
        whileTap={text.trim() !== '' && !isLoading ? { scale: 0.95 } : {}}
        className={`flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl transition-all duration-150 focus:outline-none cursor-pointer ${
          text.trim() === '' || isLoading
            ? 'bg-slate-100 text-slate-350 cursor-not-allowed border border-slate-200/40'
            : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
        }`}
      >
        <ArrowUp className="h-4.5 w-4.5 stroke-[2.5]" />
      </motion.button>
    </form>
  );
};

export default ChatInput;
