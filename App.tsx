import React, { useState } from 'react';
import SajuForm from './components/SajuForm';
import FortuneResultView from './components/FortuneResultView';
import LoadingScreen from './components/LoadingScreen';
import { UserInfo, FortuneResult, AppState } from './types';
import { generateFortune } from './services/geminiService';

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
    <div className="min-h-screen korean-pattern bg-slate-900 text-slate-100 flex flex-col items-center py-10 px-4">
      {/* Background Overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-black pointer-events-none z-0"></div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center min-h-[80vh] justify-center">
        
        {/* Title (Only show on Input Screen) */}
        {appState === AppState.INPUT && (
          <div className="text-center mb-12 animate-fade-in-down">
            <span className="text-amber-500 font-bold tracking-widest text-sm mb-2 block font-serif">2026 SPECIAL</span>
            <h1 className="text-4xl md:text-6xl font-batang font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-sm mb-4">
              병오년(丙午年) 운세
            </h1>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
              2026년 붉은 말의 해,<br/>
              당신의 사주에 숨겨진 기운을 미리 확인해보세요.
            </p>
          </div>
        )}

        {/* View Switcher */}
        <div className="w-full flex justify-center">
          {appState === AppState.INPUT && (
            <SajuForm onSubmit={handleFormSubmit} isLoading={false} />
          )}

          {appState === AppState.LOADING && (
            <LoadingScreen />
          )}

          {appState === AppState.RESULT && fortuneResult && (
            <FortuneResultView result={fortuneResult} onReset={handleReset} />
          )}

          {appState === AppState.ERROR && (
            <div className="text-center bg-red-900/20 p-8 rounded-xl border border-red-500/30">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-red-300 mb-6">{errorMsg}</p>
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                다시 시도하기
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 text-center text-xs text-gray-600">
        <p>Powered by Google Gemini | 2026년 병오년 운세 서비스</p>
        <p className="mt-1">재미로 보는 운세입니다. 맹신하지 마세요.</p>
      </footer>
    </div>
  );
};

export default App;