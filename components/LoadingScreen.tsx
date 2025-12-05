import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const messages = [
    "생년월일의 기운을 읽고 있습니다...",
    "천간(天干)과 지지(地支)를 계산 중입니다...",
    "2026년 병오년의 붉은 기운을 대입합니다...",
    "당신의 재물과 건강 흐름을 분석합니다...",
    "운명의 지도를 그리고 있습니다..."
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <div className="relative w-40 h-40 mb-10">
        {/* Outer rotating ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-slate-600"
        />
        
        {/* Middle pulsing ring */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-4 rounded-full border-2 border-amber-500/30"
        />

        {/* Inner spinning element */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-8 rounded-full border-t-2 border-r-2 border-transparent border-t-amber-400 border-r-indigo-400"
        />

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">🔮</span>
        </div>
      </div>

      <div className="h-16 flex flex-col items-center">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg font-batang text-amber-100/90 text-center"
        >
          {messages[messageIndex]}
        </motion.p>
        <div className="flex gap-1 mt-4">
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;