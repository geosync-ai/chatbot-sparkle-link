
export interface OpenRouterMessage {
  role: string;
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}

export const generateChatCompletion = async (
  messages: OpenRouterMessage[],
  apiKey: string,
  model: string = "deepseek/deepseek-chat"
): Promise<string> => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "DeepSeek Chat UI"
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      } as OpenRouterRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json() as OpenRouterResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
};

export const processKnowledgeBase = async (
  knowledgeBase: { type: string; content: string }[], 
  query: string
): Promise<string | null> => {
  if (!knowledgeBase || knowledgeBase.length === 0) return null;
  
  // Process different knowledge source types
  const processedSources = await Promise.all(knowledgeBase.map(async (kb) => {
    try {
      switch (kb.type) {
        case "url":
          // In a real implementation, this would fetch and extract content from the URL
          // For now, we'll simulate this behavior
          return `[Context from URL: ${kb.content}]: This is simulated content extracted from the website at ${kb.content}. In a real implementation, this would contain actual content crawled from the URL.`;
        
        case "github":
          // In a real implementation, this would fetch content from GitHub
          // For now, we'll simulate this behavior
          return `[Context from GitHub: ${kb.content}]: This is simulated content from the GitHub repository at ${kb.content}. In a real implementation, this would contain actual content from GitHub files.`;
        
        case "text":
          // Direct text content
          return `[Context from uploaded content]: ${kb.content}`;
        
        default:
          return `[Context from ${kb.type}]: ${kb.content}`;
      }
    } catch (error) {
      console.error(`Error processing knowledge base (${kb.type}):`, error);
      return `[Error processing ${kb.type} source: ${kb.content}]`;
    }
  }));
  
  // Return the processed knowledge base information
  return processedSources.join("\n\n");
};
