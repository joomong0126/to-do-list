# TaskFlow Pro 📋

> 현대적이고 세련된 할 일 관리 플랫폼

![TaskFlow Pro](https://img.shields.io/badge/TaskFlow-Pro-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Integrated-green?style=for-the-badge&logo=supabase)

## ✨ 주요 기능

- 🎯 **우선순위 기반 할 일 관리** (높음/보통/낮음)
- 📂 **카테고리별 분류** (업무/개인/학습/건강/기타)
- 🔍 **실시간 검색** 및 필터링 (전체/진행중/완료)
- 📊 **대시보드 통계** (진행률, 완료율, 우선순위별 통계)
- 💾 **클라우드 동기화** (Supabase 실시간 저장)
- 🌙 **다크 모드** 자동 지원
- 📱 **반응형 디자인** (모바일/태블릿/데스크톱)
- 🔔 **토스트 알림** (성공/실패 피드백)
- ⚡ **키보드 단축키** 지원

## 🛠️ 기술 스택

- **프레임워크**: Next.js 15.3.5
- **언어**: TypeScript 5.0
- **스타일링**: Tailwind CSS 4.0
- **UI 라이브러리**: shadcn/ui + Radix UI
- **아이콘**: FontAwesome + Lucide React
- **데이터베이스**: Supabase PostgreSQL
- **인증**: Supabase Auth
- **알림**: Sonner Toast
- **폰트**: Pretendard
- **테마**: next-themes

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone [repository-url]
cd to-do-list
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ **보안 주의사항**: 환경 변수 파일(.env.local)을 버전 관리에 포함하지 마세요!

### 4. 데이터베이스 설정

Supabase 프로젝트에서 다음 SQL을 실행하여 테이블을 생성하세요:

```sql
-- todos 테이블 생성
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
  user_id UUID,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT DEFAULT '업무'
);

-- RLS 정책 설정 (선택사항)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속하여 확인하세요.

## 📁 프로젝트 구조

```
to-do-list/
├── app/
│   ├── globals.css          # 전역 스타일
│   ├── layout.tsx          # 루트 레이아웃 + Toast 설정
│   └── page.tsx            # 메인 Todo 애플리케이션
├── components/
│   └── ui/                 # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── lib/
│   ├── supabase.ts         # Supabase 클라이언트 설정
│   └── utils.ts            # 유틸리티 함수
├── hooks/
│   └── use-mobile.ts       # 모바일 감지 훅
├── public/                 # 정적 자산
└── .env.local             # 환경 변수 (git 제외)
```

## 🎯 주요 기능 사용법

### 할 일 추가
1. 상단 입력 필드에 할 일 내용 입력
2. 우선순위 선택 (낮음/보통/높음)
3. 카테고리 선택 (업무/개인/학습/건강/기타)
4. "추가" 버튼 클릭 또는 **Enter** 키 입력

### 할 일 관리
- ✅ **완료 처리**: 좌측 원형 체크박스 클릭
- 🔄 **우선순위 변경**: 할 일 항목의 드롭다운 메뉴
- 🗑️ **삭제**: 우측 휴지통 아이콘 클릭
- 🔍 **검색**: 검색 입력 필드에 키워드 입력
- 🏷️ **필터링**: 전체/진행중/완료 탭 선택

### 통계 및 분석
- 📊 **대시보드**: 상단 4개 통계 카드
- 📈 **진행률**: 우측 사이드바 진행률 바
- 📅 **일별 통계**: 오늘 추가된 할 일 수

## 📦 주요 의존성

```json
{
  "dependencies": {
    "next": "15.3.5",
    "react": "^19.0.0",
    "typescript": "^5.0.0",
    "@supabase/supabase-js": "^2.50.3",
    "sonner": "^2.0.6",
    "tailwindcss": "^4.0.0",
    "next-themes": "^0.4.6",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "lucide-react": "^0.525.0"
  }
}
```

## 🎨 디자인 특징

- **글래스모피즘**: 반투명 블러 효과
- **그라데이션**: 부드러운 색상 전환
- **호버 효과**: 인터랙티브 요소들
- **반응형**: 모든 기기에서 최적화
- **다크 모드**: 시스템 설정 자동 감지

## 🔒 보안 고려사항

- 환경 변수를 통한 민감 정보 관리
- Supabase RLS (Row Level Security) 적용 가능
- 클라이언트 측 데이터 검증
- API 에러 핸들링 및 사용자 피드백

## 📜 사용 가능한 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

## 🤝 기여하기

1. 이 저장소를 Fork
2. 새로운 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🔗 참고 문서

- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

✨ **TaskFlow Pro**로 더 체계적이고 효율적인 할 일 관리를 시작하세요!
