// API Service - 백엔드 연결 또는 Mock 데이터 사용

// ========== Type Definitions ==========
export interface User {
  id: string;
  email: string;
  name?: string | null;
  nickname?: string | null;
  grade?: number | null;
  gender?: 'Male' | 'Female' | null;
  isCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Assignment {
  id: number;
  userId: number;
  subjectId?: number | null;
  type: 'assignment';
  title: string;
  description?: string | null;
  dueAt?: string | null; // DATETIME (ISO string)
  estimatedMin?: number | null;
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  userId?: string;
  name: string;
  color?: string | null;
  targetDailyMin: number;
  targetWeeklyMin: number;
  credit?: number | null;
  difficulty: number;
  weight?: number | null;
  archived: boolean;
  createdAt?: string;
  updatedAt?: string;
  hasExtraWork?: boolean;
  assignments?: Assignment[];
}

export interface DailyAllocation {
  date: string;
  totalAvailableMinutes: number;
  subjects: {
    subjectId: string;
    allocatedMinutes: number;
  }[];
}

export interface Session {
  id: string;
  subjectId: string;
  startTime: string;
  endTime?: string;
  duration: number; // minutes
  duration_sec?: number; // seconds (for more precise calculations)
  status: 'active' | 'completed' | 'manual';
  note?: string | null;
}

function normalizeSession(data: any): Session {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid session data');
  }

  const startAt = data.start_at ?? data.startTime ?? null;
  const endAt = data.end_at ?? data.endTime ?? null;
  const durationSec = data.duration_sec ?? data.duration ?? 0;
  const durationMin = Math.floor(durationSec / 60);
  
  // status가 'stopped'이면 'completed'로 변환
  let status = data.status ?? 'completed';
  if (status === 'stopped') {
    status = 'completed';
  }

  return {
    id: String(data.id ?? ''),
    subjectId: String(data.subject_id ?? data.subjectId ?? data.subject?.id ?? ''),
    startTime: startAt ? new Date(startAt).toISOString() : new Date().toISOString(),
    endTime: endAt ? new Date(endAt).toISOString() : undefined,
    duration: durationMin,
    duration_sec: durationSec, // 초 단위도 저장 (더 정확한 계산을 위해)
    status: status as 'active' | 'completed' | 'manual',
    note: data.note ?? null,
  };
}

export interface DailyReport {
  date: string;
  totalMinutes: number;
  subjects: {
    subjectId: string;
    subjectName: string;
    color: string;
    minutes: number;
    startTime?: string;
    endTime?: string;
  }[];
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalMinutes: number;
  subjects: {
    subjectId: string;
    subjectName: string;
    color: string;
    minutes: number;
    targetMinutes: number;
  }[];
  dailyBreakdown: {
    date: string;
    minutes: number;
  }[];
}

export interface Friend {
  id: string;
  userId: string;
  nickname: string;
  totalStudyMinutes: number;
}

export interface Notification {
  id: string;
  type: 'friend_request' | 'achievement' | 'reminder' | 'system' | 'other';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// ========== Realtime (Socket) ==========
type FriendEventPayload =
  | { type: 'friend:request:received'; fromUserId: string; toUserId: string; requestId: string }
  | { type: 'friend:request:responded'; toUserId?: string; friendUserId?: string; requestId: string; result: 'accepted' | 'rejected' };

let socketInstance: any = null;
const friendEventListeners = new Set<(event: FriendEventPayload) => void>();

export async function initRealtime() {
  // 동적 로딩: socket.io-client가 없는 환경에서도 빌드 가능하게
  if (socketInstance) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { io } = await import('socket.io-client');
    const base = apiBaseUrl || window.location.origin;
    socketInstance = io(base, {
      withCredentials: true,
      transports: ['websocket'],
    });
    socketInstance.on('connect', () => {
      // 연결 성공
    });
    socketInstance.on('friend:request:received', (payload: any) => {
      const req = payload?.request || {};
      const event: FriendEventPayload = {
        type: 'friend:request:received',
        fromUserId: String(
          payload?.from_user_id ??
          payload?.fromUserId ??
          req?.from_user_id ??
          req?.fromUserId ??
          req?.from_user?.id ??
          ''
        ),
        toUserId: String(
          payload?.to_user_id ??
          payload?.toUserId ??
          req?.to_user_id ??
          req?.toUserId ??
          req?.to_user?.id ??
          ''
        ),
        requestId: String(
          payload?.request_id ??
          payload?.requestId ??
          req?.id ??
          ''
        ),
      };
      friendEventListeners.forEach((fn) => fn(event));
    });
    socketInstance.on('friend:request:responded', (payload: any) => {
      const req = payload?.request || {};
      const raw = (payload?.result ?? payload?.status ?? payload?.action ?? payload?.accepted ?? req?.result ?? req?.status);
      const normalized = typeof raw === 'string' ? raw.toLowerCase() : raw;
      const isAccepted =
        normalized === true ||
        normalized === 'accepted' ||
        normalized === 'accept' ||
        normalized === 'ok' ||
        normalized === 'success' ||
        normalized === 'approved';
      const event: FriendEventPayload = {
        type: 'friend:request:responded',
        toUserId: (payload?.to_user_id ?? payload?.toUserId ?? req?.to_user_id ?? req?.toUserId ?? req?.to_user?.id) !== undefined
          ? String(
          payload?.to_user_id ??
          payload?.toUserId ??
          req?.to_user_id ??
          req?.toUserId ??
          req?.to_user?.id ??
          ''
          )
          : undefined,
        friendUserId: (payload?.friend?.id ?? req?.friend?.id) !== undefined
          ? String(payload?.friend?.id ?? req?.friend?.id)
          : undefined,
        requestId: String(
          payload?.request_id ??
          payload?.requestId ??
          req?.id ??
          ''
        ),
        result: (isAccepted ? 'accepted' : 'rejected'),
      };
      friendEventListeners.forEach((fn) => fn(event));
    });
  } catch (e) {
    // socket.io-client가 설치되어 있지 않은 경우 조용히 무시
    console.warn('Realtime disabled (socket.io-client not found).', e);
  }
}

export function onFriendEvent(listener: (event: FriendEventPayload) => void) {
  friendEventListeners.add(listener);
  return () => friendEventListeners.delete(listener);
}

// ========== Configuration ==========
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '';
const USE_MOCK = !API_BASE_URL; // API URL이 없으면 Mock 데이터 사용

const ACCESS_TOKEN_KEY = 'codemong.accessToken';
const REFRESH_TOKEN_KEY = 'codemong.refreshToken';
const REFRESH_ENDPOINT = '/api/auth/refresh';

interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  retry?: boolean;
}

type TokenPair = {
  accessToken?: string | null;
  refreshToken?: string | null;
};

let refreshPromise: Promise<boolean> | null = null;

const isBrowser = typeof window !== 'undefined';

