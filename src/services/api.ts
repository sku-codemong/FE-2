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
  profileImageUrl?: string | null;
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
  profileImageUrl?: string | null;
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
  | { type: 'friend:request:received'; fromUserId: string; fromUserNickname?: string; toUserId: string; requestId: string }
  | { type: 'friend:request:responded'; toUserId?: string; friendUserId?: string; fromUserId?: string; fromUserNickname?: string; requestId: string; result: 'accepted' | 'rejected' };

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
      const fromUser = req?.from_user ?? payload?.from_user ?? {};
      const toUser = req?.to_user ?? payload?.to_user ?? {};
      const event: FriendEventPayload = {
        type: 'friend:request:received',
        fromUserId: String(
          payload?.from_user_id ??
          payload?.fromUserId ??
          fromUser?.id ??
          ''
        ),
        fromUserNickname: fromUser?.nickname ?? fromUser?.name ?? fromUser?.userId ?? undefined,
        toUserId: String(
          payload?.to_user_id ??
          payload?.toUserId ??
          toUser?.id ??
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
      
      // 요청 보낸 사람 정보 추출 (from_user 객체에서 직접 추출)
      const fromUser = payload?.from_user ?? payload?.fromUser ?? req?.from_user ?? req?.fromUser ?? {};
      const fromUserIdRaw = fromUser?.id ?? payload?.from_user_id ?? payload?.fromUserId ?? req?.from_user_id ?? req?.fromUserId;
      const fromUserId = fromUserIdRaw ? String(fromUserIdRaw) : '';
      const fromUserNickname = fromUser?.nickname ?? fromUser?.name ?? fromUser?.userId ?? '';
      
      // 요청 받은 사람 정보 추출 (to_user 객체에서 직접 추출)
      const toUser = payload?.to_user ?? payload?.toUser ?? req?.to_user ?? req?.toUser ?? {};
      const toUserIdRaw = toUser?.id ?? payload?.to_user_id ?? payload?.toUserId ?? req?.to_user_id ?? req?.toUserId;
      const toUserId = toUserIdRaw ? String(toUserIdRaw) : '';
      
      const event: FriendEventPayload = {
        type: 'friend:request:responded',
        toUserId: toUserId || undefined,
        friendUserId: (payload?.friend?.id ?? req?.friend?.id ?? toUser?.id) !== undefined
          ? String(payload?.friend?.id ?? req?.friend?.id ?? toUser?.id)
          : undefined,
        fromUserId: fromUserId || undefined,
        fromUserNickname: fromUserNickname || undefined,
        requestId: String(
          payload?.request_id ??
          payload?.requestId ??
          req?.id ??
          ''
        ),
        result: (isAccepted ? 'accepted' : 'rejected'),
      };
      
      console.log('[WebSocket] friend:request:responded event:', {
        payload,
        fromUser,
        fromUserId,
        fromUserNickname,
        toUser,
        toUserId,
        event,
      });
      
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

// 디버깅: API_BASE_URL 확인
if (typeof window !== 'undefined') {
  console.log('[API] API_BASE_URL:', API_BASE_URL);
  console.log('[API] import.meta.env:', import.meta.env);
  console.log('[API] VITE_API_BASE_URL:', import.meta.env?.VITE_API_BASE_URL);
}

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
let refreshPromiseSilent = true;

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
  try {
    const storage = getStorage();
    if (!storage) {
      console.warn('[Token] Storage not available');
      return null;
    }
    return storage.getItem(key);
  } catch (error: any) {
    console.error(`[Token] Failed to read ${key}:`, error);
    return null;
  }
}

function writeToken(key: string, value: string | null) {
  try {
    const storage = getStorage();
    if (!storage) {
      console.error('[Token] Storage not available, cannot write token');
      return;
    }
    if (value) {
      storage.setItem(key, value);
      console.log(`[Token] Stored ${key} successfully`);
    } else {
      storage.removeItem(key);
      console.log(`[Token] Removed ${key}`);
    }
  } catch (error: any) {
    console.error(`[Token] Failed to write ${key}:`, error);
    if (error.name === 'QuotaExceededError') {
      console.error('[Token] Storage quota exceeded - localStorage is full');
    }
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

    const profileImage =
      payload.profile_image_url ??
      payload.profileImageUrl ??
      payload.profile_image ??
      payload.profile ??
      payload.avatar ??
      payload.avatar_url ??
      null;

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
      profileImageUrl: profileImage ? String(profileImage) : null,
      isCompleted: typeof isCompletedRaw === 'boolean' ? isCompletedRaw : undefined,
      createdAt: payload.created_at ?? payload.createdAt ?? undefined,
      updatedAt: payload.updated_at ?? payload.updatedAt ?? undefined,
    } as User;
  }

  throw new Error('유효하지 않은 사용자 응답입니다.');
}

