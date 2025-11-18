import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { api, User } from '../services/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState({
    nickname: '',
    grade: 1,
    gender: 'male' as 'male' | 'female'
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    
    try {
      const user = await api.login(email, password);
      
      // api.login이 성공하면 토큰도 저장된 상태 (realLoginImpl에서 확인함)

      // 백엔드에서 is_completed가 false로 넘어오면 프로필 설정 다이얼로그 표시
      // isCompleted가 false이거나 undefined이거나, 필수 정보가 없으면 프로필 설정 필요
      console.log('Login user data:', user);
      console.log('isCompleted:', user.isCompleted);
      
      const needsProfileSetup = 
        user.isCompleted === false || 
        user.isCompleted === undefined ||
        !user.nickname || 
        user.grade === null || 
        user.grade === undefined || 
        !user.gender;

      console.log('needsProfileSetup:', needsProfileSetup);

      if (needsProfileSetup) {
        // 프로필 설정이 필요한 경우, onLogin을 호출하지 않고 Dialog만 표시
        // onLogin을 호출하면 App.tsx에서 자동으로 메인 페이지로 리다이렉트됨
        setLoggedInUser(user); // 로그인한 사용자 정보 저장
        setShowProfileSetup(true);
        toast.success('로그인 성공! 프로필을 설정해주세요');
      } else {
        // 프로필 설정이 완료된 경우에만 onLogin 호출
        onLogin(user);
        toast.success('로그인 성공!');
        navigate('/');
      }
    } catch (error) {
      toast.error('로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSetup = async () => {
    if (!profileData.nickname.trim()) {
      toast.error('닉네임을 입력해주세요');
      return;
    }

    setSavingProfile(true);
    try {
      // 프로필 업데이트 (처음 프로필 설정이므로 is_completed를 true로 설정)
      await api.updateProfile({
        nickname: profileData.nickname,
        grade: profileData.grade,
        gender: profileData.gender,
        isCompleted: true
      });

      // 프로필 업데이트 후 최신 사용자 정보 다시 조회 (is_completed가 true로 업데이트되었는지 확인)
      const updatedUser = await api.getMe();

      console.log('Updated user after profile setup:', updatedUser);
      console.log('isCompleted after update:', updatedUser.isCompleted);

      // 프로필 설정 완료 후 onLogin 호출하여 App.tsx에 사용자 정보 전달
      onLogin(updatedUser);
      toast.success('프로필이 설정되었습니다!');
      setShowProfileSetup(false);
      // 프로필 설정 완료 후 메인 페이지로 이동
      navigate('/');
    } catch (error) {
      toast.error('프로필 설정에 실패했습니다');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSkipProfile = () => {
    setShowProfileSetup(false);
    // 나중에 하기를 누르면 로그인한 사용자 정보로 onLogin 호출
    if (loggedInUser) {
      onLogin(loggedInUser);
    }
    // 나중에 하기를 누르면 메인 페이지로 이동
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-[#9810fa] rounded-full p-3">
            <BarChart3 className="size-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-center text-neutral-950 mb-2">Study Timer</h1>
        <p className="text-center text-[#4a5565] mb-8">학습 목표를 달성하세요</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#9810fa] hover:bg-[#7d0dd1] text-white"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/signup" className="text-[#9810fa] hover:underline">
            계정이 없으신가요? 회원가입
          </Link>
        </div>
      </div>

      {/* 프로필 설정 Dialog */}
      <Dialog open={showProfileSetup} onOpenChange={(open) => !open && handleSkipProfile()}>
        <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-col items-center mb-4">
              <div className="inline-flex items-center justify-center w-[64px] h-[64px] rounded-full bg-gradient-to-br from-[#9810fa] to-[#2b7fff] mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-center">프로필 설정</DialogTitle>
              <DialogDescription className="text-center mt-2">
                처음 로그인하셨네요! 닉네임, 학년, 성별을 설정해주세요.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 닉네임 */}
            <div>
              <label htmlFor="nickname" className="block text-[14px] text-neutral-950 mb-2">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <input
                id="nickname"
                type="text"
                placeholder="닉네임을 입력하세요"
                value={profileData.nickname}
                onChange={(e) => setProfileData({ ...profileData, nickname: e.target.value })}
                className="bg-[#f3f3f5] rounded-[8px] h-[48px] px-4 text-[16px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa] w-full"
                maxLength={20}
              />
            </div>

            {/* 학년 */}
            <div>
              <label className="block text-[14px] text-neutral-950 mb-3">
                학년 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(grade => (
                  <button
                    key={grade}
                    type="button"
                    className={`h-[56px] rounded-[12px] border-2 transition-colors ${
                      profileData.grade === grade
                        ? 'border-[#9810fa] bg-purple-50 text-[#9810fa]'
                        : 'border-gray-200 text-neutral-950 hover:border-gray-300'
                    }`}
                    onClick={() => setProfileData({ ...profileData, grade })}
                  >
                    <span className="text-[18px]">{grade}학년</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 성별 */}
            <div>
              <label className="block text-[14px] text-neutral-950 mb-3">
                성별 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`h-[56px] rounded-[12px] border-2 transition-colors ${
                    profileData.gender === 'male'
                      ? 'border-[#9810fa] bg-purple-50 text-[#9810fa]'
                      : 'border-gray-200 text-neutral-950 hover:border-gray-300'
                  }`}
                  onClick={() => setProfileData({ ...profileData, gender: 'male' })}
                >
                  <span className="text-[18px]">남자</span>
                </button>
                <button
                  type="button"
                  className={`h-[56px] rounded-[12px] border-2 transition-colors ${
                    profileData.gender === 'female'
                      ? 'border-[#9810fa] bg-purple-50 text-[#9810fa]'
                      : 'border-gray-200 text-neutral-950 hover:border-gray-300'
                  }`}
                  onClick={() => setProfileData({ ...profileData, gender: 'female' })}
                >
                  <span className="text-[18px]">여자</span>
                </button>
              </div>
            </div>

            {/* 안내 메시지 */}
            <div className="bg-purple-50 rounded-[10px] border border-purple-200 p-4">
              <p className="text-[14px] text-[#6a7282]">
                💡 프로필 사진 및 정보는 프로필 페이지에서 수정할 수 있습니다.
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleSkipProfile}
                className="flex-1 bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[48px] text-[16px] text-neutral-950 hover:bg-gray-50 transition-colors"
              >
                나중에 하기
              </button>
              <button
                type="button"
                onClick={handleProfileSetup}
                disabled={savingProfile}
                className="flex-1 bg-[#9810fa] hover:bg-[#8610da] text-white rounded-[8px] h-[48px] text-[16px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {savingProfile ? '저장 중...' : '설정 완료'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
