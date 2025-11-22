import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { api } from '../services/api';
import { Toaster, toast } from "sonner";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface SignupPageProps {
  onLogin: (user: { id: string; name: string; email: string }) => void;
}

export function SignupPage({ onLogin }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('모든 항목을 입력해주세요');
      return;
    }

    // 이메일 도메인 검증: @ 뒤가 skuniv.ac.kr이어야 함
    const emailParts = email.split('@');
    if (emailParts.length !== 2 || emailParts[1] !== 'skuniv.ac.kr') {
      toast.error('학교이메일로 회원가입해야됩니다');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다');
      return;
    }

    if (password.length < 6) {
      toast.error('비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }

    setLoading(true);
    
    try {
      const user = await api.register({ name, email, password });
      toast.success('회원가입 성공! 로그인 페이지로 이동합니다.');
      // 회원가입 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      toast.error('회원가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-[#9810fa] rounded-full p-3">
            <BarChart3 className="size-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-center text-neutral-950 mb-2">TimerOn</h1>
        <p className="text-center text-[#4a5565] mb-8">새로운 계정을 만들어보세요</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          
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
          
          <div>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#9810fa] hover:bg-[#7d0dd1] text-white"
            disabled={loading}
          >
            {loading ? '가입 중...' : '회원가입'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/login" className="text-[#9810fa] hover:underline">
            이미 계정이 있으신가요? 로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
