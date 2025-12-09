import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import MainHub from './components/MainHub';
import InputForm from './components/InputForm';
import RitualLoading from './components/RitualLoading';
import FortuneDisplay from './components/FortuneDisplay';
import ChongunDisplay from './components/ChongunDisplay';
import { AppState, AppMode, UserSajuData, ManseResult, ChongunResult } from './types';
import { getGeminiFortune, getChongunFortune } from './services/fortuneService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [appMode, setAppMode] = useState<AppMode>(AppMode.MANSE);
  const [userData, setUserData] = useState<UserSajuData | null>(null);
  
  // Results
  const [manseResult, setManseResult] = useState<ManseResult | null>(null);
  const [chongunResult, setChongunResult] = useState<ChongunResult | null>(null);
  
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

  // Welcome -> Hub
  const handleEnterHub = () => {
    setAppState(AppState.HUB);
  };

  // Hub -> Input (with specific mode)
  const handleSelectApp = (mode: AppMode) => {
    setAppMode(mode);
    setAppState(AppState.INPUT);
  };

  // Input -> Loading -> Result
  const handleFormSubmit = async (data: UserSajuData) => {
    setUserData(data);
    setAppState(AppState.LOADING);

    try {
      if (appMode === AppMode.MANSE) {
        const result = await getGeminiFortune(data);
        setManseResult(result);
      } else if (appMode === AppMode.CHONGUN) {
        const result = await getChongunFortune(data);
        setChongunResult(result);
      }
      setAppState(AppState.RESULT);
    } catch (error) {
      alert("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n" + (error as Error).message);
      setAppState(AppState.INPUT); // Go back to input on error
    }
  };

  const handleResetToMenu = () => {
    setUserData(null);
    setManseResult(null);
    setChongunResult(null);
    setAppState(AppState.HUB);
  };

  const renderScreen = () => {
    switch (appState) {
      case AppState.WELCOME:
        return (
          <WelcomeScreen 
            onEnter={handleEnterHub} 
            installPrompt={installPrompt} 
            onInstall={handleInstallApp} 
          />
        );
      case AppState.HUB:
        return (
          <MainHub 
            onSelectApp={handleSelectApp} 
            userName={userData?.name} 
          />
        );
      case AppState.INPUT:
        return (
           <InputForm 
             onSubmit={handleFormSubmit} 
             onBack={() => setAppState(AppState.HUB)} 
           />
        );
      case AppState.LOADING:
        return <RitualLoading />;
      case AppState.RESULT:
        if (appMode === AppMode.MANSE && manseResult && userData) {
          return (
            <FortuneDisplay 
              result={manseResult} 
              userData={userData} 
              onReset={handleResetToMenu} 
            />
          );
        } else if (appMode === AppMode.CHONGUN && chongunResult && userData) {
          return (
            <ChongunDisplay 
              result={chongunResult} 
              userData={userData} 
              onReset={handleResetToMenu} 
            />
          );
        } else {
          return <div>데이터 로딩 오류. 다시 시도해주세요.</div>;
        }
      default:
        return null;
    }
  };

  return (
    <div className="antialiased min-h-screen font-sans text-gray-900 bg-[#f8f9fa]">
      {renderScreen()}
    </div>
  );
};

export default App;