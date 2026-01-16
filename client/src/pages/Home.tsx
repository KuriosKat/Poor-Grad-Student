import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Zap, Heart, Sparkles, TrendingUp } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { StatBar } from "@/components/game/StatBar";
import { ActionButton } from "@/components/game/ActionButton";
import { EventModal } from "@/components/game/EventModal";
import { GameHeader } from "@/components/game/GameHeader";
import { GameOverScreen } from "@/components/game/GameOverScreen";
import { StartScreen } from "@/components/game/StartScreen";
import { EventLog } from "@/components/game/EventLog";

import type { GameState, GameEvent, ActionType } from "@shared/schema";
import { GAME_ACTIONS } from "@shared/schema";

export default function Home() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [statChanges, setStatChanges] = useState<Record<string, number>>({});
  
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

  const { data: gameState, isLoading: isLoadingGame } = useQuery<GameState>({
    queryKey: ["/api/game", gameId],
    queryFn: async () => {
      const response = await fetch(`/api/game/${gameId}`);
      if (!response.ok) throw new Error("Failed to fetch game");
      return response.json();
    },
    enabled: !!gameId,
    refetchOnWindowFocus: false,
  });

  const createGameMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/game");
      return response.json();
    },
    onSuccess: (data: GameState) => {
      setGameId(data.id);
      queryClient.setQueryData(["/api/game", data.id], data);
    },
    onError: () => {
      toast({
        title: "오류",
        description: "게임을 시작할 수 없습니다.",
        variant: "destructive",
      });
    },
  });

  const actionMutation = useMutation({
    mutationFn: async (action: ActionType) => {
      const response = await apiRequest("POST", "/api/game/action", {
        gameId,
        action,
      });
      return response.json();
    },
    onSuccess: (data: { gameState: GameState; event?: GameEvent; changes: Record<string, number> }) => {
      queryClient.setQueryData(["/api/game", gameId], data.gameState);
      
      setStatChanges(data.changes);
      setTimeout(() => setStatChanges({}), 1000);
      
      if (data.event) {
        setCurrentEvent(data.event);
      }
      
      if (data.gameState.isGraduated) {
        toast({
          title: "축하합니다!",
          description: "드디어 졸업에 성공했습니다!",
        });
      } else if (data.gameState.isGameOver) {
        toast({
          title: "게임 오버",
          description: "다음에는 더 잘할 수 있을 거예요...",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "오류",
        description: "행동을 수행할 수 없습니다.",
        variant: "destructive",
      });
    },
  });

  const handleStart = () => {
    createGameMutation.mutate();
  };

  const handleNewGame = () => {
    setGameId(null);
    setCurrentEvent(null);
    setStatChanges({});
  };

  const handleAction = (actionType: ActionType) => {
    if (!gameId || actionMutation.isPending) return;
    actionMutation.mutate(actionType);
  };

  const closeEventModal = () => {
    setCurrentEvent(null);
  };

  if (!gameId) {
    return (
      <StartScreen 
        onStart={handleStart} 
        isLoading={createGameMutation.isPending} 
      />
    );
  }

  if (isLoadingGame) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <StartScreen 
        onStart={handleStart} 
        isLoading={createGameMutation.isPending} 
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
    <div className="min-h-screen bg-background">
      <GameHeader
        day={gameState.day}
        semester={gameState.semester}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onNewGame={handleNewGame}
      />

      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                상태
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                졸업까지 {Math.max(0, 100 - Math.round(gameState.stats.research))}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
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
                  {researchActions.map((action) => (
                    <ActionButton
                      key={action.type}
                      action={action}
                      onAction={() => handleAction(action.type)}
                      disabled={actionMutation.isPending}
                      isLoading={actionMutation.isPending}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="life" className="mt-4">
                <div className="grid grid-cols-2 gap-3">
                  {lifeActions.map((action) => (
                    <ActionButton
                      key={action.type}
                      action={action}
                      onAction={() => handleAction(action.type)}
                      disabled={actionMutation.isPending}
                      isLoading={actionMutation.isPending}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="work" className="mt-4">
                <div className="grid grid-cols-2 gap-3">
                  {workActions.map((action) => (
                    <ActionButton
                      key={action.type}
                      action={action}
                      onAction={() => handleAction(action.type)}
                      disabled={actionMutation.isPending}
                      isLoading={actionMutation.isPending}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              최근 이벤트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventLog events={gameState.eventLog} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-3">
          <Card className="p-3 text-center">
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {gameState.coffeeCount}
            </p>
            <p className="text-xs text-muted-foreground">커피 잔</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {gameState.ramenCount}
            </p>
            <p className="text-xs text-muted-foreground">라면 그릇</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              {gameState.allNighterCount}
            </p>
            <p className="text-xs text-muted-foreground">철야 횟수</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-lg font-bold text-primary">
              {gameState.totalDays}
            </p>
            <p className="text-xs text-muted-foreground">총 일수</p>
          </Card>
        </div>
      </main>

      <AnimatePresence>
        {currentEvent && (
          <EventModal event={currentEvent} onClose={closeEventModal} />
        )}
      </AnimatePresence>
    </div>
  );
}
