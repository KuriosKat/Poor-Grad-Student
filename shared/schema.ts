import { z } from "zod";

// Game Stats
export interface GameStats {
  health: number;      // 체력 (0-100)
  mental: number;      // 멘탈 (0-100)
  research: number;    // 연구진척도 (0-100)
  money: number;       // 돈 (0-1000000)
  advisorFavor: number; // 지도교수 호감도 (0-100)
}

// Game State
export interface GameState {
  id: string;
  stats: GameStats;
  day: number;
  semester: number;
  totalDays: number;
  isGameOver: boolean;
  gameOverReason: string | null;
  isGraduated: boolean;
  eventLog: GameEvent[];
  lastAction: string | null;
  coffeeCount: number;
  ramenCount: number;
  allNighterCount: number;
}

// Actions available to the player
export type ActionType = 
  | 'readPapers'      // 논문 읽기
  | 'experiment'      // 실험하기
  | 'writePaper'      // 논문 작성
  | 'sleep'           // 잠자기
  | 'drinkCoffee'     // 커피 마시기
  | 'eatRamen'        // 라면 먹기
  | 'meetAdvisor'     // 지도교수 미팅
  | 'partTimeJob'     // 알바하기
  | 'rest'            // 휴식
  | 'exercise';       // 운동하기

export interface GameAction {
  type: ActionType;
  name: string;
  description: string;
  icon: string;
  effects: Partial<GameStats>;
  cost?: number;
  cooldown?: number;
}

// Random Events
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  effects: Partial<GameStats>;
  timestamp: number;
  isPositive: boolean;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  effects: Partial<GameStats>;
  probability: number;
  isPositive: boolean;
}

// API Request/Response types
export const createGameSchema = z.object({});
export type CreateGameRequest = z.infer<typeof createGameSchema>;

export const performActionSchema = z.object({
  gameId: z.string(),
  action: z.enum([
    'readPapers', 'experiment', 'writePaper', 'sleep', 
    'drinkCoffee', 'eatRamen', 'meetAdvisor', 'partTimeJob', 
    'rest', 'exercise'
  ])
});
export type PerformActionRequest = z.infer<typeof performActionSchema>;

export const getGameSchema = z.object({
  gameId: z.string()
});
export type GetGameRequest = z.infer<typeof getGameSchema>;

// Initial game state factory
export function createInitialGameState(id: string): GameState {
  return {
    id,
    stats: {
      health: 80,
      mental: 70,
      research: 0,
      money: 500000,
      advisorFavor: 50
    },
    day: 1,
    semester: 1,
    totalDays: 0,
    isGameOver: false,
    gameOverReason: null,
    isGraduated: false,
    eventLog: [],
    lastAction: null,
    coffeeCount: 0,
    ramenCount: 0,
    allNighterCount: 0
  };
}

// Game actions definition
export const GAME_ACTIONS: GameAction[] = [
  {
    type: 'readPapers',
    name: '논문 읽기',
    description: '최신 논문을 읽고 연구에 반영합니다',
    icon: 'BookOpen',
    effects: { research: 5, mental: -5, health: -3 }
  },
  {
    type: 'experiment',
    name: '실험하기',
    description: '연구실에서 실험을 진행합니다',
    icon: 'FlaskConical',
    effects: { research: 10, mental: -8, health: -5 }
  },
  {
    type: 'writePaper',
    name: '논문 작성',
    description: '연구 결과를 논문으로 정리합니다',
    icon: 'PenTool',
    effects: { research: 15, mental: -15, health: -8, advisorFavor: 5 }
  },
  {
    type: 'sleep',
    name: '잠자기',
    description: '푹 자고 체력을 회복합니다',
    icon: 'Moon',
    effects: { health: 25, mental: 10 }
  },
  {
    type: 'drinkCoffee',
    name: '커피 마시기',
    description: '카페인으로 정신을 차립니다',
    icon: 'Coffee',
    effects: { mental: 8, health: -3, money: -5000 }
  },
  {
    type: 'eatRamen',
    name: '라면 먹기',
    description: '저렴하게 한 끼를 해결합니다',
    icon: 'Soup',
    effects: { health: 5, mental: 3, money: -3000 }
  },
  {
    type: 'meetAdvisor',
    name: '지도교수 미팅',
    description: '교수님께 연구 진행 상황을 보고합니다',
    icon: 'UserCheck',
    effects: { advisorFavor: 10, mental: -10, research: 3 }
  },
  {
    type: 'partTimeJob',
    name: '알바하기',
    description: '생활비를 벌기 위해 알바를 합니다',
    icon: 'Briefcase',
    effects: { money: 50000, health: -10, mental: -5, advisorFavor: -5 }
  },
  {
    type: 'rest',
    name: '휴식',
    description: '잠시 쉬면서 멘탈을 회복합니다',
    icon: 'Armchair',
    effects: { mental: 15, health: 5, advisorFavor: -3 }
  },
  {
    type: 'exercise',
    name: '운동하기',
    description: '건강을 위해 운동을 합니다',
    icon: 'Dumbbell',
    effects: { health: 15, mental: 5, money: -10000 }
  }
];