function getStorage(): Storage | null {
  if (!isBrowser) return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readToken(key: string): string | null {
  const storage = getStorage();
  return storage ? storage.getItem(key) : null;
}

function writeToken(key: string, value: string | null) {
  const storage = getStorage();
  if (!storage) return;
  if (value) {
    storage.setItem(key, value);
  } else {
    storage.removeItem(key);
  }
}

function updateStoredTokens(accessToken?: string | null, refreshToken?: string | null) {
  if (accessToken !== undefined) {
    writeToken(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken !== undefined) {
    writeToken(REFRESH_TOKEN_KEY, refreshToken);
  }
}

function clearStoredTokens() {
  writeToken(ACCESS_TOKEN_KEY, null);
  writeToken(REFRESH_TOKEN_KEY, null);
}

export function getStoredAccessToken(): string | null {
  return readToken(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  return readToken(REFRESH_TOKEN_KEY);
}

export function storeAuthTokens(accessToken?: string | null, refreshToken?: string | null) {
  updateStoredTokens(accessToken, refreshToken);
}

export function clearAuthTokens() {
  clearStoredTokens();
}

function extractTokens(payload: any): TokenPair {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const sources = [
    payload,
    payload?.data,
    payload?.result,
    payload?.tokens,
    payload?.data?.tokens,
    payload?.result?.tokens,
  ];

  let accessToken: string | null | undefined;
  let refreshToken: string | null | undefined;

  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;
    if (accessToken === undefined) {
      accessToken =
        source.accessToken ??
        source.access_token ??
        source.token ??
        source.idToken ??
        source.jwt ??
        null;
    }
    if (refreshToken === undefined) {
      refreshToken =
        source.refreshToken ??
        source.refresh_token ??
        null;
    }
    if (accessToken !== undefined && refreshToken !== undefined) {
      break;
    }
  }

  return { accessToken, refreshToken };
}

function normalizeUser(payload: any): User {
  if (!payload) {
    throw new Error('사용자 정보를 불러오지 못했습니다.');
  }

  if (payload.user) {
    return normalizeUser(payload.user);
  }

  if (payload.data) {
    return normalizeUser(payload.data);
  }

  if (payload.result) {
    return normalizeUser(payload.result);
  }

  if (typeof payload === 'object' && 'id' in payload && 'email' in payload) {
    const nickname =
      payload.nickname ??
      payload.nick_name ??
      payload.displayName ??
      payload.display_name ??
      null;

    const gradeValue = payload.grade ?? payload.grade_level ?? null;
    const parsedGrade =
      gradeValue === null || gradeValue === undefined
        ? null
        : typeof gradeValue === 'number'
          ? gradeValue
          : Number(gradeValue);

    const genderValue = payload.gender ?? null;
    const gender =
      genderValue === 'Male' || genderValue === 'Female'
        ? genderValue
        : null;

    const isCompletedRaw =
      payload.is_completed ??
      payload.isCompleted ??
      (nickname && parsedGrade !== null ? true : undefined);

    return {
      id: String(payload.id),
      email: (payload as Partial<User>).email ?? '',
      name:
        (payload as Partial<User>).name ??
        payload.fullName ??
        payload.full_name ??
        null,
      nickname: nickname ?? null,
      grade: Number.isFinite(parsedGrade) ? parsedGrade : null,
      gender,
      isCompleted: typeof isCompletedRaw === 'boolean' ? isCompletedRaw : undefined,
      createdAt: payload.created_at ?? payload.createdAt ?? undefined,
      updatedAt: payload.updated_at ?? payload.updatedAt ?? undefined,
    } as User;
  }

  throw new Error('유효하지 않은 사용자 응답입니다.');
}

function applyAuthSideEffects(payload: any) {
  const { accessToken, refreshToken } = extractTokens(payload);
  if (accessToken !== undefined || refreshToken !== undefined) {
    updateStoredTokens(accessToken ?? null, refreshToken ?? null);
  }
}

function processAuthPayload(payload: any): User {
  applyAuthSideEffects(payload);
  return normalizeUser(payload);
}

// 백엔드 응답의 snake_case를 camelCase로 변환
function isSubjectLike(data: any): boolean {
  return (
    data &&
    typeof data === 'object' &&
    ('name' in data || 'subject_name' in data) &&
    ('color' in data || 'subject_color' in data)
  );
}

function normalizeAssignment(data: any): Assignment {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid task data');
  }

  return {
    id: Number(data.id ?? Date.now()),
    userId: Number(data.user_id ?? data.userId ?? 0),
    subjectId:
      data.subject_id !== undefined && data.subject_id !== null
        ? Number(data.subject_id)
        : data.subjectId !== undefined && data.subjectId !== null
          ? Number(data.subjectId)
          : null,
    type: 'assignment',
    title: data.title ?? '',
    description: data.description ?? null,
    dueAt: data.due_at ?? data.dueAt ?? null,
    estimatedMin:
      data.estimated_min !== undefined && data.estimated_min !== null
        ? Number(data.estimated_min)
        : data.estimatedMin !== undefined && data.estimatedMin !== null
          ? Number(data.estimatedMin)
          : null,
    status: data.status ?? 'todo',
    createdAt: data.created_at ?? data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updated_at ?? data.updatedAt ?? new Date().toISOString(),
  };
}

function normalizeSubject(data: any): Subject {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid subject data');
  }

  // credit 처리: null이거나 undefined일 때만 기본값 사용
  let credit = data.credit;
  if (credit !== null && credit !== undefined) {
    credit = Number(credit);
  }

  return {
    id: String(data.id ?? ''),
    userId: data.user_id ? String(data.user_id) : undefined,
    name: data.name ?? '',
    color: data.color ?? '#3B82F6',
    targetDailyMin: Number(data.target_daily_min ?? data.targetDailyMin ?? 0),
    targetWeeklyMin: Number(
      data.target_weekly_min ??
      data.targetWeeklyMin ??
      (data.target_daily_min ? Number(data.target_daily_min) * 7 : 0)
    ),
    credit: credit !== undefined ? credit : null,
    difficulty: Number(data.difficulty ?? 3),
    weight: data.weight !== undefined ? Number(data.weight) : null,
    archived: Boolean(data.archived ?? false),
    createdAt: data.created_at ?? data.createdAt ?? undefined,
    updatedAt: data.updated_at ?? data.updatedAt ?? undefined,
    hasExtraWork: Boolean(data.has_extra_work ?? data.hasExtraWork ?? false),
    assignments: Array.isArray(data.assignments)
      ? data.assignments.map((assignment: any) => ({
          id: assignment.id ?? Date.now(),
          userId: assignment.user_id ?? assignment.userId ?? 0,
          subjectId: assignment.subject_id ?? assignment.subjectId ?? null,
          type: 'assignment',
          title: assignment.title ?? '',
          description: assignment.description ?? null,
          dueAt: assignment.due_at ?? assignment.dueAt ?? null,
          estimatedMin:
            assignment.estimated_min ?? assignment.estimatedMin ?? null,
          status: assignment.status ?? 'todo',
          createdAt: assignment.created_at ?? assignment.createdAt ?? new Date().toISOString(),
          updatedAt: assignment.updated_at ?? assignment.updatedAt ?? new Date().toISOString(),
        }))
      : undefined,
  };
}

function extractArray<T>(payload: any): T[] {
  if (Array.isArray(payload)) {
    if (payload.length > 0 && isSubjectLike(payload[0])) {
      return payload.map((item: any) => {
        try {
          return normalizeSubject(item) as T;
        } catch {
          return item as T;
        }
      });
    }
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const candidates = [
      (payload as any).items,
      (payload as any).data,
      (payload as any).result,
      (payload as any).results,
      (payload as any).subjects,
      (payload as any).list,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        if (candidate.length > 0 && isSubjectLike(candidate[0])) {
          return candidate.map((item: any) => {
            try {
              return normalizeSubject(item) as T;
            } catch {
              return item as T;
            }
          });
        }
        return candidate as T[];
      }
    }
  }

  return [];
}

function extractEntity<T>(payload: any): T | null {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload)) {
    const first = payload[0];
    if (first && isSubjectLike(first)) {
      try {
        return normalizeSubject(first) as T;
      } catch {
        return (first as T) ?? null;
      }
    }
    return (first as T) ?? null;
  }

  if (payload && typeof payload === 'object') {
    const candidates = [
      payload,
      (payload as any).data,
      (payload as any).result,
      (payload as any).subject,
      (payload as any).item,
      (payload as any).value,
    ];

    for (const candidate of candidates) {
      if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
        if (isSubjectLike(candidate)) {
          try {
            return normalizeSubject(candidate) as T;
          } catch {
            return candidate as T;
          }
        }

        const candidateKeys = Object.keys(candidate);
        const hasNestedObject = candidateKeys.some(
          (key) => candidate[key] && typeof candidate[key] === 'object'
        );
        if (hasNestedObject) {
          continue;
        }

        return candidate as T;
      }
    }
  }

  return null;
}

