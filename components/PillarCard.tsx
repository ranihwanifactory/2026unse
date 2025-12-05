import React from 'react';
import { Pillar } from '../types';
import { clsx } from 'clsx';

interface PillarCardProps {
  label: string;
  pillar: Pillar;
}

const PillarCard: React.FC<PillarCardProps> = ({ label, pillar }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-indigo-500/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
      <div className="relative flex flex-col items-center p-4 bg-slate-900/80 border border-white/5 rounded-xl backdrop-blur-md min-w-[85px] transition-transform duration-300 group-hover:-translate-y-1">
        <span className="text-slate-400 text-[10px] tracking-widest uppercase mb-3 font-medium bg-slate-800 px-2 py-0.5 rounded-full">{label}</span>
        
        <div className="flex flex-col items-center gap-1.5 w-full">
          {/* Heavenly Stem */}
          <div className="flex flex-col items-center">
             <div className={clsx("text-3xl font-serif font-bold leading-none filter drop-shadow-lg", pillar.color)}>
              {pillar.heavenlyStem}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">{pillar.koreanStem}</span>
          </div>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1"></div>
          
          {/* Earthly Branch */}
          <div className="flex flex-col items-center">
            <div className="text-3xl font-serif font-bold text-slate-200 leading-none">
              {pillar.earthlyBranch}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">{pillar.koreanBranch}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PillarCard;