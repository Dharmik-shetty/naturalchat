import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Character } from "@/data/characters";

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  featured?: boolean;
}

export function CharacterCard({ character, onSelect, featured = false }: CharacterCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => onSelect(character)}
    >
      <div className="relative">
        <img
          src={character.imageUrl}
          alt={character.name}
          className={`w-full object-cover ${featured ? 'h-48' : 'h-40'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <div className={`p-${featured ? '6' : '4'}`}>
        <h3 className={`font-poppins font-semibold text-white mb-2 ${featured ? 'text-2xl' : 'text-lg'}`}>
          {character.name}
        </h3>
        
        <p className={`font-inter text-white opacity-80 mb-${featured ? '4' : '3'} ${featured ? 'text-base' : 'text-sm'} line-clamp-2`}>
          {featured ? character.description : character.shortDescription}
        </p>
        
        <Button
          className={`w-full bg-gradient-to-r from-[hsl(333,100%,70%)] to-[hsl(266,68%,73%)] hover:shadow-lg transition-all duration-300 ${featured ? 'py-3' : 'py-2'}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(character);
          }}
        >
          {featured ? `Chat with ${character.name}` : 'Chat Now'}
        </Button>
      </div>
    </motion.div>
  );
}
