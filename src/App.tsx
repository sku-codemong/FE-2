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
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        console.log('[App] Initializing user...');
        const profile = await api.getMe();
        console.log('[App] Initial user profile:', profile);
        console.log('[App] profileImageUrl:', profile.profileImageUrl);
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
        setInitError(null); // 성공 시 에러 초기화
      } catch (error: any) {
        console.error('[App] Error initializing user:', error);
        console.error('[App] Error details:', {
          message: error?.message,
          stack: error?.stack,
          name: error?.name,
        });
        const errorMsg = error?.message || '알 수 없는 오류';
        setInitError(`사용자 정보 로드 실패: ${errorMsg}`);
        clearAuthTokens();
        localStorage.removeItem('user');
        setUser(null);
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

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
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
      {/* 초기화 에러 표시 (모바일 디버깅용) */}
      {initError && (
        <div className="bg-red-50 border-b border-red-200 p-3 sm:p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-2">
              <span className="text-red-600 text-lg">⚠️</span>
              <div className="flex-1">
                <p className="text-red-800 text-sm font-medium mb-1">초기화 오류</p>
                <p className="text-red-700 text-xs break-words">{initError}</p>
                <p className="text-red-600 text-xs mt-2">
                  API URL: {(typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '(설정되지 않음)'}
                </p>
                <button
                  onClick={() => {
                    setInitError(null);
                    window.location.reload();
                  }}
                  className="mt-2 text-xs text-red-600 underline hover:text-red-800"
                >
                  페이지 새로고침
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
