
import React, { useEffect, useRef, useState } from "react";
import { ChatProvider, useChat } from "@/contexts/ChatContext";
import { ChatBotProps } from "@/types/chat";
import { X, Minimize, Maximize, MessageSquare, Settings, Share2, Database, FileText, Globe, Github } from "lucide-react";
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
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

// Internal ChatBot component that uses the context
const ChatBotInternal: React.FC = () => {
  const { messages, isLoading, sendMessage, apiKey, setApiKey, options, setOptions, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(options.systemPrompt || "");
  const [activeConfigTab, setActiveConfigTab] = useState("system");
  
  // Knowledge base state
  const [knowledgeBase, setKnowledgeBase] = useState(options.knowledgeBase || []);
  const [newKnowledgeType, setNewKnowledgeType] = useState<"url" | "text" | "github">("url");
  const [newKnowledgeContent, setNewKnowledgeContent] = useState("");
  
  // Database configuration state
  const [dbConfig, setDbConfig] = useState({
    type: "firebase",
    projectId: "",
    apiKey: "",
    databaseURL: ""
  });
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleAddKnowledgeBase = () => {
    if (!newKnowledgeContent.trim()) {
      toast.error("Please enter content for the knowledge base");
      return;
    }
    
    const updatedKnowledgeBase = [
      ...knowledgeBase,
      { type: newKnowledgeType, content: newKnowledgeContent }
    ];
    
    setKnowledgeBase(updatedKnowledgeBase);
    setNewKnowledgeContent("");
    
    // Update the global options
    setOptions({ knowledgeBase: updatedKnowledgeBase });
    toast.success(`Added ${newKnowledgeType} to knowledge base`);
  };
  
  const handleRemoveKnowledgeBase = (index: number) => {
    const updatedKnowledgeBase = knowledgeBase.filter((_, i) => i !== index);
    setKnowledgeBase(updatedKnowledgeBase);
    setOptions({ knowledgeBase: updatedKnowledgeBase });
    toast.success("Removed from knowledge base");
  };
  
  const handleSaveDbConfig = () => {
    // In a real implementation, this would connect to the actual database service
    // For now, we just save the configuration
    setOptions({ 
      dbConfig: dbConfig
    });
    toast.success(`${dbConfig.type} configuration saved!`);
  };
  
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
                <DropdownMenuItem onClick={() => {
                  setActiveConfigTab("system");
                  setIsConfigOpen(true);
                }}>
                  Configure System Prompt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setActiveConfigTab("knowledge");
                  setIsConfigOpen(true);
                }}>
                  Manage Knowledge Base
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setActiveConfigTab("database");
                  setIsConfigOpen(true);
                }}>
                  Database Configuration
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
      
      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configure AI Assistant</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue={activeConfigTab} value={activeConfigTab} onValueChange={setActiveConfigTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="system">System Prompt</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
            </TabsList>
            
            {/* System Prompt Tab */}
            <TabsContent value="system" className="space-y-4">
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
                    toast.success("System prompt updated");
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </TabsContent>
            
            {/* Knowledge Base Tab */}
            <TabsContent value="knowledge" className="space-y-4">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label>Current Knowledge Base</Label>
                  {knowledgeBase.length === 0 ? (
                    <p className="text-sm text-gray-500">No knowledge base entries. Add one below.</p>
                  ) : (
                    <div className="space-y-2">
                      {knowledgeBase.map((kb, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            {kb.type === "url" && <Globe className="h-4 w-4" />}
                            {kb.type === "github" && <Github className="h-4 w-4" />}
                            {kb.type === "text" && <FileText className="h-4 w-4" />}
                            <span className="text-sm">{kb.content.substring(0, 30)}...</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveKnowledgeBase(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Add Knowledge Source</Label>
                  <div className="flex gap-2">
                    <select
                      value={newKnowledgeType}
                      onChange={(e) => setNewKnowledgeType(e.target.value as any)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="url">Website URL</option>
                      <option value="github">GitHub Repository</option>
                      <option value="text">Text Content</option>
                    </select>
                    <Input
                      placeholder={
                        newKnowledgeType === "url" 
                          ? "Enter website URL" 
                          : newKnowledgeType === "github" 
                            ? "Enter GitHub repo URL" 
                            : "Enter text content"
                      }
                      value={newKnowledgeContent}
                      onChange={(e) => setNewKnowledgeContent(e.target.value)}
                    />
                    <Button onClick={handleAddKnowledgeBase}>Add</Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {newKnowledgeType === "url" 
                      ? "The AI will crawl and index this website to answer questions."
                      : newKnowledgeType === "github" 
                        ? "The AI will read this GitHub repository to answer questions."
                        : "The AI will use this text content to answer questions."}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Database Tab */}
            <TabsContent value="database" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="db-type">Database Type</Label>
                  <select
                    id="db-type"
                    value={dbConfig.type}
                    onChange={(e) => setDbConfig({...dbConfig, type: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="firebase">Firebase</option>
                    <option value="supabase">Supabase</option>
                    <option value="mongodb">MongoDB</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-id">Project ID</Label>
                  <Input
                    id="project-id"
                    placeholder="Enter project ID"
                    value={dbConfig.projectId}
                    onChange={(e) => setDbConfig({...dbConfig, projectId: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="db-api-key">API Key</Label>
                  <Input
                    id="db-api-key"
                    type="password"
                    placeholder="Enter database API key"
                    value={dbConfig.apiKey}
                    onChange={(e) => setDbConfig({...dbConfig, apiKey: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="db-url">Database URL</Label>
                  <Input
                    id="db-url"
                    placeholder="Enter database URL"
                    value={dbConfig.databaseURL}
                    onChange={(e) => setDbConfig({...dbConfig, databaseURL: e.target.value})}
                  />
                </div>
                
                <p className="text-sm text-gray-500">
                  Database configuration allows the AI to access and use your data. 
                  All credentials are stored locally in your browser.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveDbConfig}>
                  Save Database Configuration
                </Button>
              </div>
            </TabsContent>
          </Tabs>
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
