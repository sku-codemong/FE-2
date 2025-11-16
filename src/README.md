# 학습 시간 추적 애플리케이션

학점, 난이도, 추가 과제를 고려한 가중치 기반 자동 시간 분배 시스템을 갖춘 학습 시간 관리 앱입니다.

## 주요 기능

- ✅ 과목 일괄 추가 및 자동 시간 분배
- ⏱️ 실시간 타이머 기반 학습 세션 추적
- 📊 일간/주간 학습 리포트 및 차트
- 🎯 과목별 목표 시간 대비 달성률 확인
- 📝 수동 학습 기록 추가 기능

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저가 자동으로 열리며 `http://localhost:5173`에서 확인할 수 있습니다.

### 3. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 백엔드 API 연결

현재는 Mock 데이터로 작동합니다. 백엔드와 연결하려면:

1. 프로젝트 루트에 `.env.local` 파일 생성
2. 다음 내용 추가:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

자세한 내용은 [API 연결 가이드](./README-API.md)를 참고하세요.

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## 프로젝트 구조

```
├── App.tsx              # 메인 라우터 설정
├── main.tsx            # React 엔트리 포인트
├── components/         # 재사용 가능한 컴포넌트
│   ├── ui/            # shadcn/ui 컴포넌트
│   └── ...
├── pages/             # 페이지 컴포넌트
├── services/          # API 통신 로직
└── styles/           # 전역 스타일
```

## 개발 팁

### VSCode 추천 확장 프로그램

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

### Mock 데이터 사용

`.env.local` 파일이 없거나 `VITE_API_BASE_URL`이 비어있으면 자동으로 Mock 데이터를 사용합니다.

애플리케이션 상단의 알림 배너를 통해 현재 상태를 확인할 수 있습니다:
- 🔵 파란색: Mock 데이터 사용 중
- 🟢 초록색: 백엔드 API 연결됨

## 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.
