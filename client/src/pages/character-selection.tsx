import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CharacterCard } from "@/components/character-card";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { characters } from "@/data/characters";
import type { Character } from "@/data/characters";

export default function CharacterSelection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [personalityFilter, setPersonalityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showLoading, setShowLoading] = useState(false);

  const filteredCharacters = characters
    .filter(character => {
      const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           character.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPersonality = !personalityFilter || personalityFilter === "all" || character.traits.includes(personalityFilter);
      return matchesSearch && matchesPersonality;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "popularity") return Math.random() - 0.5; // Random for demo
      return 0;
    });

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
    // Navigate to chat
    window.location.href = `/chat/${selectedCharacter?.id}`;
  };

  if (showLoading && selectedCharacter) {
    return (
      <LoadingScreen
        character={selectedCharacter}
        onComplete={handleLoadingComplete}
        onCancel={() => setShowLoading(false)}
      />
    );
  }

  return (
    <div className="min-h-screen gradient-bg pt-20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:text-[hsl(333,100%,70%)]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="font-poppins text-2xl font-bold text-white">
              AI Companion
            </h1>
            <div />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-poppins text-5xl font-bold text-white mb-4">
            Choose Your Companion
          </h1>
          <p className="font-inter text-xl text-white opacity-80">
            Select the perfect AI companion for meaningful conversations
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-70 h-4 w-4" />
              <Input
                placeholder="Search companions by name or interests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/20 text-white placeholder-white/70 pl-10 border-white/30"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={personalityFilter} onValueChange={setPersonalityFilter}>
                <SelectTrigger className="w-40 bg-white/20 text-white border-white/30">
                  <SelectValue placeholder="Personality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="adventurous">Adventurous</SelectItem>
                  <SelectItem value="gentle">Gentle</SelectItem>
                  <SelectItem value="intellectual">Intellectual</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-white/20 text-white border-white/30">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Character Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredCharacters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CharacterCard 
                character={character} 
                onSelect={handleCharacterSelect}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredCharacters.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-white opacity-70 text-lg">
              No companions found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
