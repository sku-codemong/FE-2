# 백엔드 API 연결 가이드

## 개요

이 프로젝트는 백엔드 API와 연결하거나 Mock 데이터를 사용할 수 있도록 구성되어 있습니다.

## 환경 설정

### 1. 환경 변수 파일 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 백엔드 API Base URL
VITE_API_BASE_URL=http://localhost:8000

# 또는 프로덕션 URL
# VITE_API_BASE_URL=https://api.yourdomain.com
```

### 2. Mock 데이터 사용

`.env.local` 파일이 없거나 `VITE_API_BASE_URL`이 비어있으면 자동으로 Mock 데이터를 사용합니다.

```bash
# Mock 데이터 사용 (비워두기)
VITE_API_BASE_URL=
```

## API 엔드포인트 스펙

백엔드에서 다음 엔드포인트를 구현해야 합니다:

### 인증 (Auth)

- `POST /api/auth/login` - 로그인
  - Body: `{ email: string, password: string }`
  - Response: `User`

- `GET /api/auth/me` - 현재 사용자 정보
  - Response: `User`

### 과목 (Subjects)

- `GET /api/subjects?includeArchived=false` - 과목 목록 조회
  - Response: `Subject[]`

- `GET /api/subjects/:subjectId` - 과목 상세 조회
  - Response: `Subject`

- `POST /api/subjects` - 과목 생성
  - Body: `{ name, color, targetWeeklyMin, weight, difficulty, hasExtraWork, archived }`
  - Response: `Subject`

- `PATCH /api/subjects/:subjectId` - 과목 수정
  - Body: `Partial<Subject>`
  - Response: `Subject`

- `DELETE /api/subjects/:subjectId` - 과목 삭제
  - Response: `void`

- `PATCH /api/subjects/:subjectId/archive` - 과목 보관
  - Response: `Subject`

### 학습 세션 (Sessions)

- `GET /api/sessions?from=&to=&subjectId=&status=` - 세션 목록 조회
  - Query Params: `from`, `to`, `subjectId`, `status` (모두 선택)
  - Response: `Session[]`

- `GET /api/sessions/active` - 활성 세션 조회
  - Response: `Session | null`

- `GET /api/sessions/:subjectId/latest` - 특정 과목의 최근 세션 조회
  - Response: `Session | null`

- `POST /api/sessions/:subjectId/start` - 세션 시작
  - Response: `Session`

- `PATCH /api/sessions/:sessionId/stop` - 세션 중지
  - Response: `Session`

- `POST /api/sessions/manual` - 수동 세션 생성
  - Body: `{ subjectId, startTime, endTime }`
  - Response: `Session`

### 리포트 (Reports)

- `GET /api/reports/daily?date=YYYY-MM-DD` - 일간 리포트
  - Response: `DailyReport`

- `GET /api/reports/weekly?weekStart=YYYY-MM-DD` - 주간 리포트
  - Response: `WeeklyReport`

## 타입 정의

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

### Subject
```typescript
interface Subject {
  id: string;
  name: string;
  color: string;
  targetWeeklyMin: number;
  weight: number; // 학점
  difficulty: number; // 난이도 1-5
  hasExtraWork: boolean; // 추가 과제/사항 여부
  archived: boolean;
  createdAt: string;
}
```

### Session
```typescript
interface Session {
  id: string;
  subjectId: string;
  startTime: string;
  endTime?: string;
  duration: number; // minutes
  status: 'active' | 'completed' | 'manual';
}
```

### DailyReport
```typescript
interface DailyReport {
  date: string;
  totalMinutes: number;
  subjects: {
    subjectId: string;
    subjectName: string;
    color: string;
    minutes: number;
  }[];
}
```

### WeeklyReport
```typescript
interface WeeklyReport {
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
```

## 인증 방식

현재 구현은 쿠키/세션 기반 인증을 사용합니다:
- `credentials: 'include'` 옵션으로 쿠키 전송
- 백엔드에서 세션 관리 필요

JWT 등 다른 인증 방식을 사용하려면 `/services/api.ts`의 `apiRequest` 함수를 수정하세요.

## 개발 워크플로우

1. **프론트엔드 개발**: Mock 데이터로 개발 및 테스트
2. **백엔드 연동 준비**: `.env.local`에 백엔드 URL 설정
3. **통합 테스트**: 실제 API로 전환하여 테스트
4. **배포**: 프로덕션 환경변수 설정

## 문제 해결

### CORS 에러
백엔드에서 CORS 설정이 필요합니다:
```javascript
// Express 예시
app.use(cors({
  origin: 'http://localhost:5173', // Vite 개발 서버
  credentials: true
}));
```

### 환경 변수가 적용되지 않음
Vite 개발 서버를 재시작하세요:
```bash
npm run dev
```

## 상태 확인

애플리케이션 상단에 현재 API 연결 상태가 표시됩니다:
- **파란색 배너**: Mock 데이터 사용 중
- **초록색 배너**: 백엔드 API 연결됨
