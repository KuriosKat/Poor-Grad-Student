import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, HeartCrack, Brain, Frown, Coins, Trophy, RotateCcw } from "lucide-react";
import type { GameState } from "@shared/schema";

interface GameOverScreenProps {
  gameState: GameState;
  onNewGame: () => void;
}

const gameOverReasons: Record<string, { icon: React.ComponentType<{ className?: string }>, color: string, message: string }> = {
  health: {
    icon: HeartCrack,
    color: "text-red-500",
    message: "체력이 바닥나서 쓰러졌습니다..."
  },
  mental: {
    icon: Brain,
    color: "text-blue-500",
    message: "멘탈이 무너져 더 이상 연구를 할 수 없습니다..."
  },
  advisor: {
    icon: Frown,
    color: "text-purple-500",
    message: "지도교수님이 더 이상 지도를 거부하셨습니다..."
  },
  money: {
    icon: Coins,
    color: "text-yellow-500",
    message: "돈이 바닥나서 생활이 불가능해졌습니다..."
  }
};

export function GameOverScreen({ gameState, onNewGame }: GameOverScreenProps) {
  const isGraduated = gameState.isGraduated;
  const reason = gameState.gameOverReason || "unknown";
  const reasonConfig = gameOverReasons[reason] || gameOverReasons.health;
  const ReasonIcon = reasonConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background"
    >
      <div className="w-full max-w-md">
        {isGraduated ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-8 text-center">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-20 h-20 mx-auto text-white drop-shadow-lg" />
                </motion.div>
                <motion.h1 
                  className="text-3xl font-bold text-white mt-4 drop-shadow"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  축하합니다!
                </motion.h1>
              </div>
              
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <GraduationCap className="w-8 h-8 text-primary" />
                  <span className="text-xl font-bold">졸업 성공!</span>
                </div>
                
                <p className="text-muted-foreground">
                  드디어 대학원 생활의 끝에 도달했습니다.
                  <br />
                  모든 고생이 드디어 빛을 발했네요!
                </p>
                
                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <div className="text-center p-3 rounded-md bg-muted">
                    <p className="text-2xl font-bold text-primary">{gameState.semester}</p>
                    <p className="text-xs text-muted-foreground">학기</p>
                  </div>
                  <div className="text-center p-3 rounded-md bg-muted">
                    <p className="text-2xl font-bold text-primary">{gameState.totalDays}</p>
                    <p className="text-xs text-muted-foreground">총 일수</p>
                  </div>
                  <div className="text-center p-3 rounded-md bg-muted">
                    <p className="text-2xl font-bold text-yellow-500">{gameState.coffeeCount}</p>
                    <p className="text-xs text-muted-foreground">커피 잔</p>
                  </div>
                  <div className="text-center p-3 rounded-md bg-muted">
                    <p className="text-2xl font-bold text-orange-500">{gameState.ramenCount}</p>
                    <p className="text-xs text-muted-foreground">라면 그릇</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={onNewGame}
                  data-testid="play-again-button"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  다시 도전하기
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 p-8 text-center">
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ReasonIcon className={`w-20 h-20 mx-auto ${reasonConfig.color} drop-shadow-lg`} />
                </motion.div>
                <h1 className="text-3xl font-bold text-white mt-4 drop-shadow">
                  게임 오버
                </h1>
              </div>
              
              <CardContent className="p-6 text-center space-y-4">
                <p className="text-lg font-medium text-foreground">
                  {reasonConfig.message}
                </p>
                
                <p className="text-sm text-muted-foreground">
                  대학원 생활은 정말 힘들죠...
                  <br />
                  하지만 포기하지 마세요!
                </p>
                
                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <div className="text-center p-3 rounded-md bg-muted">
                    <p className="text-2xl font-bold">{gameState.semester}</p>
                    <p className="text-xs text-muted-foreground">학기</p>
                  </div>
                  <div className="text-center p-3 rounded-md bg-muted">
                    <p className="text-2xl font-bold">{gameState.totalDays}</p>
                    <p className="text-xs text-muted-foreground">총 일수</p>
                  </div>
                  <div className="text-center p-3 rounded-md bg-muted">
                    <p className="text-2xl font-bold">{Math.round(gameState.stats.research)}</p>
                    <p className="text-xs text-muted-foreground">연구진척도</p>
                  </div>
                  <div className="text-center p-3 rounded-md bg-muted">
                    <p className="text-2xl font-bold">{gameState.allNighterCount}</p>
                    <p className="text-xs text-muted-foreground">철야 횟수</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={onNewGame}
                  data-testid="play-again-button"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  다시 도전하기
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
