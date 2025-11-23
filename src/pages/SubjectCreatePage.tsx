import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { api, Assignment } from '../services/api';
import { toast } from 'sonner';
import { InterstitialAd } from '../components/InterstitialAd';
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

interface SubjectForm {
  id: string;
  name: string;
  color: string;
  credit: number;
  difficulty: number;
  hasExtraWork: boolean;
  assignments: Assignment[];
}

export function SubjectCreatePage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectForm[]>([
    {
      id: '1',
      name: '',
      color: COLORS[0],
      credit: 3,
      difficulty: 3,
      hasExtraWork: false,
      assignments: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [showColorDialog, setShowColorDialog] = useState<{ [key: string]: boolean }>({});

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

  const addSubject = () => {
    const usedColors = subjects.map(s => s.color);
    const availableColor = COLORS.find(c => !usedColors.includes(c)) || COLORS[subjects.length % COLORS.length];
    
    setSubjects([
      ...subjects,
      {
        id: Date.now().toString(),
        name: '',
        color: availableColor,
        credit: 3,
        difficulty: 3,
        hasExtraWork: false,
        assignments: []
      }
    ]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof SubjectForm, value: any) => {
    setSubjects(subjects.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const addAssignment = (subjectId: string) => {
    setSubjects(subjects.map(s => {
      if (s.id === subjectId) {
        const newAssignment: Assignment = {
          id: Date.now(),
          userId: 1,
        subjectId: undefined,
          type: 'assignment',
          title: '',
        description: '',
        dueAt: undefined,
          estimatedMin: 60,
          status: 'todo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return {
          ...s,
          assignments: [...s.assignments, newAssignment]
        };
      }
      return s;
    }));
  };

  const removeAssignment = (subjectId: string, assignmentId: number) => {
    setSubjects(subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          assignments: s.assignments.filter(a => a.id !== assignmentId)
        };
      }
      return s;
    }));
  };

  const updateAssignment = (subjectId: string, assignmentId: number, field: keyof Assignment, value: any) => {
    setSubjects(subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          assignments: s.assignments.map(a => 
            a.id === assignmentId ? { ...a, [field]: value, updatedAt: new Date().toISOString() } : a
          )
        };
      }
      return s;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const emptyNames = subjects.filter(s => !s.name.trim());
    if (emptyNames.length > 0) {
      toast.error('모든 과목명을 입력해주세요');
      return;
    }

    // 과제가 있는 경우 과제명 검증
    for (const subject of subjects) {
      if (subject.hasExtraWork && subject.assignments.length > 0) {
        const emptyAssignments = subject.assignments.filter(a => !a.title.trim());
        if (emptyAssignments.length > 0) {
          toast.error(`${subject.name}의 과제명을 입력해주세요`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      // 모든 과목 생성 (과제는 제외)
      const createdSubjects = await Promise.all(
        subjects.map(subject =>
          api.createSubject({
            name: subject.name,
            color: subject.color,
            targetDailyMin: 0,
            credit: subject.credit,
            difficulty: subject.difficulty,
            archived: false,
          })
        )
      );

      // 각 과목의 과제 생성
      const taskPromises: Promise<any>[] = [];
      for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];
        const createdSubject = createdSubjects[i];
        
        if (subject.hasExtraWork && subject.assignments.length > 0) {
          // subjectId를 숫자로 변환 (백엔드가 숫자를 기대하는 경우)
          const subjectIdNumRaw = Number(createdSubject.id);
          const subjectIdNum = Number.isFinite(subjectIdNumRaw)
            ? subjectIdNumRaw
            : parseInt(String(createdSubject.id).replace(/[^0-9]/g, ''), 10) || 0;

          if (!subjectIdNum) {
            continue;
          }
          
          for (const assignment of subject.assignments) {
            taskPromises.push(
              api.createTask({
                subjectId: subjectIdNum,
                type: 'assignment',
                title: assignment.title,
                description: assignment.description?.trim()
                  ? assignment.description.trim()
                  : undefined,
                dueAt: assignment.dueAt ?? undefined,
                estimatedMin:
                  assignment.estimatedMin && assignment.estimatedMin > 0
                    ? assignment.estimatedMin
                    : undefined,
              })
            );
          }
        }
      }

      // 모든 과제 생성 완료 대기
      if (taskPromises.length > 0) {
        await Promise.all(taskPromises);
      }

      toast.success(`${subjects.length}개의 과목이 추가되었습니다!`);
      
      // 인터스티셜 광고 표시
      setShowInterstitialAd(true);
    } catch (error) {
      console.error('과목 추가 오류:', error);
      toast.error('과목 추가에 실패했습니다');
      setLoading(false);
    }
  };

  const handleAdClose = () => {
    setShowInterstitialAd(false);
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-[992px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 h-[36px] px-3 rounded-[8px] hover:bg-gray-100 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[14px] text-neutral-950">돌아가기</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[20px] sm:text-[24px] text-neutral-950 mb-2">과목 일괄 추가</h1>
          <p className="text-[14px] sm:text-[16px] text-[#4a5565]">
            과목 정보를 입력하세요. 일일 시간 분배는 메인 화면에서 할 수 있습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Subject Cards */}
        <div className="flex flex-col gap-6">
          {subjects.map((subject, index) => (
            <div key={subject.id} className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-4 sm:p-[25px]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-10">
                <h3 className="text-[16px] sm:text-[18px] text-[#364153]">과목 {index + 1}</h3>
                {subjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubject(subject.id)}
                    className="text-red-500 hover:text-red-700 transition-colors self-start sm:self-auto"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-[16px]">
                {/* 과목명 */}
                <div>
                  <label className="block text-[14px] text-neutral-950 mb-1">과목명</label>
                  <input
                    type="text"
                    placeholder="예: 자료구조"
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                    className="bg-[#f3f3f5] rounded-[8px] h-[36px] px-3 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa] w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 학점 */}
                  <div>
                    <label className="block text-[14px] text-neutral-950 mb-2">학점</label>
                    <div className="flex gap-2">
                      {[1, 2, 3].map(credit => (
                        <button
                          key={credit}
                          type="button"
                          className={`flex-1 h-[44px] rounded-[10px] border-2 transition-colors ${
                            subject.credit === credit
                              ? 'border-[#9810fa] bg-purple-50 text-[#9810fa]'
                              : 'border-gray-200 text-neutral-950 hover:border-gray-300'
                          }`}
                          onClick={() => updateSubject(subject.id, 'credit', credit)}
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
                            subject.difficulty === level
                              ? 'border-[#9810fa] bg-purple-50 text-[#9810fa]'
                              : 'border-gray-200 text-neutral-950 hover:border-gray-300'
                          }`}
                          onClick={() => updateSubject(subject.id, 'difficulty', level)}
                        >
                          <span className="text-[16px]">{level}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 추가 과제 체크박스 */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`extra-${subject.id}`}
                    checked={subject.hasExtraWork}
                    onChange={(e) => updateSubject(subject.id, 'hasExtraWork', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#9810fa] focus:ring-[#9810fa]"
                  />
                  <label htmlFor={`extra-${subject.id}`} className="text-[14px] text-neutral-950 cursor-pointer">
                    추가 과제나 프로젝트가 있습니다
                  </label>
                </div>

                {/* 과제 목록 */}
                {subject.hasExtraWork && (
                  <div className="bg-purple-50 rounded-[10px] p-3 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[14px] text-neutral-950">과제 목록</label>
                      <button
                        type="button"
                        onClick={() => addAssignment(subject.id)}
                        className="text-[#9810fa] hover:text-[#8610da] text-[12px] flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        과제 추가
                      </button>
                    </div>
                    
                    {subject.assignments.map((assignment) => (
                      <div key={assignment.id} className="bg-white rounded-[8px] p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="과제 이름"
                            value={assignment.title}
                            onChange={(e) => updateAssignment(subject.id, assignment.id, 'title', e.target.value)}
                            className="flex-1 bg-[#f3f3f5] rounded-[8px] h-[32px] px-3 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
                          />
                          <button
                            type="button"
                            onClick={() => removeAssignment(subject.id, assignment.id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      <div>
                        <textarea
                          placeholder="과제 설명 (선택사항)"
                          value={assignment.description ?? ''}
                          onChange={(e) => updateAssignment(subject.id, assignment.id, 'description', e.target.value)}
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
                                updateAssignment(subject.id, assignment.id, 'estimatedMin', undefined);
                              } else {
                                const numValue = parseInt(value, 10);
                                if (!isNaN(numValue) && numValue >= 0) {
                                  updateAssignment(subject.id, assignment.id, 'estimatedMin', numValue);
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
                              subject.id,
                              assignment.id,
                              'dueAt',
                              e.target.value ? new Date(e.target.value).toISOString() : undefined
                            )
                          }
                          className="flex-1 bg-[#f3f3f5] rounded-[8px] h-[32px] px-3 text-[14px] text-neutral-950 border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
                        />
                      </div>
                      </div>
                    ))}
                    
                    {subject.assignments.length === 0 && (
                      <p className="text-[12px] text-[#6a7282] text-center py-2">
                        '과제 추가' 버튼을 눌러 과제를 추가하세요
                      </p>
                    )}
                  </div>
                )}

                {/* 과목 색상 */}
                <div>
                  <Label htmlFor={`color-${subject.id}`}>과목 색상</Label>
                  <div className="space-y-3 mt-2">
                    {/* 기본 색상 (파란색, 초록색, 노란색) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {defaultColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => updateSubject(subject.id, 'color', color.value)}
                          className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-colors ${
                            subject.color === color.value
                              ? 'border-[#9810fa] bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div 
                            className={`size-6 rounded-full ${
                              subject.color === color.value
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
                      onClick={() => setShowColorDialog({ ...showColorDialog, [subject.id]: true })}
                      className={`w-full flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-colors ${
                        !defaultColors.find(c => c.value === subject.color)
                          ? 'border-[#9810fa] bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className={`size-6 rounded-full ${
                          !defaultColors.find(c => c.value === subject.color)
                            ? ''
                            : 'border-2 border-dashed border-gray-400'
                        }`}
                        style={{ 
                          backgroundColor: !defaultColors.find(c => c.value === subject.color) 
                            ? subject.color 
                            : 'transparent'
                        }}
                      />
                      <span className="text-neutral-950">다른 색상</span>
                    </button>
                  </div>
                </div>

                {/* 색상 선택 Dialog */}
                <Dialog open={showColorDialog[subject.id] || false} onOpenChange={(open) => setShowColorDialog({ ...showColorDialog, [subject.id]: open })}>
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
                            updateSubject(subject.id, 'color', color.value);
                            setShowColorDialog({ ...showColorDialog, [subject.id]: false });
                          }}
                          className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-colors ${
                            subject.color === color.value
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
              </div>
            </div>
          ))}
        </div>

        {/* 과목 추가 버튼 */}
        <button
          type="button"
          onClick={addSubject}
          className="bg-white border-2 border-[rgba(0,0,0,0.1)] rounded-[8px] h-[36px] w-full text-[14px] text-neutral-950 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          과목 추가
        </button>

        {/* 제출 버튼들 */}
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
            disabled={loading}
            className="flex-1 bg-[#9810fa] hover:bg-[#8610da] text-white rounded-[8px] h-[36px] text-[14px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '추가 중...' : `${subjects.length}개 과목 추가`}
          </button>
        </div>
      </form>
      </div>

      {/* 인터스티셜 광고 */}
      <InterstitialAd show={showInterstitialAd} onClose={handleAdClose} />
    </div>
  );
}
