import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface TimerProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  startTime?: string;
}

export function Timer({ isActive, onStart, onPause, onStop, startTime }: TimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isActive || isPaused) {
      return;
    }

    const start = startTime ? new Date(startTime).getTime() : Date.now();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
      onPause();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-6xl tracking-wider tabular-nums">
        {formatTime(elapsedSeconds)}
      </div>
      
      <div className="flex gap-4">
        {!isActive ? (
          <Button 
            size="lg" 
            onClick={onStart}
            className="px-8"
          >
            <Play className="w-5 h-5 mr-2" />
            시작
          </Button>
        ) : (
          <>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handlePauseResume}
              className="px-8"
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  재개
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  일시정지
                </>
              )}
            </Button>
            <Button 
              size="lg" 
              variant="destructive"
              onClick={onStop}
              className="px-8"
            >
              <Square className="w-5 h-5 mr-2" />
              종료
            </Button>
          </>
        )}
      </div>
      
      {isActive && (
        <div className="text-sm text-gray-500">
          {isPaused ? '일시정지됨' : '학습 중...'}
        </div>
      )}
    </div>
  );
}
