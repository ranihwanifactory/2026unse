import React from 'react';
import { SamjaeResult, UserSajuData } from '../types';

interface SamjaeDisplayProps {
  result: SamjaeResult;
  userData: UserSajuData;
  onReset: () => void;
  onOpenProfile: () => void;
  isGuest: boolean;
}

const SamjaeDisplay: React.FC<SamjaeDisplayProps> = ({ result, userData, onReset, onOpenProfile, isGuest }) => {
  const currentYear = new Date().getFullYear();
  
  // Status Color Helper
  const getStatusBadgeColor = (status: string) => {
    if (status.includes('아님')) return 'bg-gray-100 text-gray-500';
    if (status.includes('들삼재')) return 'bg-red-100 text-red-600';
    if (status.includes('눌삼재')) return 'bg-orange-100 text-orange-600';
    if (status.includes('날삼재')) return 'bg-blue-100 text-blue-600';
    return 'bg-indigo-100 text-indigo-600';
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20 fade-in overflow-x-hidden">
      {/* Mystical Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center">
        <h1 className="font-cute text-lg font-bold text-indigo-300">나의 삼재 리포트</h1>
        <div className="flex gap-2">
          <button onClick={onReset} className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition">
            🏠
          </button>
          <button onClick={onOpenProfile} className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition">
            {isGuest ? '🔐' : '👤'}
          </button>
        </div>
      </header>

      <div className="max-w-xl mx-auto p-6 space-y-8">
        
        {/* Main Status Card */}
        <section className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-slate-900 to-black border border-indigo-500/30 text-center shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[80px]"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[80px]"></div>
          </div>

          <div className="relative z-10">
             <div className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4">
                {userData.name}님의 현재 상태
             </div>
             
             <h2 className="text-4xl font-black mb-2 tracking-tight">
                {result.currentStatus}
             </h2>
             
             <div className="flex justify-center items-center gap-2 mb-6">
                <span className="text-sm text-gray-400">당신은 {result.userAnimal}띠 입니다.</span>
                {result.isGoodSamjae && (
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded-md border border-yellow-500/30">
                    ✨ 복삼재(福三災)
                  </span>
                )}
             </div>

             {/* Samjae Timeline Visualization */}
             <div className="relative mt-10 mb-6 flex justify-between items-center px-4">
                <div className="absolute left-0 top-1/2 w-full h-[1px] bg-white/10 z-0"></div>
                
                {[
                  { label: '들삼재', year: result.years.deul, type: 'deul' },
                  { label: '눌삼재', year: result.years.nul, type: 'nul' },
                  { label: '날삼재', year: result.years.nal, type: 'nal' }
                ].map((item, idx) => {
                  const isCurrent = item.year === currentYear;
                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                       <div className={`w-3 h-3 rounded-full mb-3 ${isCurrent ? 'bg-indigo-400 ring-4 ring-indigo-400/20' : 'bg-gray-700'}`}></div>
                       <span className={`text-[10px] font-bold ${isCurrent ? 'text-indigo-300' : 'text-gray-500'}`}>{item.label}</span>
                       <span className={`text-xs ${isCurrent ? 'text-white font-bold' : 'text-gray-600'}`}>{item.year}년</span>
                       {isCurrent && (
                         <div className="absolute top-[-20px] bg-indigo-500 text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold animate-bounce">
                           현재
                         </div>
                       )}
                    </div>
                  )
                })}
             </div>
          </div>
        </section>

        {/* AI Analysis Detail */}
        <section className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
           <h3 className="font-cute text-lg font-bold text-indigo-300 flex items-center gap-2">
             📜 이번 삼재의 의미
           </h3>
           <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line bg-indigo-950/30 p-4 rounded-2xl border border-indigo-500/10">
             {result.analysis.meaning}
           </p>
        </section>

        {/* Caution Points */}
        <section className="space-y-4">
           <h3 className="font-cute text-lg font-bold text-red-400 flex items-center gap-2">
             ⚠️ 각별히 주의할 점
           </h3>
           <div className="grid grid-cols-1 gap-3">
              {result.analysis.caution.map((item, idx) => (
                <div key={idx} className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex gap-3 items-start">
                   <span className="text-red-400 font-bold">0{idx + 1}</span>
                   <p className="text-sm text-gray-200">{item}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Remedy Box */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 text-4xl opacity-20">🧿</div>
           <h3 className="font-cute text-lg font-bold text-white mb-3">🛡️ 액막이 비방 (Remedy)</h3>
           <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line italic">
             "{result.analysis.remedy}"
           </p>
        </section>

        {/* Info Disclaimer */}
        <p className="text-[10px] text-gray-500 text-center px-4 leading-relaxed">
          삼재는 인생의 겨울과 같은 시기입니다. 겨울이 지나면 반드시 봄이 오듯, 
          이 시기를 겸손하고 차분하게 보내면 더 큰 행운을 맞이할 수 있습니다. 
          재미와 참고용으로만 즐겨주세요.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
           <button 
             onClick={() => navigator.share ? navigator.share({ title: '나의 삼재 리포트', url: window.location.href }) : alert('주소가 복사되었습니다.')}
             className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition"
           >
             공유하기 📤
           </button>
           <button 
             onClick={onReset}
             className="w-full py-4 bg-transparent text-gray-500 rounded-2xl text-sm font-medium"
           >
             다른 운세 보러가기
           </button>
        </div>

      </div>
    </div>
  );
};

export default SamjaeDisplay;