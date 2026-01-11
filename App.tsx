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
import CelebMatchDisplay from './components/CelebMatchDisplay';
import TravelDisplay from './components/TravelDisplay';
import SamjaeDisplay from './components/SamjaeDisplay';
import KakaoAdFit from './components/KakaoAdFit';
import AuthScreen from './components/AuthScreen';
import Profile from './components/Profile';
import { AppState, AppMode, UserSajuData, ManseResult, ChongunResult, GunghapResult, CelebMatchResult, TravelRecommendResult, SamjaeResult } from './types';
import { getGeminiFortune, getChongunFortune, getGunghapFortune, getCelebMatch, getTravelRecommendation, getSamjaeFortune } from './services/fortuneService';
import { auth, getUserProfile, saveUserProfile, logoutUser } from './services/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HUB);
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
  const [celebMatchResult, setCelebMatchResult] = useState<CelebMatchResult | null>(null);
  const [travelResult, setTravelResult] = useState<TravelRecommendResult | null>(null);
  const [samjaeResult, setSamjaeResult] = useState<SamjaeResult | null>(null);
  
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserData(profile);
            if (appState === AppState.AUTH || appState === AppState.WELCOME) {
               setAppState(AppState.HUB);
            }
          } else {
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
        if (appState === AppState.PROFILE) {
           setAppState(AppState.HUB);
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

  const handleEnterWelcome = () => setAppState(AppState.HUB);
  const handleLoginEnter = () => setAppState(AppState.AUTH);
  const handleAuthBack = () => setAppState(AppState.HUB);
  const handleLogout = async () => {
    await logoutUser();
    setAppState(AppState.HUB);
  };
  const handleOpenProfile = () => {
    if (currentUser) setAppState(AppState.PROFILE);
    else setAppState(AppState.AUTH);
  };

  const handleSelectApp = (mode: AppMode) => {
    setAppMode(mode);
    if (userData && (mode !== AppMode.GUNGHAP)) {
      if (mode === AppMode.LOTTO) setAppState(AppState.RESULT);
      else {
        setAppState(AppState.LOADING);
        handleFormSubmit(userData);
      }
    } else {
      setAppState(AppState.INPUT);
    }
  };

  const handleFormSubmit = async (data: UserSajuData) => {
    setUserData(data);
    if (currentUser) saveUserProfile(currentUser.uid, data).catch(console.error);
    if (appMode === AppMode.LOTTO) {
      setAppState(AppState.RESULT);
      return;
    }
    setAppState(AppState.LOADING);
    try {
      if (appMode === AppMode.MANSE) setManseResult(await getGeminiFortune(data));
      else if (appMode === AppMode.CHONGUN) setChongunResult(await getChongunFortune(data));
      else if (appMode === AppMode.CELEB_MATCH) setCelebMatchResult(await getCelebMatch(data));
      else if (appMode === AppMode.TRAVEL) setTravelResult(await getTravelRecommendation(data));
      else if (appMode === AppMode.SAMJAE) setSamjaeResult(await getSamjaeFortune(data));
      setAppState(AppState.RESULT);
    } catch (error) {
      alert("분석 중 오류 발생: " + (error as Error).message);
      setAppState(AppState.HUB);
    }
  };

  const handleGunghapSubmit = async (user1: UserSajuData, user2: UserSajuData) => {
    setUserData(user1);
    setPartnerData(user2);
    setAppState(AppState.LOADING);
    try {
      setGunghapResult(await getGunghapFortune(user1, user2));
      setAppState(AppState.RESULT);
    } catch (error) {
      alert("궁합 분석 중 오류 발생: " + (error as Error).message);
      setAppState(AppState.INPUT);
    }
  };

  const handleResetToMenu = () => {
    setPartnerData(null);
    setManseResult(null);
    setChongunResult(null);
    setGunghapResult(null);
    setCelebMatchResult(null);
    setTravelResult(null);
    setSamjaeResult(null);
    setAppState(AppState.HUB);
  };

  const renderScreen = () => {
    switch (appState) {
      case AppState.WELCOME: return <WelcomeScreen onEnter={handleEnterWelcome} onLogin={handleLoginEnter} installPrompt={installPrompt} onInstall={handleInstallApp} />;
      case AppState.AUTH: return <AuthScreen onBack={handleAuthBack} />;
      case AppState.PROFILE: return currentUser ? <Profile user={currentUser} initialData={userData} onBack={() => setAppState(AppState.HUB)} onSaved={(data) => setUserData(data)} /> : null;
      case AppState.HUB: return <MainHub onSelectApp={handleSelectApp} userName={userData?.name} isGuest={!currentUser} onOpenProfile={handleOpenProfile} onLogout={handleLogout} onLogin={handleLoginEnter} installPrompt={installPrompt} onInstall={handleInstallApp} />;
      case AppState.INPUT: return appMode === AppMode.GUNGHAP ? <GunghapInputForm onSubmit={handleGunghapSubmit} onBack={() => setAppState(AppState.HUB)} /> : <InputForm onSubmit={handleFormSubmit} onBack={() => setAppState(AppState.HUB)} />;
      case AppState.LOADING: return <RitualLoading />;
      case AppState.RESULT:
        if (appMode === AppMode.MANSE && manseResult && userData) return <FortuneDisplay result={manseResult} userData={userData} onReset={handleResetToMenu} onOpenProfile={handleOpenProfile} isGuest={!currentUser} />;
        if (appMode === AppMode.CHONGUN && chongunResult && userData) return <ChongunDisplay result={chongunResult} userData={userData} onReset={handleResetToMenu} onOpenProfile={handleOpenProfile} isGuest={!currentUser} />;
        if (appMode === AppMode.GUNGHAP && gunghapResult && userData && partnerData) return <GunghapDisplay result={gunghapResult} user1={userData} user2={partnerData} onReset={handleResetToMenu} onOpenProfile={handleOpenProfile} isGuest={!currentUser} />;
        if (appMode === AppMode.LOTTO && userData) return <LottoGenerator userData={userData} onReset={handleResetToMenu} onOpenProfile={handleOpenProfile} isGuest={!currentUser} />;
        if (appMode === AppMode.CELEB_MATCH && celebMatchResult && userData) return <CelebMatchDisplay result={celebMatchResult} userData={userData} onReset={handleResetToMenu} onOpenProfile={handleOpenProfile} isGuest={!currentUser} />;
        if (appMode === AppMode.TRAVEL && travelResult && userData) return <TravelDisplay result={travelResult} userData={userData} onReset={handleResetToMenu} onOpenProfile={handleOpenProfile} isGuest={!currentUser} />;
        if (appMode === AppMode.SAMJAE && samjaeResult && userData) return <SamjaeDisplay result={samjaeResult} userData={userData} onReset={handleResetToMenu} onOpenProfile={handleOpenProfile} isGuest={!currentUser} />;
        return <div className="text-center p-20"><button onClick={handleResetToMenu} className="p-4 bg-gray-200 rounded">홈으로</button></div>;
      default: return null;
    }
  };

  return (
    <div className="antialiased min-h-screen font-sans text-gray-900 bg-[#f8f9fa] flex flex-col">
      <div className="flex-grow">{renderScreen()}</div>
      {appState !== AppState.AUTH && (
        <footer className="w-full bg-[#f8f9fa] flex flex-col items-center pb-8 pt-4">
          <KakaoAdFit />
          <div className="w-full max-w-3xl px-6 py-6 border-t border-gray-200 flex flex-col items-center gap-3 text-center mt-4">
             <div className="text-[11px] text-gray-400 flex flex-wrap justify-center items-center gap-2">
                <span className="font-medium text-gray-500">내운명만세력</span>
                <span className="text-gray-300">|</span>
                <a href="mailto:hwanace@naver.com">hwanace@naver.com</a>
                <span className="text-gray-300">|</span>
                <span>Made by 도형파파팩토리</span>
             </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;