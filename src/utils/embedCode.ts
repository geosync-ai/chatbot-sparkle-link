
import { EmbedOptions } from "@/types/chat";

export const generateEmbedCode = (options: EmbedOptions): string => {
  const {
    position = "right",
    theme = "light",
    initiallyOpen = false,
    width = 400,
    height = 600
  } = options;

  // Create a unique ID for this chatbot instance
  const uniqueId = `deepseek-chatbot-${Math.random().toString(36).substring(2, 11)}`;
  
  // Base URL of the script - in a real implementation, this would be a CDN URL
  const scriptUrl = window.location.origin;
  
  return `
<!-- DeepSeek Chatbot Widget -->
<div id="${uniqueId}"></div>
<script>
(function() {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = '${scriptUrl}/chatbot-widget.js';
  script.onload = function() {
    DeepSeekChatbot.init('${uniqueId}', {
      position: '${position}',
      theme: '${theme}',
      initiallyOpen: ${initiallyOpen},
      width: ${width},
      height: ${height}
    });
  };
  document.head.appendChild(script);
})();
</script>
<!-- End DeepSeek Chatbot Widget -->
  `.trim();
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};
