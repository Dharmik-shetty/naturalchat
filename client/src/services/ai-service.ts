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

// Fallback responses for when AI service is not available
const fallbackResponses = {
  artistic: [
    "I love talking about art and creativity! What inspires you most?",
    "There's so much beauty in the world to explore together.",
    "I find meaning in the little artistic moments of life."
  ],
  adventurous: [
    "Life is such an amazing adventure! What's the most exciting thing you've done lately?",
    "I'm always ready for the next exciting experience!",
    "Every day brings new possibilities to explore!"
  ],
  gentle: [
    "I'm here to listen and understand. How are you feeling today?",
    "Sometimes the most meaningful conversations happen in quiet moments.",
    "Your thoughts and feelings matter to me."
  ],
  intellectual: [
    "That's such a fascinating topic! What are your thoughts on it?",
    "I love diving deep into complex ideas and discussions.",
    "Philosophy and literature offer such rich perspectives on life."
  ],
  creative: [
    "Music and creativity flow through everything I do! What moves you?",
    "There's a rhythm and melody in every conversation.",
    "Art has a way of expressing what words sometimes can't."
  ],
  innovative: [
    "Technology opens up so many amazing possibilities for human connection!",
    "The future is full of exciting innovations. What interests you most?",
    "I love discussing how technology can improve our lives."
  ]
};

function getCharacterCategory(traits: string[]): keyof typeof fallbackResponses {
  if (traits.includes('artistic') || traits.includes('creative')) return 'artistic';
  if (traits.includes('adventurous') || traits.includes('energetic')) return 'adventurous';
  if (traits.includes('gentle') || traits.includes('empathetic')) return 'gentle';
  if (traits.includes('intellectual') || traits.includes('sophisticated')) return 'intellectual';
  if (traits.includes('passionate') || traits.includes('expressive')) return 'creative';
  if (traits.includes('innovative') || traits.includes('tech-savvy')) return 'innovative';
  return 'gentle'; // default fallback
}

export async function generateAIResponse({ character, messages, userMessage }: ChatRequest): Promise<ChatResponse> {
  try {
    // Build conversation history
    const conversationHistory = messages
      .slice(-10) // Keep last 10 messages for context
      .map(msg => `${msg.isUser ? 'User' : character.name}: ${msg.content}`)
      .join('\n');

    // Create character prompt
    const traits = Array.isArray(character.traits) ? character.traits : [];
    const interests = Array.isArray(character.interests) ? character.interests : [];
    
    const characterPrompt = `You are ${character.name}. ${character.personality}

Your personality traits: ${traits.join(', ')}
Your interests: ${interests.join(', ')}

You should respond as ${character.name} would, staying true to your personality. Keep responses natural, conversational, and engaging. Avoid being overly dramatic or artificial. Respond like a real person texting.

Previous conversation:
${conversationHistory}

User: ${userMessage}
${character.name}:`;

    // Try to use Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: characterPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 200,
          topP: 0.9,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I didn't understand that. Could you try again?";

    return { content: content.trim() };
  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Fallback to character-specific responses
    const traits = Array.isArray(character.traits) ? character.traits : [];
    const category = getCharacterCategory(traits);
    const responses = fallbackResponses[category];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return { 
      content: randomResponse
    };
  }
}


