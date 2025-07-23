import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { characters } from "@/data/characters";
import type { Character } from "@/data/characters";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterSelect: (character: Character) => void;
  currentCharacter: Character | null;
  userCharacters: Character[];
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  onCharacterSelect, 
  currentCharacter,
  userCharacters 
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: isOpen ? 0 : -320 }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed md:relative w-80 h-full glass-effect border-r border-white/20 flex flex-col z-30"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-poppins text-xl font-semibold text-white">
            Companions
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white opacity-70 hover:opacity-100 md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-70 h-4 w-4" />
          <Input
            placeholder="Search companions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/20 text-white placeholder-white/70 pl-10 border-white/30"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scroll-hidden">
        {/* My Characters */}
        {userCharacters.length > 0 && (
          <div className="p-4">
            <h3 className="font-poppins text-sm font-semibold text-white opacity-80 uppercase tracking-wide mb-3">
              My Characters
            </h3>
            <div className="space-y-2">
              {userCharacters.map((character) => (
                <CharacterItem
                  key={character.id}
                  character={character}
                  isActive={currentCharacter?.id === character.id}
                  onClick={() => onCharacterSelect(character)}
                  showLastMessage
                />
              ))}
            </div>
          </div>
        )}

        {/* All Characters */}
        <div className="p-4">
          <h3 className="font-poppins text-sm font-semibold text-white opacity-80 uppercase tracking-wide mb-3">
            All Characters
          </h3>
          <div className="space-y-2">
            {filteredCharacters.map((character) => (
              <CharacterItem
                key={character.id}
                character={character}
                isActive={currentCharacter?.id === character.id}
                onClick={() => onCharacterSelect(character)}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface CharacterItemProps {
  character: Character;
  isActive: boolean;
  onClick: () => void;
  showLastMessage?: boolean;
}

function CharacterItem({ character, isActive, onClick, showLastMessage }: CharacterItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-[hsl(333,100%,70%)]/20 to-[hsl(266,68%,73%)]/20 border border-white/30' 
          : 'hover:bg-white/10'
      }`}
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
        <img 
          src={character.imageUrl} 
          alt={character.name}
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-poppins text-white font-medium text-sm truncate">
          {character.name}
        </h4>
        <p className="text-white opacity-60 text-xs truncate">
          {showLastMessage ? "Hey! How was your day? 😊" : character.shortDescription}
        </p>
      </div>
      
      {showLastMessage && (
        <div className="text-white opacity-60 text-xs flex-shrink-0">
          2m
        </div>
      )}
    </motion.div>
  );
}
