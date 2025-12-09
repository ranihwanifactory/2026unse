import React from 'react';
import { ChongunResult, UserSajuData } from '../types';

interface ChongunDisplayProps {
  result: ChongunResult;
  userData: UserSajuData;
  onReset: () => void;
}

const ChongunDisplay: React.FC<ChongunDisplayProps> = ({ result, userData, onReset }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 fade-in">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <h1 className="font-cute text-lg font-bold text-gray-800">사주 총운</h1>
        <button onClick={onReset} className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 hover:bg-gray-200 transition">
          메뉴로
        </button>
      </header>

      {/* Hero Section */}
      <div className="bg-white p-6 pb-10 rounded-b-3xl card-shadow mb-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm">
            🔮
          </div>
          <h2 className="font-cute text-2xl font-bold text-gray-800 mb-2">
            한눈에 보는 {userData.name}님
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {result.keywords.map((kw, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                #{kw}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto bg-gray-50 p-4 rounded-xl">
            {result.summary}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-6">
        
        <div className="text-xs text-gray-400 text-center mb-2">
           타고난 성향과 운명을 속시원하게 풀어드립니다.
        </div>

        {/* Section: Ego */}
        <SectionCard 
          icon="🧘" 
          title="내가 아는 내 모습" 
          subtitle="내면의 성향과 기질"
          content={result.sections.selfView} 
          color="bg-orange-50"
        />

        {/* Section: Persona */}
        <SectionCard 
          icon="👀" 
          title="남이 보는 내 모습" 
          subtitle="사회적 가면과 대인관계 스타일"
          content={result.sections.othersView} 
          color="bg-blue-50"
        />

        {/* Section: Talent */}
        <SectionCard 
          icon="💎" 
          title="타고난 재능과 적성" 
          subtitle="어떤 일을 할 때 빛이 날까요?"
          content={result.sections.talent} 
          color="bg-purple-50"
        />

        {/* Section: Wealth */}
        <SectionCard 
          icon="💰" 
          title="타고난 재물운" 
          subtitle="돈을 모으는 방식과 흐름"
          content={result.sections.wealth} 
          color="bg-yellow-50"
        />

        {/* Section: Love */}
        <SectionCard 
          icon="💘" 
          title="타고난 애정운" 
          subtitle="사랑하는 방식과 배우자 운"
          content={result.sections.love} 
          color="bg-pink-50"
        />

         {/* Section: Work */}
         <SectionCard 
          icon="💼" 
          title="타고난 일복" 
          subtitle="직업과 사회적 성취"
          content={result.sections.work} 
          color="bg-gray-50"
        />

         {/* Section: Social/Health */}
         <SectionCard 
          icon="🍀" 
          title="타고난 인복" 
          subtitle="주변 사람들과의 관계"
          content={result.sections.health} 
          color="bg-green-50"
        />

        {/* Final Advice */}
        <div className="bg-gray-800 rounded-3xl p-6 text-white shadow-lg mt-8">
          <h3 className="font-cute text-lg font-bold mb-3 text-yellow-300">💡 도사님의 한마디</h3>
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
            {result.advice}
          </p>
        </div>

        {/* Share Button */}
        <div className="text-center pb-8 pt-4">
           <button 
             onClick={() => navigator.share ? navigator.share({ title: '내 사주 총운', url: window.location.href }) : alert('주소가 복사되었습니다.')}
             className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-300 transition"
           >
             결과 공유하기 📤
           </button>
        </div>

      </div>
    </div>
  );
};

const SectionCard = ({ icon, title, subtitle, content, color }: { icon: string, title: string, subtitle: string, content: string, color: string }) => (
  <div className="bg-white rounded-2xl p-6 card-shadow">
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
    <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line border-t border-gray-50 pt-4">
      {content}
    </div>
  </div>
);

export default ChongunDisplay;