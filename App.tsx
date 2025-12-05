import React, { useState } from 'react';
import SajuForm from './components/SajuForm';
import FortuneResultView from './components/FortuneResultView';
import LoadingScreen from './components/LoadingScreen';
import { UserInfo, FortuneResult, AppState } from './types';
import { generateFortune } from './services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [fortuneResult, setFortuneResult] = useState<FortuneResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFormSubmit = async (info: UserInfo) => {
    setAppState(AppState.LOADING);
    setErrorMsg(null);

    try {
      const result = await generateFortune(info);
      setFortuneResult(result);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      setErrorMsg("운세를 불러오는 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setFortuneResult(null);
    setAppState(AppState.INPUT);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        
        <AnimatePresence mode="wait">
          {appState === AppState.INPUT && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl flex flex-col items-center"
            >
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-amber-500 text-xs font-bold tracking-[0.2em] mb-4">
                  2026 SPECIAL EDITION
                </span>
                <h1 className="text-5xl md:text-7xl font-batang font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                  병오년<span className="text-amber-500">.</span>
                </h1>
                <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-lg">
                  2026년 붉은 말의 해,<br/>
                  인공지능이 당신의 사주팔자를 분석하여<br/> 
                  한 해의 흐름을 읽어드립니다.
                </p>
              </div>
              <SajuForm onSubmit={handleFormSubmit} isLoading={false} />
            </motion.div>
          )}

          {appState === AppState.LOADING && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center"
            >
              <LoadingScreen />
            </motion.div>
          )}

          {appState === AppState.RESULT && fortuneResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <FortuneResultView result={fortuneResult} onReset={handleReset} />
            </motion.div>
          )}

          {appState === AppState.ERROR && (
             <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-red-950/30 p-8 rounded-3xl border border-red-500/30 backdrop-blur-md max-w-md"
            >
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-200 mb-2">분석 오류</h3>
              <p className="text-red-300/80 mb-6">{errorMsg}</p>
              <button 
                onClick={handleReset}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium"
              >
                다시 시도하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-600 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
        <p>© 2026 Fortune AI. Powered by Google Gemini.</p>
        <p className="mt-1 opacity-70">재미로 보는 운세입니다. 맹신하지 마세요.</p>
      </footer>
    </div>
  );
};

export default App;