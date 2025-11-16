import { Clock, Edit2, Archive, ArchiveRestore } from 'lucide-react';
import { Subject } from '../services/api';
import { Link } from 'react-router-dom';

interface SubjectCardProps {
  subject: Subject;
  dailyProgress?: number; // 분 단위 (하위 호환성 유지)
  dailyProgressSeconds?: number; // 초 단위
  userId: string;
  onArchive?: (id: string) => void;
  overrideTargetDailyMin?: number; // 오늘 분배 안 했을 때 0으로 표시 등
}

export function SubjectCard({ subject, dailyProgress = 0, dailyProgressSeconds, userId, onArchive, overrideTargetDailyMin }: SubjectCardProps) {
  const targetDaily = (overrideTargetDailyMin !== undefined ? overrideTargetDailyMin : (subject.targetDailyMin || 0));
  
  // 초 단위 데이터가 있으면 사용, 없으면 분 단위로 변환
  const progressSeconds = dailyProgressSeconds !== undefined ? dailyProgressSeconds : (dailyProgress * 60);
  const progressMinutes = Math.floor(progressSeconds / 60);
  const progressSecs = progressSeconds % 60;
  
  const progressPercentage = targetDaily > 0 ? (progressMinutes / targetDaily) * 100 : 0;
  
  return (
    <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-6">
      {/* Subject Info */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full shrink-0" 
            style={{ backgroundColor: subject.color }}
          />
          <div>
            <h3 className="text-[16px] text-neutral-950 mb-1">{subject.name}</h3>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="text-[#6a7282]">
                {(subject.credit ?? (subject as any).weight ?? 0) || 0}학점
              </span>
              <span className="text-[#99a1af]">•</span>
              <span className="text-[#6a7282]">난이도 {subject.difficulty}</span>
              {subject.hasExtraWork && (
                <>
                  <span className="text-[#99a1af]">•</span>
                  <span className="text-[#9810fa]">과제있음</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/subject/${userId}/${subject.id}/edit`}>
            <button className="w-9 h-8 rounded-[8px] flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Edit2 className="w-4 h-4 text-neutral-950" />
            </button>
          </Link>
          {onArchive && (
            <button 
              onClick={() => onArchive(subject.id)}
              className="w-9 h-8 rounded-[8px] flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label={subject.archived ? '보관 해제' : '보관하기'}
              title={subject.archived ? '보관 해제' : '보관하기'}
            >
              {subject.archived ? (
                <ArchiveRestore className="w-4 h-4 text-neutral-950" />
              ) : (
                <Archive className="w-4 h-4 text-neutral-950" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Progress Section - 보관된 과목이 아닐 때만 표시 */}
      {!subject.archived && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-[#4a5565]">
              {targetDaily > 0 ? '오늘 학습 목표' : '학습 시간'}
            </span>
            {targetDaily > 0 ? (
              <span className="text-[#4a5565]">
                {progressMinutes}분 {progressSecs > 0 ? `${progressSecs}초` : ''} / {targetDaily}분
              </span>
            ) : (
              <span className="text-[#4a5565]">
                {progressMinutes}분 {progressSecs > 0 ? `${progressSecs}초` : ''}
              </span>
            )}
          </div>
          
          {targetDaily > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  backgroundColor: subject.color,
                  width: `${Math.min(progressPercentage, 100)}%`
                }}
              />
            </div>
          )}
          
          <Link to={`/subject/${userId}/${subject.id}`} className="block mt-6">
            <button 
              className="w-full h-[36px] rounded-[8px] text-white text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: subject.color }}
            >
              <Clock className="w-4 h-4" />
              학습 시작
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
