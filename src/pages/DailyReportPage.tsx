import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Clock, List, BookOpen } from 'lucide-react';
import { api, DailyReport, Session, Subject } from '../services/api';
import { Toaster, toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function DailyReportPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [report, setReport] = useState<DailyReport | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | 'all'>('all');

  useEffect(() => {
    loadReport();
  }, [selectedDate]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const [reportData, sessionsData, subjectsData] = await Promise.all([
        api.getDailyReport(selectedDate),
        api.getSessions({ date: selectedDate }).catch(() => [] as Session[]),
        api.getSubjects(false).catch(() => [] as Subject[])
      ]);
      
      // 과목 정보를 사용하여 리포트의 과목 색상 매핑
      const reportWithColors = {
        ...reportData,
        subjects: reportData.subjects.map(subject => {
          const subjectInfo = subjectsData.find(s => String(s.id) === subject.subjectId);
          return {
            ...subject,
            color: subjectInfo?.color || subject.color || '#3B82F6'
          };
        })
      };
      
      setReport(reportWithColors);
      setSessions(sessionsData);
      setSubjects(subjectsData);
      
      // 디버깅: 세션 데이터 확인
      console.log('Sessions data:', sessionsData);
      console.log('Report data:', reportWithColors);
    } catch (error) {
      toast.error('리포트를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${date.toLocaleDateString('ko-KR', { weekday: 'long' })})`;
  };

  const sessionCount = sessions
    .filter(s => s && (s.status === 'completed' || s.status === 'stopped'))
    .length;
  const subjectCount = report?.subjects.length || 0;

  // 총 학습 시간을 초 단위로 계산 (세션 데이터에서 직접 계산)
  const totalSeconds = sessions
    .filter(s => s.status === 'completed' || s.status === 'stopped')
    .reduce((sum, s) => {
      let durationSec = 0;
      if (s.endTime) {
        const start = new Date(s.startTime).getTime();
        const end = new Date(s.endTime).getTime();
        durationSec = Math.floor((end - start) / 1000);
      } else {
        durationSec = (s.duration || 0) * 60;
      }
      return sum + durationSec;
    }, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMins = Math.floor((totalSeconds % 3600) / 60);
  const totalSecs = totalSeconds % 60;

  // 각 과목별 초 단위 계산
  const subjectSecondsMap = new Map<string, number>();
  sessions
    .filter(s => s.status === 'completed' || s.status === 'stopped')
    .forEach(s => {
      let durationSec = 0;
      if (s.endTime) {
        const start = new Date(s.startTime).getTime();
        const end = new Date(s.endTime).getTime();
        durationSec = Math.floor((end - start) / 1000);
      } else {
        durationSec = (s.duration || 0) * 60;
      }
      const current = subjectSecondsMap.get(s.subjectId) || 0;
      subjectSecondsMap.set(s.subjectId, current + durationSec);
    });

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-[848px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 sm:gap-3 h-[36px] px-2 sm:px-3 rounded-[8px] hover:bg-gray-100 transition-colors mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[12px] sm:text-[14px] text-neutral-950">돌아가기</span>
        </button>

        {loading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : !report ? (
          <div className="text-center py-8">리포트를 불러올 수 없습니다</div>
        ) : (
          <>
            {/* Header Card */}
            <div className="bg-white rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-4 sm:p-[32px] mb-4 sm:mb-[24px]">
              <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-[24px] gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-[18px] sm:text-[24px] text-neutral-950 mb-1 sm:mb-[8px]">일일 학습 리포트</h1>
                  <p className="text-[12px] sm:text-[16px] text-[#4a5565] break-words">{formatDate(selectedDate)}</p>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0">
                      <CalendarIcon className="w-6 h-6 sm:w-[32px] sm:h-[32px] text-[#9810fa]" strokeWidth={2.67} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg" align="end">
                    <Calendar
                      mode="single"
                      selected={new Date(selectedDate)}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(format(date, 'yyyy-MM-dd'));
                        }
                      }}
                      locale={ko}
                      className="rounded-md border-0"
                      classNames={{
                        day_today: "!bg-[#9810fa] !text-white !rounded-full !font-semibold",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-[16px]">
                <div className="bg-purple-50 rounded-[14px] p-3 sm:p-[16px]">
                  <div className="flex items-center gap-1 sm:gap-[8px] mb-1 sm:mb-[8px]">
                    <Clock className="w-4 h-4 sm:w-[20px] sm:h-[20px] text-[#9810fa]" strokeWidth={1.67} />
                    <span className="text-[11px] sm:text-[16px] text-[#4a5565]">총 학습 시간</span>
                  </div>
                  <p className="text-[12px] sm:text-[16px] text-neutral-950 break-words">
                    {totalHours > 0 ? `${totalHours}시간 ` : ''}{totalMins}분 {totalSecs}초
                  </p>
                </div>

                <div className="bg-blue-50 rounded-[14px] p-3 sm:p-[16px]">
                  <div className="flex items-center gap-1 sm:gap-[8px] mb-1 sm:mb-[8px]">
                    <List className="w-4 h-4 sm:w-[20px] sm:h-[20px] text-[#155dfc]" strokeWidth={1.67} />
                    <span className="text-[11px] sm:text-[16px] text-[#4a5565]">학습 세션</span>
                  </div>
                  <p className="text-[12px] sm:text-[16px] text-neutral-950">{sessionCount}개</p>
                </div>

                <div className="bg-emerald-50 rounded-[14px] p-3 sm:p-[16px]">
                  <div className="flex items-center gap-1 sm:gap-[8px] mb-1 sm:mb-[8px]">
                    <BookOpen className="w-4 h-4 sm:w-[20px] sm:h-[20px] text-[#009966]" strokeWidth={1.67} />
                    <span className="text-[11px] sm:text-[16px] text-[#4a5565]">과목 수</span>
                  </div>
                  <p className="text-[12px] sm:text-[16px] text-neutral-950">{subjectCount}과목</p>
                </div>
              </div>
            </div>

            {/* Sessions Card */}
            <div className="bg-white rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-4 sm:p-[32px]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-[24px]">
                <h2 className="text-[16px] sm:text-[20px] text-neutral-950">학습 세션 기록</h2>
                
                {/* 필터 및 정렬 */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {/* 정렬 선택 */}
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-[8px] p-1">
                    <button
                      onClick={() => setSortOrder('newest')}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-[14px] rounded-[6px] transition-colors ${
                        sortOrder === 'newest'
                          ? 'bg-white text-neutral-950 shadow-sm'
                          : 'text-[#6a7282] hover:text-neutral-950'
                      }`}
                    >
                      최신순
                    </button>
                    <button
                      onClick={() => setSortOrder('oldest')}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-[14px] rounded-[6px] transition-colors ${
                        sortOrder === 'oldest'
                          ? 'bg-white text-neutral-950 shadow-sm'
                          : 'text-[#6a7282] hover:text-neutral-950'
                      }`}
                    >
                      과거순
                    </button>
                  </div>
                  
                  {/* 과목 선택 */}
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-[14px] border border-gray-300 rounded-[8px] bg-white text-neutral-950 focus:outline-none focus:ring-2 focus:ring-[#9810fa] focus:border-transparent"
                  >
                    <option value="all">전체 과목</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={String(subject.id)}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {(() => {
                // 필터링 및 정렬된 세션
                const filteredSessions = sessions
                  .filter(s => (s.status === 'completed' || s.status === 'stopped') && s.endTime)
                  .filter(s => {
                    if (selectedSubjectId === 'all') return true;
                    return String(s.subjectId) === selectedSubjectId;
                  })
                  .sort((a, b) => {
                    const timeA = new Date(a.startTime).getTime();
                    const timeB = new Date(b.startTime).getTime();
                    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
                  });
                
                return filteredSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {selectedSubjectId === 'all' 
                    ? '이 날짜에는 학습 기록이 없습니다'
                    : '선택한 과목의 학습 기록이 없습니다'}
                </p>
              ) : (
                <div className="flex flex-col gap-[16px]">
                  {filteredSessions.map((session, index) => {
                      // 과목 정보 찾기
                      const subjectInfo = subjects.find(s => String(s.id) === String(session.subjectId));
                      const subjectColor = subjectInfo?.color || '#3B82F6';
                      const subjectName = subjectInfo?.name || '알 수 없는 과목';
                      
                      // 시작/종료 시간
                      const start = new Date(session.startTime);
                      const end = session.endTime ? new Date(session.endTime) : null;
                      const startTime = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
                      const endTime = end ? `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}` : '진행 중';
                      
                      // 세션 시간 계산 (초 단위)
                      let durationSec = 0;
                      if (end) {
                        durationSec = Math.floor((end.getTime() - start.getTime()) / 1000);
                      } else {
                        durationSec = (session.duration || 0) * 60;
                      }
                      
                      const hours = Math.floor(durationSec / 3600);
                      const mins = Math.floor((durationSec % 3600) / 60);
                      const secs = durationSec % 60;
                      const minutes = Math.floor(durationSec / 60);
                      
                      return (
                        <div key={session.id || index} className="border border-gray-200 rounded-[14px] p-3 sm:p-[17px]">
                          <div className="flex items-start gap-3 sm:gap-[16px]">
                            {/* Color Icon */}
                            <div
                              className="w-10 h-10 sm:w-[48px] sm:h-[48px] rounded-full flex-shrink-0"
                              style={{ backgroundColor: subjectColor }}
                            />
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2 sm:mb-[8px]">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-[14px] sm:text-[18px] text-neutral-950 mb-1 sm:mb-[3px] break-words">
                                    {subjectName}
                                  </h3>
                                  <p className="text-[12px] sm:text-[16px] text-[#6a7282]">
                                    {startTime} - {endTime}
                                  </p>
                                </div>
                                <div className="text-left sm:text-right">
                                  <p className="text-[12px] sm:text-[16px] text-neutral-950 whitespace-nowrap">
                                    {hours > 0 ? `${hours}시간 ` : ''}{mins}분 {secs}초
                                  </p>
                                </div>
                              </div>
                              
                              {/* Note */}
                              <div className="bg-gray-50 rounded-[10px] p-2 sm:p-[12px]">
                                <p className="text-[12px] sm:text-[16px] text-[#4a5565]">
                                  📝 학습 내용 기록
                                </p>
                                {session.note ? (
                                  <p className="text-[11px] sm:text-[14px] text-neutral-950 mt-1 sm:mt-[8px] whitespace-pre-wrap break-words">
                                    {session.note}
                                  </p>
                                ) : (
                                  <p className="text-[11px] sm:text-[14px] text-[#9ca3af] mt-1 sm:mt-[8px]">
                                    기록된 내용이 없습니다
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
              })()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
