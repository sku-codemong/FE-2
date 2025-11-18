import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SubjectCard } from '../components/SubjectCard';
import { Plus, Sparkles } from 'lucide-react';
import { api, Subject } from '../services/api';
import { Toaster, toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

interface MainPageProps {
  userId: string;
}

export function MainPage({ userId }: MainPageProps) {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [dailyProgress, setDailyProgress] = useState<Map<string, number>>(new Map());
  const [dailyProgressSeconds, setDailyProgressSeconds] = useState<Map<string, number>>(new Map()); // 초 단위 데이터
  const [loading, setLoading] = useState(true);
  const [showAllocationDialog, setShowAllocationDialog] = useState(false);
  const [availableMinutes, setAvailableMinutes] = useState(180); // 기본 3시간
  const [allocating, setAllocating] = useState(false);
  const [recommending, setRecommending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('');

  const formatLocalYYYYMMDD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // activeTab에 따라 필터링된 과목들
  const subjects = allSubjects.filter(subject => 
    activeTab === 'active' ? !subject.archived : subject.archived
  );

  useEffect(() => {
    // API_BASE_URL 확인 (모바일 디버깅용)
    const checkApiUrl = () => {
      try {
        const url = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '';
        setApiBaseUrl(url);
        if (!url) {
          setError('API 서버 URL이 설정되지 않았습니다. 환경 변수를 확인해주세요.');
        }
      } catch (e) {
        console.error('API URL 확인 실패:', e);
      }
    };
    checkApiUrl();
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('[MainPage] Loading data...');
      const subjectsData = await api.getSubjects(true); // includeArchived=true로 모든 과목 가져오기
      console.log('[MainPage] Subjects loaded:', subjectsData.length);
      setAllSubjects(subjectsData);

      // 오늘 학습 시간 계산 (초 단위로 합산)
      const today = formatLocalYYYYMMDD(new Date());
      console.log('[MainPage] Loading sessions for:', today);
      const sessions = await api.getSessions({
        date: today
      });
      console.log('[MainPage] Sessions loaded:', sessions.length);

      // 각 과목별로 초 단위로 합산 (초 단위 표시를 위해)
      const progressSecondsMap = new Map<string, number>();
      sessions.forEach(session => {
        if (session.status === 'completed' || session.status === 'stopped') {
          // endTime과 startTime의 차이를 초 단위로 계산
          let durationSec = 0;
          if (session.endTime) {
            const start = new Date(session.startTime).getTime();
            const end = new Date(session.endTime).getTime();
            durationSec = Math.floor((end - start) / 1000);
          } else {
            // endTime이 없으면 duration을 초로 변환 (이미 분 단위이므로 * 60)
            durationSec = (session.duration || 0) * 60;
          }
          
          const current = progressSecondsMap.get(session.subjectId) || 0;
          progressSecondsMap.set(session.subjectId, current + durationSec);
        }
      });
      
      // 초 단위 합산을 분으로 변환 (SubjectCard에서는 분만 사용)
      const progressMap = new Map<string, number>();
      progressSecondsMap.forEach((totalSeconds, subjectId) => {
        progressMap.set(subjectId, Math.floor(totalSeconds / 60));
      });

      setDailyProgress(progressMap);
      setDailyProgressSeconds(progressSecondsMap); // 초 단위 데이터 저장
      setError(null); // 성공 시 에러 초기화
    } catch (error: any) {
      console.error('[MainPage] Error loading data:', error);
      console.error('[MainPage] Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
      });
      const errorMsg = error?.message || '알 수 없는 오류';
      setError(`데이터 로드 실패: ${errorMsg}`);
      toast.error(`데이터를 불러오는데 실패했습니다: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (subjectId: string) => {
    try {
      // 현재 탭에 따라 archived 값 결정
      const shouldArchive = activeTab === 'active';
      await api.archiveSubject(subjectId, shouldArchive);
      toast.success(shouldArchive ? '과목이 보관되었습니다' : '과목이 복원되었습니다');
      loadData();
    } catch (error) {
      toast.error(activeTab === 'active' ? '보관에 실패했습니다' : '복원에 실패했습니다');
    }
  };

  const handleGetRecommendation = async () => {
    const activeSubjects = allSubjects.filter(s => !s.archived);
    if (activeSubjects.length === 0) {
      toast.error('먼저 과목을 추가해주세요');
      return;
    }

    setRecommending(true);
    
    try {
      // 오늘의 분배 추천 API 호출
      const recommendation = await api.getTodayRecommendation();
      
      // 추천된 시간을 입력 필드에 설정
      setAvailableMinutes(recommendation.totalAvailableMinutes);
      
      toast.success(`추천 시간: ${Math.floor(recommendation.totalAvailableMinutes / 60)}시간 ${recommendation.totalAvailableMinutes % 60}분`);
    } catch (error: any) {
      toast.error(error?.message || '추천을 불러오는데 실패했습니다');
    } finally {
      setRecommending(false);
    }
  };

  const handleDailyAllocation = async () => {
    if (availableMinutes < 30) {
      toast.error('최소 30분 이상을 입력해주세요');
      return;
    }

    const activeSubjects = allSubjects.filter(s => !s.archived);
    if (activeSubjects.length === 0) {
      toast.error('먼저 과목을 추가해주세요');
      return;
    }

    setAllocating(true);
    
    try {
      // 1. 먼저 총 사용 가능한 시간을 설정
      await api.updateDailyTarget(availableMinutes);
      
      // 2. 설정한 시간으로 일일 분배 추천 받기
      const allocation = await api.getTodayRecommendation();
      
      if (allocation) {
        // 3. 받은 분배 결과로 각 과목의 targetDailyMin 업데이트
        const updatePromises = allocation.subjects.map(async (allocated) => {
          const subjectId = Number(allocated.subjectId);
          return api.updateSubject(subjectId.toString(), {
            targetDailyMin: allocated.allocatedMinutes
          });
        });
        
        await Promise.all(updatePromises);
        
        // 4. 과목 데이터 다시 로드하여 업데이트된 targetDailyMin 반영
        const updatedSubjects = await api.getSubjects(true); // includeArchived=true로 모든 과목 가져오기
        setAllSubjects(updatedSubjects);
        // 오늘 분배 완료 기록 (오늘만 목표 표시)
        localStorage.setItem('dailyAllocationDate', formatLocalYYYYMMDD(new Date()));
        
        toast.success(`총 ${availableMinutes}분이 ${allocation.subjects.length}개 과목에 분배되었습니다!`);
        setShowAllocationDialog(false);
      } else {
        toast.error('일일 분배를 불러오는데 실패했습니다');
      }
    } catch (error) {
      toast.error('시간 분배에 실패했습니다');
    } finally {
      setAllocating(false);
    }
  };

  // 초 단위로 합산 후 시간, 분, 초로 변환
  const totalSeconds = Array.from(dailyProgressSeconds.values()).reduce((sum, val) => sum + val, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const todayStr = formatLocalYYYYMMDD(new Date());
  const isTodayAllocated = localStorage.getItem('dailyAllocationDate') === todayStr;
  const totalDailyTargetRaw = subjects.filter(s => !s.archived).reduce((sum, s) => sum + (s.targetDailyMin || 0), 0);
  const totalDailyTarget = isTodayAllocated ? totalDailyTargetRaw : 0;
  const dailyTargetHours = Math.floor(totalDailyTarget / 60);
  const dailyTargetMinutes = totalDailyTarget % 60;
  
  // 남은 시간 계산 (초 단위)
  const targetSeconds = totalDailyTarget * 60;
  const remainingTargetSeconds = Math.max(0, targetSeconds - totalSeconds);
  const remainingHours = Math.floor(remainingTargetSeconds / 3600);
  const remainingMins = Math.floor((remainingTargetSeconds % 3600) / 60);
  const remainingSecs = remainingTargetSeconds % 60;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-[542px] mx-auto">
        {/* 에러 표시 (모바일 디버깅용) */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-red-600 text-lg">⚠️</span>
              <div className="flex-1">
                <p className="text-red-800 text-sm font-medium mb-1">오류 발생</p>
                <p className="text-red-700 text-xs break-words">{error}</p>
                {apiBaseUrl && (
                  <p className="text-red-600 text-xs mt-2">
                    API URL: {apiBaseUrl || '(설정되지 않음)'}
                  </p>
                )}
                {error.includes('Missing access token') && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800 text-xs font-medium mb-1">해결 방법:</p>
                    <p className="text-yellow-700 text-xs">1. 로그아웃 후 다시 로그인해주세요</p>
                    <p className="text-yellow-700 text-xs">2. 브라우저 캐시를 삭제하고 다시 시도해주세요</p>
                    <button
                      onClick={() => {
                        window.location.href = '/login';
                      }}
                      className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
                    >
                      로그인 페이지로 이동
                    </button>
                  </div>
                )}
                <button
                  onClick={() => {
                    setError(null);
                    loadData();
                  }}
                  className="mt-2 text-xs text-red-600 underline hover:text-red-800"
                >
                  다시 시도
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4">
            <div className="flex-1">
              <h1 className="text-[20px] sm:text-[24px] text-neutral-950 mb-2">내 학습 현황</h1>
              <p className="text-[14px] sm:text-[16px] text-[#4a5565]">
                오늘 학습 시간: {totalHours > 0 ? `${totalHours}시간 ` : ''}{remainingMinutes}분 {remainingSeconds}초
              </p>
              {totalDailyTarget > 0 && (
                <>
                  <p className="text-[12px] sm:text-[14px] text-[#6a7282] mt-1">
                    남은 시간: {remainingHours > 0 ? `${remainingHours}시간 ` : ''}{remainingMins}분{remainingSecs > 0 ? ` ${remainingSecs}초` : ''}
                  </p>
                  <p className="text-[12px] sm:text-[14px] text-[#6a7282] mt-1">
                    오늘 목표: {dailyTargetHours > 0 ? `${dailyTargetHours}시간 ` : ''}{dailyTargetMinutes}분
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAllocationDialog(true)}
                className="bg-white border-2 border-[#9810fa] text-[#9810fa] hover:bg-purple-50 rounded-[8px] px-3 sm:px-4 h-[36px] text-[12px] sm:text-[14px] flex items-center gap-1 sm:gap-2 transition-colors"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">일일 분배</span>
                <span className="sm:hidden">분배</span>
              </button>
              <Link to={`/subject/create/${userId}`}>
                <button className="bg-[#9810fa] hover:bg-[#8610da] text-white rounded-[8px] px-3 sm:px-4 h-[36px] text-[12px] sm:text-[14px] flex items-center gap-1 sm:gap-2 transition-colors">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">과목 추가</span>
                  <span className="sm:hidden">추가</span>
                </button>
              </Link>
            </div>
          </div>
          
          {/* 탭 메뉴 */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 rounded-[8px] h-[36px] text-[12px] sm:text-[14px] font-medium transition-colors ${
                activeTab === 'active'
                  ? 'bg-[#9810fa] text-white'
                  : 'bg-white border border-[rgba(0,0,0,0.1)] text-neutral-950 hover:bg-gray-50'
              }`}
            >
              학습중인 과목
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`flex-1 rounded-[8px] h-[36px] text-[12px] sm:text-[14px] font-medium transition-colors ${
                activeTab === 'archived'
                  ? 'bg-[#9810fa] text-white'
                  : 'bg-white border border-[rgba(0,0,0,0.1)] text-neutral-950 hover:bg-gray-50'
              }`}
            >
              보관된 과목
            </button>
          </div>
        </div>

        {/* Subject Cards */}
        {subjects.length === 0 ? (
          <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-8 text-center">
            <p className="text-[#6a7282] mb-4">
              {activeTab === 'archived' ? '보관된 과목이 없습니다.' : '등록된 과목이 없습니다'}
            </p>
            {activeTab === 'active' && (
              <Link to={`/subject/create/${userId}`}>
                <button className="bg-[#9810fa] hover:bg-[#8610da] text-white rounded-[8px] px-4 h-[36px] text-[14px] inline-flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  첫 과목 추가하기
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                dailyProgress={dailyProgress.get(subject.id) || 0}
                dailyProgressSeconds={dailyProgressSeconds.get(subject.id) || 0}
                userId={userId}
                onArchive={handleArchive}
                overrideTargetDailyMin={isTodayAllocated ? undefined : 0}
              />
            ))}
          </div>
        )}

        {/* Quick Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mt-6 sm:mt-8">
          <h2 className="text-neutral-950 mb-4 text-[16px] sm:text-[18px]">빠른 메뉴</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Link to={`/profile/${userId}`}>
              <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors w-full">
                <div className="bg-[#9810fa] rounded-lg p-2">
                  <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-neutral-950">프로필 보기</span>
              </button>
            </Link>
            
            <Link to={`/reports/weekly/${userId}`}>
              <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors w-full">
                <div className="bg-blue-600 rounded-lg p-2">
                  <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24">
                    <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-neutral-950">주간 리포트</span>
              </button>
            </Link>
            
            <Link to={`/reports/daily/${userId}`}>
              <button className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors w-full">
                <div className="bg-emerald-600 rounded-lg p-2">
                  <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24">
                    <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-neutral-950">일간 리포트</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 일일 분배 다이얼로그 */}
      <Dialog open={showAllocationDialog} onOpenChange={setShowAllocationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>오늘의 학습 시간 분배</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-[14px] text-[#6a7282]">
              오늘 사용 가능한 총 학습 시간을 입력하면, 각 과목의 학점, 난이도, 과제 여부를 고려하여 자동으로 시간을 분배합니다.
            </p>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[14px] text-neutral-950">
                  오늘 사용 가능한 시간 (분)
                </label>
                <button
                  onClick={handleGetRecommendation}
                  disabled={recommending || subjects.length === 0}
                  className="text-[12px] text-[#9810fa] hover:text-[#8610da] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {recommending ? '추천 중...' : '오늘의 분배 추천'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="30"
                  step="30"
                  value={availableMinutes}
                  onChange={(e) => setAvailableMinutes(parseInt(e.target.value) || 0)}
                  className="flex-1 bg-[#f3f3f5] rounded-[8px] h-[40px] px-3 text-[16px] text-neutral-950 border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
                />
                <span className="text-[14px] text-[#6a7282] whitespace-nowrap">
                  ({Math.floor(availableMinutes / 60)}시간 {availableMinutes % 60}분)
                </span>
              </div>
            </div>

            {allSubjects.filter(s => !s.archived).length > 0 && (
              <div className="bg-purple-50 rounded-[8px] p-3">
                <p className="text-[12px] text-[#6a7282] mb-2">분배 대상 과목:</p>
                <div className="flex flex-wrap gap-2">
                  {allSubjects.filter(s => !s.archived).map(subject => (
                    <span
                      key={subject.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] text-[12px] text-white"
                      style={{ backgroundColor: subject.color }}
                    >
                      {subject.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAllocationDialog(false)}
                className="flex-1 bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[36px] text-[14px] text-neutral-950 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDailyAllocation}
                disabled={allocating || subjects.length === 0}
                className="flex-1 bg-[#9810fa] hover:bg-[#8610da] text-white rounded-[8px] h-[36px] text-[14px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {allocating ? '분배 중...' : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    시간 분배
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
