
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

export const processKnowledgeBase = async (knowledgeBase: { type: string; content: string }[], query: string): Promise<string | null> => {
  // This is a placeholder for future implementation
  // In a real implementation, this would process different knowledge sources and extract relevant information
  
  if (!knowledgeBase || knowledgeBase.length === 0) return null;
  
  // Simple implementation for demo purposes
  return knowledgeBase.map(kb => 
    `[Context from ${kb.type} source: ${kb.content.substring(0, 100)}...]`
  ).join("\n\n");
};
