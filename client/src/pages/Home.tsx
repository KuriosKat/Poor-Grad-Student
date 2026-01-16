import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Zap, Heart, Sparkles, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { StatBar } from "@/components/game/StatBar";
import { ActionButton } from "@/components/game/ActionButton";
import { EventModal } from "@/components/game/EventModal";
import { GameHeader } from "@/components/game/GameHeader";
import { GameOverScreen } from "@/components/game/GameOverScreen";
import { StartScreen } from "@/components/game/StartScreen";
import { EventLog } from "@/components/game/EventLog";

import { useGameState } from "@/hooks/useGameState";
import { 
  fireConfetti, 
  fireGraduation, 
  firePositiveEvent, 
  fireNegativeEvent, 
  fireCoffee, 
  fireRamen, 
  fireMoney, 
  fireResearch 
} from "@/lib/effects";

import type { ActionType } from "@shared/schema";
import { GAME_ACTIONS } from "@shared/schema";

export default function Home() {
  const {
    gameState,
    isLoading,
    lastEvent,
    statChanges,
    createGame,
    performAction,
    resetGame,
    clearLastEvent,
  } = useGameState();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  
  const [screenEffect, setScreenEffect] = useState<"positive" | "negative" | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (gameState?.isGraduated) {
      fireGraduation();
      toast({
        title: "축하합니다!",
        description: "드디어 졸업에 성공했습니다!",
      });
    } else if (gameState?.isGameOver) {
      setScreenEffect("negative");
      setTimeout(() => setScreenEffect(null), 500);
      toast({
        title: "게임 오버",
        description: "다음에는 더 잘할 수 있을 거예요...",
        variant: "destructive",
      });
    }
  }, [gameState?.isGraduated, gameState?.isGameOver, toast]);

  useEffect(() => {
    if (lastEvent) {
      if (lastEvent.isPositive) {
        setScreenEffect("positive");
        firePositiveEvent();
      } else {
        setScreenEffect("negative");
        if (mainRef.current) {
          mainRef.current.classList.add("animate-shake");
          setTimeout(() => {
            mainRef.current?.classList.remove("animate-shake");
          }, 500);
        }
        fireNegativeEvent();
      }
      setTimeout(() => setScreenEffect(null), 300);
    }
  }, [lastEvent]);

  const handleAction = useCallback((actionType: ActionType) => {
    if (isActionPending) return;
    
    setIsActionPending(true);
    
    const result = performAction(actionType);
    
    if (result.success) {
      switch (actionType) {
        case "drinkCoffee":
          fireCoffee();
          break;
        case "eatRamen":
          fireRamen();
          break;
        case "partTimeJob":
          fireMoney();
          break;
        case "readPapers":
        case "experiment":
        case "writePaper":
          fireResearch();
          break;
      }
      
      if (result.changes.research && result.changes.research >= 15) {
        fireConfetti();
      }
    }
    
    setTimeout(() => setIsActionPending(false), 300);
  }, [performAction, isActionPending]);

  const handleStart = () => {
    createGame();
    fireConfetti();
  };

  const handleNewGame = () => {
    resetGame();
  };

  if (!gameState) {
    return (
      <StartScreen 
        onStart={handleStart} 
        isLoading={isLoading} 
      />
    );
  }

  if (gameState.isGameOver || gameState.isGraduated) {
    return (
      <GameOverScreen 
        gameState={gameState} 
        onNewGame={handleNewGame} 
      />
    );
  }

  const researchActions = GAME_ACTIONS.filter(a => 
    ["readPapers", "experiment", "writePaper", "meetAdvisor"].includes(a.type)
  );
  const lifeActions = GAME_ACTIONS.filter(a => 
    ["sleep", "drinkCoffee", "eatRamen", "rest", "exercise"].includes(a.type)
  );
  const workActions = GAME_ACTIONS.filter(a => 
    ["partTimeJob"].includes(a.type)
  );

  return (
    <div 
      className={`min-h-screen bg-background transition-all duration-200 ${
        screenEffect === "positive" ? "screen-flash-positive" : 
        screenEffect === "negative" ? "screen-flash-negative" : ""
      }`}
    >
      <GameHeader
        day={gameState.day}
        semester={gameState.semester}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onNewGame={handleNewGame}
      />

      <main ref={mainRef} className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                  </motion.div>
                  상태
                </CardTitle>
                <motion.div
                  key={gameState.stats.research}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      gameState.stats.research >= 80 
                        ? "border-green-500 text-green-600 dark:text-green-400 animate-glow-pulse" 
                        : ""
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    졸업까지 {Math.max(0, 100 - Math.round(gameState.stats.research))}%
                  </Badge>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <StatBar
                type="health"
                value={gameState.stats.health}
                maxValue={100}
                label="체력"
                showChange={statChanges.health}
              />
              <StatBar
                type="mental"
                value={gameState.stats.mental}
                maxValue={100}
                label="멘탈"
                showChange={statChanges.mental}
              />
              <StatBar
                type="research"
                value={gameState.stats.research}
                maxValue={100}
                label="연구 진척도"
                showChange={statChanges.research}
              />
              <StatBar
                type="money"
                value={gameState.stats.money}
                maxValue={1000000}
                label="돈"
                showChange={statChanges.money}
              />
              <StatBar
                type="advisor"
                value={gameState.stats.advisorFavor}
                maxValue={100}
                label="교수 호감도"
                showChange={statChanges.advisorFavor}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Zap className="w-4 h-4 text-yellow-500" />
                </motion.div>
                행동
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="research" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="research" data-testid="tab-research">연구</TabsTrigger>
                  <TabsTrigger value="life" data-testid="tab-life">생활</TabsTrigger>
                  <TabsTrigger value="work" data-testid="tab-work">알바</TabsTrigger>
                </TabsList>
                
                <TabsContent value="research" className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {researchActions.map((action, index) => (
                      <motion.div
                        key={action.type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ActionButton
                          action={action}
                          onAction={() => handleAction(action.type)}
                          disabled={isActionPending}
                          isLoading={isActionPending}
                        />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="life" className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {lifeActions.map((action, index) => (
                      <motion.div
                        key={action.type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ActionButton
                          action={action}
                          onAction={() => handleAction(action.type)}
                          disabled={isActionPending}
                          isLoading={isActionPending}
                        />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="work" className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {workActions.map((action, index) => (
                      <motion.div
                        key={action.type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ActionButton
                          action={action}
                          onAction={() => handleAction(action.type)}
                          disabled={isActionPending}
                          isLoading={isActionPending}
                        />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </motion.div>
                최근 이벤트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EventLog events={gameState.eventLog} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="grid grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="p-3 text-center hover-elevate">
            <motion.p 
              className="text-lg font-bold text-yellow-600 dark:text-yellow-400"
              key={gameState.coffeeCount}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              {gameState.coffeeCount}
            </motion.p>
            <p className="text-xs text-muted-foreground">커피 잔</p>
          </Card>
          <Card className="p-3 text-center hover-elevate">
            <motion.p 
              className="text-lg font-bold text-orange-600 dark:text-orange-400"
              key={gameState.ramenCount}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              {gameState.ramenCount}
            </motion.p>
            <p className="text-xs text-muted-foreground">라면 그릇</p>
          </Card>
          <Card className="p-3 text-center hover-elevate">
            <motion.p 
              className="text-lg font-bold text-red-600 dark:text-red-400"
              key={gameState.allNighterCount}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              {gameState.allNighterCount}
            </motion.p>
            <p className="text-xs text-muted-foreground">철야 횟수</p>
          </Card>
          <Card className="p-3 text-center hover-elevate">
            <motion.p 
              className="text-lg font-bold text-primary"
              key={gameState.totalDays}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              {gameState.totalDays}
            </motion.p>
            <p className="text-xs text-muted-foreground">총 일수</p>
          </Card>
        </motion.div>
      </main>

      <AnimatePresence>
        {lastEvent && (
          <EventModal event={lastEvent} onClose={clearLastEvent} />
        )}
      </AnimatePresence>
    </div>
  );
}
