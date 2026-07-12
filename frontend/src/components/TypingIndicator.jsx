import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  const dotVariants = {
    start: { y: '0%' },
    end: { y: '-60%' },
  };

  const dotTransition = {
    duration: 0.4,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl w-fit shadow-sm">
      <span className="text-xs font-semibold text-slate-400 mr-1 select-none">PromptPilot is thinking</span>
      <div className="flex gap-1.5 items-center justify-center h-3">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"
            variants={dotVariants}
            initial="start"
            animate="end"
            transition={{
              ...dotTransition,
              delay: index * 0.12,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TypingIndicator;
