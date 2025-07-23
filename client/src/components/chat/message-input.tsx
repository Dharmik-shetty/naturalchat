import { useState } from "react";
import { Send, Plus, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-effect border-t border-white/20 p-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={disabled}
            className="w-full bg-white/20 text-white placeholder-white/70 border-white/30 pr-12"
          />
          
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-[hsl(333,100%,70%)] to-[hsl(266,68%,73%)] hover:scale-105 transition-transform duration-200"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
        >
          <Mic className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