async function requestTokenRefresh(): Promise<boolean> {
  if (!API_BASE_URL) {
    return false;
  }

  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return false;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('토큰 갱신에 실패했습니다.');
      }

      const text = await response.text();
      let data: any = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      }
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = extractTokens(data);
      if (!newAccessToken) {
        throw new Error('갱신된 토큰이 응답에 포함되어 있지 않습니다.');
      }
      updateStoredTokens(newAccessToken ?? null, newRefreshToken ?? refreshToken);
      return true;
    })()
      .catch(() => {
        clearStoredTokens();
        return false;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// ========== HTTP Client ==========
async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    skipAuth = false,
    retry = true,
    headers,
    body,
    credentials,
    ...rest
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const requestHeaders = new Headers(headers ?? {});

  const shouldAttachContentType =
    !(body instanceof FormData) &&
    !(requestHeaders.has('Content-Type'));

  if (shouldAttachContentType) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const accessToken = getStoredAccessToken();
    if (accessToken) {
      requestHeaders.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(url, {
    ...rest,
    body,
    credentials: credentials ?? 'include',
    headers: requestHeaders,
    cache: rest.cache ?? 'no-store',
  });

  if (response.status === 401 && !skipAuth && retry) {
    const refreshed = await requestTokenRefresh();
    if (refreshed) {
      return apiRequest<T>(endpoint, { ...options, retry: false });
    }
  }

  const text = await response.text();
  let payload: any = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const errorMessage =
      (payload && typeof payload === 'object' && 'message' in payload && (payload as any).message) ||
      `HTTP Error: ${response.status}`;
    throw new Error(errorMessage as string);
  }

  return payload as T;
}

// ========== Mock Data (개발용) ==========
let mockCurrentUser: User = {
  id: '1',
  email: 'student@example.com',
  name: '김학생',
  nickname: null,
  grade: null,
  gender: null,
  isCompleted: false,
};

let mockDailyAllocation: DailyAllocation | null = null;

let mockSubjects: Subject[] = [
  {
    id: 'sub1',
    userId: mockCurrentUser.id,
    name: '자료구조',
    color: '#3B82F6',
    targetDailyMin: 60,
    targetWeeklyMin: 420,
    credit: 3,
    difficulty: 4,
    weight: 1.15,
    archived: false,
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2025-11-10T00:00:00Z',
    hasExtraWork: true,
  },
  {
    id: 'sub2',
    userId: mockCurrentUser.id,
    name: '알고리즘',
    color: '#10B981',
    targetDailyMin: 45,
    targetWeeklyMin: 315,
    credit: 3,
    difficulty: 5,
    weight: 1.3,
    archived: false,
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2025-11-10T00:00:00Z',
    hasExtraWork: true,
  },
  {
    id: 'sub3',
    userId: mockCurrentUser.id,
    name: '운영체제',
    color: '#F59E0B',
    targetDailyMin: 30,
    targetWeeklyMin: 210,
    credit: 3,
    difficulty: 3,
    weight: 1.0,
    archived: false,
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2025-11-10T00:00:00Z',
    hasExtraWork: false,
  },
  {
    id: 'sub4',
    userId: mockCurrentUser.id,
    name: '데이터베이스',
    color: '#8B5CF6',
    targetDailyMin: 40,
    targetWeeklyMin: 280,
    credit: 3,
    difficulty: 3,
    weight: 1.1,
    archived: false,
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2025-11-10T00:00:00Z',
    hasExtraWork: true,
  },
];

let mockSessions: Session[] = [
  // 2025-11-10 (오늘)
  {
    id: 'ses1',
    subjectId: 'sub1',
    startTime: '2025-11-10T09:00:00',
    endTime: '2025-11-10T11:30:00',
    duration: 150,
    status: 'completed'
  },
  {
    id: 'ses2',
    subjectId: 'sub2',
    startTime: '2025-11-10T14:00:00',
    endTime: '2025-11-10T16:00:00',
    duration: 120,
    status: 'completed'
  },
  {
    id: 'ses3',
    subjectId: 'sub4',
    startTime: '2025-11-10T16:30:00',
    endTime: '2025-11-10T18:00:00',
    duration: 90,
    status: 'completed'
  },
  // 2025-11-09 (어제)
  {
    id: 'ses4',
    subjectId: 'sub1',
    startTime: '2025-11-09T10:00:00',
    endTime: '2025-11-09T12:30:00',
    duration: 150,
    status: 'completed'
  },
  {
    id: 'ses5',
    subjectId: 'sub3',
    startTime: '2025-11-09T14:00:00',
    endTime: '2025-11-09T16:00:00',
    duration: 120,
    status: 'completed'
  },
  {
    id: 'ses6',
    subjectId: 'sub2',
    startTime: '2025-11-09T17:00:00',
    endTime: '2025-11-09T18:30:00',
    duration: 90,
    status: 'completed'
  },
  // 2025-11-08
  {
    id: 'ses7',
    subjectId: 'sub2',
    startTime: '2025-11-08T09:00:00',
    endTime: '2025-11-08T11:00:00',
    duration: 120,
    status: 'completed'
  },
  {
    id: 'ses8',
    subjectId: 'sub4',
    startTime: '2025-11-08T13:00:00',
    endTime: '2025-11-08T15:30:00',
    duration: 150,
    status: 'completed'
  },
  // 2025-11-07
  {
    id: 'ses9',
    subjectId: 'sub1',
    startTime: '2025-11-07T10:00:00',
    endTime: '2025-11-07T12:00:00',
    duration: 120,
    status: 'completed'
  },
  {
    id: 'ses10',
    subjectId: 'sub3',
    startTime: '2025-11-07T14:00:00',
    endTime: '2025-11-07T16:30:00',
    duration: 150,
    status: 'completed'
  },
  // 2025-11-06
  {
    id: 'ses11',
    subjectId: 'sub2',
    startTime: '2025-11-06T09:00:00',
    endTime: '2025-11-06T11:30:00',
    duration: 150,
    status: 'completed'
  },
  {
    id: 'ses12',
    subjectId: 'sub4',
    startTime: '2025-11-06T15:00:00',
    endTime: '2025-11-06T16:30:00',
    duration: 90,
    status: 'completed'
  },
  // 2025-11-05
  {
    id: 'ses13',
    subjectId: 'sub1',
    startTime: '2025-11-05T10:00:00',
    endTime: '2025-11-05T12:30:00',
    duration: 150,
    status: 'completed'
  },
  {
    id: 'ses14',
    subjectId: 'sub3',
    startTime: '2025-11-05T14:00:00',
    endTime: '2025-11-05T16:00:00',
    duration: 120,
    status: 'completed'
  },
  {
    id: 'ses15',
    subjectId: 'sub2',
    startTime: '2025-11-05T17:00:00',
    endTime: '2025-11-05T18:00:00',
    duration: 60,
    status: 'completed'
  },
  // 2025-11-04
  {
    id: 'ses16',
    subjectId: 'sub4',
    startTime: '2025-11-04T09:00:00',
    endTime: '2025-11-04T11:00:00',
    duration: 120,
    status: 'completed'
  },
  {
    id: 'ses17',
    subjectId: 'sub1',
    startTime: '2025-11-04T13:00:00',
    endTime: '2025-11-04T15:30:00',
    duration: 150,
    status: 'completed'
  },
  {
    id: 'ses18',
    subjectId: 'sub3',
    startTime: '2025-11-04T16:00:00',
    endTime: '2025-11-04T17:30:00',
    duration: 90,
    status: 'completed'
  }
];

let mockActiveSession: Session | null = null;

let mockFriends: Friend[] = [
  { id: 'f1', userId: 'alice', nickname: '앨리스', totalStudyMinutes: 1230 },
  { id: 'f2', userId: 'bob', nickname: '밥', totalStudyMinutes: 980 },
  { id: 'f3', userId: 'charlie', nickname: '찰리', totalStudyMinutes: 760 },
  { id: 'f4', userId: 'david', nickname: '데이비드', totalStudyMinutes: 540 },
];

let mockNotifications: Notification[] = [
  { id: 'n1', type: 'friend_request', title: '친구 요청', message: '밥이 친구가 되기를 원해요', createdAt: new Date().toISOString(), read: false },
  { id: 'n2', type: 'achievement', title: '배지 획득', message: '연속 3일 학습 달성!', createdAt: new Date(Date.now() - 3600_000).toISOString(), read: false },
  { id: 'n3', type: 'reminder', title: '학습 리마인더', message: '오늘 학습을 시작해보세요', createdAt: new Date(Date.now() - 86400_000).toISOString(), read: true },
];
let mockTasks: Assignment[] = [
  {
    id: 1,
    userId: 1,
    subjectId: 1,
    type: 'assignment',
    title: '이진 트리 구현 과제',
    description: null,
    dueAt: '2025-11-15T00:00:00Z',
    estimatedMin: 120,
    status: 'todo',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-01T00:00:00Z',
  },
  {
    id: 2,
    userId: 1,
    subjectId: 2,
    type: 'assignment',
    title: '동적 프로그래밍 과제',
    description: '메모이제이션과 탑다운 비교',
    dueAt: '2025-11-20T23:59:59Z',
    estimatedMin: 150,
    status: 'in_progress',
    createdAt: '2025-11-03T00:00:00Z',
    updatedAt: '2025-11-08T00:00:00Z',
  },
];

const MOCK_ACCESS_TOKEN = 'mock-access-token';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token';

function buildMockAuthPayload(user: User) {
  return {
    user,
    accessToken: MOCK_ACCESS_TOKEN,
    refreshToken: MOCK_REFRESH_TOKEN,
  };
}

async function mockSignupImpl(name: string, email: string, password: string): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (name && email && password) {
    mockCurrentUser = {
      id: String(Date.now()),
      email,
      name,
      nickname: null,
      grade: null,
      gender: null,
      isCompleted: false,
    };
    return processAuthPayload(buildMockAuthPayload(mockCurrentUser));
  }
  throw new Error('Invalid signup data');
}

