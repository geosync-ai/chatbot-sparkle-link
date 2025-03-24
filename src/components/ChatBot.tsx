
import React, { useEffect, useRef, useState } from "react";
import { ChatProvider, useChat } from "@/contexts/ChatContext";
import { ChatBotProps } from "@/types/chat";
import { X, Minimize, Maximize, MessageSquare, Settings, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage, { TypingIndicator } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import EmbedOptions from "@/components/EmbedOptions";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Internal ChatBot component that uses the context
const ChatBotInternal: React.FC = () => {
  const { messages, isLoading, sendMessage, apiKey, setApiKey, options, setOptions, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(options.systemPrompt || "");
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  return (
    <div className={cn(
      "flex flex-col rounded-xl bg-white shadow-xl overflow-hidden",
      "transition-all duration-300 transform chatbot-window-animation",
      "border border-gray-200",
      isMinimized 
        ? "h-16 w-16 rounded-full" 
        : "h-[600px] w-[380px]"
    )}>
      {/* Header */}
      {!isMinimized ? (
        <div className="flex items-center justify-between px-4 py-3 border-b border-chatbot-border bg-white">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-chatbot-accent" />
            <h2 className="text-sm font-medium">DeepSeek AI Assistant</h2>
          </div>
          
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setIsConfigOpen(true)}>
                  Configure System Prompt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearMessages}>
                  Clear Conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <EmbedOptions 
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Embed on Website
                    </DropdownMenuItem>
                  } 
                />
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8" 
              onClick={() => setIsMinimized(true)}
            >
              <Minimize className="h-4 w-4" />
              <span className="sr-only">Minimize</span>
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          size="icon"
          variant="ghost"
          className="h-16 w-16 rounded-full p-0 flex items-center justify-center"
          onClick={() => setIsMinimized(false)}
        >
          <Maximize className="h-6 w-6 text-chatbot-accent" />
        </Button>
      )}
      
      {!isMinimized && (
        <>
          {/* API Key Input (if not set) */}
          {!apiKey && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
              <div className="text-center max-w-xs">
                <MessageSquare className="h-10 w-10 mx-auto mb-4 text-chatbot-accent" />
                <h3 className="font-medium text-lg mb-2">Welcome to DeepSeek AI</h3>
                <p className="text-sm text-gray-500 mb-4">
                  To start chatting, please enter your OpenRouter API key.
                </p>
              </div>
              
              <div className="w-full max-w-xs space-y-2">
                <Label htmlFor="api-key">OpenRouter API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Your API key is stored locally in your browser and never sent to our servers.
                </p>
              </div>
            </div>
          )}
          
          {/* Chat Messages */}
          {apiKey && (
            <div className="flex-1 overflow-y-auto chatbot-scrollbar px-1">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLastMessage={index === messages.length - 1}
                />
              ))}
              
              {isLoading && <TypingIndicator />}
              
              <div ref={messagesEndRef} />
            </div>
          )}
          
          {/* Chat Input */}
          {apiKey && (
            <ChatInput
              onSendMessage={sendMessage}
              isLoading={isLoading}
              placeholder="Message DeepSeek AI..."
            />
          )}
        </>
      )}
      
      {/* System Prompt Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure System Prompt</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                placeholder="Enter instructions for the AI assistant..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="min-h-[150px]"
              />
              <p className="text-sm text-gray-500">
                The system prompt helps guide the AI's behavior and responses.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => {
                  setOptions({ systemPrompt });
                  setIsConfigOpen(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main ChatBot wrapper component that provides the context
const ChatBot: React.FC<ChatBotProps> = ({ 
  initialMessage = "Hello! How can I assist you today?",
  modelName = "deepseek/deepseek-chat",
  systemPrompt,
  position = "right",
  knowledgeBase,
  ...props
}) => {
  const initialOptions = {
    initialMessage,
    modelName,
    systemPrompt,
    position,
    knowledgeBase,
    ...props
  };

  return (
    <ChatProvider initialOptions={initialOptions}>
      <ChatBotInternal />
    </ChatProvider>
  );
};

export default ChatBot;
