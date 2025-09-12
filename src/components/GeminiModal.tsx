import React, { useState, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

interface GeminiModalProps {
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'gemini';
  timestamp: Date;
}

export const GeminiModal = ({ onClose }: GeminiModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI farming assistant. I can help you with crop advice, pest management, fertilizer recommendations, and answer any farming-related questions. How can I assist you today?",
      sender: 'gemini',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        sender: 'gemini',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('pest') || input.includes('disease') || input.includes('insect')) {
      return "For pest management, I recommend integrated pest management (IPM) practices. Start with organic methods like neem oil, introduce beneficial insects, and maintain crop rotation. For specific diseases, proper field sanitation and timely application of appropriate fungicides can be very effective. Would you like specific advice for a particular crop?";
    }
    
    if (input.includes('fertilizer') || input.includes('nutrient')) {
      return "Fertilizer recommendations depend on your crop, soil type, and growth stage. Generally, NPK ratios should be adjusted based on soil testing. For example, leafy vegetables need more nitrogen, while flowering crops need phosphorus. Always test your soil pH first - most crops prefer 6.0-7.5 pH range. What crop are you planning to fertilize?";
    }
    
    if (input.includes('weather') || input.includes('rain') || input.includes('irrigation')) {
      return "Weather plays a crucial role in farming decisions. During monsoon, ensure proper drainage to prevent waterlogging. In dry spells, focus on drip irrigation and mulching to conserve moisture. I recommend checking weather forecasts regularly and planning field activities accordingly. Do you need advice for specific weather conditions?";
    }
    
    if (input.includes('crop') || input.includes('plant') || input.includes('grow')) {
      return "Crop selection should be based on your local climate, soil type, water availability, and market demand. Consider crop rotation to maintain soil health. For Maharashtra's climate, crops like cotton, sugarcane, soybean, and various vegetables perform well. What's your farm size and location? I can give more specific recommendations.";
    }
    
    return "That's a great farming question! Based on agricultural best practices, I'd recommend consulting with local agricultural experts and considering factors like soil testing, climate conditions, and market prices. Could you provide more specific details about your farming situation so I can give you more targeted advice?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Gemini Assistant</h3>
              <p className="caption">AI-powered farming advisor</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.sender === 'gemini' && (
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary text-white ml-auto' 
                  : 'bg-accent/50 text-foreground'
              }`}>
                <p className="text-sm">{message.text}</p>
                <div className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-primary" />
              </div>
              <div className="bg-accent/50 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-border">
          <div className="flex gap-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about farming, crops, pests, weather..."
              className="flex-1 farm-input resize-none"
              rows={2}
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};