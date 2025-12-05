import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 border-4 border-amber-500/30 rounded-full animate-ping"></div>
        <div className="absolute inset-0 border-4 border-t-amber-500 border-r-transparent border-b-amber-500 border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 bg-slate-800 rounded-full flex items-center justify-center border border-white/10">
          <span className="text-4xl">🔮</span>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-batang text-white">사주를 분석하고 있습니다</h3>
        <p className="text-gray-400 animate-pulse">별들의 기운을 읽는 중...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;