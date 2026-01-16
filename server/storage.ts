import { randomUUID } from "crypto";
import { 
  type GameState, 
  type GameEvent, 
  type ActionType,
  createInitialGameState, 
  GAME_ACTIONS,
  RANDOM_EVENTS 
} from "@shared/schema";

export interface IStorage {
  createGame(): Promise<GameState>;
  getGame(id: string): Promise<GameState | undefined>;
  updateGame(id: string, game: GameState): Promise<GameState>;
  performAction(gameId: string, action: ActionType): Promise<{
    gameState: GameState;
    event?: GameEvent;
    changes: Record<string, number>;
  }>;
}

export class MemStorage implements IStorage {
  private games: Map<string, GameState>;

  constructor() {
    this.games = new Map();
  }

  async createGame(): Promise<GameState> {
    const id = randomUUID();
    const gameState = createInitialGameState(id);
    this.games.set(id, gameState);
    return gameState;
  }

  async getGame(id: string): Promise<GameState | undefined> {
    return this.games.get(id);
  }

  async updateGame(id: string, game: GameState): Promise<GameState> {
    this.games.set(id, game);
    return game;
  }

  async performAction(gameId: string, actionType: ActionType): Promise<{
    gameState: GameState;
    event?: GameEvent;
    changes: Record<string, number>;
  }> {
    const game = await this.getGame(gameId);
    if (!game) {
      throw new Error("Game not found");
    }

    if (game.isGameOver || game.isGraduated) {
      return { gameState: game, changes: {} };
    }

    const action = GAME_ACTIONS.find(a => a.type === actionType);
    if (!action) {
      throw new Error("Invalid action");
    }

    const changes: Record<string, number> = {};
    const newStats = { ...game.stats };

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

    if (actionType === "drinkCoffee") {
      game.coffeeCount += 1;
    }
    if (actionType === "eatRamen") {
      game.ramenCount += 1;
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
          game.allNighterCount += 1;
        }

        game.eventLog.push(triggeredEvent);
        break;
      }
    }

    game.stats = newStats;
    game.lastAction = actionType;
    game.day += 1;
    game.totalDays += 1;

    if (game.day > 30) {
      game.day = 1;
      game.semester += 1;
    }

    if (game.stats.research >= 100) {
      game.isGraduated = true;
    }

    if (game.stats.health <= 0) {
      game.isGameOver = true;
      game.gameOverReason = "health";
    } else if (game.stats.mental <= 0) {
      game.isGameOver = true;
      game.gameOverReason = "mental";
    } else if (game.stats.advisorFavor <= 0) {
      game.isGameOver = true;
      game.gameOverReason = "advisor";
    } else if (game.stats.money <= 0) {
      game.isGameOver = true;
      game.gameOverReason = "money";
    }

    await this.updateGame(gameId, game);

    return { gameState: game, event: triggeredEvent, changes };
  }
}

export const storage = new MemStorage();
