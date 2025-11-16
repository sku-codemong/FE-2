import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
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

export function FriendsPage() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Array<{ id: string; userId: string; nickname: string; totalStudyMinutes: number }>>([]);
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

  const loadFriends = async () => {
    try {
      const data = await (api as any).getFriends();
      setFriends(data);
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

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-8">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-[73px] z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9810fa] to-[#2b7fff] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-[20px] text-neutral-950">친구 목록</h1>
                <p className="text-[14px] text-[#6a7282]">
                  총 {friends.length}명의 친구
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => openRequestsDialog('incoming')}
                variant="outline"
                className="text-[#9810fa] border-[#9810fa]"
              >
                받은 요청
              </Button>
              <Button
                onClick={() => openRequestsDialog('outgoing')}
                variant="outline"
                className="text-[#9810fa] border-[#9810fa]"
              >
                보낸 요청
              </Button>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-[#9810fa] hover:bg-[#8610da] text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                친구 추가
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6">
        {/* 상위 3명 랭킹 */}
        {topThree.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-[18px] text-neutral-950">주간 TOP 3</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {topThree.map((friend, index) => {
                const rankColors = [
                  'from-amber-400 to-yellow-500',
                  'from-gray-300 to-slate-400',
                  'from-orange-300 to-amber-500'
                ];
                const rankIcons = ['🥇', '🥈', '🥉'];

                return (
                  <div
                    key={friend.id}
                    className="bg-white rounded-[16px] border-2 border-[rgba(0,0,0,0.1)] p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* 순위 배지 */}
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${rankColors[index]} flex items-center justify-center mb-3 shadow-lg`}
                      >
                        <span className="text-[32px]">{rankIcons[index]}</span>
                      </div>

                      {/* 닉네임 */}
                      <h3 className="text-[16px] text-neutral-950 mb-1">
                        {friend.nickname}
                      </h3>

                      {/* 아이디 */}
                      <p className="text-[12px] text-[#6a7282] mb-3">
                        @{friend.userId}
                      </p>

                      {/* 학습 시간 */}
                      <div className="w-full bg-purple-50 rounded-[8px] p-3">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 text-[#9810fa]" />
                          <span className="text-[14px] text-neutral-950">
                            {formatTime(friend.totalStudyMinutes)}
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
          <h2 className="text-[18px] text-neutral-950 mb-4">전체 친구</h2>
          
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
                      // 기존 프로필 페이지로 이동
                      navigate(`/profile/${friend.userId}`);
                    }}
                  >
                    {/* 순위 */}
                    <div className="w-8 text-center">
                      <span className="text-[16px] text-[#6a7282]">
                        {index + 1}
                      </span>
                    </div>

                    {/* 프로필 아이콘 */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white">
                      <span className="text-[16px]">
                        {friend.nickname.charAt(0)}
                      </span>
                    </div>

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
                        {formatTime(friend.totalStudyMinutes)}
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
