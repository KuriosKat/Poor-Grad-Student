# 불쌍한 대학원생 서바이벌 (Graduate Student Survival)

## Overview
대학원생의 고달픈 일상을 체험하는 시뮬레이션 웹 게임입니다. 플레이어는 체력, 멘탈, 연구진척도, 돈, 지도교수 호감도를 관리하면서 졸업을 목표로 합니다.

## Game Mechanics
- **승리 조건**: 연구진척도 100% 달성 시 졸업
- **패배 조건**: 체력, 멘탈, 지도교수 호감도, 돈 중 하나라도 0이 되면 게임 오버
- **행동 시스템**: 연구, 생활, 알바 카테고리의 다양한 행동 가능
- **랜덤 이벤트**: 행동마다 긍정적/부정적 이벤트 발생 가능

## Tech Stack
- **Frontend**: React + TypeScript, Vite, TailwindCSS, Framer Motion
- **State Management**: Client-side with localStorage (useGameState hook)
- **Effects**: canvas-confetti for visual effects
- **UI Components**: Shadcn/ui, Lucide icons

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   └── game/          # 게임 UI 컴포넌트
│   │       ├── StatBar.tsx
│   │       ├── ActionButton.tsx
│   │       ├── EventModal.tsx
│   │       ├── EventLog.tsx
│   │       ├── GameHeader.tsx
│   │       ├── GameOverScreen.tsx
│   │       └── StartScreen.tsx
│   ├── hooks/
│   │   └── useGameState.ts  # 게임 상태 관리 (localStorage)
│   ├── lib/
│   │   └── effects.ts       # 시각 효과 (confetti 등)
│   ├── pages/
│   │   └── Home.tsx         # 메인 게임 페이지
│   └── App.tsx
server/
├── routes.ts              # API 라우트 (선택적)
└── storage.ts             # 게임 상태 관리 (in-memory)
shared/
└── schema.ts              # 게임 데이터 타입 및 상수 정의
```

## Deployment

### Netlify/GitHub
- `netlify.toml` 설정 파일 포함
- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `client/dist`

### Replit
- `npm run dev` 명령으로 개발 서버 실행
- Port 5000에서 서비스

## Visual Effects
- 컨페티 효과 (게임 시작, 긍정적 이벤트, 졸업)
- 화면 흔들림 (부정적 이벤트)
- 스탯 변화 애니메이션
- 플로팅 아이콘
- 그라데이션 배경

## Running the App
The app runs on port 5000 with `npm run dev` command.

## Recent Changes
- Enhanced visual effects with confetti and animations
- Client-side game state management with localStorage
- Netlify deployment configuration
- Improved UI/UX with Framer Motion
- Dark/Light theme support
- Korean language UI
- Responsive design for mobile
