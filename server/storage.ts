import { 
  users, 
  characters, 
  conversations, 
  messages, 
  userCharacters,
  type User, 
  type Character,
  type Conversation,
  type Message,
  type UserCharacter,
  type InsertUser, 
  type InsertCharacter,
  type InsertConversation,
  type InsertMessage,
  type InsertUserCharacter
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Character operations
  getCharacter(id: number): Promise<Character | undefined>;
  getAllCharacters(): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  
  // Conversation operations
  getConversation(userId: number, characterId: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getUserConversations(userId: number): Promise<Conversation[]>;
  
  // Message operations
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // User character operations
  getUserCharacters(userId: number): Promise<UserCharacter[]>;
  createUserCharacter(userCharacter: InsertUserCharacter): Promise<UserCharacter>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private characters: Map<number, Character>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private userCharacters: Map<number, UserCharacter>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.characters = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.userCharacters = new Map();
    this.currentId = 1;
    
    // Initialize with sample characters
    this.initializeCharacters();
  }

  private initializeCharacters() {
    const sampleCharacters = [
      {
        name: "Sofia",
        description: "Artistic soul with a love for deep conversations about life, art, and dreams. Sofia brings warmth and creativity to every chat.",
        personality: "Sofia is creative, empathetic, and loves exploring the deeper meanings in life. She's passionate about art, literature, and human connection. She speaks with warmth and often shares artistic perspectives on everyday experiences.",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        traits: ["artistic", "empathetic", "creative", "thoughtful"],
        interests: ["art", "literature", "philosophy", "music"],
        isActive: true,
      },
      {
        name: "Maya",
        description: "Adventurous spirit who loves exploring new ideas, traveling the world, and sharing exciting stories from her journeys.",
        personality: "Maya is adventurous, curious, and energetic. She loves trying new things, exploring different cultures, and pushing boundaries. She's optimistic and always ready for the next adventure.",
        imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        traits: ["adventurous", "energetic", "curious", "optimistic"],
        interests: ["travel", "cultures", "outdoor activities", "photography"],
        isActive: true,
      },
      {
        name: "Luna",
        description: "Gentle and empathetic, Luna specializes in meaningful connections and thoughtful conversations about emotions and mindfulness.",
        personality: "Luna is gentle, wise, and deeply empathetic. She has a calming presence and loves helping others understand their emotions. She's interested in mindfulness, meditation, and personal growth.",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        traits: ["gentle", "empathetic", "wise", "calming"],
        interests: ["mindfulness", "meditation", "psychology", "nature"],
        isActive: true,
      },
      {
        name: "Isabella",
        description: "Sophisticated and witty, loves discussing philosophy and literature.",
        personality: "Isabella is intellectual, sophisticated, and has a sharp wit. She enjoys deep philosophical discussions and analyzing literature. She's well-read and loves sharing her knowledge.",
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        traits: ["intellectual", "sophisticated", "witty", "analytical"],
        interests: ["philosophy", "literature", "history", "debate"],
        isActive: true,
      },
      {
        name: "Aria",
        description: "Creative musician who loves sharing stories about art and inspiration.",
        personality: "Aria is passionate about music and creativity. She's expressive, emotional, and loves sharing the stories behind her artistic inspirations. She sees the world through a musical lens.",
        imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        traits: ["creative", "passionate", "expressive", "musical"],
        interests: ["music", "composition", "performance", "creativity"],
        isActive: true,
      },
      {
        name: "Zoe",
        description: "Tech-savvy innovator passionate about the future and meaningful connections.",
        personality: "Zoe is tech-savvy, forward-thinking, and passionate about innovation. She loves discussing the future, technology trends, and how they can improve human connections.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        traits: ["innovative", "tech-savvy", "forward-thinking", "analytical"],
        interests: ["technology", "innovation", "future trends", "AI"],
        isActive: true,
      }
    ];

    sampleCharacters.forEach(char => {
      const id = this.currentId++;
      const character: Character = {
        id,
        ...char,
        createdAt: new Date(),
      };
      this.characters.set(id, character);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.uid === uid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      displayName: insertUser.displayName || null,
      photoURL: insertUser.photoURL || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async getAllCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values()).filter(char => char.isActive);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.currentId++;
    const character: Character = {
      ...insertCharacter,
      id,
      isActive: insertCharacter.isActive ?? true,
      createdAt: new Date(),
    };
    this.characters.set(id, character);
    return character;
  }

  async getConversation(userId: number, characterId: number): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(
      conv => conv.userId === userId && conv.characterId === characterId
    );
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentId++;
    const conversation: Conversation = {
      ...insertConversation,
      id,
      title: insertConversation.title || null,
      lastMessageAt: new Date(),
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(conv => conv.userId === userId);
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.messages.set(id, message);
    
    // Update conversation's lastMessageAt
    const conversation = this.conversations.get(insertMessage.conversationId);
    if (conversation) {
      conversation.lastMessageAt = new Date();
    }
    
    return message;
  }

  async getUserCharacters(userId: number): Promise<UserCharacter[]> {
    return Array.from(this.userCharacters.values()).filter(uc => uc.userId === userId);
  }

  async createUserCharacter(insertUserCharacter: InsertUserCharacter): Promise<UserCharacter> {
    const id = this.currentId++;
    const userCharacter: UserCharacter = {
      ...insertUserCharacter,
      id,
      isFavorite: insertUserCharacter.isFavorite ?? false,
      lastChatAt: insertUserCharacter.lastChatAt || null,
      createdAt: new Date(),
    };
    this.userCharacters.set(id, userCharacter);
    return userCharacter;
  }
}

export const storage = new MemStorage();
