import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/chat-interface";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import { characters } from "@/data/characters";
import type { Character } from "@/data/characters";

export default function Chat() {
  const [, params] = useRoute("/chat/:id");
  const { user } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [userCharacters, setUserCharacters] = useState<Character[]>([]);

  useEffect(() => {
    if (params?.id) {
      const characterId = parseInt(params.id);
      const foundCharacter = characters.find(c => c.id === characterId);
      if (foundCharacter) {
        setCharacter(foundCharacter);
      }
    }
  }, [params?.id]);

  useEffect(() => {
    // Check if auth is required after 3-4 messages
    if (messageCount >= 3 && !user) {
      setShowAuthModal(true);
    }
  }, [messageCount, user]);

  useEffect(() => {
    // Load user characters (demo data for now)
    if (user && character) {
      setUserCharacters([character]);
    }
  }, [user, character]);

  const handleCharacterChange = (newCharacter: Character) => {
    setCharacter(newCharacter);
    window.history.pushState({}, '', `/chat/${newCharacter.id}`);
  };

  if (!character) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-poppins text-2xl font-bold text-white">
            Character not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen gradient-bg"
    >
      <ChatInterface
        character={character}
        onCharacterChange={handleCharacterChange}
        userCharacters={userCharacters}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </motion.div>
  );
}
