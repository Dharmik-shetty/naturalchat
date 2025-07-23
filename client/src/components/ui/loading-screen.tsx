import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Character } from "@/data/characters";

interface LoadingScreenProps {
  character: Character;
  onComplete: () => void;
  onCancel: () => void;
}

export function LoadingScreen({ character, onComplete, onCancel }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const messages = [
    `Requesting chat time from ${character.name}...`,
    'Connecting to server...',
    'Connection established! Ready to chat.'
  ];

  useEffect(() => {
    const duration = 11000; // 11 seconds
    const steps = messages.length;
    const stepDuration = duration / steps;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / duration) * 100;
        const newStep = Math.floor((newProgress / 100) * steps);
        
        if (newStep !== currentStep && newStep < steps) {
          setCurrentStep(newStep);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [character.name, onComplete, currentStep, messages]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 gradient-bg opacity-95" />
      
      <div className="relative z-10 text-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-8 border-4 border-white border-opacity-30"
        >
          <img 
            src={character.imageUrl} 
            alt={character.name}
            className="w-full h-full object-cover" 
          />
        </motion.div>
        
        <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto">
          <div className="mb-6">
            <Progress 
              value={progress} 
              className="w-full h-2 mb-4 bg-white/20"
            />
            
            <motion.p 
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-inter text-white text-lg"
            >
              {messages[currentStep]}
            </motion.p>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-[hsl(333,100%,70%)] rounded-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
