import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Calendar, Clock, TrendingUp, Award, CalendarDays } from 'lucide-react';
import { api, WeeklyReport, Subject, Session } from '../services/api';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { ko } from 'date-fns/locale';

import { Toaster, toast } from "sonner";

export function WeeklyReportPage() {
  const navigate = useNavigate();
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadReport();
  }, [weekStart]);

  function formatLocalYYYYMMDD(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getMonday(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return formatLocalYYYYMMDD(monday);
  }

  const loadReport = async () => {
    setLoading(true);
    try {
      // 이번 주 월요일부터 오늘까지 각 날짜별로 세션 조회 (초 단위 계산용)
      const today = new Date();
      const todayStr = formatLocalYYYYMMDD(today);
      const monday = new Date(weekStart);
      monday.setHours(0, 0, 0, 0);
      
      const sessionPromises: Promise<Session[]>[] = [];
      const currentDate = new Date(monday);
      currentDate.setHours(0, 0, 0, 0);
      
      // 월요일부터 오늘까지 각 날짜별로 세션 조회
      while (true) {
        const dateStr = formatLocalYYYYMMDD(currentDate);
        sessionPromises.push(
          api.getSessions({ date: dateStr }).catch(() => [] as Session[])
        );
        
        if (dateStr === todayStr) {
          break;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      const [reportData, subjectsData, ...sessionsArrays] = await Promise.all([
        api.getWeeklyReport(weekStart),
        api.getSubjects(false).catch(() => [] as Subject[]),
        ...sessionPromises
      ]);
      
      const allSessions = sessionsArrays.flat();
      
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
      setSubjects(subjectsData);
      setSessions(allSessions);
    } catch (error) {
      toast.error('리포트를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const formatWeekRange = () => {
    if (!report) return '';
    const start = new Date(report.weekStart);
    // weekEnd가 없으면 weekStart에서 6일 더한 날짜 사용
    const endDate = report.weekEnd ? new Date(report.weekEnd) : new Date(start);
    if (!report.weekEnd) {
      endDate.setDate(start.getDate() + 6);
    }
    return `${start.getFullYear()}년 ${start.getMonth() + 1}월 ${start.getDate()}일 - ${endDate.getMonth() + 1}월 ${endDate.getDate()}일`;
  };

  // 일별 학습 시간 계산 (세션 데이터에서 직접 계산)
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  
  // weekStart가 문자열이므로 안전하게 Date로 변환
  const mondayDate = weekStart ? new Date(weekStart + 'T00:00:00') : new Date();
  mondayDate.setHours(0, 0, 0, 0);
  
  const dailyChartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(mondayDate);
    date.setDate(mondayDate.getDate() + i);
    date.setHours(0, 0, 0, 0);
    const dateStr = formatLocalYYYYMMDD(date);
    
    // 해당 날짜의 모든 세션 시간 계산 (초 단위)
    const daySeconds = (sessions || [])
      .filter(s => {
        if (!s) return false;
        if (s.status !== 'completed' && s.status !== 'stopped') return false;
        try {
          // 세션의 시작 날짜를 YYYY-MM-DD 형식으로 추출 (시간을 0으로 설정하여 정확한 날짜 비교)
          const sessionStart = new Date(s.startTime);
          sessionStart.setHours(0, 0, 0, 0);
          const sessionDateStr = formatLocalYYYYMMDD(sessionStart);
          return sessionDateStr === dateStr;
        } catch {
          return false;
        }
      })
      .reduce((sum, s) => {
        try {
          let durationSec = 0;
          if (s.endTime) {
            const start = new Date(s.startTime).getTime();
            const end = new Date(s.endTime).getTime();
            durationSec = Math.floor((end - start) / 1000);
          } else if (s.duration) {
            // duration이 분 단위이므로 초로 변환
            durationSec = s.duration * 60;
          }
          return sum + durationSec;
        } catch {
          return sum;
        }
      }, 0);
    
    // 분 단위로 변환 (차트에 표시)
    const minutes = Math.floor(daySeconds / 60);
    
    return {
      date: days[date.getDay()],
      minutes: minutes || 0 // 최소 0 보장
    };
  });

  // 세션 데이터에서 과목별 초 단위로 계산하여 pieChartData 생성
  const pieChartData = report?.subjects
    .map(s => {
      // 세션 데이터에서 정확한 초 단위 계산
      const subjectSeconds = sessions
        .filter(session => 
          String(session.subjectId) === String(s.subjectId) &&
          (session.status === 'completed' || session.status === 'stopped')
        )
        .reduce((sum, session) => {
          let durationSec = 0;
          if (session.endTime) {
            const start = new Date(session.startTime).getTime();
            const end = new Date(session.endTime).getTime();
            durationSec = Math.floor((end - start) / 1000);
          } else {
            durationSec = (session.duration || 0) * 60;
          }
          return sum + durationSec;
        }, 0);
      
      return {
        name: s.subjectName,
        value: subjectSeconds, // 초 단위로 사용
        color: s.color
      };
    })
    .filter(item => item.value > 0) // 0보다 큰 값만 표시
    || [];
  
  // 디버깅: pieChartData 확인
  console.log('[WeeklyReport] pieChartData:', pieChartData);
  console.log('[WeeklyReport] report?.subjects:', report?.subjects);

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
  
  // 일일 평균 계산 (초 단위로 정확하게 계산)
  const avgDailySeconds = report ? Math.round(totalSeconds / 7) : 0;
  const avgDailyHours = Math.floor(avgDailySeconds / 3600);
  const avgDailyMins = Math.floor((avgDailySeconds % 3600) / 60);
  const avgDailySecs = avgDailySeconds % 60;
  
  // 목표 달성률 계산: 그 주에 분배받은 총 시간 (각 과목의 targetDailyMin 합계)
  // 보관되지 않은 과목들의 일일 목표 시간을 합산
  const totalTargetMinutes = subjects
    .filter(s => !s.archived) // 보관되지 않은 과목만
    .reduce((sum, s) => sum + (s.targetDailyMin || 0), 0);
  
  const totalTargetSeconds = totalTargetMinutes * 60;
  
  // 목표 달성률 계산 (실제 학습 시간 / 목표 시간 * 100) - 소수점 한 자리까지
  const achievementRate = totalTargetSeconds > 0 
    ? ((totalSeconds / totalTargetSeconds) * 100).toFixed(1) 
    : '0.0';
  
  // 학습일 계산 (세션 데이터에서 직접 계산)
  const studyDays = dailyChartData.filter(d => d.minutes > 0).length;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-[1104px] mx-auto">
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-[24px]">
                <div className="flex-1">
                  <h1 className="text-[18px] sm:text-[24px] text-neutral-950 mb-2 sm:mb-[8px]">주간 학습 리포트</h1>
                  <p className="text-[12px] sm:text-[16px] text-[#4a5565] break-words">{formatWeekRange()}</p>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="cursor-pointer hover:opacity-70 transition-opacity self-start sm:self-auto">
                      <Calendar className="w-6 h-6 sm:w-[32px] sm:h-[32px] text-[#9810fa]" strokeWidth={2.67} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={new Date(weekStart + 'T00:00:00')}
                      onSelect={(date) => {
                        if (date) {
                          const selectedMonday = getMonday(date);
                          setWeekStart(selectedMonday);
                        }
                      }}
                      locale={ko}
                      className="rounded-md border-0"
                      modifiers={{
                        weekStart: (() => {
                          // 해당 주의 월요일
                          const monday = new Date(weekStart + 'T00:00:00');
                          monday.setHours(0, 0, 0, 0);
                          return [monday];
                        })(),
                        weekEnd: (() => {
                          // 해당 주의 일요일
                          const monday = new Date(weekStart + 'T00:00:00');
                          monday.setHours(0, 0, 0, 0);
                          const sunday = new Date(monday);
                          sunday.setDate(monday.getDate() + 6);
                          return [sunday];
                        })(),
                        weekMiddle: (() => {
                          // 해당 주의 화요일~토요일
                          const monday = new Date(weekStart + 'T00:00:00');
                          monday.setHours(0, 0, 0, 0);
                          const middleDates: Date[] = [];
                          for (let i = 1; i < 6; i++) {
                            const date = new Date(monday);
                            date.setDate(monday.getDate() + i);
                            middleDates.push(date);
                          }
                          return middleDates;
                        })(),
                      }}
                      modifiersClassNames={{
                        weekStart: "!bg-[#9810fa] !text-white !rounded-l-full !rounded-r-none",
                        weekEnd: "!bg-[#9810fa] !text-white !rounded-r-full !rounded-l-none",
                        weekMiddle: "!bg-[#9810fa] !text-white !rounded-none",
                      }}
                      classNames={{
                        day_selected: "!bg-[#9810fa] !text-white !rounded-full",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-[16px]">
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
                    <TrendingUp className="w-4 h-4 sm:w-[20px] sm:h-[20px] text-[#155dfc]" strokeWidth={1.67} />
                    <span className="text-[11px] sm:text-[16px] text-[#4a5565]">일일 평균</span>
                  </div>
                  <p className="text-[12px] sm:text-[16px] text-neutral-950 break-words">
                    {avgDailyHours > 0 ? `${avgDailyHours}시간 ` : ''}{avgDailyMins}분 {avgDailySecs}초
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-[14px] p-3 sm:p-[16px]">
                  <div className="flex items-center gap-1 sm:gap-[8px] mb-1 sm:mb-[8px]">
                    <Award className="w-4 h-4 sm:w-[20px] sm:h-[20px] text-[#009966]" strokeWidth={1.67} />
                    <span className="text-[11px] sm:text-[16px] text-[#4a5565]">목표 달성률</span>
                  </div>
                  <p className="text-[12px] sm:text-[16px] text-neutral-950">{achievementRate}%</p>
                </div>

                <div className="bg-amber-50 rounded-[14px] p-3 sm:p-[16px]">
                  <div className="flex items-center gap-1 sm:gap-[8px] mb-1 sm:mb-[8px]">
                    <CalendarDays className="w-4 h-4 sm:w-[20px] sm:h-[20px] text-[#e17100]" strokeWidth={1.67} />
                    <span className="text-[11px] sm:text-[16px] text-[#4a5565]">학습일</span>
                  </div>
                  <p className="text-[12px] sm:text-[16px] text-neutral-950">{studyDays}일 / 7일</p>
                </div>
              </div>
            </div>

            {/* Daily Chart */}
            <div className="bg-white rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-4 sm:p-[32px] mb-4 sm:mb-[24px]">
              <h2 className="text-[16px] sm:text-[20px] text-neutral-950 mb-4 sm:mb-[24px]">일별 학습 시간</h2>
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6A7282" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6A7282" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#9810fa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Distribution */}
            <div className="bg-white rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-4 sm:p-[32px]">
              <h2 className="text-[16px] sm:text-[20px] text-neutral-950 mb-4 sm:mb-[24px]">과목별 학습 시간 분포</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-[32px]">
                {/* Pie Chart */}
                <div className="flex items-center justify-center min-h-[250px] sm:min-h-[300px] w-full">
                  {pieChartData.length > 0 ? (
                    <div className="w-full" style={{ height: isMobile ? '250px' : '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => {
                            const percentValue = (percent * 100).toFixed(0);
                            // 모바일에서도 이름 표시 (짧게)
                            if (isMobile) {
                              // 모바일: 이름 첫 글자만 또는 짧은 이름
                              const shortName = name.length > 4 ? name.substring(0, 4) + '...' : name;
                              return `${shortName}\n${percentValue}%`;
                            }
                            return `${name} ${percentValue}%`;
                          }}
                          outerRadius={isMobile ? 70 : 100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center text-[#6a7282] text-sm">
                      데이터가 없습니다
                    </div>
                  )}
                </div>

                {/* Subject List */}
                <div className="flex flex-col gap-3 sm:gap-[16px]">
                  {report.subjects.length > 0 ? (
                    report.subjects.map((subject, index) => {
                      // 세션 데이터에서 정확한 초 단위 계산
                      const subjectSeconds = sessions
                        .filter(s => 
                          String(s.subjectId) === String(subject.subjectId) &&
                          (s.status === 'completed' || s.status === 'stopped')
                        )
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
                      
                      const hours = Math.floor(subjectSeconds / 3600);
                      const mins = Math.floor((subjectSeconds % 3600) / 60);
                      const secs = subjectSeconds % 60;
                      
                      return (
                        <div key={index} className="bg-gray-50 rounded-[14px] p-3 sm:p-[16px] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-[12px] min-w-0 flex-1">
                            <div
                              className="w-3 h-3 sm:w-[16px] sm:h-[16px] rounded-full flex-shrink-0"
                              style={{ backgroundColor: subject.color }}
                            />
                            <span className="text-[13px] sm:text-[16px] text-neutral-950 truncate">{subject.subjectName}</span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[12px] sm:text-[16px] text-neutral-950 whitespace-nowrap">
                              {hours > 0 ? `${hours}시간 ` : ''}{mins}분 {secs}초
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-[#6a7282] text-sm py-8">
                      과목 데이터가 없습니다
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
