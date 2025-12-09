import React, { useEffect, useRef } from 'react';

const KakaoAdFit: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 스크립트가 이미 로드되었는지 확인하지 않고, 컴포넌트가 마운트될 때마다 실행되도록 함
    // (React의 특성상 페이지 이동 시 재로드 필요할 수 있음)
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    script.type = "text/javascript";

    // 광고 영역 안에 스크립트를 append 하거나 body에 append
    if (adRef.current) {
      adRef.current.appendChild(script);
    }

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거 (선택적)
      if (adRef.current && script.parentNode === adRef.current) {
        adRef.current.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center py-6 w-full bg-transparent" ref={adRef}>
      <ins 
        className="kakao_ad_area" 
        style={{ display: 'none' }}
        data-ad-unit="DAN-d4Pgi4PFqcbmfJQF"
        data-ad-width="300"
        data-ad-height="250"
      ></ins>
    </div>
  );
};

export default KakaoAdFit;