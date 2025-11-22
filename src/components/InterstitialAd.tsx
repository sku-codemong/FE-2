import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface InterstitialAdProps {
  show: boolean;
  onClose: () => void;
}

const ADS = [
  {
    emoji: '🚀',
    gradient: 'from-purple-200 to-blue-200',
    title: '학습을 더욱 스마트하게!',
    description: '기반 학습 플래너로 목표를 달성하세요.\n지금 가입하면 첫 달 50% 할인!',
  },
  {
    emoji: '🎯',
    gradient: 'from-blue-200 to-cyan-200',
    title: '집중력을 극대화하세요',
    description: '포모도로 타이머와 함께하는\n과학적 학습 방법을 경험해보세요',
  },
  {
    emoji: '📚',
    gradient: 'from-emerald-200 to-teal-200',
    title: '체계적인 학습 관리',
    description: '과목별 진도 추적과 성취도 분석으로\n효율적인 학습을 시작하세요',
  },
  {
    emoji: '⚡',
    gradient: 'from-orange-200 to-yellow-200',
    title: '프리미엄으로 업그레이드',
    description: '광고 없는 환경에서\n무제한 기능을 사용해보세요',
  },
];

export function InterstitialAd({ show, onClose }: InterstitialAdProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!show) return;

    // 광고가 표시될 때마다 랜덤하게 시작
    setCurrentIndex(Math.floor(Math.random() * ADS.length));

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ADS.length);
    }, 4000); // 4초마다 자동 전환

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  const currentAd = ADS[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[20px] max-w-[500px] w-full p-8 relative animate-in zoom-in-95 duration-200">
        {/* Close Button - 항상 표시 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ad Content */}
        <div className="text-center">
          <div 
            className={`w-[100px] h-[100px] bg-gradient-to-br ${currentAd.gradient} rounded-[20px] flex items-center justify-center text-[50px] mx-auto mb-6 transition-all duration-500 animate-in zoom-in-95`}
            key={currentIndex}
          >
            {currentAd.emoji}
          </div>
          
          <p className="text-[12px] text-[#6a7282] mb-3">광고</p>
          <h2 className="text-[24px] text-neutral-950 mb-4 animate-in fade-in duration-500">
            {currentAd.title}
          </h2>
          <p className="text-[16px] text-[#4a5565] mb-6 whitespace-pre-line animate-in fade-in duration-700">
            {currentAd.description}
          </p>

          <button className="bg-[#9810fa] hover:bg-[#8610da] text-white rounded-[10px] px-8 h-[44px] text-[16px] flex items-center gap-2 transition-colors mx-auto mb-4">
            자세히 알아보기
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="text-[12px] text-[#6a7282] hover:text-neutral-950 underline"
          >
            광고 건너뛰기
          </button>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {ADS.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-6 bg-[#9810fa]' 
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <p className="text-[10px] text-[#9ca3af] text-center mt-4">
          실제 운영 시 Google AdSense 전면 광고가 여기에 표시됩니다
        </p>
      </div>
    </div>
  );
}