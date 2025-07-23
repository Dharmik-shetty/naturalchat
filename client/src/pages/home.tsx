import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CharacterCard } from "@/components/character-card";
import { characters } from "@/data/characters";
import { MessageCircle, Brain, Heart, Shield } from "lucide-react";

export default function Home() {
  const featuredCharacters = characters.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="font-poppins text-2xl font-bold text-white">
                AI Companion
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="#home" className="text-white hover:text-[hsl(333,100%,70%)] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                Home
              </a>
              <a href="#characters" className="text-white hover:text-[hsl(333,100%,70%)] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                Characters
              </a>
              <a href="#about" className="text-white hover:text-[hsl(333,100%,70%)] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                About
              </a>
              <Link href="/character-selection">
                <Button className="bg-gradient-to-r from-[hsl(333,100%,70%)] to-[hsl(266,68%,73%)] text-white hover:shadow-lg transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 gradient-bg opacity-90" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-[hsl(333,100%,70%)] rounded-full opacity-30 animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-[hsl(175,60%,55%)] rounded-full opacity-25 animate-float" style={{ animationDelay: '-4s' }} />
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-poppins text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Meet Your Perfect<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(333,100%,70%)] to-[hsl(266,68%,73%)]">
              AI Companion
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-inter text-xl md:text-2xl text-white opacity-90 mb-8 max-w-3xl mx-auto"
          >
            Experience authentic, meaningful conversations with AI companions who understand and connect with you on a deeper level.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/character-selection">
              <Button className="bg-gradient-to-r from-[hsl(333,100%,70%)] to-[hsl(266,68%,73%)] text-white font-poppins text-lg font-semibold px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 animate-glow">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Chatting Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white bg-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-poppins text-4xl font-bold text-white mb-4">
              Why Choose Our AI Companions?
            </h2>
            <p className="font-inter text-xl text-white opacity-80">
              Experience the future of digital relationships
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Advanced AI",
                description: "Powered by sophisticated trained models to provide natural conversations that feel genuinely human.",
                gradient: "from-[hsl(333,100%,70%)] to-[hsl(266,68%,73%)]"
              },
              {
                icon: Heart,
                title: "Personalized Experience",
                description: "Each companion has unique personalities, interests, and conversation styles tailored to connect with you.",
                gradient: "from-[hsl(175,60%,55%)] to-[hsl(151,55%,80%)]"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your conversations are private and secure, stored safely with enterprise-grade encryption.",
                gradient: "from-[hsl(266,68%,73%)] to-[hsl(266,85%,87%)]"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-2xl p-8 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="font-poppins text-2xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="font-inter text-white opacity-80">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Character Preview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-poppins text-4xl font-bold text-white mb-4">
              Meet Our Featured Companions
            </h2>
            <p className="font-inter text-xl text-white opacity-80">
              Discover personalities that resonate with you
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredCharacters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <CharacterCard 
                  character={character} 
                  onSelect={() => {}} 
                  featured 
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link href="/character-selection">
              <Button className="bg-white bg-opacity-20 text-white font-poppins font-semibold px-8 py-3 rounded-full hover:bg-opacity-30 transition-all duration-300">
                View All Characters →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
