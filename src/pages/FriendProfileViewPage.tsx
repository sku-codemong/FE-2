import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { api } from '../services/api';

export default function FriendProfileViewPage() {
  const { friendUserId } = useParams();
  const location = useLocation() as any;
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string>(location?.state?.nickname || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nickname || !friendUserId) return;
    // 닉네임이 없으면 검색 API로 보완
    (async () => {
      setLoading(true);
      try {
        const results = await (api as any).searchUsers?.(friendUserId);
        if (Array.isArray(results) && results.length > 0) {
          const exact = results.find((u: any) => String(u.id) === String(friendUserId) || u.userId === friendUserId);
          setNickname((exact?.nickname || exact?.userId) ?? '');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [friendUserId, nickname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[720px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[24px] text-neutral-950">친구 프로필</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>뒤로가기</Button>
        </div>

        <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-[18px]">
              {(nickname || friendUserId || '?').toString().charAt(0)}
            </div>
            <div>
              <p className="text-[18px] text-neutral-950">{nickname || (loading ? '불러오는 중...' : '이름 정보 없음')}</p>
              <p className="text-[14px] text-[#6a7282]">@{friendUserId}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-[10px] p-3 text-[13px] text-[#6a7282] mt-6">
            이 페이지는 읽기 전용입니다. 프로필 수정 등은 제공되지 않습니다.
          </div>
        </div>
      </div>
    </div>
  );
}

