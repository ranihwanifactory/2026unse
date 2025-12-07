import React from 'react';
import { FortuneResult, UserSajuData } from '../types';

interface FortuneDisplayProps {
  result: FortuneResult;
  userData: UserSajuData;
  onReset: () => void;
}

const FortuneDisplay: React.FC<FortuneDisplayProps> = ({ result, userData, onReset }) => {
  return (
    <div className="min-h-screen bg-[#0f0518] py-12 px-4 md:px-8 flex justify-center items-start fade-in">
      <div className="max-w-4xl w-full bg-[#e8dfc8] text-[#2a1a1a] p-1 md:p-2 rounded-sm shadow-2xl relative overflow-hidden">
        
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none"></div>
        
        {/* Inner Border */}
        <div className="border-2 border-[#5c2e2e] h-full p-6 md:p-10 relative">
          
          {/* Header */}
          <div className="text-center mb-10 border-b-2 border-[#5c2e2e]/20 pb-6">
            <p className="text-[#8b4513] text-sm font-bold tracking-widest mb-2 uppercase">
              {userData.name}님의 신년운세
            </p>
            <h1 className="font-title text-4xl md:text-5xl font-bold text-[#3d1024] mb-2">
              {result.yearTitle}
            </h1>
          </div>

          {/* Overall Fortune */}
          <div className="mb-12 text-center">
            <h3 className="font-title text-2xl text-[#5c1c2c] mb-4 font-bold flex items-center justify-center gap-2">
              <span className="block w-2 h-2 bg-[#5c1c2c] rotate-45"></span>
              총운
              <span className="block w-2 h-2 bg-[#5c1c2c] rotate-45"></span>
            </h3>
            <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-[#2a1a1a]">
              {result.overall}
            </p>
          </div>

          {/* Grid Layout for details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <DetailCard title="재물운" content={result.wealth} color="text-yellow-900" />
            <DetailCard title="애정운" content={result.love} color="text-pink-900" />
            <DetailCard title="건강운" content={result.health} color="text-green-900" />
            <DetailCard title="직업/학업" content={result.career} color="text-blue-900" />
          </div>

          {/* Lucky Items */}
          <div className="bg-[#3d1024] text-[#e0d4bc] p-6 rounded-sm text-center shadow-inner mb-8">
            <h4 className="font-title text-xl text-yellow-500 mb-2">✨ 행운의 비방 (Lucky Items)</h4>
            <p className="text-lg">{result.luckyItems}</p>
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={onReset}
              className="px-8 py-3 bg-[#5c2e2e] text-[#e8dfc8] font-title text-lg rounded hover:bg-[#3d1024] transition-colors shadow-lg"
            >
              다른 사람 운세 보기
            </button>
          </div>

          {/* Decorative Stamps */}
          <div className="absolute top-6 right-6 w-16 h-16 border-4 border-red-700/50 rounded-full flex items-center justify-center rotate-12 opacity-40 pointer-events-none">
             <span className="text-red-700 font-bold text-xs writing-vertical">천기누설</span>
          </div>
          <div className="absolute bottom-6 left-6 w-12 h-12 border-2 border-[#5c2e2e]/30 rounded-sm flex items-center justify-center -rotate-6 opacity-30 pointer-events-none">
             <span className="text-[#5c2e2e] text-xs">大吉</span>
          </div>

        </div>
      </div>
    </div>
  );
};

const DetailCard: React.FC<{ title: string; content: string; color: string }> = ({ title, content, color }) => (
  <div className="bg-[#5c2e2e]/5 p-5 rounded border-l-4 border-[#5c2e2e]/30">
    <h4 className={`font-title text-xl font-bold mb-3 ${color}`}>{title}</h4>
    <p className="text-[#4a3b3b] leading-relaxed text-sm md:text-base">{content}</p>
  </div>
);

export default FortuneDisplay;