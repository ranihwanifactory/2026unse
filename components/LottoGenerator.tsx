import React, { useState, useEffect } from 'react';
import { UserSajuData, LottoLuckResult } from '../types';
import { getLottoLuck } from '../services/fortuneService';

interface LottoGeneratorProps {
  userData: UserSajuData;
  onReset: () => void;
  onOpenProfile: () => void;
  isGuest: boolean;
}

type SelectionMode = 'INCLUDE' | 'EXCLUDE';

const LottoGenerator: React.FC<LottoGeneratorProps> = ({ userData, onReset, onOpenProfile, isGuest }) => {
  const [loading, setLoading] = useState(false);
  const [aiLuck, setAiLuck] = useState<LottoLuckResult | null>(null);
  
  // Selection State
  const [mode, setMode] = useState<SelectionMode>('INCLUDE');
  const [included, setIncluded] = useState<number[]>([]);
  const [excluded, setExcluded] = useState<number[]>([]);
  
  // Generated Results
  const [generatedSets, setGeneratedSets] = useState<number[][]>([]);

  // Initialize AI Data on Mount
  useEffect(() => {
    const fetchLuck = async () => {
      setLoading(true);
      try {
        const result = await getLottoLuck(userData);
        setAiLuck(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLuck();
  }, [userData]);

  const toggleNumber = (num: number) => {
    if (mode === 'INCLUDE') {
      // Logic for Including
      if (excluded.includes(num)) {
        alert("제외된 번호입니다. 제외 목록에서 먼저 해제해주세요.");
        return;
      }
      if (included.includes(num)) {
        setIncluded(prev => prev.filter(n => n !== num));
      } else {
        if (included.length >= 6) {
          alert("고정 번호는 최대 6개까지만 선택 가능합니다.");
          return;
        }
        setIncluded(prev => [...prev, num].sort((a, b) => a - b));
      }
    } else {
      // Logic for Excluding
      if (included.includes(num)) {
        alert("고정된 번호입니다. 고정 목록에서 먼저 해제해주세요.");
        return;
      }
      if (excluded.includes(num)) {
        setExcluded(prev => prev.filter(n => n !== num));
      } else {
        setExcluded(prev => [...prev, num].sort((a, b) => a - b));
      }
    }
  };

  const generateLotto = () => {
    const sets: number[][] = [];
    const pool = Array.from({ length: 45 }, (_, i) => i + 1).filter(n => !excluded.includes(n));

    // Validation
    const needed = 6 - included.length;
    if (pool.length < needed) {
      alert("가능한 번호 풀이 부족합니다. 제외 번호를 줄여주세요.");
      return;
    }

    // Generate 5 sets
    for (let i = 0; i < 5; i++) {
      const currentSet = [...included];
      const currentPool = [...pool].filter(n => !included.includes(n));
      
      while (currentSet.length < 6) {
        const randomIndex = Math.floor(Math.random() * currentPool.length);
        const pick = currentPool[randomIndex];
        currentSet.push(pick);
        currentPool.splice(randomIndex, 1);
      }
      sets.push(currentSet.sort((a, b) => a - b));
    }
    setGeneratedSets(sets);
  };

  const clearSelection = () => {
    setIncluded([]);
    setExcluded([]);
    setGeneratedSets([]);
  };

  // Helper to get ball color style
  const getBallStyle = (num: number) => {
    let bg = 'bg-gray-100 text-gray-800';
    if (num <= 10) bg = 'bg-yellow-400 text-white';
    else if (num <= 20) bg = 'bg-blue-500 text-white';
    else if (num <= 30) bg = 'bg-red-500 text-white';
    else if (num <= 40) bg = 'bg-gray-500 text-white';
    else bg = 'bg-green-500 text-white';
    return `${bg} rounded-full shadow-md font-bold flex items-center justify-center`;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <h1 className="font-cute text-lg font-bold text-gray-800">사주 로또 생성기 🎱</h1>
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
        
        {/* AI Analysis Section */}
        {loading ? (
          <div className="p-6 bg-white rounded-3xl card-shadow flex items-center justify-center gap-3">
             <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent"></div>
             <span className="text-gray-500 text-sm">사주를 분석하여 행운 수를 찾는 중...</span>
          </div>
        ) : aiLuck ? (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white card-shadow relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              ✨ {userData.name}님의 행운 분석
            </h3>
            <p className="text-sm text-indigo-100 mb-4 leading-relaxed">
              "{aiLuck.reason}"
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
               <span className="text-xs font-bold opacity-80">추천 번호:</span>
               {aiLuck.luckyNumbers.map(n => (
                 <span key={n} className="bg-white/20 px-2 py-0.5 rounded-md text-sm font-bold">{n}</span>
               ))}
            </div>
            <div className="flex gap-4 text-xs font-medium text-indigo-200">
               <span>🎨 행운색: {aiLuck.luckyColor}</span>
               <span>🧭 행운방위: {aiLuck.direction}</span>
            </div>
          </div>
        ) : null}

        {/* Generator Controls */}
        <div className="bg-white rounded-3xl p-6 card-shadow">
          <div className="flex justify-between items-center mb-4">
             <div className="flex gap-2">
                <button 
                  onClick={() => setMode('INCLUDE')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'INCLUDE' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
                >
                  고정수 (반자동)
                </button>
                <button 
                  onClick={() => setMode('EXCLUDE')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'EXCLUDE' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
                >
                  제외수
                </button>
             </div>
             <button onClick={clearSelection} className="text-xs text-gray-400 underline">초기화</button>
          </div>

          <p className="text-xs text-gray-500 mb-4 text-center">
            {mode === 'INCLUDE' 
              ? `꼭 넣고 싶은 번호를 선택하세요 (${included.length}/6)` 
              : `빼고 싶은 번호를 선택하세요 (${excluded.length}개 선택됨)`}
          </p>

          {/* Number Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {Array.from({length: 45}, (_, i) => i + 1).map(num => {
              const isIncluded = included.includes(num);
              const isExcluded = excluded.includes(num);
              
              let btnClass = "bg-gray-50 text-gray-600 hover:bg-gray-100";
              if (isIncluded) btnClass = "bg-green-500 text-white ring-2 ring-green-200 font-bold";
              if (isExcluded) btnClass = "bg-red-100 text-red-300 decoration-red-500 line-through";
              if (aiLuck?.luckyNumbers.includes(num) && !isIncluded && !isExcluded) btnClass += " ring-1 ring-yellow-400"; // Highlight lucky nums subtly

              return (
                <button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  className={`w-full aspect-square rounded-full text-xs transition-all ${btnClass}`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <button 
            onClick={generateLotto}
            className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-700 transition-transform active:scale-95 flex justify-center items-center gap-2"
          >
            <span>🔮</span>
            {included.length === 0 ? "완전 자동 생성" : "선택 조합 생성"}
          </button>
        </div>

        {/* Results */}
        {generatedSets.length > 0 && (
          <div className="space-y-3 animate-fadeIn">
            <h3 className="font-cute text-center text-lg font-bold text-gray-800">생성된 조합</h3>
            {generatedSets.map((set, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 card-shadow flex justify-between items-center">
                <span className="font-mono font-bold text-gray-400 w-6">{String.fromCharCode(65 + idx)}</span>
                <div className="flex gap-2">
                  {set.map(num => (
                    <div key={num} className={`w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm ${getBallStyle(num)}`}>
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pb-8 text-xs text-gray-400">
          * 생성된 번호는 재미로만 봐주세요. 과몰입은 금물!
        </div>

      </div>
    </div>
  );
};

export default LottoGenerator;