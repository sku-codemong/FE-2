import { useEffect, useRef, useState } from 'react';
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

interface ProfileEditPageProps {
  onProfileUpdate?: (user: User) => void;
}

export function ProfileEditPage({ onProfileUpdate }: ProfileEditPageProps) {
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
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadProfile();
    return () => {
      if (localImagePreview) {
        URL.revokeObjectURL(localImagePreview);
      }
    };
  }, [localImagePreview]);

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
      setProfileImageUrl(userData.profileImageUrl ?? null);
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

      if (selectedImageFile) {
        const imageFormData = new FormData();
        imageFormData.append('profile_image', selectedImageFile);
        try {
          const result = await api.updateProfileImage(imageFormData);
          setProfileImageUrl(result.profileImageUrl ?? profileImageUrl ?? null);
        } catch (imageError) {
          console.error('Profile image upload failed:', imageError);
          toast.error('프로필 사진 업로드에 실패했습니다');
          setSaving(false);
          return;
        }
      }

      // 최신 사용자 정보를 가져와서 App.tsx의 user state 업데이트
      try {
        const updatedUser = await api.getMe();
        if (onProfileUpdate) {
          onProfileUpdate(updatedUser);
        }
        // localStorage도 업데이트
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }

      toast.success('프로필이 수정되었습니다');
      navigate(`/profile/${userId ?? user?.id ?? ''}`);
    } catch (error) {
      toast.error('프로필 수정에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImageFile(file);
    setLocalImagePreview(previewUrl);
  };

  const renderAvatar = () => {
    const imageSrc = localImagePreview || profileImageUrl;
    if (imageSrc) {
      return (
        <img
          src={imageSrc}
          alt="프로필 이미지"
          className="w-full h-full object-cover"
        />
      );
    }

    const initial =
      (formData.nickname?.charAt(0) ||
        user?.nickname?.charAt(0) ||
        user?.email?.charAt(0) ||
        '?'
      ).toUpperCase();

    return (
      <span className="text-2xl font-semibold text-white flex items-center justify-center h-full w-full bg-gradient-to-br from-[#9810fa] to-[#2b7fff]">
        {initial}
      </span>
    );
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
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.png" alt="TimerOn Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-2" />
            <img src="/name.png" alt="TimerOn" className="h-10 sm:h-14 max-w-[250px] sm:max-w-[320px] object-contain mb-4" />
            <h1 className="text-[20px] text-neutral-950">프로필 수정</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[14px] text-neutral-950 mb-3">프로필 사진</label>
              <div className="flex items-center gap-4">
                <div className="w-[80px] h-[80px] rounded-full overflow-hidden border border-[rgba(0,0,0,0.08)] bg-gray-200">
                  {renderAvatar()}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 h-[40px] rounded-[8px] bg-[#9810fa] text-white text-[14px] hover:bg-[#7c0fcd] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      사진 선택
                    </button>
                  </div>
                  <p className="text-[12px] text-[#6a7282]">JPG 또는 PNG 파일을 업로드할 수 있어요.</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageSelect}
              />
            </div>

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