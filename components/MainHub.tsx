import React from 'react';
import { AppMode } from '../types';

interface MainHubProps {
  onSelectApp: (mode: AppMode) => void;
  userName?: string;
}

const MainHub: React.FC<MainHubProps> = ({ onSelectApp, userName }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 flex flex-col fade-in">
      <header className="py-6 px-2">
        <h1 className="font-cute text-2xl font-bold text-gray-800">
          {userName ? `${userName}님, 환영합니다 👋` : '내운명 연구소'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">오늘 당신에게 필요한 조언은 무엇인가요?</p>
      </header>

      <div className="flex-1 grid grid-cols-1 gap-4 overflow-y-auto pb-10">
        
        {/* App Card 1: Manse Chart */}
        <button 
          onClick={() => onSelectApp(AppMode.MANSE)}
          className="bg-white rounded-3xl p-6 card-shadow text-left relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 z-0 group-hover:bg-blue-100 transition-colors"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
              📊
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">정통 만세력 분석</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              내 사주 원국과 오행, 대운 흐름을<br/>
              그래프와 함께 자세히 분석합니다.
            </p>
          </div>
        </button>

        {/* App Card 2: General Fortune (Chongun) */}
        <button 
          onClick={() => onSelectApp(AppMode.CHONGUN)}
          className="bg-white rounded-3xl p-6 card-shadow text-left relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 z-0 group-hover:bg-purple-100 transition-colors"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
              📜
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">사주 총운 풀이</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              "한눈에 보는 나"<br/>
              성격, 재물, 애정 등 타고난 운명을<br/>
              텍스트로 상세하게 풀어드립니다.
            </p>
          </div>
        </button>

        {/* App Card 3: Compatibility (Gunghap) */}
        <button 
          onClick={() => onSelectApp(AppMode.GUNGHAP)}
          className="bg-white rounded-3xl p-6 card-shadow text-left relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -mr-8 -mt-8 z-0 group-hover:bg-pink-100 transition-colors"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
              💞
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">궁합 보기</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              그 사람과 나는 얼마나 잘 맞을까?<br/>
              성격, 가치관, 연애 스타일까지<br/>
              두 사람의 케미를 분석해드립니다.
            </p>
          </div>
        </button>

        {/* Placeholder for future apps */}
        <div className="bg-gray-100 rounded-3xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
           <span className="text-2xl mb-2">🔜</span>
           <span className="text-sm font-medium">새로운 기능 준비 중</span>
           <span className="text-xs mt-1">토정비결, 타로 등</span>
        </div>

      </div>
    </div>
  );
};

export default MainHub;