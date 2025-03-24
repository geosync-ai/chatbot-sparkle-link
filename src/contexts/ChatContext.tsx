import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ChatMessage, ChatOptions, ChatRole } from "@/types/chat";
import { generateChatCompletion, processKnowledgeBase } from "@/utils/api";
import { toast } from "sonner";

interface ChatContextProps {
  messages: ChatMessage[];
  isLoading: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  options: ChatOptions;
  setOptions: (options: Partial<ChatOptions>) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{
  children: React.ReactNode;
  initialOptions?: ChatOptions;
}> = ({ children, initialOptions = {} }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [options, setOptions] = useState<ChatOptions>(initialOptions);

  useEffect(() => {
    const savedApiKey = localStorage.getItem("openrouter_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("openrouter_api_key", apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (options.initialMessage && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: options.initialMessage,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [options.initialMessage, messages.length]);

  const updateOptions = useCallback((newOptions: Partial<ChatOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (options.initialMessage) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: options.initialMessage,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [options.initialMessage]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      
      if (!apiKey) {
        toast.error("Please enter an OpenRouter API key to continue.");
        return;
      }

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const apiMessages = messages
          .slice(-10)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        if (options.systemPrompt) {
          apiMessages.unshift({
            role: "system",
            content: options.systemPrompt,
          });
        }

        apiMessages.push({
          role: "user",
          content,
        });

        let contextInfo = null;
        if (options.knowledgeBase && options.knowledgeBase.length > 0) {
          contextInfo = await processKnowledgeBase(options.knowledgeBase, content);
          
          if (contextInfo) {
            const lastIndex = apiMessages.length - 1;
            apiMessages[lastIndex].content = 
              `${content}\n\nAvailable context information:\n${contextInfo}`;
          }
        }

        const responseContent = await generateChatCompletion(
          apiMessages,
          apiKey,
          options.modelName
        );

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, messages, options.knowledgeBase, options.modelName, options.systemPrompt]
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        apiKey,
        setApiKey,
        options,
        setOptions: updateOptions,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
