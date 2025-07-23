import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-end space-x-3`}
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
            
            <div className={`max-w-xs lg:max-w-md ${message.isUser ? 'order-first' : ''}`}>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-gradient-to-r from-[hsl(333,100%,70%)] to-[hsl(266,68%,73%)] text-white ml-auto'
                    : 'bg-white/10 text-white backdrop-blur-lg border border-white/20'
                } shadow-lg`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              
              <div className={`mt-1 px-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
                <span className="text-xs text-white/50">
                  {format(message.timestamp, 'HH:mm')}
                </span>
              </div>
            </div>

            {message.isUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(333,100%,70%)] to-[hsl(266,68%,73%)] flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">You</span>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Typing Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-start items-end space-x-3"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.length === 0 && !isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
            <img 
              src={character.imageUrl} 
              alt={character.name}
              className="w-full h-full object-cover" 
            />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">
            Start chatting with {character.name}
          </h3>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            {character.description}
          </p>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}