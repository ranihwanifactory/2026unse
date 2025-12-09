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
  const [birthRegion, setBirthRegion] = useState('서울'); // Default region
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
      birthRegion
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 px-4 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-xl relative fade-in">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8 font-cute">
          사주 정보 입력 📝
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 pl-1">이름</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 pl-1">성별</label>
              <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
                {Object.values(Gender).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${gender === g ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Birth Date & Calendar */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 pl-1">생년월일</label>
            <div className="flex gap-2 mb-2">
              {Object.values(CalendarType).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCalendarType(t)}
                  className={`text-xs py-1 px-3 rounded-full border transition-colors ${calendarType === t ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input 
              type="date" 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
              required
            />
          </div>

          {/* Birth Time & Region */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 pl-1">태어난 시간</label>
              <div className="relative">
                <input 
                  type="time" 
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  disabled={isUnknownTime}
                  className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all ${isUnknownTime ? 'opacity-30' : ''}`}
                  required={!isUnknownTime}
                />
              </div>
              <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs text-gray-500">
                <input 
                  type="checkbox" 
                  checked={isUnknownTime}
                  onChange={(e) => setIsUnknownTime(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-200"
                />
                시간 모름
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 pl-1">출생 지역 (시/군)</label>
              <input 
                type="text" 
                value={birthRegion}
                onChange={(e) => setBirthRegion(e.target.value)}
                placeholder="서울, 부산 등"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-gray-800 transition-all transform hover:-translate-y-1 mt-4"
          >
            분석 시작하기 ✨
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;