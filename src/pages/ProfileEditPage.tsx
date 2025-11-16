import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api, User } from '../services/api';
import { toast } from 'sonner';

type FormGender = 'male' | 'female';

interface FormState {
  nickname: string;
  grade: number;
  gender: FormGender;
}

export function ProfileEditPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormState>({
    nickname: '',
    grade: 1,
    gender: 'male',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const normalizeGender = (value: User['gender']): FormGender => {
    if (!value) return 'male';
    return value.toLowerCase() === 'female' ? 'female' : 'male';
  };

  const loadProfile = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
      setFormData({
        nickname: userData.nickname || '',
        grade: userData.grade || 1,
        gender: normalizeGender(userData.gender),
      });
    } catch (error) {
      toast.error('프로필을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nickname.trim()) {
      toast.error('닉네임을 입력해주세요');
      return;
    }

    setSaving(true);

    try {
      await api.updateProfile({
        nickname: formData.nickname,
        grade: formData.grade,
        // gender는 수정할 수 없으므로 제외
      });

      toast.success('프로필이 수정되었습니다');
      navigate(`/profile/${userId ?? user?.id ?? ''}`);
    } catch (error) {
      toast.error('프로필 수정에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">프로필을 찾을 수 없습니다</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-[640px] mx-auto">
        <button
          onClick={() => navigate(`/profile/${userId ?? user.id}`)}
          className="flex items-center gap-3 h-[36px] px-3 rounded-[8px] hover:bg-gray-100 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[14px] text-neutral-950">돌아가기</span>
        </button>

        <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-[33px]">
          <h1 className="text-[20px] text-neutral-950 mb-8">프로필 수정</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[14px] text-neutral-950 mb-2">아이디</label>
              <input
                type="text"
                value={user.email}
                disabled
                className="bg-gray-100 rounded-[8px] h-[44px] px-4 text-[14px] text-gray-500 border-0 w-full cursor-not-allowed"
              />
              <p className="text-[12px] text-[#6a7282] mt-1">아이디는 변경할 수 없습니다</p>
            </div>

            <div>
              <label htmlFor="nickname" className="block text-[14px] text-neutral-950 mb-2">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <input
                id="nickname"
                type="text"
                placeholder="닉네임을 입력하세요"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                className="bg-[#f3f3f5] rounded-[8px] h-[44px] px-4 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa] w-full"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-[14px] text-neutral-950 mb-2">
                학년 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    className={`h-[52px] rounded-[10px] border-2 transition-colors ${
                      formData.grade === grade
                        ? 'border-[#9810fa] bg-purple-50 text-[#9810fa]'
                        : 'border-gray-200 text-neutral-950 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, grade })}
                  >
                    <span className="text-[16px]">{grade}학년</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[14px] text-neutral-950 mb-2">
                성별
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled
                  className={`h-[52px] rounded-[10px] border-2 transition-colors cursor-not-allowed ${
                    formData.gender === 'male'
                      ? 'border-gray-300 bg-gray-100 text-gray-500'
                      : 'border-gray-200 bg-gray-100 text-gray-400'
                  }`}
                >
                  <span className="text-[16px]">남자</span>
                </button>
                <button
                  type="button"
                  disabled
                  className={`h-[52px] rounded-[10px] border-2 transition-colors cursor-not-allowed ${
                    formData.gender === 'female'
                      ? 'border-gray-300 bg-gray-100 text-gray-500'
                      : 'border-gray-200 bg-gray-100 text-gray-400'
                  }`}
                >
                  <span className="text-[16px]">여자</span>
                </button>
              </div>
              <p className="text-[12px] text-[#6a7282] mt-1">성별은 변경할 수 없습니다</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/profile/${userId ?? user.id}`)}
                className="flex-1 bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[44px] text-[14px] text-neutral-950 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#9810fa] hover:bg-[#8610da] text-white rounded-[8px] h-[44px] text-[14px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}