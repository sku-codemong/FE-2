import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Check, Plus, X } from 'lucide-react';
import { api, Subject, Assignment } from '../services/api';

import { toast } from 'sonner';
import { InterstitialAd } from '../components/InterstitialAd';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1',
  '#EF4444', '#84CC16', '#06B6D4', '#F43F5E'
];

export function SubjectEditPage() {
  const { userId, subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: COLORS[0],
    targetWeeklyMin: 180,
    credit: 3,
    difficulty: 3,
    hasExtraWork: false,
    assignments: [] as Assignment[],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [showColorDialog, setShowColorDialog] = useState(false);

  // 로컬 시간을 datetime-local 형식으로 변환
  const formatLocalDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // datetime-local 값을 UTC ISO 문자열로 변환 (입력한 시간을 그대로 UTC로 저장)
  const localDateTimeToISO = (localDateTimeString: string) => {
    if (!localDateTimeString) return undefined;
    // datetime-local 형식: "YYYY-MM-DDTHH:mm"
    // 입력한 시간을 그대로 UTC로 저장 (시간대 변환 없이)
    // 예: "2025-11-27T18:00" -> "2025-11-27T18:00:00.000Z"
    return `${localDateTimeString}:00.000Z`;
  };

  // 기본 색상 (파란색, 초록색, 노란색)
  const defaultColors = [
    { value: '#3B82F6', label: '파란색' },
    { value: '#10B981', label: '초록색' },
    { value: '#F59E0B', label: '노란색' },
  ];

  // 추가 색상 (보라색, 핑크색, 남색 등)
  const additionalColors = [
    { value: '#8B5CF6', label: '보라색' },
    { value: '#EC4899', label: '핑크색' },
    { value: '#6366F1', label: '남색' },
    { value: '#14B8A6', label: '청록색' },
    { value: '#F97316', label: '주황색' },
    { value: '#EF4444', label: '빨간색' },
    { value: '#84CC16', label: '라임색' },
    { value: '#06B6D4', label: '하늘색' },
    { value: '#F43F5E', label: '로즈색' },
  ];

  useEffect(() => {
    loadSubject();
  }, [subjectId]);

  const loadSubject = async () => {
    if (!subjectId) return;

    try {
      const data = await api.getSubject(subjectId);
      if (data) {
        setSubject(data);

        // 과제 목록 별도 조회
        const numericSubjectId = Number(subjectId);
        const subjectIdForTask =
          Number.isFinite(numericSubjectId) && numericSubjectId > 0
            ? numericSubjectId
            : subjectId;

        const tasks = await api
          .getTasks({ subjectId: subjectIdForTask })
          .catch((error) => {
            console.warn('과제 데이터를 불러오지 못했습니다:', error);
            return [] as Assignment[];
          });

        setFormData({
          name: data.name,
          color: data.color ?? COLORS[0],
          targetWeeklyMin: data.targetWeeklyMin,
          credit: data.credit ?? (data as any).weight ?? 0,
          difficulty: data.difficulty,
          hasExtraWork: tasks.length > 0 || data.hasExtraWork,
          assignments: tasks.map((assignment) => ({
            ...assignment,
            description: assignment.description ?? '',
            dueAt: assignment.dueAt ?? undefined,
            estimatedMin:
              assignment.estimatedMin !== null && assignment.estimatedMin !== undefined
                ? assignment.estimatedMin
                : 60,
          })),
        });
      }
    } catch (error) {
      toast.error('과목 정보를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const addAssignment = () => {
    const newAssignment: Assignment = {
      id: Date.now(),
      userId: 1,
      subjectId: subjectId ? Number(subjectId) : undefined,
      type: 'assignment',
      title: '',
      description: '',
      dueAt: undefined,
      estimatedMin: 60,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setFormData({
      ...formData,
      assignments: [...formData.assignments, newAssignment]
    });
  };

  const removeAssignment = (assignmentId: number) => {
    setFormData({
      ...formData,
      assignments: formData.assignments.filter(a => a.id !== assignmentId)
    });
  };

  const updateAssignment = (assignmentId: number, field: keyof Assignment, value: any) => {
    setFormData({
      ...formData,
      assignments: formData.assignments.map(a => 
        a.id === assignmentId ? { ...a, [field]: value, updatedAt: new Date().toISOString() } : a
      )
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('과목명을 입력해주세요');
      return;
    }

    // 과제가 있는 경우 과제명 검증
    if (formData.hasExtraWork && formData.assignments.length > 0) {
      const emptyAssignments = formData.assignments.filter(a => !a.title.trim());
      if (emptyAssignments.length > 0) {
        toast.error('모든 과제의 이름을 입력해주세요');
        return;
      }
    }

    if (!subjectId) return;

    setSaving(true);

    try {
      const sanitizedAssignments = formData.assignments.map((assignment) => ({
        ...assignment,
        description: assignment.description?.trim() ? assignment.description.trim() : undefined,
        dueAt: assignment.dueAt ? assignment.dueAt : undefined,
        estimatedMin:
          assignment.estimatedMin && assignment.estimatedMin > 0
            ? assignment.estimatedMin
            : undefined,
      }));

      await api.updateSubject(subjectId, {
        name: formData.name,
        color: formData.color,
        targetWeeklyMin: formData.targetWeeklyMin,
        credit: formData.credit,
        difficulty: formData.difficulty,
        hasExtraWork: formData.hasExtraWork,
        assignments: sanitizedAssignments,
      });

      toast.success('과목이 수정되었습니다');
      
      // 인터스티셜 광고 표시
      setShowInterstitialAd(true);
    } catch (error) {
      toast.error('과목 수정에 실패했습니다');
      setSaving(false);
    }
  };

  const handleAdClose = () => {
    setShowInterstitialAd(false);
    setSaving(false);
    navigate('/');
  };

  const handleDelete = async () => {
    if (!subjectId) return;

    try {
      await api.deleteSubject(subjectId);
      toast.success('과목이 삭제되었습니다');
      navigate('/');
    } catch (error) {
      toast.error('과목 삭제에 실패했습니다');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">과목을 찾을 수 없습니다</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-[640px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 sm:gap-3 h-[36px] px-2 sm:px-3 rounded-[8px] hover:bg-gray-100 transition-colors mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[12px] sm:text-[14px] text-neutral-950">돌아가기</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-4 sm:p-[33px]">
          {/* Header with Delete Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-12">
            <h1 className="text-[16px] text-neutral-950">과목 수정</h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="bg-[#d4183d] hover:bg-[#b51430] text-white rounded-[8px] h-[32px] px-4 text-[14px] flex items-center gap-2 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>과목을 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 모든 학습 기록도 함께 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600">
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 과목명 */}
            <div>
              <label htmlFor="name" className="block text-[14px] text-neutral-950 mb-1">과목명</label>
              <input
                id="name"
                type="text"
                placeholder="자료구조"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#f3f3f5] rounded-[8px] h-[36px] px-3 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa] w-full"
              />
            </div>

            {/* 학점 */}
            <div>
              <label className="block text-[14px] text-neutral-950 mb-2">학점</label>
              <div className="flex gap-2">
                {[1, 2, 3].map(credit => (
                  <button
                    key={credit}
                    type="button"
                    className={`flex-1 h-[44px] rounded-[10px] border-2 transition-colors ${
                      formData.credit === credit
                        ? 'border-[#9810fa] bg-purple-50 text-[#9810fa]'
                        : 'border-gray-200 text-neutral-950 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, credit })}
                  >
                    <span className="text-[16px]">{credit}학점</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 난이도 */}
            <div>
              <label className="block text-[14px] text-neutral-950 mb-2">난이도 (1: 쉬움 ~ 5: 어려움)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    className={`flex-1 h-[44px] rounded-[10px] border-2 transition-colors ${
                      formData.difficulty === level
                        ? 'border-[#9810fa] bg-purple-50 text-[#9810fa]'
                        : 'border-gray-200 text-neutral-950 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, difficulty: level })}
                  >
                    <span className="text-[16px]">{level}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 추가 과제 체크박스 */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="checkbox"
                  id="hasExtraWork"
                  checked={formData.hasExtraWork}
                  onChange={(e) => setFormData({ ...formData, hasExtraWork: e.target.checked })}
                  className="peer w-4 h-4 rounded border-[#030213] appearance-none checked:bg-[#030213] checked:border-[#030213] cursor-pointer"
                />
                {formData.hasExtraWork && (
                  <Check className="w-3.5 h-3.5 text-white absolute top-0.5 left-0.5 pointer-events-none" />
                )}
              </div>
              <label htmlFor="hasExtraWork" className="text-[14px] text-neutral-950 cursor-pointer">
                추가 과제나 프로젝트가 있습니다
              </label>
            </div>

            {/* 과제 목록 */}
            {formData.hasExtraWork && (
              <div className="bg-purple-50 rounded-[10px] p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[14px] text-neutral-950">과제 목록</label>
                  <button
                    type="button"
                    onClick={addAssignment}
                    className="text-[#9810fa] hover:text-[#8610da] text-[12px] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    과제 추가
                  </button>
                </div>
                
                {formData.assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white rounded-[8px] p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="과제 이름"
                        value={assignment.title}
                        onChange={(e) => updateAssignment(assignment.id, 'title', e.target.value)}
                        className="flex-1 bg-[#f3f3f5] rounded-[8px] h-[32px] px-3 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
                      />
                      <button
                        type="button"
                        onClick={() => removeAssignment(assignment.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <textarea
                        placeholder="과제 설명 (선택사항)"
                        value={assignment.description ?? ''}
                        onChange={(e) => updateAssignment(assignment.id, 'description', e.target.value)}
                        className="w-full bg-[#f3f3f5] rounded-[8px] h-[60px] px-3 py-2 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa] resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="text-[12px] text-[#6a7282] whitespace-nowrap">예상 소요시간:</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={
                          assignment.estimatedMin === undefined || assignment.estimatedMin === null
                            ? ''
                            : assignment.estimatedMin
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            updateAssignment(assignment.id, 'estimatedMin', undefined);
                          } else {
                            const numValue = parseInt(value, 10);
                            if (!isNaN(numValue) && numValue >= 0) {
                              updateAssignment(assignment.id, 'estimatedMin', numValue);
                            }
                          }
                        }}
                        className="bg-[#f3f3f5] rounded-[8px] h-[32px] px-3 text-[14px] text-neutral-950 border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa] w-[100px]"
                      />
                      <span className="text-[12px] text-[#6a7282]">분</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[12px] text-[#6a7282] whitespace-nowrap">마감 기한:</label>
                      <input
                        type="datetime-local"
                        value={
                          assignment.dueAt
                            ? formatLocalDateTime(assignment.dueAt)
                            : ''
                        }
                        onChange={(e) =>
                          updateAssignment(
                            assignment.id,
                            'dueAt',
                            localDateTimeToISO(e.target.value)
                          )
                        }
                        className="flex-1 bg-[#f3f3f5] rounded-[8px] h-[32px] px-3 text-[14px] text-neutral-950 border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
                      />
                    </div>
                  </div>
                ))}
                
                {formData.assignments.length === 0 && (
                  <p className="text-[12px] text-[#6a7282] text-center py-2">
                    '과제 추가' 버튼을 눌러 과제를 추가하세요
                  </p>
                )}
              </div>
            )}

            {/* 과목 색상 */}
            <div>
              <Label htmlFor="color">과목 색상</Label>
              <div className="space-y-3 mt-2">
                {/* 기본 색상 (파란색, 초록색, 노란색) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {defaultColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-colors ${
                        formData.color === color.value
                          ? 'border-[#9810fa] bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className={`size-6 rounded-full ${
                          formData.color === color.value
                            ? ''
                            : 'border-2 border-dashed border-gray-400'
                        }`}
                        style={{ 
                          backgroundColor: color.value
                        }}
                      />
                      <span className="text-neutral-950">{color.label}</span>
                    </button>
                  ))}
                </div>
                
                {/* 다른 색상 선택 버튼 */}
                <button
                  type="button"
                  onClick={() => setShowColorDialog(true)}
                  className={`w-full flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-colors ${
                    !defaultColors.find(c => c.value === formData.color)
                      ? 'border-[#9810fa] bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div 
                    className={`size-6 rounded-full ${
                      !defaultColors.find(c => c.value === formData.color)
                        ? ''
                        : 'border-2 border-dashed border-gray-400'
                    }`}
                    style={{ 
                      backgroundColor: !defaultColors.find(c => c.value === formData.color) 
                        ? formData.color 
                        : 'transparent'
                    }}
                  />
                  <span className="text-neutral-950">다른 색상</span>
                </button>
              </div>
            </div>

            {/* 색상 선택 Dialog */}
            <Dialog open={showColorDialog} onOpenChange={setShowColorDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>색상 선택</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-3 py-4">
                  {additionalColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, color: color.value });
                        setShowColorDialog(false);
                      }}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-colors ${
                        formData.color === color.value
                          ? 'border-[#9810fa] bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="size-6 rounded-full" 
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-neutral-950">{color.label}</span>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Info Box */}
            <div className="bg-blue-50 rounded-[10px] border border-[#bedbff] p-[17px]">
              <p className="text-[14px] text-[#193cb8] mb-1">
                💡 일일 학습 목표 시간은 메인 화면의 '일일 분배' 기능을 통해 설정할 수 있습니다
              </p>
              <p className="text-[12px] text-[#155dfc]">
                학점, 난이도, 추가 과제 여부를 고려하여 자동으로 시간이 분배됩니다
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[36px] text-[14px] text-neutral-950 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#9810fa] hover:bg-[#8610da] text-white rounded-[8px] h-[36px] text-[14px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 인터스티셜 광고 */}
      <InterstitialAd show={showInterstitialAd} onClose={handleAdClose} />
    </div>
  );
}
