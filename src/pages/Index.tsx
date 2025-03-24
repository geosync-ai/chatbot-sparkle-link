
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatBot from "@/components/ChatBot";
import { Settings, Database, Github, MessageSquare } from "lucide-react";

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [knowledgeUrl, setKnowledgeUrl] = useState("");
  const [showChatbot, setShowChatbot] = useState(true);
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-medium tracking-tight">DeepSeek AI Chatbot</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowChatbot(!showChatbot)}
            >
              {showChatbot ? "Hide" : "Show"} Chatbot
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container px-4 py-12 md:px-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Intelligent AI Chatbot with DeepSeek
              </h2>
              <p className="text-gray-500 leading-relaxed">
                A powerful, customizable AI chatbot that integrates seamlessly with your applications 
                and can access external knowledge sources.
              </p>
            </div>

            <Tabs value={tab} onValueChange={setTab} className="space-y-8">
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8 animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Seamless Integration</CardTitle>
                    <CardDescription>
                      Easily embed this chatbot on any website or application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="flex items-center justify-center bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <div className="max-w-md text-center">
                          <div className="bg-blue-50 text-blue-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                            <code>&lt;/&gt;</code>
                          </div>
                          <h3 className="text-lg font-medium mb-2">Easy Embedding</h3>
                          <p className="text-gray-500 text-sm">
                            Position the chatbot anywhere on your site with a simple code snippet
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-blue-500" />
                        Customizable
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Tailor the AI's behavior with custom system prompts and instructions
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Github className="h-5 w-5 text-blue-500" />
                        GitHub Integration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Connect to GitHub repositories to read and analyze files
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-500" />
                        External Data
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Link to Firebase or other databases for data-driven insights
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="config" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Chatbot Configuration</CardTitle>
                    <CardDescription>
                      Configure your AI chatbot settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">OpenRouter API Key</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="Enter your OpenRouter API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Your API key is stored locally in your browser.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="systemPrompt">System Prompt</Label>
                      <Textarea
                        id="systemPrompt"
                        placeholder="Instructions for how the AI should behave..."
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <p className="text-xs text-gray-500">
                        This prompt guides the AI's behavior and responses.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Save Configuration</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="knowledge" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge Sources</CardTitle>
                    <CardDescription>
                      Connect external knowledge sources for the chatbot
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        placeholder="https://example.com"
                        value={knowledgeUrl}
                        onChange={(e) => setKnowledgeUrl(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        The chatbot will crawl and index this website to answer questions.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="githubRepo">GitHub Repository</Label>
                      <Input
                        id="githubRepo"
                        placeholder="username/repository"
                      />
                      <p className="text-xs text-gray-500">
                        Connect to a GitHub repository to read its files.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Connect Knowledge Sources</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="container px-4 md:px-6">
          <p className="text-center text-sm text-gray-500">
            © 2025 DeepSeek AI Chatbot. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Chatbot */}
      {showChatbot && (
        <div className="fixed bottom-8 right-8 z-50">
          <ChatBot
            initialMessage="Hello! I'm the DeepSeek AI assistant. How can I help you today?"
            systemPrompt={systemPrompt || "You are a helpful assistant that provides accurate and concise information."}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
