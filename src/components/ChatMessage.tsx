
import React, { useEffect, useRef, useState } from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  isLastMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage }) => {
  const { role, content } = message;
  const isUser = role === "user";
  
  const messageRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  
  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Animate message entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={messageRef}
      className={cn(
        "flex w-full gap-3 px-4 py-3 transition-all duration-300 chatbot-message-animation",
        isUser ? "justify-end" : "justify-start",
        !visible && "opacity-0 translate-y-2"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 rounded-md bg-chatbot-accent/10 p-1">
          <Bot className="h-6 w-6 text-chatbot-accent" />
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-3 rounded-2xl text-sm",
          "border border-transparent shadow-sm",
          isUser 
            ? "bg-chatbot-accent text-white rounded-tr-none" 
            : "bg-chatbot-assistant border-chatbot-border rounded-tl-none"
        )}>
          {content}
        </div>
        
        <span className="text-xs text-gray-500 mt-1 px-2">
          {formattedTime}
        </span>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 rounded-md bg-chatbot-accent p-1">
          <User className="h-6 w-6 text-white" />
        </Avatar>
      )}
    </div>
  );
};

// Typing indicator component
export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full gap-3 px-4 py-3 animate-fade-in">
      <Avatar className="h-8 w-8 rounded-md bg-chatbot-accent/10 p-1">
        <Bot className="h-6 w-6 text-chatbot-accent" />
      </Avatar>
      
      <div className="flex flex-col max-w-[80%] items-start">
        <div className="px-4 py-3 rounded-2xl text-sm bg-chatbot-assistant border-chatbot-border rounded-tl-none border shadow-sm">
          <div className="chatbot-typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
