import React, { useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

interface AuthScreenProps {
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // App.tsx auth listener handles the rest
    } catch (err: any) {
      setError("구글 로그인 실패: " + err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // App.tsx auth listener handles the rest
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else if (err.code === 'auth/invalid-email') {
        setError('이메일 형식이 올바르지 않습니다.');
      } else if (err.code === 'auth/weak-password') {
        setError('비밀번호는 6자리 이상이어야 합니다.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('이메일 또는 비밀번호가 일치하지 않습니다.');
      } else {
        setError('로그인/회원가입 실패: ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl relative">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="text-center mb-8 mt-4">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="font-cute text-2xl font-bold text-gray-800">
            {isLogin ? '로그인' : '회원가입'}
          </h2>
          <p className="text-gray-500 text-xs mt-2">
            로그인하면 나의 사주 정보를 안전하게 저장하고<br/>언제든 다시 확인할 수 있어요.
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 text-gray-700 font-bold hover:bg-gray-50 transition-colors mb-6 shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          구글 계정으로 {isLogin ? '로그인' : '시작하기'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-400">또는 이메일로</span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호 (6자리 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-bold text-lg py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-all active:scale-95"
          >
            {isLogin ? '로그인하기' : '회원가입하기'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="ml-2 font-bold text-indigo-600 hover:underline"
          >
            {isLogin ? '회원가입' : '로그인'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;