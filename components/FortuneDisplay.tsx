import React from 'react';
import { ManseResult, UserSajuData, Pillar } from '../types';

interface FortuneDisplayProps {
  result: ManseResult;
  userData: UserSajuData;
  onReset: () => void;
}

// Element Color Helper
const getElementColor = (element: string) => {
  if (element.includes('목') || element.includes('Wood')) return 'text-green-600 bg-green-50 border-green-200';
  if (element.includes('화') || element.includes('Fire')) return 'text-red-500 bg-red-50 border-red-200';
  if (element.includes('토') || element.includes('Earth')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (element.includes('금') || element.includes('Metal')) return 'text-gray-500 bg-gray-50 border-gray-200';
  if (element.includes('수') || element.includes('Water')) return 'text-blue-600 bg-blue-50 border-blue-200';
  return 'text-gray-800 bg-gray-50';
};

const FortuneDisplay: React.FC<FortuneDisplayProps> = ({ result, userData, onReset }) => {
  
  // Calculate Ohaeng chart gradient
  const total = 100;
  let currentAngle = 0;
  const gradientParts = [
    { el: '목', val: result.ohaeng.wood, color: '#4ade80' },
    { el: '화', val: result.ohaeng.fire, color: '#f87171' },
    { el: '토', val: result.ohaeng.earth, color: '#facc15' },
    { el: '금', val: result.ohaeng.metal, color: '#94a3b8' },
    { el: '수', val: result.ohaeng.water, color: '#60a5fa' },
  ].map(p => {
    const start = currentAngle;
    const end = currentAngle + (p.val / total) * 360;
    currentAngle = end;
    return `${p.color} ${start}deg ${end}deg`;
  });

  const donutStyle = {
    background: `conic-gradient(${gradientParts.join(', ')})`
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 fade-in">
      {/* Top Navigation / Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <h1 className="font-cute text-lg font-bold text-gray-800">내운명 만세력</h1>
        <button onClick={onReset} className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 hover:bg-gray-200 transition">
          다시 입력
        </button>
      </header>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        
        {/* User Profile Card */}
        <section className="bg-white rounded-3xl p-6 card-shadow flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
          
          <div className="z-10 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-4xl shadow-sm border-4 border-white">
            {userData.gender === '남성' ? '👦' : '👧'}
          </div>
          <div className="z-10">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-800">{userData.name}</h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{userData.gender}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{userData.birthDate} {userData.birthTime === 'unknown' ? '' : userData.birthTime} ({userData.birthRegion})</p>
            <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg">
              {result.userInfo.color} {result.userInfo.animal}의 기운
            </div>
          </div>
        </section>

        {/* Manse Chart (The 4 Pillars) */}
        <section className="bg-white rounded-3xl p-6 card-shadow">
          <h3 className="font-cute text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            📊 사주 원국 (Four Pillars)
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            나를 이루고 있는 4가지 기둥입니다. 한자 밑에 한글 독음을 참고하세요.
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {['시주 (말년)', '일주 (나)', '월주 (사회)', '연주 (초년)'].map((label, i) => (
              <div key={i} className="text-xs text-gray-500 font-bold mb-1">{label}</div>
            ))}
            
            {/* Stems (Top Row) */}
            <PillarCard pillar={result.pillars.time} part="stem" />
            <PillarCard pillar={result.pillars.day} part="stem" highlight />
            <PillarCard pillar={result.pillars.month} part="stem" />
            <PillarCard pillar={result.pillars.year} part="stem" />

            {/* Branches (Bottom Row) */}
            <PillarCard pillar={result.pillars.time} part="branch" />
            <PillarCard pillar={result.pillars.day} part="branch" highlight />
            <PillarCard pillar={result.pillars.month} part="branch" />
            <PillarCard pillar={result.pillars.year} part="branch" />
            
            {/* Ten Gods (Label) */}
            <div className="text-[10px] text-gray-400 mt-1">{result.pillars.time.branch.tenGod}</div>
            <div className="text-[10px] text-indigo-500 font-bold mt-1">본원</div>
            <div className="text-[10px] text-gray-400 mt-1">{result.pillars.month.branch.tenGod}</div>
            <div className="text-[10px] text-gray-400 mt-1">{result.pillars.year.branch.tenGod}</div>
          </div>

          {/* Pillars Analysis Detail */}
          <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
             <h4 className="font-cute text-md font-bold text-gray-700">📜 내 사주 기둥 상세 풀이</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AnalysisBox title="일주 (나 자신)" content={result.pillarAnalysis.day} highlight />
                <AnalysisBox title="월주 (사회/부모)" content={result.pillarAnalysis.month} />
                <AnalysisBox title="연주 (초년/조상)" content={result.pillarAnalysis.year} />
                <AnalysisBox title="시주 (말년/자식)" content={result.pillarAnalysis.time} />
             </div>
          </div>
        </section>

        {/* Ohaeng Chart */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 card-shadow">
            <h3 className="font-cute text-lg font-bold text-gray-800 mb-4">오행 분석</h3>
            <div className="flex items-center justify-center gap-8">
              {/* Donut Chart */}
              <div className="relative w-32 h-32 rounded-full" style={donutStyle}>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                  <span className="text-xs text-gray-400">가장 강한</span>
                  <span className="font-bold text-lg text-gray-800">
                    {Object.entries(result.ohaeng).reduce((a, b) => 
                      (typeof a[1] === 'number' && typeof b[1] === 'number' && a[1] > b[1]) ? a : b
                    )[0] === 'wood' ? '목(Wood)' :
                    Object.entries(result.ohaeng).reduce((a, b) => (typeof a[1] === 'number' && typeof b[1] === 'number' && a[1] > b[1]) ? a : b)[0] === 'fire' ? '화(Fire)' :
                    Object.entries(result.ohaeng).reduce((a, b) => (typeof a[1] === 'number' && typeof b[1] === 'number' && a[1] > b[1]) ? a : b)[0] === 'earth' ? '토(Earth)' :
                    Object.entries(result.ohaeng).reduce((a, b) => (typeof a[1] === 'number' && typeof b[1] === 'number' && a[1] > b[1]) ? a : b)[0] === 'metal' ? '금(Metal)' : '수(Water)'}
                  </span>
                </div>
              </div>
              
              {/* Legend */}
              <div className="space-y-1 text-xs">
                {[
                  { l: '목(나무)', v: result.ohaeng.wood, c: 'bg-green-400' },
                  { l: '화(불)', v: result.ohaeng.fire, c: 'bg-red-400' },
                  { l: '토(땅)', v: result.ohaeng.earth, c: 'bg-yellow-400' },
                  { l: '금(쇠)', v: result.ohaeng.metal, c: 'bg-gray-400' },
                  { l: '수(물)', v: result.ohaeng.water, c: 'bg-blue-400' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.c}`}></div>
                    <span className="text-gray-600">{item.l}</span>
                    <span className="font-bold">{item.v}%</span>
                  </div>
                ))}
              </div>
            </div>
             {result.ohaeng.missing.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
                  💡 부족한 오행: <span className="font-bold text-gray-700">{result.ohaeng.missing.join(', ')}</span>
                </div>
              )}
          </div>

          <div className="bg-white rounded-3xl p-6 card-shadow flex flex-col">
            <h3 className="font-cute text-lg font-bold text-gray-800 mb-4">내 성격 키워드</h3>
            <div className="flex-1 bg-indigo-50 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed overflow-y-auto">
              {result.analysis.personality}
            </div>
          </div>
        </section>

        {/* Daewoon (Luck Cycles) */}
        <section className="bg-white rounded-3xl p-6 card-shadow">
          <h3 className="font-cute text-lg font-bold text-gray-800 mb-2">📅 대운 흐름 (10년 주기)</h3>
          <p className="text-xs text-gray-500 mb-4">대운은 10년마다 바뀌는 큰 운의 흐름을 말합니다.</p>
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x">
            {result.daewoon.map((cycle, idx) => (
              <div key={idx} className="flex-shrink-0 w-20 flex flex-col items-center bg-gray-50 rounded-xl p-3 border border-gray-100 snap-center">
                <span className="text-xs text-gray-400 mb-1">{cycle.age}세~</span>
                <div className="font-bold text-lg text-gray-800">{cycle.stem}{cycle.branch}</div>
                <div className="text-xs text-gray-500 mb-1">({cycle.stemHangul}{cycle.branchHangul})</div>
                <span className="text-[10px] text-indigo-400 mt-1">{cycle.tenGod}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2025 Prediction */}
        <section className="bg-gradient-to-br from-[#2a0a18] to-[#3d1024] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
          </div>
          
          <h3 className="font-cute text-xl font-bold mb-4 text-yellow-400">2025년 총운</h3>
          <p className="text-gray-200 leading-relaxed whitespace-pre-line text-sm md:text-base">
            {result.analysis.currentYearLuck}
          </p>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="font-bold text-sm text-pink-300 mb-2">💡 조언</h4>
            <p className="text-sm text-gray-300">{result.analysis.advice}</p>
          </div>
        </section>

        {/* Share Button */}
        <div className="text-center pb-8">
           <button 
             onClick={() => navigator.share ? navigator.share({ title: '내운명 만세력', url: window.location.href }) : alert('주소가 복사되었습니다.')}
             className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-300 transition"
           >
             내 사주 공유하기 📤
           </button>
        </div>

      </div>
    </div>
  );
};

// Helper Component for a single Pillar Cell
const PillarCard = ({ pillar, part, highlight }: { pillar: Pillar, part: 'stem' | 'branch', highlight?: boolean }) => {
  const data = pillar[part];
  const colorClass = getElementColor(data.element);

  return (
    <div className={`
      relative p-2 rounded-xl border flex flex-col items-center justify-center h-20 md:h-24
      ${colorClass} ${highlight ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}
    `}>
      <span className="text-[10px] opacity-70 mb-1">{data.tenGod}</span>
      <div className="flex flex-col items-center leading-none">
        <span className="text-2xl md:text-3xl font-serif font-bold">{data.char}</span>
        <span className="text-xs font-bold mt-1 opacity-80">({data.hangul})</span>
      </div>
      {part === 'branch' && 'animal' in data && <span className="text-[10px] mt-1">{data.animal}</span>}
      {part === 'stem' && <span className="text-[10px] mt-1 opacity-50">{data.element}</span>}
    </div>
  );
};

// Helper for detailed analysis box
const AnalysisBox = ({ title, content, highlight }: { title: string, content: string, highlight?: boolean }) => (
  <div className={`p-4 rounded-xl text-sm leading-relaxed ${highlight ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50 border border-gray-100'}`}>
    <h5 className={`font-bold mb-2 ${highlight ? 'text-indigo-800' : 'text-gray-700'}`}>{title}</h5>
    <p className="text-gray-600">{content}</p>
  </div>
);

export default FortuneDisplay;