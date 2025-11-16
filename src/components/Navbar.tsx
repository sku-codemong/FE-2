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
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'friend_request' | 'achievement' | 'reminder' | 'system' | 'other';
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
  }>>([]);

  useEffect(() => {
    if (!user) return;
    // 초기 배지 동기화: 받은 친구 요청 목록을 읽어와 미읽음으로 표시
    (async () => {
      try {
        const incoming = await (api as any).getIncomingFriendRequests?.();
        if (Array.isArray(incoming)) {
          const initial = incoming.map((r: any) => ({
            id: `incoming_${r.id}`,
            type: 'friend_request' as const,
            title: '친구 요청이 도착했어요',
            message: `보낸 사람 ID: ${r.fromUserId ?? ''}`,
            createdAt: new Date().toISOString(),
            read: false,
          }));
          setNotifications((prev) => {
            // 중복 방지
            const prevIds = new Set(prev.map((n) => n.id));
            const merged = [...prev, ...initial.filter((n) => !prevIds.has(n.id))];
            return merged;
          });
        }
      } catch {
        // 무시
      }
    })();
    // 소켓 연결(있으면)
    initRealtime?.();
    const unsubscribe = onFriendEvent?.((event) => {
      if (event.type === 'friend:request:received') {
        // 자신에게 온 요청만 표시
        if (!user?.id || String(user.id) !== String((event as any).toUserId)) return;
        setNotifications(prev => [
          {
            id: `sock_${event.requestId}`,
            type: 'friend_request',
            title: '친구 요청이 도착했어요',
            message: `${event.fromUserId} 님이 친구 요청을 보냈습니다.`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev,
        ]);
        toast.info('새 친구 요청이 도착했습니다');
      } else if (event.type === 'friend:request:responded') {
        // 내 요청에 대한 처리 결과만 표시
        if (!user?.id || String(user.id) !== String(event.toUserId)) return;
        setNotifications(prev => [
          {
            id: `sock_${event.requestId}`,
            type: 'system',
            title: '친구 요청 처리 결과',
            message: `요청이 ${event.result === 'accepted' ? '수락' : '거절'}되었습니다.`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev,
        ]);
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
        setNotifications(data);
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
    if (!notification.read) {
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    }
  };

  const handleMarkAllAsRead = async () => {
    // 서버 호출 없이 로컬 상태만 업데이트
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

            <Popover>
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
              <Button variant="ghost" size="sm">
                <UserIcon className="w-4 h-4 mr-2" />
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
