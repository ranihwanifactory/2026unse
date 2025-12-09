import React from 'react';
import { ManseResult, UserSajuData, Pillar } from '../types';

interface FortuneDisplayProps {
  result: ManseResult;
  userData: UserSajuData;
  onReset: () => void;
  onOpenProfile: () => void;
  isGuest: boolean;
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

const FortuneDisplay: React.FC<FortuneDisplayProps> = ({ result, userData, onReset, onOpenProfile, isGuest }) => {
  
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
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <h1 className="font-cute text-lg font-bold text-gray-800">내운명 만세력</h1>
        <div className="flex gap-2">
          <button onClick={onReset} className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition" title="홈으로">
            🏠
          </button>
          <button onClick={onOpenProfile} className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition" title={isGuest ? "로그인" : "프로필"}>
            {isGuest ? '🔐' : '👤'}
          </button>
        </div>
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

        {/* New: Strength Index (Sinkang/Sinyak) */}
        <section className="bg-white rounded-3xl p-6 card-shadow">
          <h3 className="font-cute text-lg font-bold text-gray-800 mb-4">💪 신강 / 신약 지수</h3>
          <div className="relative pt-6 pb-2">
            {/* Background Bar */}
            <div className="h-4 w-full rounded-full bg-gradient-to-r from-blue-200 via-gray-200 to-red-300"></div>
            
            {/* Markers */}
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold">
              <span>극신약</span>
              <span>신약</span>
              <span>중화</span>
              <span>신강</span>
              <span>극신강</span>
            </div>

            {/* Indicator */}
            <div 
              className="absolute top-4 w-6 h-6 bg-white border-4 border-gray-800 rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
              style={{ left: `${Math.min(Math.max(result.strength.score, 0), 100)}%` }}
            ></div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-xl font-bold text-gray-800">{result.strength.label}</span>
            <p className="text-sm text-gray-500 mt-1">{result.strength.description}</p>
          </div>
        </section>

        {/* New: Ohaeng Relationship Diagram (My Ohaeng) */}
        <section className="bg-white rounded-3xl p-6 card-shadow">
          <h3 className="font-cute text-lg font-bold text-gray-800 mb-4">🌟 나의 오행 관계도</h3>
          <p className="text-xs text-gray-500 mb-6 text-center">가운데가 '나'를 뜻하며 화살표는 기운의 흐름(생/극)을 나타냅니다.</p>
          
          <div className="flex justify-center">
            <OhaengRelationChart myElement={result.userInfo.element} />
          </div>

          <div className="mt-6 grid grid-cols-5 gap-1 text-center text-xs">
             <div className="bg-green-100 p-2 rounded-lg text-green-800">목<br/>{result.ohaeng.wood}%</div>
             <div className="bg-red-100 p-2 rounded-lg text-red-800">화<br/>{result.ohaeng.fire}%</div>
             <div className="bg-yellow-100 p-2 rounded-lg text-yellow-800">토<br/>{result.ohaeng.earth}%</div>
             <div className="bg-gray-100 p-2 rounded-lg text-gray-800">금<br/>{result.ohaeng.metal}%</div>
             <div className="bg-blue-100 p-2 rounded-lg text-blue-800">수<br/>{result.ohaeng.water}%</div>
          </div>
        </section>

        {/* Shipseong Analysis (Bar Chart) */}
        <section className="bg-white rounded-3xl p-6 card-shadow">
          <h3 className="font-cute text-lg font-bold text-gray-800 mb-4">🔮 십성 분석 (기질 분포)</h3>
          <div className="space-y-4">
            <ShipseongBar label="비겁 (나와 같은 기운 / 주체성)" value={result.shipseong.bi} color="bg-indigo-400" />
            <ShipseongBar label="식상 (표현력 / 재능)" value={result.shipseong.sik} color="bg-pink-400" />
            <ShipseongBar label="재성 (재물운 / 결과)" value={result.shipseong.jae} color="bg-green-400" />
            <ShipseongBar label="관성 (직업 / 명예)" value={result.shipseong.gwan} color="bg-gray-400" />
            <ShipseongBar label="인성 (학업 / 사랑)" value={result.shipseong.in} color="bg-yellow-400" />
          </div>
          <p className="text-xs text-gray-400 mt-4 text-right">* 각 기질의 비율이 높을수록 해당 성향이 강하게 나타납니다.</p>
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

// Helper for Shipseong Bar
const ShipseongBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-xs font-bold text-gray-600">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-1000`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

// Helper SVG Chart for My Ohaeng Relation
const OhaengRelationChart = ({ myElement }: { myElement: string }) => {
  // Simple circular layout for Wood -> Fire -> Earth -> Metal -> Water -> Wood
  const elements = [
    { name: '목', color: '#4ade80', cx: 100, cy: 30 },
    { name: '화', color: '#f87171', cx: 170, cy: 80 },
    { name: '토', color: '#facc15', cx: 150, cy: 160 },
    { name: '금', color: '#94a3b8', cx: 50, cy: 160 },
    { name: '수', color: '#60a5fa', cx: 30, cy: 80 },
  ];

  // Map element character (including possible english) to index
  const getIndex = (el: string) => {
    if (el.includes('목') || el.includes('Wood')) return 0;
    if (el.includes('화') || el.includes('Fire')) return 1;
    if (el.includes('토') || el.includes('Earth')) return 2;
    if (el.includes('금') || el.includes('Metal')) return 3;
    if (el.includes('수') || el.includes('Water')) return 4;
    return 0; // Default
  };

  const myIdx = getIndex(myElement);

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {/* Connecting Lines (Pentagon) */}
      <polygon points="100,30 170,80 150,160 50,160 30,80" fill="none" stroke="#e2e8f0" strokeWidth="2" />
      
      {/* Arrows indicating flow (simplified) */}
      <path d="M100 30 L160 75" stroke="#e2e8f0" strokeWidth="1" markerEnd="url(#arrow)" />
      <path d="M170 80 L155 150" stroke="#e2e8f0" strokeWidth="1" markerEnd="url(#arrow)" />
      <path d="M150 160 L60 160" stroke="#e2e8f0" strokeWidth="1" markerEnd="url(#arrow)" />
      <path d="M50 160 L35 90" stroke="#e2e8f0" strokeWidth="1" markerEnd="url(#arrow)" />
      <path d="M30 80 L90 35" stroke="#e2e8f0" strokeWidth="1" markerEnd="url(#arrow)" />

      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#cbd5e1" />
        </marker>
      </defs>

      {/* Nodes */}
      {elements.map((el, i) => (
        <g key={i}>
          <circle 
            cx={el.cx} 
            cy={el.cy} 
            r={i === myIdx ? 18 : 14} 
            fill={el.color} 
            className="transition-all duration-500"
            stroke={i === myIdx ? "#fff" : "none"}
            strokeWidth={i === myIdx ? 3 : 0}
            style={{ filter: i === myIdx ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : '' }}
          />
          <text 
            x={el.cx} 
            y={el.cy} 
            dy="0.3em" 
            textAnchor="middle" 
            fill={i === myIdx ? "#333" : "#fff"} 
            fontSize={i === myIdx ? "14" : "10"} 
            fontWeight="bold"
          >
            {el.name}
          </text>
          {i === myIdx && (
             <text x={el.cx} y={el.cy - 25} textAnchor="middle" fontSize="10" fill="#666" fontWeight="bold">나(Me)</text>
          )}
        </g>
      ))}
    </svg>
  );
};

export default FortuneDisplay;