function applyAuthSideEffects(payload: any) {
  const { accessToken, refreshToken } = extractTokens(payload);
  
  // 디버깅: 토큰 추출 결과 확인
  console.log('[Auth] Token extraction result:', {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    payloadStructure: payload ? Object.keys(payload) : 'no payload',
  });
  
  if (accessToken !== undefined || refreshToken !== undefined) {
    updateStoredTokens(accessToken ?? null, refreshToken ?? null);
    
    // 저장 후 확인
    const storedAccess = getStoredAccessToken();
    const storedRefresh = getStoredRefreshToken();
    console.log('[Auth] Tokens stored:', {
      accessTokenStored: !!storedAccess,
      refreshTokenStored: !!storedRefresh,
    });
    
    if (accessToken && !storedAccess) {
      console.error('[Auth] WARNING: Access token was not stored!');
    }
  } else {
    console.warn('[Auth] No tokens found in login response. Payload:', payload);
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

async function requestTokenRefresh(options?: { silent?: boolean }): Promise<boolean> {
  if (!API_BASE_URL) {
    return false;
  }

  const silent = Boolean(options?.silent);

  if (refreshPromise) {
    if (!silent) {
      refreshPromiseSilent = false;
    }
    return refreshPromise;
  }

  refreshPromiseSilent = silent;

  refreshPromise = (async () => {
    const refreshToken = getStoredRefreshToken();
    const hasRefreshToken = Boolean(refreshToken);

    const requestInit: RequestInit = {
      method: 'POST',
      credentials: 'include',
    };

    if (hasRefreshToken) {
      requestInit.headers = {
        'Content-Type': 'application/json',
      };
      requestInit.body = JSON.stringify({
        refreshToken,
        refresh_token: refreshToken,
      });
    }

    const response = await fetch(`${API_BASE_URL}${REFRESH_ENDPOINT}`, requestInit);

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

    // 토큰이 응답에 없을 수도 있으므로(서버가 쿠키만 재발급하는 경우) 존재할 때만 저장
    if (newAccessToken !== undefined || newRefreshToken !== undefined) {
      updateStoredTokens(
        newAccessToken ?? null,
        newRefreshToken ?? (hasRefreshToken ? refreshToken ?? null : null),
      );
    }
    return true;
  })()
    .catch((error) => {
      if (!refreshPromiseSilent) {
        clearStoredTokens();
      }
      console.error('Token refresh failed:', error);
      return false;
    })
    .finally(() => {
      refreshPromise = null;
      refreshPromiseSilent = true;
    });

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
  
  // 디버깅: API 호출 정보 로깅
  console.log('[API Request]', {
    endpoint,
    url,
    API_BASE_URL,
    hasToken: !skipAuth && !!getStoredAccessToken(),
    userAgent: navigator.userAgent,
  });

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
      // 디버깅: 헤더가 제대로 붙었는지 확인
      if (import.meta.env?.DEV) {
        console.log(`[API] Authorization header attached for: ${endpoint}`);
      }
    } else {
      // 모바일 디버깅: 토큰이 없을 때 경고
      console.warn(`[API] Missing access token for: ${endpoint}`);
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      body,
      credentials: credentials ?? 'include',
      headers: requestHeaders,
      cache: rest.cache ?? 'no-store',
    });
  } catch (fetchError: any) {
    // 네트워크 에러 (CORS, 연결 실패 등)
    console.error('[API Request] Fetch error:', {
      endpoint,
      url,
      error: fetchError.message,
      name: fetchError.name,
      stack: fetchError.stack,
    });
    throw new Error(`네트워크 오류: ${fetchError.message || '서버에 연결할 수 없습니다'}`);
  }

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
    
    console.error('[API Request] Error response:', {
      endpoint,
      url,
      status: response.status,
      statusText: response.statusText,
      payload,
      errorMessage,
    });
    
    throw new Error(errorMessage as string);
  }

  return payload as T;
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

  getOutgoingFriendRequests: async (): Promise<Array<{ id: string; toUserId: string; status?: string; updated_at?: string; updatedAt?: string }>> => {
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
      status: r.status,
      updated_at: r.updated_at,
      updatedAt: r.updatedAt,
    }));
  },

  respondFriendRequest: async (requestId: string, action: 'accept' | 'reject' | 'cancel'): Promise<void> => {
    await apiRequest(`/api/friends/requests/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    });
  },

  // 토큰 재발급
  refreshToken: async (options?: { silent?: boolean }): Promise<{ accessToken: string | null; refreshToken: string | null }> => {
    const refreshed = await requestTokenRefresh(options);
    if (!refreshed) {
      throw new Error('토큰을 갱신할 수 없습니다.');
    }
    return {
      accessToken: getStoredAccessToken(),
      refreshToken: getStoredRefreshToken(),
    };
  },

  // 전체 공부 시간 (초) 조회
  getTotalStudyTime: async (options?: { userId?: string }): Promise<{ totalSeconds: number }> => {
    const params = new URLSearchParams();
    if (options?.userId) {
      params.append('user_id', String(options.userId));
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const payload = await apiRequest<any>(`/api/sessions/total-time${query}`, { method: 'GET' });
    const totalSeconds =
      payload?.total_seconds ??
      payload?.totalSeconds ??
      payload?.total?.total_seconds ??
      payload?.total?.total_sec ??
      payload?.data?.total_seconds ??
      payload?.result?.total_seconds ??
      payload?.data?.totalSeconds ??
      payload?.result?.totalSeconds ??
      0;
    return { totalSeconds: Number(totalSeconds) || 0 };
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
        profileImageUrl: u.profile_image_url ?? u.profileImageUrl ?? u.profile_image ?? u.image_url ?? u.imageUrl ?? null,
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

  updateProfileImage: async (formData: FormData): Promise<{ profileImageUrl: string | null }> => {
    const payload = await apiRequest<any>('/api/user/me/profile-image', {
      method: 'PATCH',
      body: formData,
    });
    const url =
      payload?.profile_image_url ??
      payload?.profileImageUrl ??
      payload?.url ??
      payload?.data?.profile_image_url ??
      payload?.data?.profileImageUrl ??
      payload?.data?.url ??
      null;

    if (url && typeof url === 'string') {
      return { profileImageUrl: url };
    }

    return { profileImageUrl: null };
  },

  getSubjects: async (includeArchived = false): Promise<Subject[]> => {
    const query = includeArchived ? '?includeArchived=true' : '';
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
export const api = {
  ...realApi,
  // Real API는 실시간 세션 상태를 직접 제공하지 않으므로 null 반환
  getActiveSession: () => null,
};

export const apiBaseUrl = API_BASE_URL;