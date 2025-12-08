import React from 'react';

interface WelcomeScreenProps {
  onEnter: () => void;
  installPrompt?: any;
  onInstall?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, installPrompt, onInstall }) => {
  const handleShare = async () => {
    const shareData = {
      title: '천기누설 - AI 신점',
      text: 'AI 무당이 봐주는 2025년 신년운세, 지금 확인해보세요.',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 복사되었습니다. 주변에 널리 알리세요.');
      }
    } catch (err) {
      console.log('Share failed', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 relative overflow-hidden fade-in">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2568&auto=format&fit=crop')] opacity-20 bg-cover bg-center pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0518]/80 to-[#0f0518] pointer-events-none"></div>

      <div className="z-10 animate-float">
        <div className="mb-6 opacity-80">
          <svg className="w-16 h-16 mx-auto text-red-700" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
          </svg>
        </div>
        <h1 className="font-title text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-t from-yellow-700 to-yellow-200 mb-4 drop-shadow-lg">
          천기누설
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-light tracking-widest mb-12">
          당신의 운명을 마주할 준비가 되었는가
        </p>
      </div>

      <div className="z-10 flex flex-col gap-4 items-center w-full max-w-xs">
        <button
          onClick={onEnter}
          className="w-full group relative px-8 py-4 bg-[#2a0a18] border border-red-900/50 text-red-100 font-title text-xl rounded-sm hover:bg-[#3d1024] transition-all duration-500 shadow-[0_0_20px_rgba(220,20,60,0.3)] hover:shadow-[0_0_40px_rgba(220,20,60,0.6)]"
        >
          <span className="relative z-10 group-hover:tracking-widest transition-all duration-300">
            점집 입장하기
          </span>
          <div className="absolute inset-0 h-full w-full scale-0 rounded-sm transition-all duration-300 group-hover:scale-100 group-hover:bg-red-900/20"></div>
        </button>

        <div className="flex w-full gap-3">
          <button
            onClick={handleShare}
            className="flex-1 py-3 bg-[#1a0b14] border border-[#5c2e2e]/50 text-gray-400 font-title hover:text-yellow-200 hover:border-yellow-700 transition-all rounded-sm text-sm"
          >
            복채 나누기 (공유)
          </button>
          
          {installPrompt && (
            <button
              onClick={onInstall}
              className="flex-1 py-3 bg-[#1a0b14] border border-[#5c2e2e]/50 text-gray-400 font-title hover:text-yellow-200 hover:border-yellow-700 transition-all rounded-sm text-sm"
            >
              점집 저장하기 (설치)
            </button>
          )}
        </div>
      </div>
      
      <p className="absolute bottom-8 text-xs text-gray-600 z-10">
        AI 신점이므로 재미로만 봐주시길 바랍니다.
      </p>
    </div>
  );
};

export default WelcomeScreen;