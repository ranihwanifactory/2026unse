import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import InputForm from './components/InputForm';
import RitualLoading from './components/RitualLoading';
import FortuneDisplay from './components/FortuneDisplay';
import { AppState, UserSajuData, FortuneResult } from './types';
import { getGeminiFortune } from './services/fortuneService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [userData, setUserData] = useState<UserSajuData | null>(null);
  const [fortuneResult, setFortuneResult] = useState<FortuneResult | null>(null);

  const handleEnterApp = () => {
    setAppState(AppState.INPUT);
  };

  const handleFormSubmit = async (data: UserSajuData) => {
    setUserData(data);
    setAppState(AppState.RITUAL);

    try {
      // Fetch fortune from Gemini
      const result = await getGeminiFortune(data);
      setFortuneResult(result);
      setAppState(AppState.RESULT);
    } catch (error) {
      alert("신령님과의 연결이 끊겼습니다. 다시 시도해주세요.\n" + (error as Error).message);
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
        return <WelcomeScreen onEnter={handleEnterApp} />;
      case AppState.INPUT:
        return <InputForm onSubmit={handleFormSubmit} onBack={() => setAppState(AppState.WELCOME)} />;
      case AppState.RITUAL:
        return <RitualLoading />;
      case AppState.RESULT:
        return (
          userData && fortuneResult ? (
            <FortuneDisplay 
              result={fortuneResult} 
              userData={userData} 
              onReset={handleReset} 
            />
          ) : <div>오류가 발생했습니다.</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="antialiased min-h-screen font-serif">
      {renderScreen()}
    </div>
  );
};

export default App;