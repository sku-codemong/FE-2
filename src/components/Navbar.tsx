import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { User as UserIcon, LogOut, BarChart3, Bell, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import { api, type User, initRealtime, onFriendEvent } from '../services/api';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner';

interface NavbarProps {
  user?: User | null;
  onLogout?: () => Promise<void> | void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState<boolean>(false);
  
  // 디버깅: user 객체와 profileImageUrl 확인
  useEffect(() => {
    if (user) {
      console.log('[Navbar] User object:', user);
      console.log('[Navbar] profileImageUrl:', user.profileImageUrl);
      // user가 변경되면 이미지 에러 상태 초기화
      setImageError(false);
    }
  }, [user]);
  
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'friend_request' | 'achievement' | 'reminder' | 'system' | 'other';
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
  }>>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // 로컬 스토리지에서 읽은 알림 ID 목록 불러오기
  const getReadNotificationIds = (): Set<string> => {
    try {
      const stored = localStorage.getItem(`readNotifications_${user?.id}`);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {
      // 무시
    }
    return new Set<string>();
  };

  // 로컬 스토리지에 읽은 알림 ID 저장
  const saveReadNotificationIds = (ids: Set<string>) => {
    try {
      localStorage.setItem(`readNotifications_${user?.id}`, JSON.stringify(Array.from(ids)));
    } catch {
      // 무시
    }
  };

  useEffect(() => {
    if (!user) return;
    // 소켓 연결(있으면)
    initRealtime?.();
    const unsubscribe = onFriendEvent?.((event) => {
      const readIds = getReadNotificationIds();
      
      if (event.type === 'friend:request:received') {
        if (!user?.id) return;
        const toUserId = (event as any).toUserId;
        if (toUserId && String(user.id) !== String(toUserId)) return;
        const notificationId = `sock_${event.requestId}`;
        const requesterName = event.fromUserNickname || event.fromUserId;
        setNotifications(prev => [
          {
            id: notificationId,
            type: 'friend_request',
            title: '친구 요청이 도착했어요',
            message: `${requesterName} 님이 친구 요청을 보냈습니다.`,
            createdAt: new Date().toISOString(),
            read: readIds.has(notificationId), // 로컬 스토리지에서 읽음 상태 확인
          },
          ...prev,
        ]);
        toast.info(`${requesterName} 님이 친구 요청을 보냈습니다`);
      } else if (event.type === 'friend:request:responded') {
        console.log('[Navbar] friend:request:responded event handler called', { user: user?.id, event });
        if (!user?.id) return;
        
        const responderId = event.friendUserId; // 수락/거절한 사람 (요청 받은 사람)
        const toUserId = event.toUserId; // 요청 받은 사람 ID
        const fromUserId = event.fromUserId; // 요청 보낸 사람 ID
        const fromUserNickname = event.fromUserNickname || '알 수 없음'; // 요청 보낸 사람 닉네임
        
        console.log('[Navbar] friend:request:responded event received:', {
          currentUserId: user.id,
          fromUserId,
          toUserId,
          responderId,
          fromUserNickname,
          result: event.result,
        });
        
        // 현재 사용자 ID를 문자열로 변환
        const currentUserIdStr = String(user.id);
        const fromUserIdStr = fromUserId ? String(fromUserId) : '';
        const toUserIdStr = toUserId ? String(toUserId) : '';
        
        console.log('[Navbar] Checking notification recipients:', {
          currentUserId: currentUserIdStr,
          fromUserId: fromUserIdStr,
          toUserId: toUserIdStr,
          fromUserIdMatch: fromUserIdStr && currentUserIdStr === fromUserIdStr,
          toUserIdMatch: toUserIdStr && currentUserIdStr === toUserIdStr,
        });
        
        // 요청 받은 사람(수락/거절한 사람)에게 알림
        // 주의: 수락한 사람의 WebSocket에는 이벤트가 오지 않으므로 이 조건은 실행되지 않을 수 있음
        if ((!event.toUserId || toUserIdStr === '') || (toUserIdStr && currentUserIdStr === toUserIdStr)) {
          console.log('[Navbar] Sending notification to request receiver (toUserId)');
          const notificationId = `sock_responded_${event.requestId}`;
          const message = event.result === 'accepted'
            ? `${fromUserNickname || '상대방'}님과 친구가 되었습니다!`
            : '친구 요청을 거절하였습니다.';
          
          setNotifications(prev => [
            {
              id: notificationId,
              type: 'system',
              title: event.result === 'accepted' ? '친구 추가 완료' : '친구 요청 거절',
              message: message,
              createdAt: new Date().toISOString(),
              read: readIds.has(notificationId),
            },
            ...prev,
          ]);
          
          toast.info(message);
          return;
        }
        
        // 요청 보낸 사람에게 결과 알림
        // fromUserId가 현재 사용자와 같으면 (요청을 보낸 사람) 알림 표시
        if ((!event.fromUserId || fromUserIdStr === '') || (fromUserIdStr && currentUserIdStr === fromUserIdStr)) {
          console.log('[Navbar] Sending notification to request sender (fromUserId)');
          const notificationId = `sock_${event.requestId}`;
          const message = event.result === 'accepted'
            ? '친구 요청이 수락되었습니다.'
            : '친구 요청이 거절되었습니다.';
          
          setNotifications(prev => [
            {
              id: notificationId,
              type: 'system',
              title: '친구 요청 처리 결과',
              message: message,
              createdAt: new Date().toISOString(),
              read: readIds.has(notificationId),
            },
            ...prev,
          ]);
          
          toast.info(message);
        } else if (!fromUserIdStr) {
          console.log('[Navbar] fromUserId is empty or undefined - cannot send notification to sender');
        } else {
          console.log('[Navbar] Not sending notification - fromUserId mismatch:', {
            fromUserId: fromUserIdStr,
            currentUserId: currentUserIdStr,
            match: currentUserIdStr === fromUserIdStr,
          });
        }
      }
    });
    return () => {
      unsubscribe?.();
    };
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications?.();
      if (Array.isArray(data)) {
        // 로컬 스토리지에서 읽은 알림 ID 목록 불러오기
        const readIds = getReadNotificationIds();
        // 서버 데이터와 로컬 스토리지의 읽음 상태를 병합
        const merged = data.map(n => ({
          ...n,
          read: n.read || readIds.has(n.id), // 서버에서 읽음이거나 로컬 스토리지에 있으면 읽음
        }));
        setNotifications(merged);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      // 알림 불러오기 실패는 조용히 무시
      console.error('Failed to load notifications:', error);
    }
  };

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notification: any) => {
    // 알림을 읽음으로 표시
    if (!notification.read) {
      // 서버에 읽음 상태 저장
      try {
        await api.markNotificationAsRead?.(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
      
      // 로컬 스토리지에 읽은 알림 ID 저장
      const readIds = getReadNotificationIds();
      readIds.add(notification.id);
      saveReadNotificationIds(readIds);
      
      // 로컬 state 업데이트
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    }
    
    // 친구 요청 관련 알림인 경우 친구 목록 페이지로 이동
    if (notification.type === 'friend_request' || 
        (notification.type === 'system' && 
         (notification.message?.includes('수락') || notification.message?.includes('거절')))) {
      // 알림창 닫기
      setNotificationOpen(false);
      // 페이지 이동
      if (user?.id) {
        navigate(`/friends/${user.id}`);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    // 서버에 모든 알림 읽음 상태 저장
    try {
      await api.markAllNotificationsAsRead?.();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
    
    // 로컬 스토리지에 모든 알림 ID 저장
    const readIds = new Set(notifications.map(n => n.id));
    saveReadNotificationIds(readIds);
    
    // 로컬 state 업데이트
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('모든 알림을 읽음으로 표시했습니다');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return '👥';
      case 'achievement':
        return '🎉';
      case 'reminder':
        return '⏰';
      case 'system':
        return '📢';
      default:
        return '📬';
    }
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <span className="text-purple-600">Study Timer</span>
        </Link>
        
        {user && (
          <div className="flex items-center gap-2">
            <Link to={`/friends/${user.id}`}>
              <Button variant="ghost" size="sm">
                <Users className="w-4 h-4" />
              </Button>
            </Link>

            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="relative inline-flex items-center justify-center h-9 rounded-md px-3 hover:bg-gray-100 transition-colors"
                  aria-label="알림 열기"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] leading-5 text-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[380px] p-0 bg-white border border-gray-200 shadow-xl rounded-lg" align="end" sideOffset={8}>
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] text-neutral-950">알림</h3>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-[12px] h-auto p-1">
                        모두 읽음
                      </Button>
                    )}
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-[14px] text-[#6a7282]">
                      알림이 없습니다
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0 ${!notification.read ? 'bg-purple-50/50' : ''}`}
                      >
                        <div className="flex gap-3">
                          <span className="text-[20px]">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-[14px] text-neutral-950">{notification.title}</p>
                              {!notification.read && <div className="w-2 h-2 rounded-full bg-purple-600" />}
                            </div>
                            <p className="text-[13px] text-[#6a7282] line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-[11px] text-[#9ca3af] mt-1">
                              {new Date(notification.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Link to={`/profile/${user.id}`}>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user.profileImageUrl && user.profileImageUrl.trim() !== '' && !imageError ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        console.log('[Navbar] Profile image loaded successfully:', user.profileImageUrl);
                        setImageError(false);
                      }}
                      onError={(e) => {
                        // 이미지 로드 실패 시 기본 이미지로 대체
                        console.error('[Navbar] Profile image load failed:', user.profileImageUrl);
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <span className="text-xs text-gray-500">
                      {(user.nickname || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {user.nickname || user.name || user.email}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
