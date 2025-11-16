import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Play, Trash2, Edit } from 'lucide-react';
import { api, Subject, Session, Assignment } from '../services/api';
import { toast } from 'sonner';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

// hex 색상을 받아서 더 밝은 버전을 반환하는 함수
const lightenColorHex = (hex: string, percent: number): string => {
  // # 제거
  const num = parseInt(hex.replace('#', ''), 16);
  
  // RGB 분리
  const r = (num >> 16) + Math.round(2.55 * percent * (255 - (num >> 16)));
  const g = (num >> 8 & 0x00FF) + Math.round(2.55 * percent * (255 - (num >> 8 & 0x00FF)));
  const b = (num & 0x0000FF) + Math.round(2.55 * percent * (255 - (num & 0x0000FF)));
  
  // hex로 변환
  return '#' + (0x1000000 + (r < 255 ? r : 255) * 0x10000 + 
    (g < 255 ? g : 255) * 0x100 + (b < 255 ? b : 255)).toString(16).slice(1);
};

export function SubjectDetailPage() {
  const { userId, subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    estimatedMin: 60,
    dueAt: '',
  });

  useEffect(() => {
    loadData();
  }, [subjectId]);

  useEffect(() => {
    if (!activeSession || isPaused) {
      return;
    }

    const start = new Date(activeSession.startTime).getTime();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, isPaused]);

  const loadData = async () => {
    if (!subjectId) return;

    try {
      const subjectData = await api.getSubject(subjectId);

      if (!subjectData) {
        setSubject(null);
        setRecentSessions([]);
        toast.error('과목 정보를 불러오지 못했습니다');
        return;
      }

      // 이번 주 월요일부터 오늘까지 각 날짜별로 세션 조회 (메인 화면과 동일)
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      // 이번 주 월요일 계산
      const weekStartDate = new Date();
      const day = weekStartDate.getDay();
      const diff = weekStartDate.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(weekStartDate.setDate(diff));
      monday.setHours(0, 0, 0, 0);
      
      const sessionPromises: Promise<Session[]>[] = [];
      const currentDate = new Date(monday);
      currentDate.setHours(0, 0, 0, 0);
      
      // 월요일부터 오늘까지 각 날짜별로 세션 조회
      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        sessionPromises.push(
          api.getSessions({ subjectId, date: dateStr }).catch(() => [] as Session[])
        );
        
        if (dateStr === todayStr) {
          break;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      const sessionsArrays = await Promise.all(sessionPromises);
      const sessions = sessionsArrays.flat();

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

      setSubject({
        ...subjectData,
        assignments: tasks,
        hasExtraWork: tasks.length > 0,
      });

      // 모든 세션 저장 (최근 5개만이 아닌)
      setRecentSessions(sessions);

      // 활성 세션 확인
      const active = api.getActiveSession();
      if (active && active.subjectId === subjectId) {
        setActiveSession(active);
      }
    } catch (error) {
      toast.error('데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentStatusChange = async (taskId: number, newStatus: 'todo' | 'in_progress' | 'done') => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      
      // 상태 업데이트
      setSubject(prev => {
        if (!prev || !prev.assignments) return prev;
        return {
          ...prev,
          assignments: prev.assignments.map(a =>
            a.id === taskId ? { ...a, status: newStatus } : a
          ),
        };
      });

      const statusText = newStatus === 'todo' ? '시작 전' : newStatus === 'in_progress' ? '진행중' : '완료';
      toast.success(`과제 상태가 '${statusText}'로 변경되었습니다`);
    } catch (error) {
      toast.error('상태 변경에 실패했습니다');
    }
  };

  const handleDeleteAssignment = async (taskId: number) => {
    try {
      await api.deleteTask(taskId);
      
      // 과제 목록에서 제거
      setSubject(prev => {
        if (!prev || !prev.assignments) return prev;
        return {
          ...prev,
          assignments: prev.assignments.filter(a => a.id !== taskId),
        };
      });

      toast.success('과제가 삭제되었습니다');
    } catch (error) {
      toast.error('과제 삭제에 실패했습니다');
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setEditFormData({
      title: assignment.title,
      description: assignment.description || '',
      estimatedMin: assignment.estimatedMin || 60,
      dueAt: assignment.dueAt ? new Date(assignment.dueAt).toISOString().slice(0, 16) : '',
    });
    setEditDialogOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!editingAssignment) return;
    if (!editFormData.title.trim()) {
      toast.error('과제 이름을 입력해주세요');
      return;
    }

    try {
      const updatedData: Partial<Assignment> = {
        title: editFormData.title,
        description: editFormData.description || undefined,
        estimatedMin: editFormData.estimatedMin || undefined,
        dueAt: editFormData.dueAt ? new Date(editFormData.dueAt).toISOString() : undefined,
      };

      await api.updateTask(editingAssignment.id, updatedData);

      setSubject(prev => {
        if (!prev || !prev.assignments) return prev;
        return {
          ...prev,
          assignments: prev.assignments.map(a =>
            a.id === editingAssignment.id
              ? {
                  ...a,
                  ...updatedData,
                  description:
                    updatedData.description !== undefined ? updatedData.description : a.description,
                  estimatedMin:
                    updatedData.estimatedMin !== undefined ? updatedData.estimatedMin : a.estimatedMin,
                  dueAt: updatedData.dueAt !== undefined ? updatedData.dueAt : a.dueAt,
                  updatedAt: new Date().toISOString(),
                }
              : a
          ),
        };
      });

      toast.success('과제가 수정되었습니다');
      setEditDialogOpen(false);
      setEditingAssignment(null);
    } catch (error) {
      toast.error('과제 수정에 실패했습니다');
    }
  };

  const getStatusColor = (status: 'todo' | 'in_progress' | 'done') => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'done': return 'bg-green-100 text-green-700';
    }
  };

  const getStatusText = (status: 'todo' | 'in_progress' | 'done') => {
    switch (status) {
      case 'todo': return '시작 전';
      case 'in_progress': return '진행중';
      case 'done': return '완료';
    }
  };

  const getNextStatus = (status: 'todo' | 'in_progress' | 'done'): 'todo' | 'in_progress' | 'done' => {
    switch (status) {
      case 'todo': return 'in_progress';
      case 'in_progress': return 'done';
      case 'done': return 'todo';
    }
  };

  const handleStart = async () => {
    if (!subjectId) return;

    try {
      const session = await api.startSession(subjectId);
      setActiveSession(session);
      setElapsedSeconds(0);
      setIsPaused(false);
      toast.success('학습을 시작했습니다');
    } catch (error) {
      toast.error('세션 시작에 실패했습니다');
    }
  };

  const handleStop = async () => {
    if (!activeSession) return;

    try {
      // 세션 종료
      const completedSession = await api.stopSession(activeSession.id);
      
      // 노트가 있으면 저장
      if (note.trim()) {
        try {
          await api.updateSessionNote(activeSession.id, note.trim());
        } catch (noteError) {
          console.error('노트 저장 실패:', noteError);
          // 노트 저장 실패는 경고만 하고 전체 프로세스는 계속 진행
          toast.error('노트 저장에 실패했습니다');
        }
      }
      
      setActiveSession(null);
      setElapsedSeconds(0);
      setNote(''); // 노트 초기화
      setRecentSessions([completedSession, ...recentSessions.slice(0, 4)]);
      toast.success(`학습 완료! (${completedSession.duration}분)`);
    } catch (error) {
      toast.error('세션 종료에 실패했습니다');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">과목을 찾을 수 없습니다</div>
      </div>
    );
  }

      // 해당 과목의 세션만 필터링 (백엔드 필터가 제대로 작동하지 않을 수 있으므로 클라이언트에서도 확인)
      const filteredSessions = recentSessions.filter(s => 
        String(s.subjectId) === String(subjectId)
      );
      
      // 메인 화면과 동일한 계산 방식: 초 단위로 합산한 후 분으로 변환
      // normalizeSession에서 'stopped'는 'completed'로 변환되므로 'completed'만 체크
      const todayTotalSeconds = filteredSessions
        .filter(s => {
          // 완료된 세션만 포함 (메인 화면과 동일)
          // normalizeSession에서 'stopped'가 'completed'로 변환되므로 'completed'만 체크
          if (s.status !== 'completed') {
            return false;
          }
          // 세션의 시작 시간을 YYYY-MM-DD 형식으로 변환
          const sessionDateStr = new Date(s.startTime).toISOString().split('T')[0];
          const todayStr = new Date().toISOString().split('T')[0];
          return sessionDateStr === todayStr;
        })
        .reduce((sum, s) => {
          // endTime과 startTime의 차이를 초 단위로 계산 (메인 화면과 동일)
          let durationSec = 0;
          if (s.endTime) {
            const start = new Date(s.startTime).getTime();
            const end = new Date(s.endTime).getTime();
            durationSec = Math.floor((end - start) / 1000);
          } else {
            // endTime이 없으면 duration을 초로 변환 (이미 분 단위이므로 * 60)
            durationSec = (s.duration || 0) * 60;
          }
          return sum + durationSec;
        }, 0);
      const todayMinutes = Math.floor(todayTotalSeconds / 60);
      const todaySeconds = todayTotalSeconds % 60;

      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekTotalSeconds = filteredSessions
        .filter(s => {
          // 완료된 세션만 포함 (메인 화면과 동일)
          // normalizeSession에서 'stopped'가 'completed'로 변환되므로 'completed'만 체크
          if (s.status !== 'completed') {
            return false;
          }
          return new Date(s.startTime) >= weekStart;
        })
        .reduce((sum, s) => {
          // endTime과 startTime의 차이를 초 단위로 계산 (메인 화면과 동일)
          let durationSec = 0;
          if (s.endTime) {
            const start = new Date(s.startTime).getTime();
            const end = new Date(s.endTime).getTime();
            durationSec = Math.floor((end - start) / 1000);
          } else {
            // endTime이 없으면 duration을 초로 변환
            durationSec = (s.duration || 0) * 60;
          }
          return sum + durationSec;
        }, 0);
      const weekMinutes = Math.floor(weekTotalSeconds / 60);
      const weekSeconds = weekTotalSeconds % 60;

  // 일일 목표까지 남은 시간 계산 (일일 분배로 설정된 targetDailyMin 사용)
  const remainingMinutes = Math.max(0, (subject.targetDailyMin || 0) - todayMinutes);
  const remaining = remainingMinutes; // 기존 코드 호환성

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3ff] via-[#faf5ff] to-[#fff] py-6 px-4">
      <div className="max-w-[848px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 h-[36px] px-3 rounded-[8px] hover:bg-gray-100 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[14px] text-neutral-950">돌아가기</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] p-[48px]">
          {/* Header with Icon */}
          <div className="flex flex-col items-center mb-[48px]">
            <div 
              className="w-[96px] h-[96px] rounded-full flex items-center justify-center mb-[16px]"
              style={{
                background: `linear-gradient(to bottom right, ${lightenColorHex(subject.color, 30)}, ${subject.color})`
              }}
            >
              <Clock className="w-[48px] h-[48px] text-white" strokeWidth={2.67} />
            </div>
            <h1 className="text-[16px] text-neutral-950 mb-[8px]">{subject.name}</h1>
            <p className="text-[16px] text-[#4a5565]">학습 타이머</p>
          </div>

          {/* Timer Section */}
          <div className="flex flex-col items-center mb-[48px]">
            <div 
              className="w-full rounded-[24px] px-[48px] py-[32px] mb-[16px]"
              style={{
                background: `linear-gradient(to bottom right, ${lightenColorHex(subject.color, 40)}, ${lightenColorHex(subject.color, 20)})`
              }}
            >
              <p className="text-[96px] leading-[96px] text-center text-neutral-950 tracking-tight">
                {formatTime(elapsedSeconds)}
              </p>
              <p className="text-[16px] text-[#4a5565] text-center mt-[16px]">
                {!activeSession ? '시작 대기 중' : isPaused ? '일시정지됨' : '학습 중...'}
              </p>
            </div>
            
            {/* Start Button */}
            {!activeSession && (
              <button
                onClick={handleStart}
                style={{
                  backgroundColor: subject.color,
                }}
                className="hover:opacity-90 text-white rounded-[8px] h-[40px] px-[16px] flex items-center gap-[12px] transition-opacity"
              >
                <Play className="w-[20px] h-[20px]" strokeWidth={1.67} fill="white" />
                <span className="text-[14px]">시작</span>
              </button>
            )}
            
            {/* Stop Button */}
            {activeSession && (
              <button
                onClick={handleStop}
                className="bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-[8px] h-[40px] px-[16px] text-[14px] transition-colors"
              >
                종료
              </button>
            )}
          </div>

          {/* Assignments Section */}
          {subject.hasExtraWork && subject.assignments && subject.assignments.length > 0 && (
            <div className="border-t border-gray-200 pt-[25px] mb-[24px]">
              <h2 className="text-[16px] text-neutral-950 mb-[12px]">등록된 과제</h2>
              <div className="space-y-[8px]">
                {subject.assignments.map((assignment) => (
                  <div 
                    key={assignment.id}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-[10px] px-[16px] py-[12px] flex items-center justify-between gap-[12px]"
                  >
                    <div className="flex items-center gap-[12px] flex-1 min-w-0">
                      <div 
                        className="w-[8px] h-[8px] rounded-full shrink-0"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="text-[14px] text-neutral-950 truncate">{assignment.title}</span>
                    </div>
                    <div className="flex items-center gap-[8px] shrink-0">
                      {assignment.estimatedMin && (
                        <div className="flex items-center gap-[6px]">
                          <Clock className="w-[14px] h-[14px] text-[#6a7282]" />
                          <span className="text-[12px] text-[#6a7282] whitespace-nowrap">
                            {Math.floor(assignment.estimatedMin / 60) > 0 && `${Math.floor(assignment.estimatedMin / 60)}h `}
                            {assignment.estimatedMin % 60}m
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleAssignmentStatusChange(assignment.id, getNextStatus(assignment.status))}
                        className={`px-[12px] py-[4px] rounded-[6px] text-[12px] transition-colors ${getStatusColor(assignment.status)} hover:opacity-80`}
                      >
                        {getStatusText(assignment.status)}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditAssignment(assignment)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <Edit className="w-[14px] h-[14px]" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 className="w-[14px] h-[14px]" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>과제를 삭제하시겠습니까?</AlertDialogTitle>
                            <AlertDialogDescription>
                              이 작업은 되돌릴 수 없습니다. 과제가 영구적으로 삭제됩니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteAssignment(assignment.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Note Section */}
          <div className="border-t border-gray-200 pt-[25px] mb-[24px]">
            <label className="block text-[16px] text-neutral-950 mb-[8px]">학습 노트</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="오늘 학습한 내용을 기록하세요..."
              className="w-full h-[128px] bg-white border border-gray-200 rounded-[10px] px-[16px] py-[12px] text-[16px] text-neutral-950 placeholder:text-[rgba(10,10,10,0.5)] resize-none focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
            />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="bg-purple-50 rounded-[14px] p-[16px]">
              <p className="text-[16px] text-[#6a7282] text-center mb-[4px]">오늘 학습 시간</p>
              <p className="text-[16px] text-neutral-950 text-center">
                {Math.floor(todayMinutes / 60) > 0 ? `${Math.floor(todayMinutes / 60)}시간 ` : ''}{todayMinutes % 60}분 {todaySeconds}초
              </p>
            </div>
            <div className="bg-blue-50 rounded-[14px] p-[16px]">
              <p className="text-[16px] text-[#6a7282] text-center mb-[4px]">이번 주 누적</p>
              <p className="text-[16px] text-neutral-950 text-center">
                {Math.floor(weekMinutes / 60) > 0 ? `${Math.floor(weekMinutes / 60)}시간 ` : ''}{weekMinutes % 60}분 {weekSeconds}초
              </p>
            </div>
            <div className="bg-emerald-50 rounded-[14px] p-[16px]">
              <p className="text-[16px] text-[#6a7282] text-center mb-[4px]">목표까지</p>
              <p className="text-[16px] text-neutral-950 text-center">
                {Math.floor(remaining / 60)}시간 {remaining % 60}분
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
      {/* 과제 수정 다이얼로그 */}
      <Dialog
        open={editDialogOpen && Boolean(editingAssignment)}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setEditingAssignment(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>과제 수정</DialogTitle>
            <DialogDescription>과제 정보를 수정하세요.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label htmlFor="edit-title" className="block text-[14px] text-neutral-950 mb-2">
                과제 이름 <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-title"
                type="text"
                placeholder="과제 이름"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className="w-full bg-[#f3f3f5] rounded-[8px] h-[44px] px-4 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
              />
            </div>
            <div>
              <label htmlFor="edit-description" className="block text-[14px] text-neutral-950 mb-2">
                과제 설명
              </label>
              <textarea
                id="edit-description"
                placeholder="과제 설명 (선택사항)"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full bg-[#f3f3f5] rounded-[8px] h-[80px] px-4 py-3 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa] resize-none"
              />
            </div>
            <div>
              <label htmlFor="edit-time" className="block text-[14px] text-neutral-950 mb-2">
                예상 소요시간
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="edit-time"
                  type="number"
                  min="10"
                  step="10"
                  value={editFormData.estimatedMin}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, estimatedMin: parseInt(e.target.value) || 0 })
                  }
                  className="flex-1 bg-[#f3f3f5] rounded-[8px] h-[44px] px-4 text-[14px] text-neutral-950 border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
                />
                <span className="text-[14px] text-[#6a7282]">분</span>
              </div>
            </div>
            <div>
              <label htmlFor="edit-due" className="block text-[14px] text-neutral-950 mb-2">
                마감 기한
              </label>
              <input
                id="edit-due"
                type="datetime-local"
                value={editFormData.dueAt}
                onChange={(e) => setEditFormData({ ...editFormData, dueAt: e.target.value })}
                className="w-full bg-[#f3f3f5] rounded-[8px] h-[44px] px-4 text-[14px] text-neutral-950 border-0 focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditDialogOpen(false);
                  setEditingAssignment(null);
                }}
                className="flex-1 bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[44px] text-[14px] text-neutral-950 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveAssignment}
                className="flex-1 bg-[#9810fa] hover:bg-[#8610da] text-white rounded-[8px] h-[44px] text-[14px] transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
