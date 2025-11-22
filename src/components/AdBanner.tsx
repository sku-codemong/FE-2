import { useState, useEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdBannerProps {
  variant?: 'default' | 'compact';
}

const ADS = [
  {
    emoji: '⚡',
    title: '학습 효율을 높이는 프리미엄 플랜',
    description: '광고 제거, 무제한 과목 추가, 고급 통계 분석 등\n더 많은 기능을 사용해보세요',
    gradient: 'from-blue-50 to-purple-50'
  },
  {
    emoji: '🎯',
    title: '학습 도우미가 당신을 기다립니다',
    description: '맞춤형 학습 계획과 스마트 알림으로\n목표 달성률을 2배 높이세요',
    gradient: 'from-purple-50 to-pink-50'
  },
  {
    emoji: '📊',
    title: '상위 10% 학생들의 비밀',
    description: '데이터 기반 학습 분석으로\n성적 향상을 경험해보세요',
    gradient: 'from-emerald-50 to-cyan-50'
  },
  {
    emoji: '🚀',
    title: '지금 가입하면 첫 달 50% 할인',
    description: '프리미엄 기능을 특별한 가격에\n시작할 수 있는 마지막 기회!',
    gradient: 'from-orange-50 to-yellow-50'
  }
];

export function AdBanner({ variant = 'default' }: AdBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ADS.length);
    }, 5000); // 5초마다 자동 전환

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + ADS.length) % ADS.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ADS.length);
  };

  const currentAd = ADS[currentIndex];
  
  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r ${currentAd.gradient} rounded-[10px] p-4 border border-[rgba(0,0,0,0.1)] relative transition-all duration-500`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[12px] text-[#6a7282] mb-1">광고</p>
            <p className="text-[14px] text-neutral-950 mb-1">{currentAd.title} {currentAd.emoji}</p>
            <p className="text-[12px] text-[#6a7282]">{currentAd.description.split('\n')[0]}</p>
          </div>
          <button className="ml-4 bg-[#9810fa] hover:bg-[#8610da] text-white rounded-[6px] px-4 h-[32px] text-[12px] flex items-center gap-2 transition-colors whitespace-nowrap">
            자세히
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        
        {/* Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {ADS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-6 bg-[#9810fa]' 
                  : 'w-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r ${currentAd.gradient} rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] relative overflow-hidden transition-all duration-500`}>
      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all z-10 shadow-sm"
      >
        <ChevronLeft className="w-4 h-4 text-neutral-950" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all z-10 shadow-sm"
      >
        <ChevronRight className="w-4 h-4 text-neutral-950" />
      </button>

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <p className="text-[12px] text-[#6a7282] mb-2">광고</p>
          <h3 className="text-[18px] text-neutral-950 mb-2 animate-in fade-in duration-500">
            {currentAd.title} {currentAd.emoji}
          </h3>
          <p className="text-[14px] text-[#6a7282] mb-4 whitespace-pre-line animate-in fade-in duration-700">
            {currentAd.description}
          </p>
          <button className="bg-[#9810fa] hover:bg-[#8610da] text-white rounded-[8px] px-6 h-[36px] text-[14px] flex items-center gap-2 transition-colors">
            프리미엄 알아보기
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <div className="ml-4 w-[120px] h-[120px] bg-gradient-to-br from-purple-200 to-blue-200 rounded-[12px] flex items-center justify-center text-[40px] animate-in zoom-in-95 duration-500">
          {currentAd.emoji}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {ADS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-[#9810fa]' 
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      <p className="text-[10px] text-[#9ca3af] text-center mt-4">
        실제 운영 시 Google AdSense 또는 다른 광고 네트워크가 여기에 표시됩니다
      </p>
    </div>
  );
}