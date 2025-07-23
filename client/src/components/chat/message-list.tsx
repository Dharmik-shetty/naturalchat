import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import type { Character } from "@/data/characters";

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  character: Character;
  isTyping: boolean;
}

export function MessageList({ messages, character, isTyping }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto scroll-hidden p-4 space-y-4">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start space-x-3 ${
              message.isUser ? 'justify-end' : ''
            }`}
          >
            {!message.isUser && (
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={character.imageUrl} 
                  alt={character.name}
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            
            <div className={`flex-1 ${message.isUser ? 'flex justify-end' : ''}`}>
              <div className={`p-3 rounded-2xl max-w-xs lg:max-w-md ${
                message.isUser 
                  ? 'chat-bubble-user text-white rounded-tr-md ml-auto' 
                  : 'chat-bubble-ai text-white rounded-tl-md'
              }`}>
                <p className="font-inter break-words">{message.content}</p>
              </div>
              <p className={`text-white opacity-50 text-xs mt-1 ${
                message.isUser ? 'text-right' : ''
              }`}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            
            {message.isUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(333,100%,70%)] to-[hsl(266,68%,73%)] flex items-center justify-center flex-shrink-0">
                <User className="text-white text-sm" />
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-start space-x-3"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1">
              <div className="chat-bubble-ai text-white p-3 rounded-2xl rounded-tl-md">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-white opacity-50 text-xs mt-1">
                {character.name} is typing...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}
