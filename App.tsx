import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import InputForm from './components/InputForm';
import RitualLoading from './components/RitualLoading';
import FortuneDisplay from './components/FortuneDisplay';
import { AppState, UserSajuData, ManseResult } from './types';
import { getGeminiFortune } from './services/fortuneService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [userData, setUserData] = useState<UserSajuData | null>(null);
  const [fortuneResult, setFortuneResult] = useState<ManseResult | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for PWA install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const handleEnterApp = () => {
    setAppState(AppState.INPUT);
  };

  const handleFormSubmit = async (data: UserSajuData) => {
    setUserData(data);
    setAppState(AppState.LOADING); // Using LOADING state

    try {
      // Fetch fortune from Gemini
      const result = await getGeminiFortune(data);
      setFortuneResult(result);
      setAppState(AppState.RESULT);
    } catch (error) {
      alert("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n" + (error as Error).message);
      setAppState(AppState.INPUT);
    }
  };

  const handleReset = () => {
    setUserData(null);
    setFortuneResult(null);
    setAppState(AppState.WELCOME);
  };

  const renderScreen = () => {
    switch (appState) {
      case AppState.WELCOME:
        return (
          <WelcomeScreen 
            onEnter={handleEnterApp} 
            installPrompt={installPrompt} 
            onInstall={handleInstallApp} 
          />
        );
      case AppState.INPUT:
        return <InputForm onSubmit={handleFormSubmit} onBack={() => setAppState(AppState.WELCOME)} />;
      case AppState.LOADING:
        return <RitualLoading />;
      case AppState.RESULT:
        return (
          userData && fortuneResult ? (
            <FortuneDisplay 
              result={fortuneResult} 
              userData={userData} 
              onReset={handleReset} 
            />
          ) : <div>데이터 오류</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="antialiased min-h-screen font-sans text-gray-900">
      {renderScreen()}
    </div>
  );
};

export default App;