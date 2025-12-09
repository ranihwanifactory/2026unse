import React from 'react';
import { GunghapResult, UserSajuData } from '../types';

interface GunghapDisplayProps {
  result: GunghapResult;
  user1: UserSajuData;
  user2: UserSajuData;
  onReset: () => void;
}

const GunghapDisplay: React.FC<GunghapDisplayProps> = ({ result, user1, user2, onReset }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 fade-in">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <h1 className="font-cute text-lg font-bold text-gray-800">궁합 분석 결과</h1>
        <button onClick={onReset} className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 hover:bg-gray-200 transition">
          메뉴로
        </button>
      </header>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        
        {/* Score Card */}
        <section className="bg-gradient-to-br from-pink-50 to-red-50 rounded-3xl p-8 card-shadow text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -ml-10 -mb-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-gray-500 font-bold mb-2 text-sm">{user1.name} ❤️ {user2.name}</h2>
            <div className="text-6xl font-black text-pink-500 mb-2 drop-shadow-sm">
              {result.score}점
            </div>
            <p className="text-gray-700 font-medium text-lg leading-snug break-keep">
              "{result.summary}"
            </p>
          </div>
        </section>

        {/* Details Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard icon="🧩" title="성격 궁합" content={result.details.personalityMatch} />
          <DetailCard icon="💭" title="가치관 궁합" content={result.details.valueMatch} />
          <DetailCard icon="💌" title="연애 스타일" content={result.details.loveStyle} />
          <DetailCard icon="🔥" title="갈등 해결" content={result.details.conflictResolution} />
        </section>

        {/* Good & Bad Points */}
        <section className="bg-white rounded-3xl p-6 card-shadow">
          <h3 className="font-cute text-lg font-bold text-gray-800 mb-4">우리의 궁합 포인트</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center gap-2 font-bold text-green-600 mb-3 text-sm">
                <span className="bg-green-100 p-1 rounded">👍</span> 서로에게 좋은 점
              </h4>
              <ul className="space-y-2">
                {result.goodPoints.map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-green-400">•</span> {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h4 className="flex items-center gap-2 font-bold text-red-500 mb-3 text-sm">
                <span className="bg-red-100 p-1 rounded">⚠️</span> 주의해야 할 점
              </h4>
              <ul className="space-y-2">
                {result.badPoints.map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-red-300">•</span> {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Advice */}
        <section className="bg-gray-800 rounded-3xl p-6 text-white shadow-lg">
          <h3 className="font-cute text-lg font-bold mb-3 text-pink-300">💡 더 예쁜 사랑을 위한 조언</h3>
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
            {result.advice}
          </p>
        </section>

        {/* Share */}
        <div className="text-center pb-8 pt-4">
           <button 
             onClick={() => navigator.share ? navigator.share({ title: '우리 궁합 결과', url: window.location.href }) : alert('주소가 복사되었습니다.')}
             className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-300 transition"
           >
             궁합 결과 공유하기 📤
           </button>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, title, content }: { icon: string, title: string, content: string }) => (
  <div className="bg-white p-5 rounded-2xl card-shadow border border-gray-50">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xl">{icon}</span>
      <h4 className="font-bold text-gray-800">{title}</h4>
    </div>
    <p className="text-sm text-gray-600 leading-relaxed text-justify break-keep">
      {content}
    </p>
  </div>
);

export default GunghapDisplay;