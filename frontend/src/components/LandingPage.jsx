import React from 'react';
import { Compass, Sparkles, ArrowRight, Code, BookOpen, PenTool, Lightbulb, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const GithubIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

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

const LandingPage = ({ onStartChat, onOpenAuth }) => {
  const quickPrompts = [
    { title: 'Explain React', desc: 'Break down React Hooks and render cycles.', icon: BookOpen },
    { title: 'Create REST API', desc: 'Generate Express JS route structures.', icon: Code },
    { title: 'Improve Resume', desc: 'Optimize a developer resume layout.', icon: PenTool },
    { title: 'SQL Queries', desc: 'Write database joins and table indexes.', icon: DatabaseIcon },
    { title: 'Write Email', desc: 'Draft a professional client business email.', icon: Lightbulb },
    { title: 'Prepare Interview', desc: 'Generate lead tech manager QA prep.', icon: BookOpen },
    { title: 'Debug JavaScript', desc: 'Fix closures, scoping, and state bugs.', icon: Code },
    { title: 'Build Portfolio', desc: 'Design clean responsive frontend layouts.', icon: PenTool }
  ];

  function DatabaseIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </svg>
    );
  }

  const handleScrollToPrompts = () => {
    document.getElementById('explore-prompts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 relative font-sans">
      
      {/* Floating Sticky Glass Navbar */}
      <div className="fixed top-4 inset-x-4 z-40 max-w-5xl mx-auto">
        <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between shadow-sm bg-white/90 backdrop-blur-md border border-slate-200">
          
          {/* Logo */}
          <div className="flex items-center gap-2 select-none">
            <LogoIcon className="h-7.5 w-7.5" />
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">
              PromptPilot
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-500">
            <a href="#features" className="hover:text-[#2563EB] transition-colors">Features</a>
            <a href="#explore-prompts" className="hover:text-[#2563EB] transition-colors">Suggestions</a>
            <a href="#about" className="hover:text-[#2563EB] transition-colors">About</a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth()}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <motion.button
              onClick={() => onStartChat()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4.5 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-36 md:pt-44 pb-16 text-center flex flex-col items-center">
        
        {/* Name and Tagline */}
        <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase mb-2 select-none font-mono">
          PromptPilot &bull; Navigate Ideas. Create Smarter.
        </span>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
          Your Intelligent AI Workspace
        </h1>

        {/* Subtitles list */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 max-w-lg mb-8 mt-2 text-xs font-bold text-slate-50">
          <div className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-[#2563EB]" />
            <span className="text-slate-500">Code faster.</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-[#2563EB]" />
            <span className="text-slate-500">Learn smarter.</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-[#2563EB]" />
            <span className="text-slate-500">Write better.</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-[#2563EB]" />
            <span className="text-slate-500">Brainstorm anything with AI.</span>
          </div>
        </div>

        {/* CTA triggers */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => onStartChat()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <span>Start Chat</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </motion.button>

          <motion.button
            onClick={handleScrollToPrompts}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-[#2563EB] border border-[#2563EB] font-bold text-xs transition-all cursor-pointer"
          >
            Learn More
          </motion.button>
        </div>
      </div>

      {/* Suggestion Prompts Section */}
      <div id="explore-prompts" className="max-w-4xl mx-auto px-6 py-12 border-t border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Suggestions
          </h2>
        </div>

        {/* Shrunk suggestions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickPrompts.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => onStartChat(item.title)}
                className="flex items-start text-left p-4.5 rounded-xl border border-[#E5E7EB] bg-white transition-all duration-200 group hover:border-[#2563EB] cursor-pointer"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-[#2563EB] mr-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 mb-0.5 group-hover:text-[#2563EB] transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
