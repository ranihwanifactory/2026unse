import React from 'react';
import { FortuneResult } from '../types';
import PillarCard from './PillarCard';

interface FortuneResultViewProps {
  result: FortuneResult;
  onReset: () => void;
}

const FortuneResultView: React.FC<FortuneResultViewProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-batang font-bold text-amber-500">
          2026년 병오년(丙午年)
        </h2>
        <p className="text-gray-300">
          <span className="font-bold text-white">{result.userName}</span>님의 신년 운세
        </p>
      </div>

      {/* Pillars Display */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-amber-500/30">
        <h3 className="text-center text-amber-200 mb-6 font-batang text-lg">― 사주팔자 (四柱八字) ―</h3>
        <div className="grid grid-cols-4 gap-2 sm:gap-4 justify-items-center">
          <PillarCard label="시주 (시간)" pillar={result.pillars.hour} />
          <PillarCard label="일주 (나)" pillar={result.pillars.day} />
          <PillarCard label="월주 (환경)" pillar={result.pillars.month} />
          <PillarCard label="년주 (조상)" pillar={result.pillars.year} />
        </div>
      </div>

      {/* Main Fortune */}
      <div className="bg-slate-800/80 p-6 md:p-8 rounded-2xl shadow-xl border border-white/5">
        <h3 className="text-2xl font-batang font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-amber-500">✦</span> 총운
        </h3>
        <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
          {result.overallLuck}
        </p>
      </div>

      {/* Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 hover:border-amber-500/30 transition-colors">
          <h4 className="text-xl font-batang text-yellow-400 mb-3">💰 재물운</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{result.wealthLuck}</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 hover:border-amber-500/30 transition-colors">
          <h4 className="text-xl font-batang text-blue-400 mb-3">💼 직업/학업운</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{result.careerLuck}</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 hover:border-amber-500/30 transition-colors">
          <h4 className="text-xl font-batang text-pink-400 mb-3">💕 연애/대인관계</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{result.loveLuck}</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 hover:border-amber-500/30 transition-colors">
          <h4 className="text-xl font-batang text-green-400 mb-3">🌿 건강운</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{result.healthLuck}</p>
        </div>
      </div>

      {/* Lucky Items & Advice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gradient-to-br from-amber-900/40 to-slate-900 p-6 rounded-xl border border-amber-500/20">
          <h4 className="text-lg font-batang text-amber-200 mb-4 text-center">✨ 행운의 포인트</h4>
          <ul className="space-y-2">
            {result.luckyItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-200">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl border-l-4 border-amber-500 flex flex-col justify-center">
          <h4 className="text-sm font-batang text-gray-500 mb-2">마음을 다스리는 조언</h4>
          <p className="text-xl font-serif text-white italic">"{result.advice}"</p>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-batang transition-all transform hover:scale-105 shadow-lg border border-white/10"
        >
          다른 사주 보기
        </button>
      </div>
    </div>
  );
};

export default FortuneResultView;