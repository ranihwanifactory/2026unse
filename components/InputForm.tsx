import React, { useState } from 'react';
import { UserSajuData, Gender, CalendarType } from '../types';

interface InputFormProps {
  onSubmit: (data: UserSajuData) => void;
  onBack: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [calendarType, setCalendarType] = useState<CalendarType>(CalendarType.SOLAR);
  const [isUnknownTime, setIsUnknownTime] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate) return;
    
    onSubmit({
      name,
      gender,
      birthDate,
      birthTime: isUnknownTime ? 'unknown' : birthTime || '00:00',
      calendarType,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 relative fade-in">
       <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
      >
        ← 돌아가기
      </button>

      <div className="w-full max-w-lg bg-[#1a0b14]/90 border border-[#3d1c26] p-8 md:p-12 rounded-sm shadow-2xl relative glow-border backdrop-blur-sm">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#2a0a18] px-4 py-1 border border-[#5c2e2e]">
          <span className="font-title text-yellow-500 text-lg">사주 정보 입력</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-gray-400 text-sm">성함 (Name)</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full bg-[#0f0518] border-b border-[#5c2e2e] focus:border-red-500 text-gray-200 py-2 px-1 outline-none transition-colors text-center text-lg"
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="block text-gray-400 text-sm mb-2">성별 (Gender)</label>
            <div className="flex gap-4 justify-center">
              {Object.values(Gender).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 px-4 border ${gender === g ? 'bg-[#3d1024] border-red-500 text-red-100' : 'border-[#2e1a2e] text-gray-500 hover:border-gray-500'} transition-all`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Birth Date & Calendar Type */}
          <div className="space-y-2">
            <label className="block text-gray-400 text-sm">생년월일 (Birth Date)</label>
            <div className="flex gap-2 mb-2">
               {Object.values(CalendarType).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCalendarType(t)}
                  className={`text-xs py-1 px-3 border rounded-full ${calendarType === t ? 'bg-[#3d1024] border-red-500 text-white' : 'border-[#2e1a2e] text-gray-500'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input 
              type="date" 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-[#0f0518] border border-[#2e1a2e] text-gray-200 py-3 px-4 rounded-sm outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          {/* Birth Time */}
          <div className="space-y-2">
            <label className="block text-gray-400 text-sm">태어난 시간 (Birth Time)</label>
            <div className="flex items-center gap-4">
              <input 
                type="time" 
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                disabled={isUnknownTime}
                className={`flex-1 bg-[#0f0518] border border-[#2e1a2e] text-gray-200 py-3 px-4 rounded-sm outline-none focus:border-red-500 transition-colors ${isUnknownTime ? 'opacity-30' : ''}`}
                required={!isUnknownTime}
              />
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400">
                <input 
                  type="checkbox" 
                  checked={isUnknownTime}
                  onChange={(e) => setIsUnknownTime(e.target.checked)}
                  className="accent-red-700 w-4 h-4"
                />
                시간 모름
              </label>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#3d1024] to-[#5c1c2c] hover:from-[#5c1c2c] hover:to-[#7a2e3e] text-white font-title text-xl py-4 rounded-sm shadow-lg border border-red-900/30 transition-all transform hover:-translate-y-1"
            >
              운세 확인하기
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default InputForm;