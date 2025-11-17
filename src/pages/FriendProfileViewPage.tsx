import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import { Calendar, Clock, TrendingUp, ArrowLeft } from 'lucide-react';
import { api, Subject, User, Session } from '../services/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';

export default function FriendProfileViewPage() {
  const { friendUserId } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (friendUserId) {
      loadData();
    }
  }, [friendUserId]);

  useEffect(() => {
    console.log('[FriendProfile] weeklyData updated:', weeklyData);
  }, [weeklyData]);

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

  const loadData = async () => {
    if (!friendUserId) return;
    
    setLoading(true);
    try {
      // 친구 프로필 조회
      const profile = await (api as any).getFriendProfile(friendUserId);
      setUser(profile);
    } catch (error) {
      toast.error('친구 프로필을 불러오는데 실패했습니다');
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
          (api as any).getFriendSessions(friendUserId, dateStr).catch(() => [] as Session[])
        );
        
        if (dateStr === todayStr) {
          break;
        }
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        currentDate.setTime(nextDate.getTime());
      }
      
      const [subjectsData, ...weekSessionsArrays] = await Promise.all([
        (api as any).getFriendSubjects(friendUserId).catch(() => [] as Subject[]),
        ...weekSessionPromises
      ]);
      
      const allWeekSessions = weekSessionsArrays.flat();
      console.log('[FriendProfile] All week sessions:', allWeekSessions);
      
      // 주간 세션 필터링: 이미 각 날짜별로 조회했으므로, 상태만 확인
      const weekSessions = allWeekSessions.filter(
        (session) => (session.status === 'completed' || (session as any).status === 'stopped')
      );
      console.log('[FriendProfile] Filtered week sessions:', weekSessions);

      // 초 단위로 계산 (프로필 페이지와 동일한 방식)
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
        console.log(`[FriendProfile] Session ${session.id}: subjectId=${subjectId}, durationSec=${durationSec}, total=${current + durationSec}`);
      });
      console.log('[FriendProfile] Subject seconds map:', Array.from(subjectSecondsMap.entries()));
      
      // 분 단위로 변환 (차트 데이터용)
      const subjectMap = new Map<string, number>();
      subjectSecondsMap.forEach((totalSeconds, subjectId) => {
        subjectMap.set(subjectId, Math.floor(totalSeconds / 60));
      });
      console.log('[FriendProfile] Subject map (minutes):', Array.from(subjectMap.entries()));

      // 차트 데이터 생성
      console.log('[FriendProfile] Subjects data:', subjectsData);
      const chartData = subjectsData.filter((s: Subject) => !s.archived).map((subject) => {
        const subjectId = String(subject.id);
        const minutes = subjectMap.get(subjectId) || 0;
        const seconds = subjectSecondsMap.get(subjectId) || 0;
        console.log(`[FriendProfile] Chart data for ${subject.name} (id: ${subjectId}): minutes=${minutes}, seconds=${seconds}, target=${subject.targetDailyMin}`);
        return {
          name: subject.name,
          minutes,
          seconds,
          target: subject.targetDailyMin || 0,
          color: subject.color,
        };
      });
      console.log('[FriendProfile] Final chart data:', chartData);

      setWeeklyData(chartData);

      // 초 단위로 합산 (프로필 페이지와 동일한 방식)
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
        const totalTimeResult = await (api as any).getTotalStudyTime?.({ userId: String(friendUserId) });
        if (totalTimeResult && typeof totalTimeResult.totalSeconds === 'number') {
          finalTotalSeconds = totalTimeResult.totalSeconds;
        }
      } catch (error) {
        console.warn('[FriendProfile] Failed to fetch total study time:', error);
      }

      setStats({
        totalMinutes: Math.floor(finalTotalSeconds / 60),
        thisWeekMinutes: Math.floor(thisWeekSeconds / 60),
        avgSessionLength: Math.floor(avgSessionSeconds / 60),
        totalSeconds: finalTotalSeconds,
        thisWeekSeconds,
        avgSessionSeconds,
      });
    } catch (error) {
      toast.error('학습 데이터를 불러오는데 실패했습니다');
      setWeeklyData([]);
      setStats({ totalMinutes: 0, thisWeekMinutes: 0, avgSessionLength: 0, totalSeconds: 0, thisWeekSeconds: 0, avgSessionSeconds: 0 });
    } finally {
      setLoading(false);
    }
  };

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
    const roundedMax = Math.ceil(maxDataValue * 1.2 / 50) * 50;
    return Math.max(roundedMax, 100);
  };

  const maxYValue = getMaxValue();
  
  // Y축 틱 생성 (0부터 maxYValue까지 4-5개 구간)
  const getYTicks = () => {
    const interval = Math.ceil(maxYValue / 4 / 25) * 25;
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
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
        
        <div className="box-border content-stretch flex flex-col gap-[32px] items-start pb-0 pt-[32px] px-[16px]">
          {/* 헤더 */}
          <div className="h-[24px] w-full flex items-center justify-between">
            <p className="font-normal leading-[24px] text-[16px] text-neutral-950">친구 프로필</p>
            {/* 수정 버튼 제거 */}
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

          {/* 상단 3개 카드 */}
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

          {/* 차트 카드 */}
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
                      formatter={(value, entry: any) => (
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

          {/* 과목별 진행 상황 */}
          <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-[25px] w-full">
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
        </div>
      </div>
    </div>
  );
}
