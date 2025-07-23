import { Character, Message } from "@shared/schema";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "default_key";

export interface ChatRequest {
  character: Character;
  messages: Message[];
  userMessage: string;
}

export interface ChatResponse {
  content: string;
}


