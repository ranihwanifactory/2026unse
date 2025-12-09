import React from 'react';
import { CelebMatchResult, UserSajuData } from '../types';

interface CelebMatchDisplayProps {
  result: CelebMatchResult;
  userData: UserSajuData;
  onReset: () => void;
  onOpenProfile: () => void;
  isGuest: boolean;
}

const CelebMatchDisplay: React.FC<CelebMatchDisplayProps> = ({ result, userData, onReset, onOpenProfile, isGuest }) => {
  
  const handleSearchCeleb = () => {
    const query = `${result.celebrityName} ${result.celebrityJob}`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 fade-in">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <h1 className="font-cute text-lg font-bold text-gray-800">내 연예인 짝꿍은?</h1>
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
        
        {/* Match Card */}
        <section className="bg-white rounded-3xl p-8 card-shadow text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-pink-100 to-white z-0"></div>
          
          <div className="relative z-10 mt-4">
             <div className="flex items-center justify-center gap-4 mb-6">
                {/* User Avatar */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl border-4 border-white shadow-md">
                     {userData.gender === '남성' ? '👦' : '👧'}
                  </div>
                  <span className="text-sm font-bold text-gray-700 mt-2">{userData.name}</span>
                  <span className="text-xs text-gray-400">({result.userElement || '?'})</span>
                </div>

                <div className="text-pink-500 text-2xl animate-pulse">❤️</div>

                {/* Celeb Avatar Placeholder */}
                <div className="flex flex-col items-center cursor-pointer" onClick={handleSearchCeleb}>
                  <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center text-4xl border-4 border-white shadow-md hover:scale-105 transition-transform">
                     🌟
                  </div>
                  <span className="text-sm font-bold text-gray-700 mt-2">{result.celebrityName}</span>
                  <span className="text-xs text-gray-400">({result.celebElement || '?'})</span>
                </div>
             </div>

             <div className="mb-6">
                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1 block">Compatibility Score</span>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 drop-shadow-sm">
                   {result.compatibilityScore}점
                </div>
             </div>

             <div className="flex justify-center gap-2 mb-6">
                {result.keywords.map((kw, i) => (
                   <span key={i} className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-bold">
                      #{kw}
                   </span>
                ))}
             </div>

             <button 
               onClick={handleSearchCeleb}
               className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold shadow-lg hover:bg-gray-800 transition-transform active:scale-95 flex items-center gap-2 mx-auto"
             >
               <span>🔍</span> {result.celebrityName} 사진 보기
             </button>
          </div>
        </section>

        {/* Reason */}
        <section className="bg-white rounded-3xl p-6 card-shadow">
          <h3 className="font-cute text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            📝 매칭 분석 리포트
          </h3>
          <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-700 leading-relaxed text-justify whitespace-pre-line">
            {result.matchReason}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="text-center text-xs text-gray-400 px-4">
           * 이 결과는 사주 오행 이론을 바탕으로 한 재미있는 매칭 결과입니다.<br/>
           실제 연예인의 정확한 생시를 알 수 없으므로 오차가 있을 수 있습니다.
        </div>

        {/* Share */}
        <div className="text-center pb-8 pt-4">
           <button 
             onClick={() => navigator.share ? navigator.share({ title: `내 연예인 짝꿍은 ${result.celebrityName}!`, url: window.location.href }) : alert('주소가 복사되었습니다.')}
             className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-300 transition"
           >
             결과 공유하기 📤
           </button>
        </div>

      </div>
    </div>
  );
};

export default CelebMatchDisplay;