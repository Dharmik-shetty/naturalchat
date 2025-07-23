import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase UID
  email: text("email").notNull(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  personality: text("personality").notNull(),
  imageUrl: text("image_url").notNull(),
  traits: jsonb("traits").notNull(), // Array of personality traits
  interests: jsonb("interests").notNull(), // Array of interests
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  characterId: integer("character_id").references(() => characters.id).notNull(),
  title: text("title"),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  content: text("content").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const userCharacters = pgTable("user_characters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  characterId: integer("character_id").references(() => characters.id).notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  lastChatAt: timestamp("last_chat_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  lastMessageAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertUserCharacterSchema = createInsertSchema(userCharacters).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type Character = typeof characters.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type UserCharacter = typeof userCharacters.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertUserCharacter = z.infer<typeof insertUserCharacterSchema>;
