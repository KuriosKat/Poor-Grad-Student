import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { performActionSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/game", async (req, res) => {
    try {
      const gameState = await storage.createGame();
      res.json(gameState);
    } catch (error) {
      console.error("Error creating game:", error);
      res.status(500).json({ error: "Failed to create game" });
    }
  });

  app.get("/api/game/:gameId", async (req, res) => {
    try {
      const { gameId } = req.params;
      const gameState = await storage.getGame(gameId);
      
      if (!gameState) {
        return res.status(404).json({ error: "Game not found" });
      }
      
      res.json(gameState);
    } catch (error) {
      console.error("Error getting game:", error);
      res.status(500).json({ error: "Failed to get game" });
    }
  });

  app.post("/api/game/action", async (req, res) => {
    try {
      const validationResult = performActionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: validationResult.error.errors 
        });
      }
      
      const { gameId, action } = validationResult.data;
      const result = await storage.performAction(gameId, action);
      
      res.json(result);
    } catch (error) {
      console.error("Error performing action:", error);
      if (error instanceof Error && error.message === "Game not found") {
        return res.status(404).json({ error: "Game not found" });
      }
      res.status(500).json({ error: "Failed to perform action" });
    }
  });

  return httpServer;
}
