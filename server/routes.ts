import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMessageSchema, insertConversationSchema } from "@shared/schema";
import { generateAIResponse } from "../client/src/services/ai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/sync", async (req, res) => {
    try {
      const { uid, email, displayName, photoURL } = req.body;
      
      let user = await storage.getUserByUid(uid);
      if (!user) {
        user = await storage.createUser({
          uid,
          email,
          displayName,
          photoURL,
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Auth sync error:", error);
      res.status(500).json({ message: "Failed to sync user" });
    }
  });

  // Character routes
  app.get("/api/characters", async (req, res) => {
    try {
      const characters = await storage.getAllCharacters();
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  app.get("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const character = await storage.getCharacter(id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch character" });
    }
  });

  // Conversation routes
  app.get("/api/conversations/:characterId/:userId", async (req, res) => {
    try {
      const characterId = parseInt(req.params.characterId);
      const userId = parseInt(req.params.userId);
      
      // Get user by UID if userId is actually a UID
      let user = await storage.getUserByUid(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let conversation = await storage.getConversation(user.id, characterId);
      if (!conversation) {
        conversation = await storage.createConversation({
          userId: user.id,
          characterId,
          title: null,
        });
      }
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Message routes
  app.get("/api/messages/:conversationId", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  // AI Chat routes
  app.post("/api/chat/generate", async (req, res) => {
    try {
      const { conversationId, characterId } = req.body;
      
      const character = await storage.getCharacter(characterId);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }

      const messages = await storage.getMessages(conversationId);
      const lastUserMessage = messages
        .filter(m => m.isUser)
        .slice(-1)[0];

      if (!lastUserMessage) {
        return res.status(400).json({ message: "No user message found" });
      }

      // Generate AI response
      const aiResponse = await generateAIResponse({
        character,
        messages,
        userMessage: lastUserMessage.content,
      });

      // Save AI response
      const aiMessage = await storage.createMessage({
        conversationId,
        content: aiResponse.content,
        isUser: false,
      });

      res.json(aiMessage);
    } catch (error) {
      console.error("AI generation error:", error);
      res.status(500).json({ message: "Failed to generate AI response" });
    }
  });

  // User character routes
  app.get("/api/user-characters/:userId", async (req, res) => {
    try {
      const user = await storage.getUserByUid(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userCharacters = await storage.getUserCharacters(user.id);
      res.json(userCharacters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user characters" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
