import React, { useEffect, useState } from 'react';

const RitualLoading: React.FC = () => {
  const [message, setMessage] = useState("별들의 위치를 찾고 있어요...");

  useEffect(() => {
    const messages = [
      "별들의 위치를 찾고 있어요... 🌟",
      "오행의 균형을 계산 중이에요... ⚖️",
      "만세력을 펼쳐보고 있어요... 📜",
      "당신의 수호 동물을 부르고 있어요... 🐯",
      "2025년의 기운을 읽고 있어요... ✨",
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfbf7] p-4 text-center">
      <div className="relative mb-8">
        {/* Cute Rotating Sun/Moon */}
        <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center animate-spin-slow shadow-inner relative overflow-hidden">
             <div className="absolute top-2 left-1/2 w-4 h-4 bg-yellow-400 rounded-full transform -translate-x-1/2"></div>
             <div className="absolute bottom-2 left-1/2 w-4 h-4 bg-blue-300 rounded-full transform -translate-x-1/2"></div>
             <div className="text-4xl animate-bounce">🐰</div>
        </div>
      </div>

      <h2 className="font-cute text-xl text-gray-700 font-bold mb-2 animate-pulse">
        {message}
      </h2>
      <p className="text-sm text-gray-400">잠시만 기다려주세요</p>
    </div>
  );
};

export default RitualLoading;