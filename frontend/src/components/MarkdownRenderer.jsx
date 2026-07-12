import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose max-w-none text-slate-800 dark:text-slate-200 font-sans">
      <ReactMarkdown
        components={{
          // Override the code element
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');
            
            return !inline && match ? (
              <CodeBlock
                language={match[1]}
                value={value}
                {...props}
              />
            ) : (
              <code
                className="bg-slate-100 dark:bg-slate-900 text-rose-650 dark:text-rose-400 font-mono text-xs px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-800/80"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Custom styling for standard markdown elements
          h1: ({ children }) => <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-5 mb-2.5 first:mt-0 leading-tight">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white mt-4 mb-2 first:mt-0 leading-tight">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mt-3.5 mb-1.5 leading-tight">{children}</h3>,
          p: ({ children }) => <p className="leading-relaxed mb-3.5 text-slate-850 dark:text-slate-300 text-sm md:text-base break-words last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-3.5 space-y-1.5 text-sm md:text-base text-slate-700 dark:text-slate-350">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-3.5 space-y-1.5 text-sm md:text-base text-slate-700 dark:text-slate-350">{children}</ol>,
          li: ({ children }) => <li className="mb-0.5">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium transition-colors"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-slate-300 dark:border-slate-700 pl-4 py-2 my-4 bg-slate-50 dark:bg-slate-900/40 rounded-r-lg text-slate-500 dark:text-slate-400 italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <table className="w-full border-collapse text-left text-sm text-slate-650 dark:text-slate-400">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-100 dark:bg-slate-900/80 text-xs font-semibold uppercase text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white/40 dark:bg-slate-950/10">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-4 py-2.5 border-r border-slate-250 dark:border-slate-800 last:border-r-0 font-semibold">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2.5 border-r border-slate-200 dark:border-slate-800 last:border-r-0 text-slate-600 dark:text-slate-350">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
