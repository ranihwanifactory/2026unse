import React from 'react';
import { Pillar } from '../types';

interface PillarCardProps {
  label: string;
  pillar: Pillar;
}

const PillarCard: React.FC<PillarCardProps> = ({ label, pillar }) => {
  return (
    <div className="flex flex-col items-center p-3 bg-white/5 border border-white/10 rounded-lg shadow-lg backdrop-blur-sm min-w-[80px]">
      <span className="text-gray-400 text-xs mb-2 font-batang">{label}</span>
      <div className="flex flex-col items-center gap-1">
        {/* Heavenly Stem */}
        <div className={`text-4xl font-serif font-bold ${pillar.color}`}>
          {pillar.heavenlyStem}
        </div>
        <span className="text-xs text-gray-500">{pillar.koreanStem}</span>
        
        <div className="w-8 h-px bg-white/10 my-1"></div>
        
        {/* Earthly Branch */}
        <div className="text-4xl font-serif font-bold text-gray-200">
          {pillar.earthlyBranch}
        </div>
        <span className="text-xs text-gray-500">{pillar.koreanBranch}</span>
      </div>
    </div>
  );
};

export default PillarCard;