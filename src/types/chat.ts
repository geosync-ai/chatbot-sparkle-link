
export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
}

export interface DatabaseConfig {
  type: string;
  projectId: string;
  apiKey: string;
  databaseURL: string;
  [key: string]: any; // Allow additional properties for different database types
}

export interface ChatOptions {
  initialMessage?: string;
  modelName?: string;
  apiKey?: string;
  systemPrompt?: string;
  position?: "right" | "left" | "center";
  theme?: "light" | "dark" | "auto";
  customStyles?: {
    chatWindow?: React.CSSProperties;
    header?: React.CSSProperties;
    messages?: React.CSSProperties;
    input?: React.CSSProperties;
  };
  branding?: {
    name?: string;
    logo?: string;
    primaryColor?: string;
  };
  knowledgeBase?: {
    type: "url" | "text" | "github";
    content: string;
  }[];
  dbConfig?: DatabaseConfig;
}

export interface EmbedOptions {
  position: "right" | "left" | "center";
  theme: "light" | "dark" | "auto";
  initiallyOpen: boolean;
  width?: number;
  height?: number;
}

export interface ChatBotProps extends ChatOptions {
  onClose?: () => void;
  isOpen?: boolean;
}
