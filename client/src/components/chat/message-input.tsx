import { useState } from "react";
import { Send, Plus, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ onSendMessage, disabled, placeholder = "Type your message..." }: MessageInputProps) {
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
    <div className="p-4">
      <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-transparent text-white placeholder-white/50 border-none focus:ring-0 focus:outline-none pr-12"
          />
          
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-[hsl(333,100%,70%)] to-[hsl(266,68%,73%)] hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:scale-100"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <Mic className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
