import React from 'react';
import { TravelRecommendResult, UserSajuData } from '../types';

interface TravelDisplayProps {
  result: TravelRecommendResult;
  userData: UserSajuData;
  onReset: () => void;
  onOpenProfile: () => void;
  isGuest: boolean;
}

const TravelDisplay: React.FC<TravelDisplayProps> = ({ result, userData, onReset, onOpenProfile, isGuest }) => {
  
  const handleSearchPlace = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query + " 여행")}&tbm=isch`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <h1 className="font-cute text-lg font-bold text-gray-800">행운의 여행지 ✈️</h1>
        <div className="flex gap-2">
          <button onClick={onReset} className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition" title="홈으로">
            🏠
          </button>
          <button onClick={onOpenProfile} className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition" title={isGuest ? "로그인" : "프로필"}>
            {isGuest ? '🔐' : '👤'}
          </button>
        </div>
      </header>

      <div className="max-w-xl mx-auto p-4 space-y-6">
        
        {/* Intro Analysis */}
        <section className="bg-white rounded-3xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
               🌿
             </div>
             <div>
               <h2 className="font-bold text-gray-800">{userData.name}님의 사주 분석</h2>
               <p className="text-xs text-gray-500">여행으로 운을 높여보세요!</p>
             </div>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl text-sm text-gray-700 leading-relaxed whitespace-pre-line border border-green-100">
            {result.elementAnalysis}
          </div>
        </section>

        {/* Domestic Recommendation */}
        <div className="relative">
          <div className="absolute top-[-10px] left-4 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
            🇰🇷 국내 추천
          </div>
          <section className="bg-white rounded-3xl p-6 card-shadow pt-8">
             <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-cute text-2xl font-bold text-gray-800">{result.domestic.place}</h3>
                  <p className="text-gray-500 text-sm font-medium">{result.domestic.location}</p>
                </div>
                <button 
                  onClick={() => handleSearchPlace(result.domestic.place)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  🔍
                </button>
             </div>
             
             <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                   <h4 className="font-bold text-blue-800 text-xs mb-1">💡 추천 이유</h4>
                   <p className="text-sm text-gray-700 leading-snug">{result.domestic.reason}</p>
                </div>
                <div>
                   <h4 className="font-bold text-gray-600 text-xs mb-1">✨ 추천 활동</h4>
                   <p className="text-sm text-gray-600">{result.domestic.activity}</p>
                </div>
             </div>
          </section>
        </div>

        {/* International Recommendation */}
        <div className="relative">
          <div className="absolute top-[-10px] left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
            ✈️ 해외 추천
          </div>
          <section className="bg-white rounded-3xl p-6 card-shadow pt-8">
             <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-cute text-2xl font-bold text-gray-800">{result.international.place}</h3>
                  <p className="text-gray-500 text-sm font-medium">{result.international.country}</p>
                </div>
                <button 
                  onClick={() => handleSearchPlace(result.international.place)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  🔍
                </button>
             </div>
             
             <div className="space-y-4">
                <div className="bg-purple-50 p-3 rounded-xl">
                   <h4 className="font-bold text-purple-800 text-xs mb-1">💡 추천 이유</h4>
                   <p className="text-sm text-gray-700 leading-snug">{result.international.reason}</p>
                </div>
                <div>
                   <h4 className="font-bold text-gray-600 text-xs mb-1">✨ 추천 활동</h4>
                   <p className="text-sm text-gray-600">{result.international.activity}</p>
                </div>
             </div>
          </section>
        </div>

        {/* Travel Tip */}
        <section className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg">
          <h3 className="font-cute text-lg font-bold mb-3 flex items-center gap-2">
            🎒 여행 개운법 (Travel Tip)
          </h3>
          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">
            {result.travelTip}
          </p>
        </section>

        {/* Share Button */}
        <div className="text-center pb-8 pt-4">
           <button 
             onClick={() => navigator.share ? navigator.share({ title: '나의 행운의 여행지', url: window.location.href }) : alert('주소가 복사되었습니다.')}
             className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-300 transition"
           >
             결과 공유하기 📤
           </button>
        </div>

      </div>
    </div>
  );
};

export default TravelDisplay;