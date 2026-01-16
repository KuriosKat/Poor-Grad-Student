##Play at: https://sage-centaur-e02e60.netlify.app/

# 불쌍한 대학원생 서바이벌 (Graduate Student Survival)

대학원생의 고달픈 일상을 체험하는 시뮬레이션 웹 게임입니다.


![Game Screenshot](./screenshot.png)

## 게임 소개

### 목표
- **졸업 조건**: 연구진척도 100% 달성
- **게임오버 조건**: 체력, 멘탈, 돈, 교수 호감도 중 하나라도 0이 되면 종료

### 스탯
- **체력**: 잠자기, 운동, 라면으로 회복
- **멘탈**: 휴식, 커피로 회복
- **연구 진척도**: 논문 읽기, 실험, 논문 작성으로 상승
- **돈**: 알바로 획득, 식비로 소모
- **교수 호감도**: 미팅, 논문 작성으로 상승

### 랜덤 이벤트
- 긍정적: 장학금 수령, 논문 억셉, 선배의 도움 등
- 부정적: 지도교수 호출, 실험 실패, 논문 리젝 등

## 기술 스택

- **Frontend**: React, TypeScript, Vite
- **Styling**: TailwindCSS, Framer Motion
- **UI**: Shadcn/ui, Lucide Icons
- **State**: LocalStorage (client-side)

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## Netlify 배포

### 방법 1: GitHub 연동

1. GitHub에 저장소 생성 및 푸시
2. Netlify에서 "New site from Git" 선택
3. GitHub 저장소 연결
4. Build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Deploy!

### 방법 2: 수동 배포

```bash
# 클라이언트 폴더로 이동
cd client

# 빌드
npm run build

# dist 폴더를 Netlify에 드래그 앤 드롭
```

## 환경 설정

Netlify 빌드를 위한 설정이 `netlify.toml`에 포함되어 있습니다:

```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 프로젝트 구조

```
├── client/
│   ├── src/
│   │   ├── components/game/   # 게임 UI 컴포넌트
│   │   ├── hooks/             # 커스텀 훅 (게임 상태 관리)
│   │   ├── lib/               # 유틸리티 (이펙트 등)
│   │   └── pages/             # 페이지 컴포넌트
│   └── index.html
├── shared/
│   └── schema.ts              # 게임 데이터 타입 및 상수
├── netlify.toml               # Netlify 빌드 설정
└── README.md
```

## 라이선스

MIT License

---

Made with exhaustion and instant noodles
