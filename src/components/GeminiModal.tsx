import React, { useState, useEffect } from 'react';
import { X, Send, Bot, User, AlertCircle } from 'lucide-react';
import { GeminiService } from '@/services/gemini';

interface GeminiModalProps {
  onClose: () => void;
  diseaseContext?: {
    diseaseName: string;
    plantName: string;
    confidence: number;
  };
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'gemini';
  timestamp: Date;
}

export const GeminiModal = ({ onClose, diseaseContext }: GeminiModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize messages based on disease context
  useEffect(() => {
    if (diseaseContext) {
      const initialMessage: Message = {
        id: '1',
        text: `I've detected a potential disease: "${diseaseContext.diseaseName}" on ${diseaseContext.plantName} (${diseaseContext.confidence}% confidence). I can provide detailed treatment advice, prevention strategies, and management recommendations. What specific information would you like about this disease?`,
        sender: 'gemini',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    } else {
      const initialMessage: Message = {
        id: '1',
        text: "Hello! I'm your AI farming assistant powered by Gemini. I can help you with crop advice, pest management, fertilizer recommendations, and answer any farming-related questions. How can I assist you today?",
        sender: 'gemini',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [diseaseContext]);

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      let response: string;
      
      if (diseaseContext && inputText.toLowerCase().includes('disease')) {
        // If we have disease context and user is asking about disease, use specialized function
        response = await GeminiService.getDiseaseAdvice(
          diseaseContext.diseaseName,
          diseaseContext.plantName,
          `User question: ${inputText}`
        );
      } else {
        // General farming advice
        response = await GeminiService.getGeneralFarmingAdvice(inputText);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'gemini',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to get response from Gemini. Please try again.');
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment.",
        sender: 'gemini',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
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

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

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