import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, Clock, TrendingUp, Edit, ArrowLeft } from 'lucide-react';
import { api, Subject, User, Session } from '../services/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';

export function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalMinutes: 0,
    thisWeekMinutes: 0,
    avgSessionLength: 0,
    totalSeconds: 0,
    thisWeekSeconds: 0,
    avgSessionSeconds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [viewingOther, setViewingOther] = useState(false);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const me = await api.getMe();
      // 친구 프로필 보기: URL 파라미터가 있고, 내 ID와 다르면 조회 전용으로 처리
      if (userId && String(userId) !== String(me.id)) {
        setViewingOther(true);
        try {
          const results = await (api as any).searchUsers?.(String(userId));
          const friend = Array.isArray(results)
            ? results.find((u: any) => String(u.id) === String(userId) || String(u.userId) === String(userId)) || results[0]
            : null;
          if (friend) {
            setUser({
              id: String(friend.id ?? friend.userId ?? ''),
              email: friend.email ?? '',
              name: friend.nickname ?? friend.userId ?? '',
              nickname: friend.nickname ?? null,
              grade: null,
              gender: null,
              isCompleted: undefined,
            } as User);
          } else {
            setUser({
              id: String(userId),
              email: '',
              name: '',
              nickname: null,
              grade: null,
              gender: null,
              isCompleted: undefined,
            } as User);
          }
        } catch {
          setUser({
            id: String(userId),
            email: '',
            name: '',
            nickname: null,
            grade: null,
            gender: null,
            isCompleted: undefined,
          } as User);
        }
        // 다른 사용자 프로필에서는 통계/세션 데이터는 표시하지 않음
        setWeeklyData([]);
        setStats({ totalMinutes: 0, thisWeekMinutes: 0, avgSessionLength: 0, totalSeconds: 0, thisWeekSeconds: 0, avgSessionSeconds: 0 });
        setLoading(false);
        return;
      }
      // 내 프로필 보기
      setViewingOther(false);
      setUser(me);
    } catch (error) {
      toast.error('프로필을 불러오는데 실패했습니다');
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // 이번 주 월요일부터 오늘까지 각 날짜별로 세션 조회 (주간 리포트와 동일한 방식)
      const today = new Date();
      const todayStr = formatLocalYYYYMMDD(today);
      const weekStartStr = getMonday(today);
      const monday = new Date(weekStartStr + 'T00:00:00');
      monday.setHours(0, 0, 0, 0);
      
      const weekSessionPromises: Promise<Session[]>[] = [];
      const currentDate = new Date(monday);
      currentDate.setHours(0, 0, 0, 0);
      
      // 월요일부터 오늘까지 각 날짜별로 세션 조회
      while (true) {
        const dateStr = formatLocalYYYYMMDD(currentDate);
        weekSessionPromises.push(
          api.getSessions({ date: dateStr }).catch(() => [] as Session[])
        );
        
        if (dateStr === todayStr) {
          break;
        }
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        currentDate.setTime(nextDate.getTime());
      }
      
      console.log('Fetching sessions from', weekStartStr, 'to', todayStr, '- Total days:', weekSessionPromises.length);
      
      const [subjectsData, ...weekSessionsArrays] = await Promise.all([
        api.getSubjects(true),
        ...weekSessionPromises
      ]);
      
      const allWeekSessions = weekSessionsArrays.flat();
      
      // 주간 세션 필터링: 이미 각 날짜별로 조회했으므로, 상태만 확인
      const weekSessions = allWeekSessions.filter(
        (session) => (session.status === 'completed' || (session as any).status === 'stopped')
      );

      // 디버깅: 세션 데이터 확인
      console.log('All week sessions:', allWeekSessions);
      console.log('Filtered week sessions:', weekSessions);

      // 초 단위로 계산 (메인 페이지와 동일한 방식)
      const subjectSecondsMap = new Map<string, number>();
      weekSessions.forEach((session) => {
        const subjectId = String(session.subjectId);
        let durationSec = 0;
        if (session.endTime) {
          const start = new Date(session.startTime).getTime();
          const end = new Date(session.endTime).getTime();
          durationSec = Math.floor((end - start) / 1000);
        } else {
          durationSec = (session.duration || 0) * 60;
        }
        const current = subjectSecondsMap.get(subjectId) || 0;
        subjectSecondsMap.set(subjectId, current + durationSec);
      });
      
      // 분 단위로 변환 (차트 데이터용)
      const subjectMap = new Map<string, number>();
      subjectSecondsMap.forEach((totalSeconds, subjectId) => {
        subjectMap.set(subjectId, Math.floor(totalSeconds / 60));
      });
      
      console.log('Subject map:', subjectMap);

      // 이번 주 목표: 현재는 오늘 분배받은 일일 목표만 저장되므로, 
      // 실제로는 "한 주 동안 분배받은 일일 목표의 합"을 표시해야 하지만
      // 현재 데이터 구조로는 오늘의 일일 목표를 그대로 표시
      // (한 주 동안 분배받은 목표를 합산하려면 백엔드에서 각 날짜별 분배 데이터를 저장해야 함)
      const chartData = (subjectsData as Subject[]).filter(s => !s.archived).map((subject) => {
        const subjectId = String(subject.id); // 타입 일치시키기
        const minutes = subjectMap.get(subjectId) || 0;
        const seconds = subjectSecondsMap.get(subjectId) || 0;
        console.log(`Subject ${subject.name} (${subjectId}): minutes=${minutes}`);
        return {
          name: subject.name,
          minutes,
          seconds, // 초 단위 저장
          target: subject.targetDailyMin || 0, // 일일 목표를 그대로 표시 (주간이 아닌)
          color: subject.color,
        };
      });
      
      console.log('Chart data:', chartData);

      setWeeklyData(chartData);

      // 초 단위로 합산
      const completedSessions = allWeekSessions.filter((session) => session.status === 'completed' || (session as any).status === 'stopped');
      const totalSeconds = completedSessions.reduce((sum, session) => {
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
      
      const thisWeekSeconds = weekSessions.reduce((sum, session) => {
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
      
      const avgSessionSeconds = completedSessions.length
        ? Math.round(totalSeconds / completedSessions.length)
        : 0;

      let finalTotalSeconds = totalSeconds;
      try {
        const totalTimeResult = await (api as any).getTotalStudyTime?.();
        if (totalTimeResult && typeof totalTimeResult.totalSeconds === 'number') {
          finalTotalSeconds = totalTimeResult.totalSeconds;
        }
      } catch (error) {
        console.warn('Failed to fetch total study time:', error);
      }

      setStats({
        totalMinutes: Math.floor(finalTotalSeconds / 60), // 하위 호환성 유지
        thisWeekMinutes: Math.floor(thisWeekSeconds / 60), // 하위 호환성 유지
        avgSessionLength: Math.floor(avgSessionSeconds / 60), // 하위 호환성 유지
        totalSeconds: finalTotalSeconds, // 초 단위 추가
        thisWeekSeconds, // 초 단위 추가
        avgSessionSeconds, // 초 단위 추가
      });
    } catch (error) {
      toast.error('학습 데이터를 불러오는데 실패했습니다');
      setWeeklyData([]);
      setStats({ totalMinutes: 0, thisWeekMinutes: 0, avgSessionLength: 0, totalSeconds: 0, thisWeekSeconds: 0, avgSessionSeconds: 0 });
    } finally {
      setLoading(false);
    }
  };

  // 주간 리포트와 동일한 방식으로 날짜 포맷팅
  function formatLocalYYYYMMDD(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // 이번 주 월요일 구하기 (주간 리포트와 동일)
  function getMonday(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.getFullYear(), d.getMonth(), diff);
    monday.setHours(0, 0, 0, 0);
    return formatLocalYYYYMMDD(monday);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  // 초 단위로 표시 (메인 페이지와 동일한 방식)
  const totalHours = Math.floor(stats.totalSeconds / 3600);
  const totalMins = Math.floor((stats.totalSeconds % 3600) / 60);
  const totalSecs = stats.totalSeconds % 60;
  
  const weekHours = Math.floor(stats.thisWeekSeconds / 3600);
  const weekMins = Math.floor((stats.thisWeekSeconds % 3600) / 60);
  const weekSecs = stats.thisWeekSeconds % 60;
  
  const avgHours = Math.floor(stats.avgSessionSeconds / 3600);
  const avgMins = Math.floor((stats.avgSessionSeconds % 3600) / 60);
  const avgSecs = stats.avgSessionSeconds % 60;

  // 차트 Y축 최대값 계산 (데이터에 따라 유동적으로)
  const getMaxValue = () => {
    if (weeklyData.length === 0) return 300;
    const maxDataValue = Math.max(
      ...weeklyData.map(item => Math.max(item.minutes || 0, item.target || 0))
    );
    // 최대값의 1.2배를 상한으로 설정하되, 최소 100, 최대값을 50 단위로 올림
    const roundedMax = Math.ceil(maxDataValue * 1.2 / 50) * 50;
    return Math.max(roundedMax, 100);
  };

  const maxYValue = getMaxValue();
  
  // Y축 틱 생성 (0부터 maxYValue까지 4-5개 구간)
  const getYTicks = () => {
    const interval = Math.ceil(maxYValue / 4 / 25) * 25; // 25 단위로 반올림
    const ticks = [];
    for (let i = 0; i <= maxYValue; i += interval) {
      ticks.push(i);
    }
    if (ticks[ticks.length - 1] < maxYValue) {
      ticks.push(maxYValue);
    }
    return ticks;
  };

  const yTicks = getYTicks();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1120px] mx-auto p-4">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </Link>
        
        <div className="box-border content-stretch flex flex-col gap-[32px] items-start pb-0 pt-[32px] px-[16px]">
          {/* 헤더 */}
          <div className="h-[24px] w-full flex items-center justify-between">
            <p className="font-normal leading-[24px] text-[16px] text-neutral-950">프로필</p>
            {user && !viewingOther && (
              <Link to={`/profile/edit/${user.id}`}>
                <button className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-4 h-[36px] text-[14px] text-neutral-950 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  프로필 수정
                </button>
              </Link>
            )}
          </div>

          {/* 사용자 정보 */}
          {user && (
            <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-6 w-full">
              <h2 className="text-[16px] text-neutral-950 mb-4">기본 정보</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-[14px] text-[#4B5563] w-20">아이디</span>
                  <span className="text-[14px] text-neutral-950">{user.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] text-[#4B5563] w-20">닉네임</span>
                  <span className="text-[14px] text-neutral-950">{user.nickname || '닉네임 미설정'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] text-[#4B5563] w-20">학년</span>
                  <span className="text-[14px] text-neutral-950">{user.grade ? `${user.grade}학년` : '학년 미설정'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] text-[#4B5563] w-20">성별</span>
                  <span className="text-[14px] text-neutral-950">
                    {user.gender === 'Male'
                      ? '남자'
                      : user.gender === 'Female'
                        ? '여자'
                        : '성별 미설정'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 다른 사용자 조회 시에는 통계 블록 숨김 */}
          {!viewingOther && (
          <div className="h-[158px] w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 총 학습 시간 */}
            <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-[25px] flex flex-col gap-[32px]">
              <div className="flex gap-[12px] items-center">
                <div className="bg-purple-100 rounded-[10px] size-[40px] flex items-center justify-center">
                  <Clock className="size-[20px] text-[#9810FA]" />
                </div>
                <p className="font-normal leading-[24px] text-[#4a5565] text-[16px]">총 학습 시간</p>
              </div>
              <p className="font-normal leading-[36px] text-[30px] text-neutral-950">
                {totalHours > 0 ? `${totalHours}시간 ` : ''}{totalMins}분 {totalSecs}초
              </p>
            </div>

            {/* 이번 주 학습 */}
            <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-[25px] flex flex-col gap-[32px]">
              <div className="flex gap-[12px] items-center">
                <div className="bg-blue-100 rounded-[10px] size-[40px] flex items-center justify-center">
                  <Calendar className="size-[20px] text-[#155DFC]" />
                </div>
                <p className="font-normal leading-[24px] text-[#4a5565] text-[16px]">이번 주 학습</p>
              </div>
              <p className="font-normal leading-[36px] text-[30px] text-neutral-950">
                {weekHours > 0 ? `${weekHours}시간 ` : ''}{weekMins}분 {weekSecs}초
              </p>
            </div>

            {/* 평균 세션 */}
            <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-[25px] flex flex-col gap-[32px]">
              <div className="flex gap-[12px] items-center">
                <div className="bg-green-100 rounded-[10px] size-[40px] flex items-center justify-center">
                  <TrendingUp className="size-[20px] text-[#00A63E]" />
                </div>
                <p className="font-normal leading-[24px] text-[#4a5565] text-[16px]">평균 세션</p>
              </div>
              <p className="font-normal leading-[36px] text-[30px] text-neutral-950">
                {avgHours > 0 ? `${avgHours}시간 ` : ''}{avgMins}분 {avgSecs}초
              </p>
            </div>
          </div>
          )}

          {/* 다른 사용자 조회 시에는 차트 숨김 */}
          {!viewingOther && (
          <div className="bg-white h-[414px] rounded-[14px] border border-[rgba(0,0,0,0.1)] w-full">
            <div className="p-[25px]">
              <p className="font-normal leading-[24px] text-[16px] text-neutral-950 mb-[40px]">이번 주 과목별 학습 시간</p>
              
              {/* 차트 영역 - recharts 사용 (툴팁 기능 유지) */}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#4B5563' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#4B5563' }}
                      domain={[0, maxYValue]}
                      ticks={yTicks}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '16px', paddingTop: '20px' }} 
                      iconType="square"
                      align="center"
                      formatter={(value) => (
                        <span style={{ color: '#111827' }}>{value}</span>
                      )}
                    />
                    <Bar dataKey="minutes" fill="#8B5CF6" name="학습 시간 (분)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#9CA3AF" name="목표 (분)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          )}

          {/* 다른 사용자 조회 시에는 진행상황/리포트 숨김 */}
          {!viewingOther && (
          <div className="gap-[24px] grid grid-cols-1 md:grid-cols-2 h-auto w-full">
            {/* 과목별 진행 상황 */}
            <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-[25px]">
              <p className="font-normal leading-[24px] text-[16px] text-neutral-950 mb-[40px]">과목별 진행 상황</p>
              
              <div className="flex flex-col gap-[16px]">
                {weeklyData.map((item, index) => {
                  const target = item.target || 1;
                  const percentage = target > 0 ? (item.minutes / target) * 100 : 0;
                  return (
                    <div key={index} className="flex flex-col gap-[8px]">
                      <div className="flex items-center justify-between h-[20px]">
                        <div className="flex items-center gap-[8px]">
                          <div
                            className="rounded-full size-[12px]"
                            style={{ backgroundColor: item.color ?? '#8B5CF6' }}
                          />
                          <p className="font-normal leading-[20px] text-[14px] text-neutral-950">{item.name}</p>
                        </div>
                        <p className="font-normal leading-[20px] text-[#4B5563] text-[14px]">
                          {item.minutes}분 {item.seconds % 60 > 0 ? `${item.seconds % 60}초` : ''}/{item.target}분
                        </p>
                      </div>
                      <div className="bg-gray-300 rounded-full h-[8px] overflow-hidden w-full">
                        <div
                          className="h-[8px] rounded-full transition-all"
                          style={{
                            backgroundColor: item.color ?? '#8B5CF6',
                            width: `${Math.min(percentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 리포트 */}
            <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-[25px]">
              <p className="font-normal leading-[24px] text-[16px] text-neutral-950 mb-[40px]">리포트</p>
              
              <div className="flex flex-col gap-[15px] pt-[7px]">
                <Link to={`/reports/weekly/${userId ?? user?.id ?? ''}`}>
                  <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors w-full">
                    <div className="bg-blue-600 rounded-lg p-2">
                      <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24">
                        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-neutral-950">주간 리포트 보기</span>
                  </button>
                </Link>
                
                <Link to={`/reports/daily/${userId ?? user?.id ?? ''}`}>
                  <button className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors w-full">
                    <div className="bg-emerald-600 rounded-lg p-2">
                      <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24">
                        <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-neutral-950">일간 리포트 보기</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