async function mockRegisterImpl(data: { name: string; email: string; password: string }): Promise<User> {
  return mockSignupImpl(data.name, data.email, data.password);
}

async function realLoginImpl(email: string, password: string): Promise<User> {
  const payload = await apiRequest<any>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
    retry: false,
  });
  return processAuthPayload(payload);
}

async function realRegisterImpl(data: { name: string; email: string; password: string }): Promise<User> {
  const payload = await apiRequest<any>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
    retry: false,
  });
  return processAuthPayload(payload);
}

// ========== Mock API Functions ==========
const mockApi = {
  getMe: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return normalizeUser({ ...mockCurrentUser });
  },

  // 친구/알림 (Mock)
  getFriends: async (): Promise<Friend[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...mockFriends].sort((a, b) => b.totalStudyMinutes - a.totalStudyMinutes);
  },

  // 사용자 검색 (친구 추가용)
  searchUsers: async (query: string): Promise<Array<{ userId: string; nickname: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    // 간단 Mock: query 포함하는 사용자
    const pool = [
      { userId: 'alice', nickname: '앨리스' },
      { userId: 'bob', nickname: '밥' },
      { userId: 'charlie', nickname: '찰리' },
      { userId: 'david', nickname: '데이비드' },
    ];
    return pool.filter(u => u.userId.includes(query) || u.nickname.includes(query));
  },

  // 친구 요청 보내기
  sendFriendRequest: async (toUserId: string): Promise<{ requestId: string }> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    return { requestId: `req_${Date.now()}` };
  },

  // 받은/보낸 요청 목록
  getIncomingFriendRequests: async (): Promise<Array<{ id: string; fromUserId: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [];
  },
  getOutgoingFriendRequests: async (): Promise<Array<{ id: string; toUserId: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [];
  },

  // 친구 요청 수락/거절/취소
  respondFriendRequest: async (requestId: string, action: 'accept' | 'reject' | 'cancel'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return;
  },

  // 친구 삭제
  deleteFriend: async (friendUserId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    mockFriends = mockFriends.filter(f => f.userId !== friendUserId);
  },

  // 친구 프로필 조회
  getFriendProfile: async (friendUserId: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Mock: 친구 목록에서 찾거나 기본 사용자 반환
    const friend = mockFriends.find(f => f.userId === friendUserId);
    if (friend) {
      return normalizeUser({
        id: friend.userId,
        email: `${friend.userId}@example.com`,
        nickname: friend.nickname,
        name: friend.nickname,
        grade: null,
        gender: null,
        isCompleted: true,
      });
    }
    return normalizeUser({ ...mockCurrentUser });
  },

  // 친구 과목 목록 조회
  getFriendSubjects: async (friendUserId: string): Promise<Subject[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Mock: 친구의 과목은 현재 사용자 과목과 동일하게 반환 (실제로는 별도 데이터 필요)
    return mockSubjects.filter(s => !s.archived);
  },

  // 친구 세션 목록 조회 (하루)
  getFriendSessions: async (friendUserId: string, date?: string): Promise<Session[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    let filtered = [...mockSessions];
    if (date) {
      filtered = filtered.filter(s => s.startTime.startsWith(date));
    }
    return filtered;
  },

  getNotifications: async (): Promise<Notification[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    // 최신순
    return [...mockNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    mockNotifications = mockNotifications.map(n => n.id === id ? { ...n, read: true } : n);
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    mockNotifications = mockNotifications.map(n => ({ ...n, read: true }));
  },

  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (email && password) {
      return processAuthPayload(buildMockAuthPayload(mockCurrentUser));
    }
    throw new Error('Invalid credentials');
  },

  signup: mockSignupImpl,

  register: mockRegisterImpl,

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    clearStoredTokens();
  },

  updateProfile: async (data: { nickname: string; grade?: number; gender?: 'male' | 'female'; isCompleted?: boolean }): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    mockCurrentUser = {
      ...mockCurrentUser,
      nickname: data.nickname,
      grade: typeof data.grade === 'number' ? data.grade : mockCurrentUser.grade ?? null,
      gender:
        data.gender !== undefined
          ? data.gender === 'female'
            ? 'Female'
            : 'Male'
          : mockCurrentUser.gender ?? null,
      isCompleted: data.isCompleted !== undefined ? data.isCompleted : true,
    };
    return normalizeUser({ ...mockCurrentUser });
  },

  getSubjects: async (includeArchived = false): Promise<Subject[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const list = includeArchived
      ? mockSubjects
      : mockSubjects.filter(s => !s.archived);

    return list.map(subject => ({
      ...subject,
      assignments: mockTasks.filter(task =>
        task.subjectId !== null && String(task.subjectId) === String(subject.id)
      ),
      hasExtraWork: mockTasks.some(task =>
        task.subjectId !== null && String(task.subjectId) === String(subject.id)
      ),
    }));
  },

  getSubject: async (subjectId: string): Promise<Subject | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const subject = mockSubjects.find(s => s.id === subjectId);
    if (!subject) return null;

    const assignmentsForSubject = mockTasks.filter(task =>
      task.subjectId !== null && String(task.subjectId) === String(subjectId)
    );

    return {
      ...subject,
      assignments: assignmentsForSubject,
      hasExtraWork: assignmentsForSubject.length > 0,
    };
  },

  createSubject: async (data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'targetWeeklyMin'> & { targetDailyMin: number; credit?: number | null }) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const now = new Date().toISOString();
    const newSubject: Subject = {
      id: String(Date.now()),
      userId: mockCurrentUser.id,
      name: data.name,
      color: data.color ?? null,
      targetDailyMin: data.targetDailyMin ?? 0,
      targetWeeklyMin: (data.targetDailyMin ?? 0) * 7,
      credit: data.credit ?? null,
      difficulty: data.difficulty,
      weight: data.weight ?? 1,
      archived: false,
      createdAt: now,
      updatedAt: now,
    };
    mockSubjects.push(newSubject);
    return newSubject;
  },

  updateSubject: async (subjectId: string, data: Partial<Subject>): Promise<Subject> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockSubjects.findIndex(s => s.id === subjectId);
    if (index === -1) throw new Error('Subject not found');
    
    const current = mockSubjects[index];
    const updated: Subject = {
      ...current,
      name: data.name ?? current.name,
      color: data.color ?? current.color,
      targetDailyMin: data.targetDailyMin ?? current.targetDailyMin,
      targetWeeklyMin: data.targetDailyMin !== undefined ? data.targetDailyMin * 7 : current.targetWeeklyMin,
      credit: data.credit !== undefined ? data.credit : current.credit,
      difficulty: data.difficulty ?? current.difficulty,
      weight: data.weight ?? current.weight,
      archived: data.archived ?? current.archived,
      updatedAt: new Date().toISOString(),
    };

    mockSubjects[index] = updated;
    return updated;
  },

  deleteSubject: async (subjectId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    mockSubjects = mockSubjects.filter(s => s.id !== subjectId);
  },

  archiveSubject: async (subjectId: string): Promise<Subject> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockSubjects.findIndex(s => s.id === subjectId);
    if (index === -1) throw new Error('Subject not found');
    
    mockSubjects[index].archived = true;
    return mockSubjects[index];
  },

  getSessions: async (filters?: {
    from?: string;
    to?: string;
    subjectId?: string;
    status?: string;
  }): Promise<Session[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    let filtered = [...mockSessions];
    
    if (filters?.subjectId) {
      filtered = filtered.filter(s => s.subjectId === filters.subjectId);
    }
    if (filters?.from) {
      filtered = filtered.filter(s => s.startTime >= filters.from!);
    }
    if (filters?.to) {
      filtered = filtered.filter(s => s.startTime <= filters.to!);
    }
    if (filters?.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    
    return filtered;
  },

  startSession: async (subjectId: string): Promise<Session> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newSession: Session = {
      id: `ses${Date.now()}`,
      subjectId,
      startTime: new Date().toISOString(),
      duration: 0,
      status: 'active'
    };
    mockSessions.push(newSession);
    mockActiveSession = newSession;
    return newSession;
  },

  stopSession: async (sessionId: string): Promise<Session> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const session = mockSessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');
    
    const endTime = new Date();
    const startTime = new Date(session.startTime);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);
    
    session.endTime = endTime.toISOString();
    session.duration = duration;
    session.status = 'completed';
    mockActiveSession = null;
    
    return session;
  },

  // 세션 노트 업데이트
  updateSessionNote: async (sessionId: string, note: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const session = mockSessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');
    // Mock에서는 노트 업데이트 로직이 필요없지만 일관성을 위해 함수 제공
    console.log(`Updating note for session ${sessionId}: ${note}`);
  },

  createManualSession: async (data: {
    subjectId: string;
    startTime: string;
    endTime: string;
  }): Promise<Session> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
    
    const newSession: Session = {
      id: `ses${Date.now()}`,
      subjectId: data.subjectId,
      startTime: data.startTime,
      endTime: data.endTime,
      duration,
      status: 'manual'
    };
    mockSessions.push(newSession);
    return newSession;
  },

  getActiveSession: (): Session | null => {
    return mockActiveSession;
  },

  getLatestSession: async (subjectId: string): Promise<Session | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const sessions = mockSessions.filter(s => s.subjectId === subjectId);
    if (sessions.length === 0) return null;
    
    return sessions.reduce((latest, current) => 
      new Date(current.startTime) > new Date(latest.startTime) ? current : latest
    );
  },

  getDailyReport: async (date: string): Promise<DailyReport> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const sessions = mockSessions.filter(s => 
      s.startTime.startsWith(date) && s.status === 'completed'
    );
    
    const subjectMap = new Map<string, number>();
    sessions.forEach(s => {
      const current = subjectMap.get(s.subjectId) || 0;
      subjectMap.set(s.subjectId, current + s.duration);
    });
    
    const subjects = Array.from(subjectMap.entries()).map(([subjectId, minutes]) => {
      const subject = mockSubjects.find(s => s.id === subjectId);
      return {
        subjectId,
        subjectName: subject?.name || 'Unknown',
        color: subject?.color || '#000000',
        minutes
      };
    });
    
    const totalMinutes = subjects.reduce((sum, s) => sum + s.minutes, 0);
    
    return { date, totalMinutes, subjects };
  },

  getWeeklyReport: async (weekStart: string): Promise<WeeklyReport> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    
    const sessions = mockSessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= start && sessionDate < end && s.status === 'completed';
    });
    
    const subjectMap = new Map<string, number>();
    sessions.forEach(s => {
      const current = subjectMap.get(s.subjectId) || 0;
      subjectMap.set(s.subjectId, current + s.duration);
    });
    
    const subjects = Array.from(subjectMap.entries()).map(([subjectId, minutes]) => {
      const subject = mockSubjects.find(s => s.id === subjectId);
      return {
        subjectId,
        subjectName: subject?.name || 'Unknown',
        color: subject?.color || '#000000',
        minutes,
        targetMinutes: subject?.targetWeeklyMin || 0
      };
    });
    
    const dailyBreakdown: { date: string; minutes: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySessions = sessions.filter(s => s.startTime.startsWith(dateStr));
      const minutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
      
      dailyBreakdown.push({ date: dateStr, minutes });
    }
    
    const totalMinutes = subjects.reduce((sum, s) => sum + s.minutes, 0);
    
    return {
      weekStart,
      weekEnd: end.toISOString().split('T')[0],
      totalMinutes,
      subjects,
      dailyBreakdown
    };
  },

  // 일일 시간 분배
  createDailyAllocation: async (totalAvailableMinutes: number): Promise<DailyAllocation> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const today = new Date().toISOString().split('T')[0];
    
    // 활성 과목만 가져오기
    const activeSubjects = mockSubjects.filter(s => !s.archived);
    
    // 각 과목의 가중치 계산
    const subjectsWithWeight = activeSubjects.map(subject => {
      const baseWeight = (subject.weight ?? 1) * subject.difficulty;
      const finalWeight = subject.hasExtraWork ? baseWeight * 1.3 : baseWeight;
      return { ...subject, finalWeight };
    });
    
    // 전체 가중치 합계
    const totalWeight = subjectsWithWeight.reduce((sum, s) => sum + s.finalWeight, 0);
    
    // 각 과목에 시간 분배
    const subjects = subjectsWithWeight.map(subject => ({
      subjectId: subject.id,
      allocatedMinutes: Math.round((subject.finalWeight / totalWeight) * totalAvailableMinutes)
    }));
    
    mockDailyAllocation = {
      date: today,
      totalAvailableMinutes,
      subjects
    };
    
    // 각 과목의 targetDailyMin 업데이트
    subjects.forEach(({ subjectId, allocatedMinutes }) => {
      const subject = mockSubjects.find(s => s.id === subjectId);
      if (subject) {
        subject.targetDailyMin = allocatedMinutes;
      }
    });
    
    return mockDailyAllocation;
  },

  getDailyAllocation: async (): Promise<DailyAllocation | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const today = new Date().toISOString().split('T')[0];
    
    // 오늘 날짜의 allocation이면 반환, 아니면 null
    if (mockDailyAllocation && mockDailyAllocation.date === today) {
      return mockDailyAllocation;
    }
    return null;
  },

  // 오늘의 분배 추천
  getTodayRecommendation: async (): Promise<DailyAllocation> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const today = new Date().toISOString().split('T')[0];
    
    // 활성 과목만 가져오기
    const activeSubjects = mockSubjects.filter(s => !s.archived);
    
    if (activeSubjects.length === 0) {
      throw new Error('분배할 과목이 없습니다');
    }
    
    // 각 과목의 가중치 계산
    const subjectsWithWeight = activeSubjects.map(subject => {
      const baseWeight = (subject.weight ?? 1) * subject.difficulty;
      const finalWeight = subject.hasExtraWork ? baseWeight * 1.3 : baseWeight;
      return { ...subject, finalWeight };
    });
    
    // 전체 가중치 합계
    const totalWeight = subjectsWithWeight.reduce((sum, s) => sum + s.finalWeight, 0);
    
    // 기본 추천 시간: 각 과목의 targetDailyMin 합계 또는 180분 중 큰 값
    const totalTargetMinutes = activeSubjects.reduce((sum, s) => sum + (s.targetDailyMin || 0), 0);
    const recommendedMinutes = Math.max(totalTargetMinutes, 180);
    
    // 각 과목에 시간 분배
    const subjects = subjectsWithWeight.map(subject => ({
      subjectId: subject.id,
      allocatedMinutes: Math.round((subject.finalWeight / totalWeight) * recommendedMinutes)
    }));
    
    return {
      date: today,
      totalAvailableMinutes: recommendedMinutes,
      subjects
    };
  },

  // 일일 목표 총 공부 시간 설정
  updateDailyTarget: async (totalAvailableMinutes: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock API에서는 단순히 성공 처리
    console.log('Mock: Daily target updated to', totalAvailableMinutes, 'minutes');
  },

  // ========== 과제 관련 API ==========
  
  // 과제 생성
  createTask: async (data: {
    subjectId: number;
    type: 'assignment';
    title: string;
    description?: string | null;
    dueAt?: string | null;
    estimatedMin?: number | null;
  }): Promise<Assignment> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newTask: Assignment = {
      id: Date.now(),
      userId: 1,
      subjectId: data.subjectId,
      type: 'assignment',
      title: data.title,
      description: data.description ?? null,
      dueAt: data.dueAt ?? null,
      estimatedMin: data.estimatedMin ?? null,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockTasks.push(newTask);
    return newTask;
  },

  // 과제 목록 조회
  getTasks: async (filters?: { subjectId?: number }): Promise<Assignment[]> => {
    const subjectIdValue = filters?.subjectId;
    await new Promise(resolve => setTimeout(resolve, 100));
 
    if (subjectIdValue !== undefined) {
      return mockTasks.filter(task =>
        task.subjectId !== null && String(task.subjectId) === String(subjectIdValue)
      );
    }
 
    return mockTasks;
  },

  // 과제 단건 조회
  getTask: async (taskId: number): Promise<Assignment> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const task = mockTasks.find(a => a.id === taskId);
    if (task) {
      return task;
    }
    throw new Error('Task not found');
  },

  // 과제 정보 수정
  updateTask: async (taskId: number, data: Partial<Assignment>): Promise<Assignment> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const taskIndex = mockTasks.findIndex(a => a.id === taskId);
    if (taskIndex !== -1) {
      const existing = mockTasks[taskIndex];
      const updatedTask: Assignment = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      mockTasks[taskIndex] = updatedTask;
      return updatedTask;
    }
    
    throw new Error('Task not found');
  },

  // 과제 삭제
  deleteTask: async (taskId: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = mockTasks.findIndex(a => a.id === taskId);
    if (index !== -1) {
      mockTasks.splice(index, 1);
      return;
    }

    throw new Error('Task not found');
  }
};

