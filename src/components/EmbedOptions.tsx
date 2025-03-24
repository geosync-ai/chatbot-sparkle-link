import React, { useState } from "react";
import { Check, Clipboard, Code } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmbedOptions as EmbedOptionsType } from "@/types/chat";
import { generateEmbedCode, copyToClipboard } from "@/utils/embedCode";
import { toast } from "sonner";

interface EmbedOptionsProps {
  trigger: React.ReactNode;
}

const EmbedOptions: React.FC<EmbedOptionsProps> = ({ trigger }) => {
  const [options, setOptions] = useState<EmbedOptionsType>({
    position: "right",
    theme: "light",
    initiallyOpen: false,
    width: 400,
    height: 600
  });
  
  const [copied, setCopied] = useState(false);
  
  const embedCode = generateEmbedCode(options);
  
  const handlePositionChange = (position: "right" | "left" | "center") => {
    setOptions(prev => ({ ...prev, position }));
  };
  
  const handleThemeChange = (theme: "light" | "dark" | "auto") => {
    setOptions(prev => ({ ...prev, theme }));
  };
  
  const handleToggleInitialOpen = (checked: boolean) => {
    setOptions(prev => ({ ...prev, initiallyOpen: checked }));
  };
  
  const handleCopyCode = async () => {
    const success = await copyToClipboard(embedCode);
    
    if (success) {
      setCopied(true);
      toast.success("Embed code copied to clipboard");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Embed DeepSeek Chatbot</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="visual" className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="visual">Visual Options</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Position</h3>
                <RadioGroup
                  defaultValue={options.position}
                  onValueChange={(value) => handlePositionChange(value as "right" | "left" | "center")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="right" id="position-right" />
                    <Label htmlFor="position-right">Right</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="position-left" />
                    <Label htmlFor="position-left">Left</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="center" id="position-center" />
                    <Label htmlFor="position-center">Center</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Theme</h3>
                <RadioGroup
                  defaultValue={options.theme}
                  onValueChange={(value) => handleThemeChange(value as "light" | "dark" | "auto")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="auto" id="theme-auto" />
                    <Label htmlFor="theme-auto">Auto (follow user preference)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="initiallyOpen">Initially Open</Label>
                <Switch
                  id="initiallyOpen"
                  checked={options.initiallyOpen}
                  onCheckedChange={handleToggleInitialOpen}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code">
            <div className="relative">
              <pre className="bg-gray-50 text-sm p-4 rounded-lg overflow-x-auto border">
                <code>{embedCode}</code>
              </pre>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyCode}
                className="absolute top-2 right-2"
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Clipboard className="h-4 w-4 mr-1" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EmbedOptions;
