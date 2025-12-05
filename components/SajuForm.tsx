import React, { useState } from 'react';
import { UserInfo, Gender, CalendarType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface SajuFormProps {
  onSubmit: (info: UserInfo) => void;
  isLoading: boolean;
}

const SajuForm: React.FC<SajuFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    gender: Gender.MALE,
    birthDate: '',
    birthTime: '',
    calendarType: CalendarType.SOLAR
  });

  const nextStep = () => {
    if (step === 1 && !formData.name) return;
    if (step === 2 && !formData.birthDate) return;
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
          <motion.div 
            className="h-full bg-amber-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="mb-8 mt-2 text-center">
          <h2 className="text-2xl font-batang font-bold text-white mb-1">
            {step === 1 && "누구의 운세를 볼까요?"}
            {step === 2 && "언제 태어나셨나요?"}
            {step === 3 && "정보가 맞는지 확인해주세요"}
          </h2>
          <p className="text-slate-400 text-sm">
             2026년 병오년(丙午年) 신년운세
          </p>
        </div>

        <AnimatePresence mode='wait' custom={step}>
          <motion.div
            key={step}
            custom={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="min-h-[280px] flex flex-col justify-center"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-amber-500 text-xs font-bold mb-2 uppercase tracking-wider">이름</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 focus:border-amber-500 text-white rounded-xl py-4 pl-10 pr-4 outline-none transition-all placeholder:text-slate-600"
                      placeholder="이름을 입력하세요"
                      autoFocus
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-amber-500 text-xs font-bold mb-2 uppercase tracking-wider">성별</label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.values(Gender).map((g) => (
                      <button
                        key={g}
                        onClick={() => setFormData({...formData, gender: g})}
                        className={clsx(
                          "py-4 rounded-xl border transition-all font-medium text-sm",
                          formData.gender === g
                            ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                            : "bg-slate-800/30 border-slate-700 text-slate-400 hover:bg-slate-800"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                   <div className="col-span-2">
                    <label className="block text-amber-500 text-xs font-bold mb-2 uppercase tracking-wider">생년월일</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-700 focus:border-amber-500 text-white rounded-xl py-4 pl-10 pr-4 outline-none transition-all"
                      />
                    </div>
                   </div>
                   <div>
                    <label className="block text-amber-500 text-xs font-bold mb-2 uppercase tracking-wider">양력/음력</label>
                    <select 
                      value={formData.calendarType}
                      onChange={(e) => setFormData({...formData, calendarType: e.target.value as CalendarType})}
                      className="w-full h-[58px] bg-slate-800/50 border border-slate-700 focus:border-amber-500 text-white rounded-xl px-2 outline-none text-sm"
                    >
                      {Object.values(CalendarType).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                   </div>
                </div>

                <div>
                  <label className="block text-amber-500 text-xs font-bold mb-2 uppercase tracking-wider">태어난 시간</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 focus:border-amber-500 text-white rounded-xl py-4 pl-10 pr-4 outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 ml-1">
                    * 시간을 정확히 모를 경우 00:00 (자시)으로 설정하세요.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 rounded-2xl p-6 border border-white/5 space-y-4">
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-slate-400 text-sm">이름</span>
                      <span className="text-white font-medium">{formData.name}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-slate-400 text-sm">성별</span>
                      <span className="text-white font-medium">{formData.gender}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-slate-400 text-sm">생년월일</span>
                      <span className="text-white font-medium">{formData.birthDate} ({formData.calendarType})</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">태어난 시간</span>
                      <span className="text-white font-medium">{formData.birthTime || "모름 (00:00)"}</span>
                   </div>
                </div>
                <div className="text-center">
                  <p className="text-amber-200/80 text-sm font-batang">
                    입력하신 정보로 2026년 운세를 분석합니다.<br/>
                    잠시 시간이 소요될 수 있습니다.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              이전
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={nextStep}
              disabled={(step === 1 && !formData.name) || (step === 2 && !formData.birthDate)}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="animate-pulse">분석 중...</span>
              ) : (
                <>
                  운세 확인하기
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SajuForm;