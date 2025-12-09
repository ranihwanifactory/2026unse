import React from 'react';

interface WelcomeScreenProps {
  onEnter: () => void;
  installPrompt?: any;
  onInstall?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, installPrompt, onInstall }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfbf7] p-6 text-center relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>

      <div className="z-10 flex flex-col items-center max-w-md w-full">
        <div className="mb-6 animate-[bounce_3s_infinite]">
          <span className="text-6xl filter drop-shadow-md">🔮</span>
        </div>
        
        <h1 className="font-cute text-4xl font-bold text-gray-800 mb-2">
          포스텔 만세력
        </h1>
        <p className="text-gray-500 mb-10 font-medium">
          가장 쉽고 예쁜 내 운명의 지도
        </p>

        <div className="w-full space-y-3">
          <button
            onClick={onEnter}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-800 transition-transform transform hover:-translate-y-1 active:scale-95"
          >
            내 사주 분석하기
          </button>

          {installPrompt && (
            <button
              onClick={onInstall}
              className="w-full py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              앱 설치하기 ⬇️
            </button>
          )}
        </div>

        <p className="mt-8 text-xs text-gray-400">
          복잡한 만세력, 이제 귀엽고 편하게 확인하세요.<br/>
          AI가 분석하는 당신의 운세
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;