// Random events pool
export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'advisor_angry',
    title: '지도교수 호출',
    description: '교수님이 갑자기 호출하셨습니다. 연구 진행이 느리다며 불같이 화를 내십니다.',
    effects: { mental: -20, advisorFavor: -15 },
    probability: 0.1,
    isPositive: false
  },
  {
    id: 'experiment_fail',
    title: '실험 실패',
    description: '며칠간 준비한 실험이 완전히 실패했습니다...',
    effects: { mental: -25, research: -10 },
    probability: 0.12,
    isPositive: false
  },
  {
    id: 'paper_reject',
    title: '논문 리젝',
    description: '제출한 논문이 리젝되었습니다. 리뷰어 코멘트가 가혹합니다.',
    effects: { mental: -30, research: -5, advisorFavor: -10 },
    probability: 0.08,
    isPositive: false
  },
  {
    id: 'sudden_meeting',
    title: '갑작스러운 회의',
    description: '오늘 저녁에 갑자기 랩미팅이 잡혔습니다.',
    effects: { mental: -10, health: -5 },
    probability: 0.15,
    isPositive: false
  },
  {
    id: 'computer_crash',
    title: '컴퓨터 고장',
    description: '연구실 컴퓨터가 갑자기 고장났습니다. 저장 안 한 데이터가...',
    effects: { mental: -20, research: -8, money: -100000 },
    probability: 0.05,
    isPositive: false
  },
  {
    id: 'senior_help',
    title: '선배의 도움',
    description: '착한 선배가 연구에 도움을 줍니다.',
    effects: { research: 10, mental: 10 },
    probability: 0.1,
    isPositive: true
  },
  {
    id: 'scholarship',
    title: '장학금 수령',
    description: '이번 달 장학금이 입금되었습니다!',
    effects: { money: 200000, mental: 15 },
    probability: 0.08,
    isPositive: true
  },
  {
    id: 'advisor_praise',
    title: '교수님 칭찬',
    description: '교수님이 연구 진행에 만족하시며 칭찬을 해주셨습니다!',
    effects: { mental: 25, advisorFavor: 15 },
    probability: 0.07,
    isPositive: true
  },
  {
    id: 'paper_accept',
    title: '논문 억셉',
    description: '제출한 논문이 학회에 억셉되었습니다! 축하합니다!',
    effects: { mental: 30, research: 15, advisorFavor: 20 },
    probability: 0.05,
    isPositive: true
  },
  {
    id: 'free_food',
    title: '공짜 밥',
    description: '세미나에서 공짜 밥을 먹었습니다.',
    effects: { health: 10, mental: 5, money: 10000 },
    probability: 0.12,
    isPositive: true
  },
  {
    id: 'all_nighter',
    title: '철야 강요',
    description: '교수님이 내일까지 결과를 요구하셔서 밤을 새야 합니다...',
    effects: { health: -20, mental: -15, research: 8 },
    probability: 0.1,
    isPositive: false
  },
  {
    id: 'lab_mate_quit',
    title: '동기 자퇴',
    description: '같이 입학한 동기가 자퇴를 선언했습니다. 나도 그러고 싶다...',
    effects: { mental: -15 },
    probability: 0.06,
    isPositive: false
  }
];

// Placeholder User schema (required by storage.ts)
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}
