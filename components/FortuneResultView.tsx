import React from 'react';
import { FortuneResult } from '../types';
import PillarCard from './PillarCard';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, Heart, Briefcase, Sparkles, Quote } from 'lucide-react';

interface FortuneResultViewProps {
  result: FortuneResult;
  onReset: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const FortuneResultView: React.FC<FortuneResultViewProps> = ({ result, onReset }) => {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-5xl mx-auto pb-12 px-4"
    >
      
      {/* Header Section */}
      <motion.div variants={item} className="text-center mb-10">
        <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold tracking-widest mb-3">
          2026 丙午年 REPORT
        </div>
        <h2 className="text-3xl md:text-4xl font-batang font-bold text-white mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{result.userName}</span>님의 신년 운세
        </h2>
        <p className="text-slate-400 text-sm">사주팔자를 기반으로 분석한 당신의 2026년 흐름입니다.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pillars & Personal Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pillars */}
          <motion.div variants={item} className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
             <h3 className="text-slate-300 font-batang mb-4 text-center border-b border-white/5 pb-2">사주 원국 (四柱)</h3>
             <div className="grid grid-cols-4 gap-2 justify-items-center">
              <PillarCard label="시주" pillar={result.pillars.hour} />
              <PillarCard label="일주" pillar={result.pillars.day} />
              <PillarCard label="월주" pillar={result.pillars.month} />
              <PillarCard label="년주" pillar={result.pillars.year} />
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">당신의 중심 기운은 <span className="text-amber-400 font-bold">{result.pillars.day.koreanStem}({result.pillars.day.heavenlyStem})</span> 입니다.</p>
            </div>
          </motion.div>

          {/* Lucky Items */}
          <motion.div variants={item} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
             <h3 className="flex items-center gap-2 text-amber-300 font-batang mb-4 relative z-10">
               <Sparkles className="w-4 h-4" /> 행운의 열쇠
             </h3>
             <ul className="space-y-3 relative z-10">
              {result.luckyItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">{idx + 1}</span>
                  <span className="text-slate-200 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right Column: Detailed Analysis */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Overall Luck */}
          <motion.div variants={item} className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative">
            <h3 className="text-2xl font-batang text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
              총운
            </h3>
            <p className="text-slate-300 leading-8 text-lg whitespace-pre-wrap font-serif">
              {result.overallLuck}
            </p>
          </motion.div>

          {/* Grid for Specific Lucks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Wealth */}
            <motion.div variants={item} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="font-batang text-lg text-slate-200">재물운</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{result.wealthLuck}</p>
            </motion.div>

            {/* Career */}
            <motion.div variants={item} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="font-batang text-lg text-slate-200">직업/학업</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{result.careerLuck}</p>
            </motion.div>

            {/* Love */}
            <motion.div variants={item} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-batang text-lg text-slate-200">애정운</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{result.loveLuck}</p>
            </motion.div>

            {/* Advice */}
            <motion.div variants={item} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:bg-slate-800/40 transition-colors">
               <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Quote className="w-5 h-5" />
                </div>
                <h4 className="font-batang text-lg text-slate-200">조언</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-emerald-500/30 pl-3">
                "{result.advice}"
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div variants={item} className="flex justify-center pt-12">
        <button
          onClick={onReset}
          className="group flex items-center gap-2 px-8 py-3 bg-white text-slate-900 hover:bg-slate-200 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-white/10"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          다른 사주 보기
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FortuneResultView;