import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, HeartCrack, Brain, Frown, Coins, Trophy, RotateCcw, Sparkles, Star } from "lucide-react";
import { fireGraduation } from "@/lib/effects";
import type { GameState } from "@shared/schema";

interface GameOverScreenProps {
  gameState: GameState;
  onNewGame: () => void;
}

const gameOverReasons: Record<string, { icon: React.ComponentType<{ className?: string }>, color: string, message: string, bgGradient: string }> = {
  health: {
    icon: HeartCrack,
    color: "text-red-500",
    message: "체력이 바닥나서 쓰러졌습니다...",
    bgGradient: "from-red-600 via-red-700 to-red-900"
  },
  mental: {
    icon: Brain,
    color: "text-blue-500",
    message: "멘탈이 무너져 더 이상 연구를 할 수 없습니다...",
    bgGradient: "from-blue-600 via-blue-700 to-blue-900"
  },
  advisor: {
    icon: Frown,
    color: "text-purple-500",
    message: "지도교수님이 더 이상 지도를 거부하셨습니다...",
    bgGradient: "from-purple-600 via-purple-700 to-purple-900"
  },
  money: {
    icon: Coins,
    color: "text-yellow-500",
    message: "돈이 바닥나서 생활이 불가능해졌습니다...",
    bgGradient: "from-yellow-600 via-yellow-700 to-yellow-900"
  }
};

export function GameOverScreen({ gameState, onNewGame }: GameOverScreenProps) {
  const isGraduated = gameState.isGraduated;
  const reason = gameState.gameOverReason || "unknown";
  const reasonConfig = gameOverReasons[reason] || gameOverReasons.health;
  const ReasonIcon = reasonConfig.icon;

  useEffect(() => {
    if (isGraduated) {
      fireGraduation();
    }
  }, [isGraduated]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isGraduated && [...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
              y: -20,
              rotate: 0
            }}
            animate={{ 
              y: (typeof window !== "undefined" ? window.innerHeight : 600) + 50,
              rotate: 360
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          >
            <Star className={`w-4 h-4 ${
              i % 3 === 0 ? "text-yellow-400" : 
              i % 3 === 1 ? "text-orange-400" : "text-red-400"
            }`} />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {isGraduated ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ type: "spring", damping: 15, duration: 0.8 }}
          >
            <Card className="overflow-hidden border-2 border-yellow-400/50 shadow-2xl shadow-yellow-500/30">
              <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-10 text-center relative overflow-hidden">
                {/* Sparkle effects */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${10 + i * 12}%`,
                      top: `${20 + (i % 3) * 30}%`
                    }}
                    animate={{ 
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-white/60" />
                  </motion.div>
                ))}

                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-24 h-24 mx-auto text-white drop-shadow-2xl" />
                </motion.div>
                <motion.h1 
                  className="text-4xl font-bold text-white mt-6 drop-shadow-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  축하합니다!
                </motion.h1>
              </div>
              
              <CardContent className="p-8 text-center space-y-6">
                <motion.div 
                  className="flex items-center justify-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <GraduationCap className="w-10 h-10 text-primary" />
                  </motion.div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                    졸업 성공!
                  </span>
                </motion.div>
                
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  드디어 대학원 생활의 끝에 도달했습니다.
                  <br />
                  모든 고생이 드디어 빛을 발했네요!
                </motion.p>
                
                <motion.div 
                  className="grid grid-cols-2 gap-4 pt-6 border-t"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {[
                    { value: gameState.semester, label: "학기", color: "text-primary" },
                    { value: gameState.totalDays, label: "총 일수", color: "text-primary" },
                    { value: gameState.coffeeCount, label: "커피 잔", color: "text-yellow-500" },
                    { value: gameState.ramenCount, label: "라면 그릇", color: "text-orange-500" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center p-4 rounded-lg bg-muted hover-elevate"
                      whileHover={{ scale: 1.05, y: -3 }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <Button 
                    className="w-full mt-4 py-6 text-lg shadow-lg" 
                    onClick={onNewGame}
                    data-testid="play-again-button"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    다시 도전하기
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Card className="overflow-hidden border-2 border-gray-500/30 shadow-2xl">
              <div className={`bg-gradient-to-br ${reasonConfig.bgGradient} p-10 text-center relative overflow-hidden`}>
                {/* Falling particles */}
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    initial={{ 
                      x: Math.random() * 300, 
                      y: -10 
                    }}
                    animate={{ y: 200 }}
                    transition={{ 
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}

                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ReasonIcon className="w-24 h-24 mx-auto text-white/90 drop-shadow-lg" />
                </motion.div>
                <motion.h1 
                  className="text-4xl font-bold text-white mt-6 drop-shadow"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  게임 오버
                </motion.h1>
              </div>
              
              <CardContent className="p-8 text-center space-y-6">
                <motion.p 
                  className="text-lg font-medium text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {reasonConfig.message}
                </motion.p>
                
                <motion.p 
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  대학원 생활은 정말 힘들죠...
                  <br />
                  하지만 포기하지 마세요!
                </motion.p>
                
                <motion.div 
                  className="grid grid-cols-2 gap-4 pt-6 border-t"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[
                    { value: gameState.semester, label: "학기" },
                    { value: gameState.totalDays, label: "총 일수" },
                    { value: Math.round(gameState.stats.research), label: "연구진척도" },
                    { value: gameState.allNighterCount, label: "철야 횟수" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center p-4 rounded-lg bg-muted"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Button 
                    className="w-full mt-4 py-6 text-lg" 
                    onClick={onNewGame}
                    data-testid="play-again-button"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    다시 도전하기
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
