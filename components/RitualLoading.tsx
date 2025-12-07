import React, { useEffect, useState } from 'react';

const RitualLoading: React.FC = () => {
  const [message, setMessage] = useState("향을 피우는 중입니다...");

  useEffect(() => {
    const messages = [
      "향을 피우는 중입니다...",
      "생년월일을 하늘에 고하는 중입니다...",
      "방울을 흔들어 신령님을 부릅니다...",
      "깃발을 뽑아 점괘를 확인합니다...",
      "운명의 실타래를 읽고 있습니다...",
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-[#0f0518] fade-in">
      {/* Mist Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2a0a18]/50 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Circle/Talisman */}
        <div className="relative w-48 h-48 mb-12">
           <div className="absolute inset-0 border-4 border-red-900/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
           <div className="absolute inset-4 border-2 border-yellow-700/30 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-32 h-32 bg-[#2a0a18] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,20,60,0.4)] animate-pulse">
                <span className="font-title text-4xl text-yellow-600 font-bold">神</span>
             </div>
           </div>
        </div>

        <h2 className="font-title text-2xl md:text-3xl text-gray-200 mb-4 animate-float text-center px-4">
          {message}
        </h2>
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default RitualLoading;