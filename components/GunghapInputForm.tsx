import React, { useState } from 'react';
import { UserSajuData, Gender, CalendarType } from '../types';

interface GunghapInputFormProps {
  onSubmit: (user1: UserSajuData, user2: UserSajuData) => void;
  onBack: () => void;
}

const GunghapInputForm: React.FC<GunghapInputFormProps> = ({ onSubmit, onBack }) => {
  const [activeTab, setActiveTab] = useState<0 | 1>(0); // 0 for Me, 1 for Partner

  // User 1 Data
  const [name1, setName1] = useState('');
  const [gender1, setGender1] = useState<Gender>(Gender.MALE);
  const [birthDate1, setBirthDate1] = useState('');
  const [birthTime1, setBirthTime1] = useState('');
  const [calendarType1, setCalendarType1] = useState<CalendarType>(CalendarType.SOLAR);
  const [birthRegion1, setBirthRegion1] = useState('서울');
  const [isUnknownTime1, setIsUnknownTime1] = useState(false);

  // User 2 Data
  const [name2, setName2] = useState('');
  const [gender2, setGender2] = useState<Gender>(Gender.FEMALE);
  const [birthDate2, setBirthDate2] = useState('');
  const [birthTime2, setBirthTime2] = useState('');
  const [calendarType2, setCalendarType2] = useState<CalendarType>(CalendarType.SOLAR);
  const [birthRegion2, setBirthRegion2] = useState('서울');
  const [isUnknownTime2, setIsUnknownTime2] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name1 || !birthDate1 || !name2 || !birthDate2) return;

    const user1Data: UserSajuData = {
      name: name1,
      gender: gender1,
      birthDate: birthDate1,
      birthTime: isUnknownTime1 ? 'unknown' : birthTime1 || '00:00',
      calendarType: calendarType1,
      birthRegion: birthRegion1
    };

    const user2Data: UserSajuData = {
      name: name2,
      gender: gender2,
      birthDate: birthDate2,
      birthTime: isUnknownTime2 ? 'unknown' : birthTime2 || '00:00',
      calendarType: calendarType2,
      birthRegion: birthRegion2
    };

    onSubmit(user1Data, user2Data);
  };

  const isUser1Complete = name1 && birthDate1;
  const isUser2Complete = name2 && birthDate2;

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 px-4 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl relative fade-in">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 font-cute">
          궁합 정보 입력 💞
        </h2>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab(0)}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 0 ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
          >
            본인 정보 {isUser1Complete && '✅'}
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 1 ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
          >
            상대방 정보 {isUser2Complete && '✅'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 0 ? (
            <FormSection 
              name={name1} setName={setName1}
              gender={gender1} setGender={setGender1}
              birthDate={birthDate1} setBirthDate={setBirthDate1}
              birthTime={birthTime1} setBirthTime={setBirthTime1}
              calendarType={calendarType1} setCalendarType={setCalendarType1}
              birthRegion={birthRegion1} setBirthRegion={setBirthRegion1}
              isUnknownTime={isUnknownTime1} setIsUnknownTime={setIsUnknownTime1}
            />
          ) : (
            <FormSection 
              name={name2} setName={setName2}
              gender={gender2} setGender={setGender2}
              birthDate={birthDate2} setBirthDate={setBirthDate2}
              birthTime={birthTime2} setBirthTime={setBirthTime2}
              calendarType={calendarType2} setCalendarType={setCalendarType2}
              birthRegion={birthRegion2} setBirthRegion={setBirthRegion2}
              isUnknownTime={isUnknownTime2} setIsUnknownTime={setIsUnknownTime2}
              isPartner
            />
          )}

          <div className="pt-4">
            {activeTab === 0 ? (
              <button
                type="button"
                onClick={() => setActiveTab(1)}
                className="w-full bg-indigo-50 text-indigo-700 font-bold text-lg py-4 rounded-2xl hover:bg-indigo-100 transition-all"
              >
                다음: 상대방 입력하기 👉
              </button>
            ) : (
              <button 
                type="submit"
                disabled={!isUser1Complete || !isUser2Complete}
                className={`w-full font-bold text-lg py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 
                  ${(!isUser1Complete || !isUser2Complete) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-pink-500 text-white hover:bg-pink-600'}
                `}
              >
                {!isUser1Complete ? '본인 정보를 입력해주세요' : '두근두근 궁합 보기 💘'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const FormSection = ({ 
  name, setName, gender, setGender, birthDate, setBirthDate, birthTime, setBirthTime,
  calendarType, setCalendarType, birthRegion, setBirthRegion, isUnknownTime, setIsUnknownTime, isPartner
}: any) => (
  <div className="space-y-6 animate-fadeIn">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 pl-1">{isPartner ? '상대방 이름' : '이름'}</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isPartner ? "연인 이름" : "홍길동"}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300 transition-all"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 pl-1">성별</label>
        <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
          {Object.values(Gender).map((g: any) => (
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

    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-500 pl-1">생년월일</label>
      <div className="flex gap-2 mb-2">
        {Object.values(CalendarType).map((t: any) => (
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
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300 transition-all"
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 pl-1">시간</label>
        <div className="relative">
          <input 
            type="time" 
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            disabled={isUnknownTime}
            className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300 transition-all ${isUnknownTime ? 'opacity-30' : ''}`}
          />
        </div>
        <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs text-gray-500">
          <input 
            type="checkbox" 
            checked={isUnknownTime}
            onChange={(e) => setIsUnknownTime(e.target.checked)}
            className="rounded text-pink-500 focus:ring-pink-200"
          />
          시간 모름
        </label>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 pl-1">지역</label>
        <input 
          type="text" 
          value={birthRegion}
          onChange={(e) => setBirthRegion(e.target.value)}
          placeholder="서울"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300 transition-all"
          required
        />
      </div>
    </div>
  </div>
);

export default GunghapInputForm;