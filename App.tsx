import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import MainHub from './components/MainHub';
import InputForm from './components/InputForm';
import GunghapInputForm from './components/GunghapInputForm';
import RitualLoading from './components/RitualLoading';
import FortuneDisplay from './components/FortuneDisplay';
import ChongunDisplay from './components/ChongunDisplay';
import GunghapDisplay from './components/GunghapDisplay';
import LottoGenerator from './components/LottoGenerator';
import KakaoAdFit from './components/KakaoAdFit';
import AuthScreen from './components/AuthScreen';
import Profile from './components/Profile';
import { AppState, AppMode, UserSajuData, ManseResult, ChongunResult, GunghapResult } from './types';
import { getGeminiFortune, getChongunFortune, getGunghapFortune } from './services/fortuneService';
import { auth, getUserProfile, saveUserProfile, logoutUser } from './services/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [appMode, setAppMode] = useState<AppMode>(AppMode.MANSE);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Data State
  const [userData, setUserData] = useState<UserSajuData | null>(null);
  const [partnerData, setPartnerData] = useState<UserSajuData | null>(null);
  
  // Results State
  const [manseResult, setManseResult] = useState<ManseResult | null>(null);
  const [chongunResult, setChongunResult] = useState<ChongunResult | null>(null);
  const [gunghapResult, setGunghapResult] = useState<GunghapResult | null>(null);
  
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

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // User logged in, fetch profile
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserData(profile);
            // If we are currently in AUTH or WELCOME, go to HUB
            if (appState === AppState.AUTH || appState === AppState.WELCOME) {
               setAppState(AppState.HUB);
            }
          } else {
            // New user, no profile yet. 
            // If they are coming from AuthScreen, send to Input to create profile
            if (appState === AppState.AUTH) {
               setAppState(AppState.INPUT);
            }
          }
        } catch (e) {
          console.error("Error fetching profile", e);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
        // If logged out, we generally don't force page change unless strictly required
        // But if in Profile/Auth, go to Welcome
        if (appState === AppState.PROFILE) {
           setAppState(AppState.WELCOME);
        }
      }
    });
    return () => unsubscribe();
  }, [appState]);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  // Welcome -> Main (Start)
  const handleEnterWelcome = () => {
    // Allows Guest Access: Always go to HUB.
    // If logged in, the AuthListener might have already moved us, but this is safe.
    setAppState(AppState.HUB);
  };

  // Welcome -> Auth (Login Click)
  const handleLoginEnter = () => {
    setAppState(AppState.AUTH);
  };

  // Auth -> Back
  const handleAuthBack = () => {
    setAppState(AppState.WELCOME);
  };

  // Logout
  const handleLogout = async () => {
    await logoutUser();
    setAppState(AppState.WELCOME);
  };

  // Hub -> Profile
  const handleOpenProfile = () => {
    setAppState(AppState.PROFILE);
  };

  // Hub -> Input (with specific mode)
  const handleSelectApp = (mode: AppMode) => {
    setAppMode(mode);
    
    // Check if user has data (Logged in users with saved profile)
    if (userData && (mode === AppMode.MANSE || mode === AppMode.CHONGUN || mode === AppMode.LOTTO)) {
      if (mode === AppMode.LOTTO) {
        setAppState(AppState.RESULT); 
      } else {
        // Logged in user with data -> Skip input, go to loading/result
        setAppState(AppState.LOADING);
        handleFormSubmit(userData); // Auto-submit existing data
      }
    } else {
      // Guest or New User -> Go to Input
      setAppState(AppState.INPUT);
    }
  };

  // Input -> Loading -> Result (Single User)
  const handleFormSubmit = async (data: UserSajuData) => {
    setUserData(data);

    // Save to Firestore ONLY if logged in
    if (currentUser) {
      saveUserProfile(currentUser.uid, data).catch(console.error);
    }

    if (appMode === AppMode.LOTTO) {
      setAppState(AppState.RESULT);
      return;
    }

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
      setAppState(AppState.INPUT); 
    }
  };

  // Input -> Loading -> Result (Gunghap / Two Users)
  const handleGunghapSubmit = async (user1: UserSajuData, user2: UserSajuData) => {
    setUserData(user1);
    setPartnerData(user2);
    setAppState(AppState.LOADING);

    try {
      const result = await getGunghapFortune(user1, user2);
      setGunghapResult(result);
      setAppState(AppState.RESULT);
    } catch (error) {
      alert("궁합 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n" + (error as Error).message);
      setAppState(AppState.INPUT);
    }
  };

  const handleResetToMenu = () => {
    setPartnerData(null);
    setManseResult(null);
    setChongunResult(null);
    setGunghapResult(null);
    setAppState(AppState.HUB);
  };

  const renderScreen = () => {
    switch (appState) {
      case AppState.WELCOME:
        return (
          <WelcomeScreen 
            onEnter={handleEnterWelcome} 
            onLogin={handleLoginEnter}
            installPrompt={installPrompt} 
            onInstall={handleInstallApp} 
          />
        );
      case AppState.AUTH:
        return (
          <AuthScreen onBack={handleAuthBack} />
        );
      case AppState.PROFILE:
        return currentUser ? (
          <Profile 
            user={currentUser}
            initialData={userData}
            onBack={() => setAppState(AppState.HUB)}
            onSaved={(data) => setUserData(data)}
          />
        ) : null;
      case AppState.HUB:
        return (
          <MainHub 
            onSelectApp={handleSelectApp} 
            userName={userData?.name} 
            isGuest={!currentUser}
            onOpenProfile={handleOpenProfile}
            onLogout={handleLogout}
            onLogin={handleLoginEnter}
          />
        );
      case AppState.INPUT:
        if (appMode === AppMode.GUNGHAP) {
          return (
            <GunghapInputForm
              onSubmit={handleGunghapSubmit}
              onBack={() => setAppState(AppState.HUB)}
            />
          );
        }
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
        } else if (appMode === AppMode.GUNGHAP && gunghapResult && userData && partnerData) {
          return (
            <GunghapDisplay
              result={gunghapResult}
              user1={userData}
              user2={partnerData}
              onReset={handleResetToMenu}
            />
          );
        } else if (appMode === AppMode.LOTTO && userData) {
           return (
             <LottoGenerator
               userData={userData}
               onReset={handleResetToMenu}
             />
           );
        } else {
          return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <p className="mb-4">데이터 로딩 오류가 발생했습니다.</p>
              <button onClick={handleResetToMenu} className="px-4 py-2 bg-gray-200 rounded">홈으로</button>
            </div>
          );
        }
      default:
        return null;
    }
  };

  return (
    <div className="antialiased min-h-screen font-sans text-gray-900 bg-[#f8f9fa] flex flex-col">
      <div className="flex-grow">
        {renderScreen()}
      </div>
      
      {/* Kakao AdFit Footer - Hide on Auth Screen */}
      {appState !== AppState.AUTH && (
        <footer className="w-full bg-[#f8f9fa]">
          <KakaoAdFit />
        </footer>
      )}
    </div>
  );
};

export default App;