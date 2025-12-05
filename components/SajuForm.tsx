import React, { useState } from 'react';
import { UserInfo, Gender, CalendarType } from '../types';

interface SajuFormProps {
  onSubmit: (info: UserInfo) => void;
  isLoading: boolean;
}

const SajuForm: React.FC<SajuFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    gender: Gender.MALE,
    birthDate: '',
    birthTime: '',
    calendarType: CalendarType.SOLAR
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.birthDate || !formData.name) return;
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md bg-slate-800/80 p-8 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-batang font-bold text-white mb-2">사주 정보 입력</h2>
        <p className="text-gray-400 text-sm">정확한 사주 분석을 위해 태어난 시간을 입력해주세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Name */}
        <div>
          <label className="block text-amber-500 text-sm font-bold mb-2 font-batang">이름</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-900/50 border border-slate-600 text-white rounded-lg p-3 focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="홍길동"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-amber-500 text-sm font-bold mb-2 font-batang">성별</label>
          <div className="flex gap-4">
            {Object.values(Gender).map((g) => (
              <label key={g} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={() => setFormData({...formData, gender: g})}
                  className="hidden"
                />
                <div className={`text-center p-3 rounded-lg border transition-all ${
                  formData.gender === g 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                    : 'bg-slate-900/30 border-slate-600 text-gray-500 hover:bg-slate-800'
                }`}>
                  {g}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Date & Calendar Type */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="block text-amber-500 text-sm font-bold mb-2 font-batang">생년월일</label>
            <input
              type="date"
              required
              value={formData.birthDate}
              onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-600 text-white rounded-lg p-3 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-amber-500 text-sm font-bold mb-2 font-batang">양력/음력</label>
            <select 
              value={formData.calendarType}
              onChange={(e) => setFormData({...formData, calendarType: e.target.value as CalendarType})}
              className="w-full h-[50px] bg-slate-900/50 border border-slate-600 text-white rounded-lg px-2 focus:outline-none focus:border-amber-500"
            >
              {Object.values(CalendarType).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="block text-amber-500 text-sm font-bold mb-2 font-batang">태어난 시간</label>
          <input
            type="time"
            value={formData.birthTime}
            onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
            className="w-full bg-slate-900/50 border border-slate-600 text-white rounded-lg p-3 focus:outline-none focus:border-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">* 시간을 모르면 00:00으로 설정하세요.</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-batang font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 ${
            isLoading 
              ? 'bg-slate-600 cursor-not-allowed text-gray-400' 
              : 'bg-gradient-to-r from-amber-600 to-red-600 text-white hover:from-amber-500 hover:to-red-500'
          }`}
        >
          {isLoading ? '운세 분석 중...' : '2026년 운세 확인하기'}
        </button>
      </form>
    </div>
  );
};

export default SajuForm;