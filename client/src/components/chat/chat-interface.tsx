import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Star, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./sidebar";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/use-auth";
import type { Character } from "@/data/characters";

interface ChatInterfaceProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
  userCharacters: Character[];
}

export function ChatInterface({ character, onCharacterChange, userCharacters }: ChatInterfaceProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  const { messages, isTyping, sendMessage, isLoading } = useChat(
    character.id, 
    user?.uid || null
  );

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 pt-16 flex"
    >
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onCharacterSelect={(char) => {
            onCharacterChange(char);
            setSidebarOpen(false);
          }}
          currentCharacter={character}
          userCharacters={userCharacters}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="glass-effect border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="text-white opacity-70 hover:opacity-100 mr-4 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img 
                  src={character.imageUrl} 
                  alt={character.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div>
                <h3 className="font-poppins text-white font-semibold">
                  {character.name}
                </h3>
                <p className="text-white opacity-60 text-sm">Online</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white opacity-70 hover:opacity-100"
              >
                <Star className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white opacity-70 hover:opacity-100"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <MessageList 
          messages={messages as any[]} 
          character={character} 
          isTyping={isTyping} 
        />

        {/* Message Input */}
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading} 
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </motion.div>
  );
}
