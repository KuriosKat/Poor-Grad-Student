import { useState, useCallback, useEffect } from "react";
import { 
  type GameState, 
  type GameEvent, 
  type ActionType,
  createInitialGameState, 
  GAME_ACTIONS,
  RANDOM_EVENTS 
} from "@shared/schema";

const STORAGE_KEY = "graduate_survival_game";

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function loadGameFromStorage(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load game:", e);
  }
  return null;
}

function saveGameToStorage(game: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  } catch (e) {
    console.error("Failed to save game:", e);
  }
}

function clearGameFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear game:", e);
  }
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastEvent, setLastEvent] = useState<GameEvent | null>(null);
  const [statChanges, setStatChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = loadGameFromStorage();
    if (saved && !saved.isGameOver && !saved.isGraduated) {
      setGameState(saved);
    }
  }, []);

  useEffect(() => {
    if (gameState) {
      saveGameToStorage(gameState);
    }
  }, [gameState]);

  const createGame = useCallback(() => {
    setIsLoading(true);
    const id = generateId();
    const newGame = createInitialGameState(id);
    setGameState(newGame);
    setLastEvent(null);
    setStatChanges({});
    setIsLoading(false);
    return newGame;
  }, []);

  const performAction = useCallback((actionType: ActionType): { 
    success: boolean; 
    event?: GameEvent; 
    changes: Record<string, number>;
  } => {
    if (!gameState || gameState.isGameOver || gameState.isGraduated) {
      return { success: false, changes: {} };
    }

    const action = GAME_ACTIONS.find(a => a.type === actionType);
    if (!action) {
      return { success: false, changes: {} };
    }

    const changes: Record<string, number> = {};
    const newStats = { ...gameState.stats };

    for (const [key, value] of Object.entries(action.effects)) {
      if (value !== undefined) {
        const statKey = key as keyof typeof newStats;
        changes[key] = value;
        newStats[statKey] = Math.max(0, Math.min(
          statKey === "money" ? 1000000 : 100,
          newStats[statKey] + value
        ));
      }
    }

    const newGame = { ...gameState };
    
    if (actionType === "drinkCoffee") {
      newGame.coffeeCount += 1;
    }
    if (actionType === "eatRamen") {
      newGame.ramenCount += 1;
    }

    let triggeredEvent: GameEvent | undefined;
    const randomValue = Math.random();
    let cumulativeProbability = 0;

    for (const eventDef of RANDOM_EVENTS) {
      cumulativeProbability += eventDef.probability;
      if (randomValue < cumulativeProbability) {
        triggeredEvent = {
          id: `${eventDef.id}-${Date.now()}`,
          title: eventDef.title,
          description: eventDef.description,
          effects: eventDef.effects,
          timestamp: Date.now(),
          isPositive: eventDef.isPositive
        };

        for (const [key, value] of Object.entries(eventDef.effects)) {
          if (value !== undefined) {
            const statKey = key as keyof typeof newStats;
            changes[key] = (changes[key] || 0) + value;
            newStats[statKey] = Math.max(0, Math.min(
              statKey === "money" ? 1000000 : 100,
              newStats[statKey] + value
            ));
          }
        }

        if (eventDef.id === "all_nighter") {
          newGame.allNighterCount += 1;
        }

        newGame.eventLog = [...newGame.eventLog, triggeredEvent];
        break;
      }
    }

    newGame.stats = newStats;
    newGame.lastAction = actionType;
    newGame.day += 1;
    newGame.totalDays += 1;

    if (newGame.day > 30) {
      newGame.day = 1;
      newGame.semester += 1;
    }

    if (newGame.stats.research >= 100) {
      newGame.isGraduated = true;
    }

    if (newGame.stats.health <= 0) {
      newGame.isGameOver = true;
      newGame.gameOverReason = "health";
    } else if (newGame.stats.mental <= 0) {
      newGame.isGameOver = true;
      newGame.gameOverReason = "mental";
    } else if (newGame.stats.advisorFavor <= 0) {
      newGame.isGameOver = true;
      newGame.gameOverReason = "advisor";
    } else if (newGame.stats.money <= 0) {
      newGame.isGameOver = true;
      newGame.gameOverReason = "money";
    }

    setGameState(newGame);
    setStatChanges(changes);
    
    if (triggeredEvent) {
      setLastEvent(triggeredEvent);
    }

    setTimeout(() => setStatChanges({}), 1500);

    return { success: true, event: triggeredEvent, changes };
  }, [gameState]);

  const resetGame = useCallback(() => {
    clearGameFromStorage();
    setGameState(null);
    setLastEvent(null);
    setStatChanges({});
  }, []);

  const clearLastEvent = useCallback(() => {
    setLastEvent(null);
  }, []);

  return {
    gameState,
    isLoading,
    lastEvent,
    statChanges,
    createGame,
    performAction,
    resetGame,
    clearLastEvent,
  };
}
