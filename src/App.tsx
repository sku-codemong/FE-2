import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { MainPage } from './pages/MainPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import { SubjectCreatePage } from './pages/SubjectCreatePage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { SubjectEditPage } from './pages/SubjectEditPage';
import { DailyReportPage } from './pages/DailyReportPage';
import { WeeklyReportPage } from './pages/WeeklyReportPage';
import { FriendsPage } from './pages/FriendsPage';
import FriendProfileViewPage from './pages/FriendProfileViewPage';
import { SignupPage } from './pages/SignupPage';
import { api, clearAuthTokens, type User } from './services/api';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // 토큰이 있는지 먼저 확인
        const { getStoredAccessToken, getStoredRefreshToken } = await import('./services/api');
        const hasAccessToken = !!getStoredAccessToken();
        const hasRefreshToken = !!getStoredRefreshToken();
        
        // 토큰이 전혀 없으면 조용히 정리하고 로그인 페이지로
        if (!hasAccessToken && !hasRefreshToken) {
          clearAuthTokens();
          localStorage.removeItem('user');
          setUser(null);
          setLoading(false);
          return;
        }

        const profile = await api.getMe();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch (error: any) {
        // 인증 관련 에러는 조용히 처리 (토큰 없음, 만료 등)
        const errorMsg = error?.message || '';
        const isAuthError = 
          errorMsg.includes('Missing access token') ||
          errorMsg.includes('access token') ||
          errorMsg.includes('Unauthorized') ||
          errorMsg.includes('401') ||
          errorMsg.includes('토큰');
        
        if (isAuthError) {
          // 인증 에러는 조용히 정리만 하고 로그인 페이지로
          clearAuthTokens();
          localStorage.removeItem('user');
          setUser(null);
        } else {
          // 다른 에러는 콘솔에만 로그
          console.error('[App] Error initializing user:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // 401이 발생하기 전에 미리 refresh를 호출해 서버를 웜업
  useEffect(() => {
    if (!user) return;

    const warmUpRefresh = async () => {
      try {
        await api.refreshToken({ silent: true });
      } catch (error) {
        if (import.meta.env?.DEV) {
          console.debug('Refresh warm-up skipped:', error);
        }
      }
    };

    // 로그인 직후/앱 진입 직후 한 번만 호출
    warmUpRefresh();
  }, [user?.id]);

  const handleLogin = async (userData: User) => {
    // 로그인 후 최신 사용자 정보를 가져와서 profileImageUrl 등 최신 정보 반영
    try {
      const latestUser = await api.getMe();
      setUser(latestUser);
      localStorage.setItem('user', JSON.stringify(latestUser));
    } catch (error) {
      // getMe 실패 시 로그인 응답 데이터 사용
      console.warn('Failed to fetch latest user info, using login response:', error);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      // 로그아웃 API 실패해도 클라이언트에서는 정리
      console.error('Logout error:', error);
    }
    clearAuthTokens();
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar user={user} onLogout={handleLogout} />}

      <Routes>
        {/* 로그인 페이지 */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />}
        />

        {/* 메인 페이지 */}
        <Route
          path="/"
          element={user ? <MainPage userId={user.id} /> : <Navigate to="/login" replace />}
        />

        {/* 프로필 페이지 */}
        <Route
          path="/profile/:userId"
          element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile/edit/:userId"
          element={user ? <ProfileEditPage onProfileUpdate={handleLogin} /> : <Navigate to="/login" replace />}
        />

        {/* 과목 관련 페이지 */}
        <Route
          path="/subject/create/:userId"
          element={user ? <SubjectCreatePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/subject/:userId/:subjectId"
          element={user ? <SubjectDetailPage /> : <Navigate to="/login" replace />}
        />
        <Route
  path="/signup"
  element={user ? <Navigate to="/" replace /> : <SignupPage onLogin={handleLogin} />}
/>
        <Route
          path="/subject/:userId/:subjectId/edit"
          element={user ? <SubjectEditPage /> : <Navigate to="/login" replace />}
        />

        {/* 보고서 페이지 */}
        <Route
          path="/reports/daily/:userId"
          element={user ? <DailyReportPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/reports/weekly/:userId"
          element={user ? <WeeklyReportPage /> : <Navigate to="/login" replace />}
        />

        {/* 친구 페이지 */}
        <Route
          path="/friends/:userId"
          element={user ? <FriendsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/friends/:friendUserId/profile"
          element={user ? <FriendProfileViewPage /> : <Navigate to="/login" replace />}
        />

        {/* 잘못된 경로는 로그인 페이지로 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

    </div>
  );
}

export default App;
