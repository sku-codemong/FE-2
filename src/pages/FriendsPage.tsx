import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Session } from '../services/api';
import { toast } from 'sonner';
import { Users, UserPlus, Trophy, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { UserAvatar } from '../components/UserAvatar';

interface FriendWithStats {
  id: string;
  userId: string;
  nickname: string;
  totalStudyMinutes: number;
  weeklyStudyMinutes: number; // 일주일 학습 시간 (분)
  weeklyStudySeconds: number; // 일주일 학습 시간 (초)
  profileImageUrl?: string | null;
}

export function FriendsPage() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<FriendWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  // const [friendUserId, setFriendUserId] = useState('');
  // const [adding, setAdding] = useState(false); // 검색 UI로 대체되어 미사용
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: number; userId: string; nickname: string }>>([]);
  const [sendingId, setSendingId] = useState<number | null>(null);
  // 친구 프로필 뷰
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // 요청 목록 다이얼로그
  const [showRequestsDialog, setShowRequestsDialog] = useState(false);
  const [requestTab, setRequestTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [incoming, setIncoming] = useState<Array<{ id: string; fromUserId: string }>>([]);
  const [outgoing, setOutgoing] = useState<Array<{ id: string; toUserId: string }>>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [actingRequestId, setActingRequestId] = useState<string | null>(null);
  const meId = (() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return null;
      const obj = JSON.parse(raw);
      return obj?.id ? Number(obj.id) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    loadFriends();
  }, []);

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
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return formatLocalYYYYMMDD(monday);
  }

  // 친구의 일주일 세션 데이터 가져와서 시간 계산 (초 단위 반환) - 주간 리포트와 동일한 방식
  const loadFriendWeeklySessions = async (friendUserId: string): Promise<number> => {
    try {
      // 이번 주 월요일부터 오늘까지 각 날짜별로 세션 조회 (주간 리포트와 동일한 방식)
      const today = new Date();
      const todayStr = formatLocalYYYYMMDD(today);
      const weekStartStr = getMonday(today);
      const monday = new Date(weekStartStr);
      monday.setHours(0, 0, 0, 0);
      
      const sessionPromises: Promise<Session[]>[] = [];
      const currentDate = new Date(monday);
      currentDate.setHours(0, 0, 0, 0);
      
      // 월요일부터 오늘까지 각 날짜별로 세션 조회
      while (true) {
        const dateStr = formatLocalYYYYMMDD(currentDate);
        sessionPromises.push(
          (api as any).getFriendSessions?.(friendUserId, dateStr).catch((err: any) => {
            console.error(`Failed to load sessions for ${friendUserId} on ${dateStr}:`, err);
            return [] as Session[];
          })
        );
        
        if (dateStr === todayStr) {
          break;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      const sessionArrays = await Promise.all(sessionPromises);
      const allSessions = sessionArrays.flat();
      console.log(`Total sessions loaded for friend ${friendUserId}:`, allSessions.length, allSessions);
      
      // 완료된 세션만 필터링 (주간 리포트와 동일)
      const completedSessions = allSessions.filter(
        (session: Session) => session.status === 'completed' || (session as any).status === 'stopped'
      );
      console.log(`Completed sessions for friend ${friendUserId}:`, completedSessions.length, completedSessions);
      
      // 초 단위로 합산 (주간 리포트와 동일한 방식)
      const totalSeconds = completedSessions.reduce((sum: number, session: Session) => {
        let durationSec = 0;
        // endTime이 있으면 endTime - startTime을 사용 (가장 정확)
        if (session.endTime) {
          const start = new Date(session.startTime).getTime();
          const end = new Date(session.endTime).getTime();
          durationSec = Math.floor((end - start) / 1000);
        } else if (session.duration_sec !== undefined) {
          // duration_sec이 있으면 직접 사용
          durationSec = session.duration_sec;
        } else {
          // duration은 분 단위이므로 초로 변환
          durationSec = (session.duration || 0) * 60;
        }
        console.log(`Session ${session.id}: durationSec=${durationSec}, endTime=${session.endTime}, duration=${session.duration}, duration_sec=${session.duration_sec}`);
        return sum + durationSec;
      }, 0);
      
      console.log(`Total seconds for friend ${friendUserId}:`, totalSeconds, `from ${completedSessions.length} sessions`);
      return totalSeconds;
    } catch (error) {
      console.error(`Failed to load sessions for friend ${friendUserId}:`, error);
      return 0;
    }
  };

  const loadFriends = async () => {
    try {
      const data = await (api as any).getFriends();
      
      // 각 친구의 일주일 학습 시간 계산
      const friendsWithStats = await Promise.all(
        data.map(async (friend: any) => {
          const weeklySeconds = await loadFriendWeeklySessions(friend.userId);
          return {
            ...friend,
            weeklyStudySeconds: weeklySeconds,
            weeklyStudyMinutes: Math.floor(weeklySeconds / 60), // 하위 호환성 유지
          } as FriendWithStats;
        })
      );
      
      // 일주일 학습 시간(초) 기준으로 내림차순 정렬
      friendsWithStats.sort((a, b) => b.weeklyStudySeconds - a.weeklyStudySeconds);
      
      setFriends(friendsWithStats);
    } catch (error) {
      toast.error('친구 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 입력 추가 버튼 로직은 검색 UI로 대체됨

  const handleSearchUsers = async () => {
    const keyword = searchQuery.trim();
    if (!keyword) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await (api as any).searchUsers?.(keyword);
      if (Array.isArray(results)) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (e) {
      toast.error('사용자 검색에 실패했습니다');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequestTo = async (targetId: number) => {
    setSendingId(targetId);
    try {
      if (meId && Number(meId) === Number(targetId)) {
        toast.error('자기 자신에게는 친구 요청을 보낼 수 없습니다');
        return;
      }
      // 중복 방지: 이미 나↔상대 사이에 pending 존재하면 미리 차단
      try {
        const [incomingNow, outgoingNow] = await Promise.all([
          (api as any).getIncomingFriendRequests?.().catch(() => []),
          (api as any).getOutgoingFriendRequests?.().catch(() => []),
        ]);
        const dupIncoming = Array.isArray(incomingNow)
          ? incomingNow.some((r: any) => String(r.fromUserId) === String(targetId))
          : false;
        const dupOutgoing = Array.isArray(outgoingNow)
          ? outgoingNow.some((r: any) => String(r.toUserId) === String(targetId))
          : false;
        if (dupIncoming || dupOutgoing) {
          toast.error('이미 대기 중인 친구 요청이 있습니다');
          return;
        }
      } catch {
        // 무시하고 진행
      }
      await (api as any).sendFriendRequest(targetId);
      toast.success('친구 요청을 보냈습니다!');
      // 요청 보낸 대상은 버튼 비활성화 처리
      setSearchResults(prev => prev.map(u => u.id === targetId ? u : u));
    } catch {
      toast.error('친구 요청에 실패했습니다. 이미 보낸 요청이 있거나, 잠시 후 다시 시도해주세요.');
    } finally {
      setSendingId(null);
    }
  };

  const formatTime = (totalSeconds: number) => {
    if (!totalSeconds || totalSeconds === 0) {
      return '0초';
    }
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}시간`);
    if (mins > 0) parts.push(`${mins}분`);
    if (secs > 0) parts.push(`${secs}초`);
    
    return parts.length > 0 ? parts.join(' ') : '0초';
  };

  const openRequestsDialog = async (tab: 'incoming' | 'outgoing') => {
    setRequestTab(tab);
    setShowRequestsDialog(true);
    await loadRequests(tab);
  };

  const loadRequests = async (tab: 'incoming' | 'outgoing') => {
    setLoadingRequests(true);
    try {
      if (tab === 'incoming') {
        const list = await (api as any).getIncomingFriendRequests?.();
        setIncoming(Array.isArray(list) ? list : []);
      } else {
        const list = await (api as any).getOutgoingFriendRequests?.();
        setOutgoing(Array.isArray(list) ? list : []);
      }
    } catch {
      toast.error('요청 목록을 불러오는데 실패했습니다');
      if (tab === 'incoming') setIncoming([]); else setOutgoing([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const respondRequest = async (requestId: string, action: 'accept' | 'reject' | 'cancel') => {
    setActingRequestId(requestId);
    try {
      await (api as any).respondFriendRequest?.(requestId, action);
      if (requestTab === 'incoming') {
        setIncoming(prev => prev.filter(r => r.id !== requestId));
      } else {
        setOutgoing(prev => prev.filter(r => r.id !== requestId));
      }
      // 수락 시 내 친구 목록 갱신
      if (action === 'accept') {
        // 최신 목록 로드
        await loadFriends();
      }
      toast.success(action === 'accept' ? '요청을 수락했습니다' : action === 'reject' ? '요청을 거절했습니다' : '요청을 취소했습니다');
    } catch {
      toast.error('처리에 실패했습니다');
    } finally {
      setActingRequestId(null);
    }
  };

  // 상위 3명 (랭킹)
  const topThree = friends.slice(0, 3);
  // 나머지 친구들 (현재 사용하지 않음)
  // const otherFriends = friends.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-[#6a7282]">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-6 sm:pb-8">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-[57px] sm:top-[73px] z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#9810fa] to-[#2b7fff] flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-[18px] sm:text-[20px] text-neutral-950">친구 목록</h1>
                <p className="text-[12px] sm:text-[14px] text-[#6a7282]">
                  총 {friends.length}명의 친구
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Button
                onClick={() => openRequestsDialog('incoming')}
                variant="outline"
                className="text-[#9810fa] border-[#9810fa] text-[11px] sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                받은 요청
              </Button>
              <Button
                onClick={() => openRequestsDialog('outgoing')}
                variant="outline"
                className="text-[#9810fa] border-[#9810fa] text-[11px] sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                보낸 요청
              </Button>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-[#9810fa] hover:bg-[#8610da] text-white text-[11px] sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">친구 추가</span>
                <span className="sm:hidden">추가</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
        {/* 상위 3명 랭킹 */}
        {topThree.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              <h2 className="text-[16px] sm:text-[18px] text-neutral-950">주간 TOP 3</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {topThree.map((friend) => {
                return (
                  <div
                    key={friend.id}
                    className="bg-white rounded-[16px] border-2 border-[rgba(0,0,0,0.1)] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* 프로필 이미지 */}
                      <UserAvatar
                        src={friend.profileImageUrl || undefined}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-2 sm:mb-3 shadow-lg"
                        iconClassName="w-5 h-5 sm:w-6 sm:h-6"
                      />

                      {/* 닉네임 */}
                      <h3 className="text-[14px] sm:text-[16px] text-neutral-950 mb-1">
                        {friend.nickname}
                      </h3>

                      {/* 아이디 */}
                      <p className="text-[11px] sm:text-[12px] text-[#6a7282] mb-2 sm:mb-3">
                        @{friend.userId}
                      </p>

                      {/* 학습 시간 */}
                      <div className="w-full bg-purple-50 rounded-[8px] p-2 sm:p-3">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#9810fa]" />
                          <span className="text-[12px] sm:text-[14px] text-neutral-950">
                            {formatTime(friend.weeklyStudySeconds)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 전체 친구 목록 */}
        <div>
          <h2 className="text-[16px] sm:text-[18px] text-neutral-950 mb-3 sm:mb-4">전체 친구</h2>
          
          {friends.length === 0 ? (
            <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-[16px] text-[#6a7282] mb-4">
                아직 친구가 없습니다
              </p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-[#9810fa] hover:bg-[#8610da] text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                첫 친구 추가하기
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] overflow-hidden">
              {friends.map((friend, index) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => {
                      // 친구 프로필 페이지로 이동
                      navigate(`/friends/${friend.userId}/profile`);
                    }}
                  >
                    {/* 순위 */}
                    <div className="w-8 text-center">
                      <span className="text-[16px] text-[#6a7282]">
                        {index + 1}
                      </span>
                    </div>

                    {/* 프로필 이미지 */}
                    <UserAvatar
                      src={friend.profileImageUrl || undefined}
                      className="w-12 h-12 rounded-full overflow-hidden"
                      iconClassName="w-4 h-4"
                    />

                    {/* 정보 */}
                    <div>
                      <h3 className="text-[16px] text-neutral-950">
                        {friend.nickname}
                      </h3>
                      <p className="text-[13px] text-[#6a7282]">
                        @{friend.userId}
                      </p>
                    </div>
                  </div>

                  {/* 학습 시간 */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-purple-50 rounded-[8px] px-4 py-2">
                      <Clock className="w-4 h-4 text-[#9810fa]" />
                      <span className="text-[14px] text-neutral-950">
                        {formatTime(friend.weeklyStudySeconds)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-300"
                      onClick={async () => {
                        if (deletingId) return;
                        setDeletingId(friend.userId);
                        try {
                          await (api as any).deleteFriend?.(friend.userId);
                          toast.success('친구를 삭제했습니다');
                          await loadFriends();
                        } catch {
                          toast.error('친구 삭제에 실패했습니다');
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                      disabled={deletingId === friend.userId}
                    >
                      {deletingId === friend.userId ? '삭제 중...' : '삭제'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 친구 추가 Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-[440px]">
          <DialogHeader>
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9810fa] to-[#2b7fff] flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-center">친구 추가</DialogTitle>
              <DialogDescription className="text-center mt-2">
                아이디 또는 닉네임으로 검색 후 친구 요청을 보내세요
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 검색 입력 */}
            <div>
              <label className="block text-[14px] text-neutral-950 mb-2">
                검색어 (아이디/닉네임)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="예: user123"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchUsers();
                  }}
                  className="flex-1 bg-[#f3f3f5] rounded-[8px] h-[44px] px-4 text-[16px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
                />
                <Button onClick={handleSearchUsers} disabled={searching} className="h-[44px]">
                  {searching ? '검색 중...' : '검색'}
                </Button>
              </div>
            </div>

            {/* 검색 결과 목록 */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] max-h-[260px] overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-[14px] text-[#6a7282]">
                  검색 결과가 없습니다
                </div>
              ) : (
                <div className="divide-y">
                  {searchResults.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-3">
                      <div>
                        <p className="text-[14px] text-neutral-950">{u.nickname || u.userId}</p>
                        <p className="text-[12px] text-[#6a7282]">@{u.userId} · ID {u.id}</p>
                      </div>
                      <Button
                        onClick={() => handleSendRequestTo(u.id)}
                        disabled={sendingId === u.id}
                        className="bg-[#9810fa] hover:bg-[#8610da] text-white"
                      >
                        {sendingId === u.id ? '요청 중...' : '추가'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 안내 */}
            <div className="bg-purple-50 rounded-[10px] border border-purple-200 p-4">
              <p className="text-[13px] text-[#6a7282]">
                💡 검색 결과에서 친구를 선택해 요청을 보내세요.
              </p>
            </div>

            {/* 닫기 */}
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowAddDialog(false)} variant="outline" className="flex-1">
                닫기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 받은/보낸 요청 Dialog */}
      <Dialog open={showRequestsDialog} onOpenChange={setShowRequestsDialog}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{requestTab === 'incoming' ? '받은 친구 요청' : '보낸 친구 요청'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={requestTab === 'incoming' ? 'default' : 'outline'}
                className={requestTab === 'incoming' ? 'bg-[#9810fa] hover:bg-[#8610da] text-white' : ''}
                onClick={() => { setRequestTab('incoming'); loadRequests('incoming'); }}
              >
                받은 요청
              </Button>
              <Button
                variant={requestTab === 'outgoing' ? 'default' : 'outline'}
                className={requestTab === 'outgoing' ? 'bg-[#9810fa] hover:bg-[#8610da] text-white' : ''}
                onClick={() => { setRequestTab('outgoing'); loadRequests('outgoing'); }}
              >
                보낸 요청
              </Button>
            </div>
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] max-h-[360px] overflow-y-auto">
              {loadingRequests ? (
                <div className="p-6 text-center text-[14px] text-[#6a7282]">불러오는 중...</div>
              ) : (
                <div className="divide-y">
                  {(requestTab === 'incoming' ? incoming : outgoing).length === 0 ? (
                    <div className="p-6 text-center text-[14px] text-[#6a7282]">목록이 없습니다</div>
                  ) : (
                    (requestTab === 'incoming' ? incoming : outgoing).map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-3">
                        <div className="text-[14px] text-neutral-950">
                          {requestTab === 'incoming' ? `보낸 사람 ID: ${(r as any).fromUserId}` : `받는 사람 ID: ${(r as any).toUserId}`}
                        </div>
                        <div className="flex gap-2">
                          {requestTab === 'incoming' ? (
                            <>
                              <Button
                                onClick={() => respondRequest(r.id, 'accept')}
                                disabled={actingRequestId === r.id}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                {actingRequestId === r.id ? '처리 중...' : '수락'}
                              </Button>
                              <Button
                                onClick={() => respondRequest(r.id, 'reject')}
                                disabled={actingRequestId === r.id}
                                variant="outline"
                              >
                                거절
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => respondRequest(r.id, 'cancel')}
                              disabled={actingRequestId === r.id}
                              variant="outline"
                            >
                              취소
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