// ========== Real API Functions ==========
const realApi = {
  getMe: async (): Promise<User> => {
    const payload = await apiRequest<any>('/api/user/me', {
      method: 'GET',
    });
    return normalizeUser(payload);
  },

  // 친구/알림 (Real)
  searchUsers: async (query: string): Promise<Array<{ id: number; userId: string; nickname: string }>> => {
    // 서버 DTO: { keyword } → GET 쿼리 키는 keyword로 사용
    const payload = await apiRequest<any>(`/api/users/search?keyword=${encodeURIComponent(query)}`, { method: 'GET' });
    // 다양한 래핑 형태 지원
    const candidates = [
      payload,
      payload?.data,
      payload?.result,
      payload?.results,
      payload?.users,
      payload?.data?.users,
      payload?.result?.users,
      payload?.items,
      payload?.list,
    ];
    let list: any[] = [];
    for (const c of candidates) {
      if (Array.isArray(c)) {
        list = c;
        break;
      }
    }
    return list.map((u: any) => ({
      id: Number(u.id ?? u.user_id ?? u.userId ?? 0),
      userId: String(u.user_id ?? u.userId ?? u.username ?? ''),
      nickname: u.nickname ?? u.name ?? u.displayName ?? u.userId ?? '',
    }));
  },

  sendFriendRequest: async (toUserId: string): Promise<{ requestId: string }> => {
    const payload = await apiRequest<any>('/api/friends/requests', {
      method: 'POST',
      // 서버 DTO: { target_user_id } (number). currentUserId는 서버에서 인증으로 주입됨
      body: JSON.stringify({
        target_user_id: Number(toUserId),
      }),
    });
    const req = payload.request || payload.data || payload;
    return { requestId: String(req.id ?? req.request_id ?? '') };
  },

  getIncomingFriendRequests: async (): Promise<Array<{ id: string; fromUserId: string }>> => {
    const payload = await apiRequest<any>('/api/friends/requests/incoming', { method: 'GET' });
    const list =
      (payload && (payload.requests || payload.data?.requests || payload.result?.requests)) ||
      payload?.items ||
      payload?.data ||
      payload?.result ||
      (Array.isArray(payload) ? payload : []);
    return (Array.isArray(list) ? list : []).map((r: any) => ({
      id: String(r.id ?? ''),
      fromUserId: String(
        r.from_user_id ??
          r.fromUserId ??
          r.from_user?.id ??
          r.fromUser?.id ??
          ''
      ),
    }));
  },

  getOutgoingFriendRequests: async (): Promise<Array<{ id: string; toUserId: string }>> => {
    const payload = await apiRequest<any>('/api/friends/requests/outgoing', { method: 'GET' });
    const list =
      (payload && (payload.requests || payload.data?.requests || payload.result?.requests)) ||
      payload?.items ||
      payload?.data ||
      payload?.result ||
      (Array.isArray(payload) ? payload : []);
    return (Array.isArray(list) ? list : []).map((r: any) => ({
      id: String(r.id ?? ''),
      toUserId: String(
        r.to_user_id ??
          r.toUserId ??
          r.to_user?.id ??
          r.toUser?.id ??
          ''
      ),
    }));
  },

  respondFriendRequest: async (requestId: string, action: 'accept' | 'reject' | 'cancel'): Promise<void> => {
    await apiRequest(`/api/friends/requests/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    });
  },

  getFriends: async (): Promise<Friend[]> => {
    const payload = await apiRequest<any>('/api/friends', { method: 'GET' });
    // 백엔드 응답: { ok: true, friends: [{ id, friend_user: { id, nickname, ... }, created_at }] }
    const list =
      (payload && (payload.friends || payload.data?.friends || payload.result?.friends)) ||
      payload?.items ||
      payload?.data ||
      payload?.result ||
      (Array.isArray(payload) ? payload : []);
    return (Array.isArray(list) ? list : []).map((f: any) => {
      const u = f.friend_user || f.friendUser || {};
      return {
        id: String(f.id ?? f.friend_id ?? `${u.id ?? ''}`),
        userId: String(u.id ?? f.user_id ?? f.userId ?? ''),
        nickname: u.nickname ?? u.name ?? u.userId ?? '',
        totalStudyMinutes: Number(f.total_study_min ?? f.totalStudyMinutes ?? 0),
      };
    });
  },

  deleteFriend: async (friendUserId: string): Promise<void> => {
    await apiRequest(`/api/friends/${friendUserId}`, { method: 'DELETE' });
  },

  // 친구 프로필 조회
  getFriendProfile: async (friendUserId: string): Promise<User> => {
    const payload = await apiRequest<any>(`/api/friends/${friendUserId}/profile`, { method: 'GET' });
    return normalizeUser(payload);
  },

  // 친구 과목 목록 조회
  getFriendSubjects: async (friendUserId: string): Promise<Subject[]> => {
    const payload = await apiRequest<any>(`/api/friends/${friendUserId}/subjects`, { method: 'GET' });
    return extractArray<Subject>(payload);
  },

  // 친구 세션 목록 조회 (하루)
  getFriendSessions: async (friendUserId: string, date?: string): Promise<Session[]> => {
    const params = new URLSearchParams();
    if (date) {
      params.append('date', date);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const payload = await apiRequest<any>(`/api/friends/${friendUserId}/sessions${query}`, { method: 'GET' });
    const sessions = payload.sessions || payload.items || payload.data?.sessions || payload.data?.items || payload.result?.sessions || payload.result?.items || (Array.isArray(payload) ? payload : []);
    return sessions.map((s: any) => normalizeSession(s));
  },

  getNotifications: async (): Promise<Notification[]> => {
    const payload = await apiRequest<any>('/api/notifications', { method: 'GET' });
    const list = Array.isArray(payload) ? payload : payload.items || payload.data || payload.result || [];
    return list.map((n: any) => ({
      id: String(n.id ?? ''),
      type: (n.type ?? 'other') as Notification['type'],
      title: n.title ?? '',
      message: n.message ?? '',
      createdAt: n.created_at ?? n.createdAt ?? new Date().toISOString(),
      read: Boolean(n.read ?? false),
    }));
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    await apiRequest(`/api/notifications/${id}/read`, { method: 'POST' });
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    await apiRequest('/api/notifications/read-all', { method: 'POST' });
  },

  login: realLoginImpl,

  signup: async (nickname: string, email: string, password: string): Promise<User> => {
    return realRegisterImpl({ name: nickname, email, password });
  },

  register: realRegisterImpl,

  logout: async (): Promise<void> => {
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
        skipAuth: false,
        retry: false,
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    clearStoredTokens();
  },

  updateProfile: async (data: { nickname: string; grade?: number; gender?: 'male' | 'female'; isCompleted?: boolean }): Promise<User> => {
    const normalizedGender =
      data.gender !== undefined
        ? data.gender === 'female'
          ? 'Female'
          : 'Male'
        : undefined;
    const payload = await apiRequest<any>('/api/user/me', {
      method: 'PATCH',
      body: JSON.stringify({
        nickname: data.nickname,
        grade: data.grade,
        gender: normalizedGender,
        is_completed: data.isCompleted,
      }),
    });
    const user = normalizeUser(payload);
    return user;
  },

  getSubjects: async (includeArchived = false): Promise<Subject[]> => {
    const query = '?includeArchived=true';
    const payload = await apiRequest<any>(`/api/subjects${query}`);
    return extractArray<Subject>(payload);
  },

  getSubject: async (subjectId: string): Promise<Subject | null> => {
    try {
      const payload = await apiRequest<any>(`/api/subjects/${subjectId}`);
      return extractEntity<Subject>(payload);
    } catch {
      return null;
    }
  },

  createSubject: async (data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'targetWeeklyMin'> & { targetDailyMin: number; credit?: number | null }) => {
    const payload = await apiRequest<any>('/api/subjects', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        color: data.color,
        target_daily_min: data.targetDailyMin ?? 0,
        credit: data.credit ?? null,
        difficulty: data.difficulty,
      })
    });
    const subject = extractEntity<Subject>(payload);
    if (!subject) {
      throw new Error('과목 생성에 실패했습니다.');
    }
    return subject;
  },
 
   updateSubject: async (subjectId: string, data: Partial<Subject>): Promise<Subject> => {
     const payload = await apiRequest<any>(`/api/subjects/${subjectId}`, {
       method: 'PATCH',
       body: JSON.stringify({
         name: data.name,
         color: data.color,
         target_daily_min:
           data.targetDailyMin !== undefined ? data.targetDailyMin : undefined,
         credit: data.credit,
         difficulty: data.difficulty,
         archived: data.archived,
       })
     });
     const subject = extractEntity<Subject>(payload);
     if (!subject) {
       throw new Error('과목 수정에 실패했습니다.');
     }
     return subject;
   },

  deleteSubject: async (subjectId: string): Promise<void> => {
    await apiRequest(`/api/subjects/${subjectId}`, {
      method: 'DELETE'
    });
  },

  archiveSubject: async (subjectId: string, archived: boolean = true): Promise<Subject> => {
    const payload = await apiRequest<any>(`/api/subjects/${subjectId}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({
        archived: archived
      })
    });
    const subject = extractEntity<Subject>(payload);
    if (!subject) {
      throw new Error(archived ? '과목 보관에 실패했습니다.' : '과목 복원에 실패했습니다.');
    }
    return subject;
  },

  getSessions: async (filters?: {
    from?: string;
    to?: string;
    subjectId?: string;
    status?: string;
    date?: string;
  }): Promise<Session[]> => {
    const params = new URLSearchParams();
    // 백엔드는 date 파라미터를 받음 (YYYY-MM-DD 형식)
    if (filters?.date) {
      params.append('date', filters.date);
    } else if (filters?.from) {
      // from이 있으면 날짜 부분만 추출 (YYYY-MM-DD)
      const dateStr = filters.from.split('T')[0];
      params.append('date', dateStr);
    }
    if (filters?.subjectId) {
      params.append('subjectId', filters.subjectId);
      params.append('subject_id', filters.subjectId);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const payload = await apiRequest<any>(`/api/sessions${query}`);
    
    // 백엔드 응답: { ok: true, sessions: [...] }
    const sessions = payload.sessions || payload.data?.sessions || payload.result?.sessions || (Array.isArray(payload) ? payload : []);
    return sessions.map((s: any) => normalizeSession(s));
  },

  startSession: async (subjectId: string): Promise<Session> => {
    const payload = await apiRequest<any>('/api/sessions/start', {
      method: 'POST',
      body: JSON.stringify({ subject_id: Number(subjectId) }),
    });
    return normalizeSession(payload.session || payload);
  },

  stopSession: async (sessionId: string): Promise<Session> => {
    const payload = await apiRequest<any>('/api/sessions/stop', {
      method: 'POST',
      body: JSON.stringify({ session_id: Number(sessionId) }),
    });
    return normalizeSession(payload.session || payload);
  },

  // 세션 노트 업데이트
  updateSessionNote: async (sessionId: string, note: string): Promise<void> => {
    await apiRequest(`/api/sessions/${sessionId}/note`, {
      method: 'PATCH',
      body: JSON.stringify({ note }),
    });
  },

  // ========== 과제 관련 API ==========
  
  // 과제 생성
  createTask: async (data: {
    subjectId: number;
    type: 'assignment';
    title: string;
    description?: string | null;
    dueAt?: string | null;
    estimatedMin?: number | null;
  }): Promise<Assignment> => {
    return apiRequest<Assignment>('/api/subject-tasks', {
      method: 'POST',
      body: JSON.stringify({
        subject_id: data.subjectId,
        type: data.type,
        title: data.title,
        description: data.description ?? undefined,
        due_at: data.dueAt ?? undefined,
        estimated_min: data.estimatedMin ?? undefined,
      }),
    });
  },

  // 과제 목록 조회
  getTasks: async (filters?: { subjectId?: number | string }): Promise<Assignment[]> => {
    const params = new URLSearchParams();
    if (filters?.subjectId !== undefined) {
      const value = String(filters.subjectId);
      params.append('subjectId', value);
      params.append('subject_id', value);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    const payload = await apiRequest<any>(`/api/subject-tasks${query}`);

    if (Array.isArray(payload)) {
      return payload.map(normalizeAssignment);
    }

    if (payload && typeof payload === 'object') {
      const candidates = [
        payload.items,
        payload.data,
        payload.result,
        payload.results,
        payload.tasks,
        payload.data?.tasks,
        payload.result?.tasks,
      ];

      for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
          return candidate.map(normalizeAssignment);
        }
      }
    }

    return [];
  },

  // 과제 단건 조회
  getTask: async (taskId: number): Promise<Assignment> => {
    const payload = await apiRequest<any>(`/api/subject-tasks/${taskId}`);
    return normalizeAssignment(payload);
  },

  // 과제 정보 수정
  updateTask: async (taskId: number, data: Partial<Assignment>): Promise<Assignment> => {
    const payload = await apiRequest<any>(`/api/subject-tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        subject_id: data.subjectId,
        title: data.title,
        description: data.description,
        due_at: data.dueAt,
        estimated_min: data.estimatedMin,
        status: data.status,
      }),
    });
    return normalizeAssignment(payload);
  },

  // 과제 삭제
  deleteTask: async (taskId: number): Promise<void> => {
    await apiRequest(`/api/subject-tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  createManualSession: async (data: {
    subjectId: string;
    startTime: string;
    endTime: string;
  }): Promise<Session> => {
    const payload = await apiRequest<any>('/api/sessions/manual', {
      method: 'POST',
      body: JSON.stringify({
        subject_id: Number(data.subjectId),
        start_at: data.startTime,
        end_at: data.endTime,
      }),
    });
    return normalizeSession(payload.session || payload);
  },

  getActiveSession: (): Session | null => {
    // 실시간 상태는 서버에서 푸시되지 않으므로 null 처리
    return null;
  },

  getLatestSession: async (subjectId: string): Promise<Session | null> => {
    try {
      const payload = await apiRequest<any>(`/api/sessions/${subjectId}/latest`);
      return extractEntity<Session>(payload);
    } catch {
      return null;
    }
  },

  getDailyReport: async (date: string): Promise<DailyReport> => {
    const payload = await apiRequest<any>(`/api/sessions/report/daily?date=${date}`);
    // 백엔드 응답: { ok: true, report: { date, total_duration_min, by_subject } }
    const data = payload.report || payload.data || payload;
    return {
      date: data.date || date,
      totalMinutes: data.total_duration_min || 0,
      subjects: (data.by_subject || []).map((s: any) => ({
        subjectId: String(s.subject_id || s.subjectId || ''),
        subjectName: s.subject_name || s.subjectName || '',
        color: s.color || '#3B82F6',
        minutes: s.duration_min || s.minutes || 0,
        startTime: s.start_at || s.startTime || undefined,
        endTime: s.end_at || s.endTime || undefined,
      })),
    };
  },

  getWeeklyReport: async (weekStart: string): Promise<WeeklyReport> => {
    const payload = await apiRequest<any>(`/api/sessions/report/weekly?week_start=${weekStart}`);
    // 백엔드 응답: { ok: true, report: { week_start, week_end, total_duration_min, by_subject, daily_breakdown } }
    const data = payload.report || payload.data || payload;
    
    // daily_breakdown이 없으면 각 날짜별로 일일 리포트를 호출해서 데이터 수집
    let dailyBreakdown = data.daily_breakdown || data.dailyBreakdown || [];
    
    // daily_breakdown이 배열이 아니거나 비어있으면, 각 날짜별로 일일 리포트 호출
    if (!Array.isArray(dailyBreakdown) || dailyBreakdown.length === 0) {
      const start = new Date(data.week_start || weekStart);
      dailyBreakdown = [];
      
      // 7일치 일일 리포트를 병렬로 호출
      const dailyPromises = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        dailyPromises.push(
          api.getDailyReport(dateStr).catch(() => ({
            date: dateStr,
            totalMinutes: 0,
            subjects: []
          }))
        );
      }
      
      const dailyReports = await Promise.all(dailyPromises);
      dailyBreakdown = dailyReports.map((report: DailyReport) => ({
        date: report.date,
        minutes: report.totalMinutes
      }));
    }
    
    return {
      weekStart: data.week_start || weekStart,
      weekEnd: data.week_end || '',
      totalMinutes: data.total_duration_min || 0,
      subjects: (data.by_subject || []).map((s: any) => ({
        subjectId: String(s.subject_id || s.subjectId || ''),
        subjectName: s.subject_name || s.subjectName || '',
        color: s.color || '#3B82F6',
        minutes: s.duration_min || s.minutes || 0,
        targetMinutes: s.target_minutes || s.targetMinutes || 0,
      })),
      dailyBreakdown: dailyBreakdown.map((d: any) => ({
        date: d.date || '',
        minutes: d.minutes || d.duration_min || 0,
      })),
    };
  },

  createDailyAllocation: async (totalAvailableMinutes: number): Promise<DailyAllocation> => {
    return apiRequest<DailyAllocation>('/api/allocations/daily', {
      method: 'POST',
      body: JSON.stringify({ totalAvailableMinutes }),
    });
  },

  getDailyAllocation: async (): Promise<DailyAllocation | null> => {
    try {
      return await apiRequest<DailyAllocation>('/api/allocations/daily');
    } catch {
      return null;
    }
  },

  // 오늘의 분배 추천
  getTodayRecommendation: async (): Promise<DailyAllocation> => {
    const payload = await apiRequest<any>('/api/sessions/recommend/today');
    // 백엔드 응답: { ok: true, recommendation: { today, daily_target_min, recommended: [{ subject_id, subject_name, weight, recommended_min }] } }
    const data = payload.recommendation || payload.data || payload;
    
    return {
      date: data.today || data.date || new Date().toISOString().split('T')[0],
      totalAvailableMinutes: data.daily_target_min || data.totalAvailableMinutes || 0,
      subjects: (data.recommended || []).map((item: any) => ({
        subjectId: String(item.subject_id || item.subjectId || ''),
        allocatedMinutes: item.recommended_min || item.allocatedMinutes || 0,
      })),
    };
  },

  // 일일 목표 총 공부 시간 설정
  updateDailyTarget: async (totalAvailableMinutes: number): Promise<void> => {
    await apiRequest('/api/sessions/daily-target', {
      method: 'PATCH',
      body: JSON.stringify({ 
        daily_target_min: totalAvailableMinutes
      }),
    });
  },
};

// ========== Export API ==========
export const api = USE_MOCK
  ? {
      ...mockApi,
      // getActiveSession은 실시간 상태 반환 (Mock만 지원)
      getActiveSession: () => mockActiveSession,
    }
  : {
      ...realApi,
      // Real API는 비동기 함수를 동기처럼 사용할 수 없으므로 항상 null 반환
      getActiveSession: () => null,
    };

export const isUsingMock = USE_MOCK;
export const apiBaseUrl = API_BASE_URL;