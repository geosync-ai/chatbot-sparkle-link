
import React, { useState, useRef, KeyboardEvent } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;
    
    onSendMessage(trimmedMessage);
    setMessage("");
    
    // Focus input after sending
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-end gap-2 p-4 border-t border-chatbot-border bg-white/80 backdrop-blur-sm transition-all duration-200"
    >
      <Button 
        type="button"
        size="icon" 
        variant="ghost"
        className="h-9 w-9 rounded-full flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        disabled={isLoading}
      >
        <Paperclip className="h-5 w-5" />
        <span className="sr-only">Attach file</span>
      </Button>
      
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className={cn(
            "pr-10 py-6 text-base rounded-full border-chatbot-border",
            "bg-white/80 backdrop-blur-xs transition-all duration-200",
            "focus-visible:ring-chatbot-accent focus-visible:ring-offset-0",
            "placeholder:text-gray-400"
          )}
        />
      </div>
      
      <Button 
        type="submit"
        size="icon" 
        disabled={!message.trim() || isLoading}
        className={cn(
          "h-10 w-10 rounded-full flex-shrink-0",
          "bg-chatbot-accent hover:bg-chatbot-accent/90 transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
};

export default ChatInput;
