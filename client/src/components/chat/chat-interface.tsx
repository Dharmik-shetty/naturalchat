import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, Star, MoreVertical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./sidebar";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { AuthModal } from "@/components/auth-modal";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import type { Character } from "@/data/characters";

interface ChatInterfaceProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
  userCharacters: Character[];
}

export function ChatInterface({ character, onCharacterChange, userCharacters }: ChatInterfaceProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  
  const { messages, isTyping, sendMessage, isLoading } = useChat(
    character.id, 
    user?.uid || "demo-user"
  );

  // Check if user has sent 4+ messages and show auth modal
  const userMessageCount = messages.filter((msg: any) => msg.isUser).length;
  const shouldShowAuthPrompt = userMessageCount >= 4 && !user;

  useEffect(() => {
    if (shouldShowAuthPrompt) {
      setShowAuthModal(true);
    }
  }, [shouldShowAuthPrompt]);

  const handleSendMessage = (content: string) => {
    if (shouldShowAuthPrompt && !user) {
      setShowAuthModal(true);
      return;
    }
    sendMessage(content);
  };

  return (
    <div className="h-screen flex flex-col gradient-bg">
      {/* Professional Chat Header */}
      <div className="glass-effect border-b border-white/10 backdrop-blur-lg">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/characters">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="text-white/70 hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20">
                  <img 
                    src={character.imageUrl} 
                    alt={character.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              
              <div>
                <h3 className="font-poppins text-white font-semibold text-lg">
                  {character.name}
                </h3>
                <p className="text-white/60 text-sm">
                  {isTyping ? "Typing..." : "Online"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
              <Star className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 flex overflow-hidden">
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

        {/* Chat Area */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Character Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 text-center border-b border-white/10"
          >
            <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-white/80 text-sm leading-relaxed">
                {character.description}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {character.traits?.map((trait) => (
                  <span 
                    key={trait}
                    className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            <MessageList 
              messages={messages as any[]} 
              character={character} 
              isTyping={isTyping} 
            />
          </div>

          {/* Message Input */}
          <div className="border-t border-white/10 p-4">
            <div className="max-w-2xl mx-auto">
              {shouldShowAuthPrompt && !user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 glass-effect rounded-xl text-center"
                >
                  <p className="text-white/80 text-sm mb-3">
                    You've reached the message limit. Sign in with Google to continue chatting!
                  </p>
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-[hsl(333,100%,70%)] to-[hsl(266,68%,73%)] hover:shadow-lg"
                  >
                    Sign In to Continue
                  </Button>
                </motion.div>
              )}
              
              <MessageInput 
                onSendMessage={handleSendMessage}
                disabled={isLoading || (shouldShowAuthPrompt && !user)}
                placeholder={
                  shouldShowAuthPrompt && !user 
                    ? "Sign in to continue chatting..." 
                    : `Message ${character.name}...`
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Sign in with Google to continue your unlimited conversations!"
      />
    </div>
  );
}