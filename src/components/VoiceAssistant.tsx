import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX, Settings, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { voiceAssistant, VoiceMessage, VoiceSettings } from '@/services/voiceAssistant';
import { useLanguage } from '@/contexts/LanguageContext';
import { GeminiService } from '@/services/gemini';

interface VoiceAssistantProps {
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose, onNavigate }) => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string>('');
  
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    language: language,
    voiceGender: 'female',
    rate: 1,
    pitch: 1,
    volume: 0.8
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiService = new GeminiService();

  useEffect(() => {
    if (!voiceAssistant.isSupported()) {
      setError(t('voice.notSupported') || 'Voice assistant is not supported in this browser');
    }
    
    // Update voice settings when language changes
    setVoiceSettings(prev => ({ ...prev, language }));
    voiceAssistant.updateSettings({ language });
    
    // Add welcome message
    const welcomeMessage: VoiceMessage = {
      id: Date.now().toString(),
      text: getWelcomeMessage(),
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // Speak welcome message
    handleSpeak(welcomeMessage.text);
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    voiceAssistant.updateSettings(voiceSettings);
  }, [voiceSettings]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessage = (): string => {
    const welcomeMessages: { [key: string]: string } = {
      'en': "Hello! I'm your farming assistant. You can ask me about crops, pest detection, weather, or say commands like 'open scanner' or 'show prices'.",
      'hi': "नमस्ते! मैं आपका कृषि सहायक हूं। आप मुझसे फसलों, कीट पहचान, मौसम के बारे में पूछ सकते हैं या 'स्कैनर खोलें' या 'कीमतें दिखाएं' जैसे कमांड कह सकते हैं।",
      'mr': "नमस्कार! मी तुमचा शेती सहाय्यक आहे। तुम्ही मला पिकांबद्दल, कीड ओळख, हवामान विषयी विचारू शकता किंवा 'स्कॅनर उघडा' किंवा 'किंमती दाखवा' असे आदेश सांगू शकता."
    };
    return welcomeMessages[language] || welcomeMessages['en'];
  };

  const handleStartListening = async () => {
    try {
      setError('');
      setIsListening(true);
      const result = await voiceAssistant.startListening();
      setIsListening(false);
      
      if (result.trim()) {
        await processUserInput(result);
      }
    } catch (error) {
      setIsListening(false);
      setError(error instanceof Error ? error.message : 'Failed to listen');
    }
  };

  const handleStopListening = () => {
    voiceAssistant.stopListening();
    setIsListening(false);
  };

  const handleSpeak = async (text: string) => {
    try {
      setIsSpeaking(true);
      await voiceAssistant.speak(text);
      setIsSpeaking(false);
    } catch (error) {
      setIsSpeaking(false);
      console.error('Speech failed:', error);
    }
  };

  const handleStopSpeaking = () => {
    voiceAssistant.stopSpeaking();
    setIsSpeaking(false);
  };

  const processUserInput = async (userInput: string) => {
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Check for navigation commands first
      const navigationResponse = handleNavigationCommands(userInput);
      if (navigationResponse) {
        const assistantMessage: VoiceMessage = {
          id: (Date.now() + 1).toString(),
          text: navigationResponse,
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        await handleSpeak(navigationResponse);
        setIsProcessing(false);
        return;
      }

      // Get AI response using Gemini
      const aiResponse = await geminiService.getFarmingAdvice(userInput, language);
      
      const assistantMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      await handleSpeak(aiResponse);
    } catch (error) {
      const errorMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        text: t('voice.error') || 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      await handleSpeak(errorMessage.text);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNavigationCommands = (input: string): string | null => {
    const lowerInput = input.toLowerCase();
    
    // Navigation patterns for different languages
    const navigationPatterns: { [key: string]: { [key: string]: string[] } } = {
      'en': {
        'scanner': ['open scanner', 'scan', 'detect pest', 'camera', 'identify plant'],
        'dashboard': ['home', 'dashboard', 'main page'],
        'prices': ['market prices', 'prices', 'rates', 'market'],
        'crop-recommendation': ['crop recommendation', 'suggest crop', 'recommend crop'],
        'fertilizer': ['fertilizer', 'nutrient', 'soil']
      },
      'hi': {
        'scanner': ['स्कैनर खोलें', 'स्कैन', 'कीट पहचान', 'कैमरा', 'पौधा पहचानें'],
        'dashboard': ['होम', 'डैशबोर्ड', 'मुख्य पृष्ठ'],
        'prices': ['बाज़ार की कीमतें', 'कीमतें', 'दरें', 'बाज़ार'],
        'crop-recommendation': ['फसल सुझाव', 'फसल सुझाएं', 'फसल की सिफारिश'],
        'fertilizer': ['उर्वरक', 'पोषक तत्व', 'मिट्टी']
      },
      'mr': {
        'scanner': ['स्कॅनर उघडा', 'स्कॅन', 'कीड ओळख', 'कॅमेरा', 'झाड ओळखा'],
        'dashboard': ['होम', 'डॅशबोर्ड', 'मुख्य पान'],
        'prices': ['बाजार भाव', 'किंमती', 'दर', 'बाजार'],
        'crop-recommendation': ['पीक सूचना', 'पीक सुचवा', 'पिकाची शिफारस'],
        'fertilizer': ['खत', 'पोषक तत्व', 'माती']
      }
    };

    const patterns = navigationPatterns[language] || navigationPatterns['en'];

    for (const [view, keywords] of Object.entries(patterns)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        onNavigate(view);
        onClose();
        
        const responses: { [key: string]: string } = {
          'en': `Opening ${view.replace('-', ' ')}...`,
          'hi': `${view === 'scanner' ? 'स्कैनर' : view === 'dashboard' ? 'डैशबोर्ड' : view === 'prices' ? 'कीमतें' : view} खोल रहा हूं...`,
          'mr': `${view === 'scanner' ? 'स्कॅनर' : view === 'dashboard' ? 'डॅशबोर्ड' : view === 'prices' ? 'किंमती' : view} उघडत आहे...`
        };
        
        return responses[language] || responses['en'];
      }
    }

    return null;
  };

  const handleSendText = () => {
    if (inputText.trim()) {
      processUserInput(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col bg-background border-border">
        <CardHeader className="flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            {t('voice.title') || 'Voice Assistant'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {showSettings && (
          <div className="px-6 pb-4 border-b">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('voice.voiceGender') || 'Voice'}</label>
                <Select
                  value={voiceSettings.voiceGender}
                  onValueChange={(value: 'male' | 'female') =>
                    setVoiceSettings(prev => ({ ...prev, voiceGender: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">{t('voice.female') || 'Female'}</SelectItem>
                    <SelectItem value="male">{t('voice.male') || 'Male'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">{t('voice.speed') || 'Speed'}</label>
                <Slider
                  value={[voiceSettings.rate]}
                  onValueChange={([value]) =>
                    setVoiceSettings(prev => ({ ...prev, rate: value }))
                  }
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">{t('voice.volume') || 'Volume'}</label>
                <Slider
                  value={[voiceSettings.volume]}
                  onValueChange={([value]) =>
                    setVoiceSettings(prev => ({ ...prev, volume: value }))
                  }
                  min={0}
                  max={1}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        )}

        <CardContent className="flex-1 flex flex-col p-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('voice.typeMessage') || 'Type your message or use voice...'}
                className="min-h-[40px] resize-none"
                rows={1}
              />
            </div>
            <Button onClick={handleSendText} size="sm" disabled={!inputText.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            {!isListening ? (
              <Button
                onClick={handleStartListening}
                className="w-16 h-16 rounded-full"
                disabled={isProcessing || !voiceAssistant.isSupported()}
              >
                <Mic className="w-6 h-6" />
              </Button>
            ) : (
              <Button
                onClick={handleStopListening}
                variant="destructive"
                className="w-16 h-16 rounded-full animate-pulse"
              >
                <MicOff className="w-6 h-6" />
              </Button>
            )}

            {isSpeaking && (
              <Button
                onClick={handleStopSpeaking}
                variant="outline"
                className="w-16 h-16 rounded-full"
              >
                <VolumeX className="w-6 h-6" />
              </Button>
            )}
          </div>

          {isListening && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              {t('voice.listening') || 'Listening... Speak now'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};