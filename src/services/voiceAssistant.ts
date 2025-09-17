interface VoiceSettings {
  language: string;
  voiceGender: 'male' | 'female';
  rate: number;
  pitch: number;
  volume: number;
}

interface VoiceMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string;
}

class VoiceAssistantService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private settings: VoiceSettings;
  
  // Language mapping for speech recognition
  private languageMap: { [key: string]: string } = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'mr': 'mr-IN',
    'bn': 'bn-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'gu': 'gu-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN',
    'pa': 'pa-IN',
    'or': 'or-IN',
    'as': 'as-IN',
    'ur': 'ur-IN',
    'ne': 'ne-NP',
    'sa': 'sa-IN'
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.settings = {
      language: 'en',
      voiceGender: 'female',
      rate: 1,
      pitch: 1,
      volume: 0.8
    };
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  updateSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (this.recognition) {
      this.recognition.lang = this.languageMap[this.settings.language] || 'en-US';
    }
  }

  async startListening(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      // Request microphone permission
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        reject(new Error('Microphone permission denied'));
        return;
      }

      this.isListening = true;
      this.recognition.lang = this.languageMap[this.settings.language] || 'en-US';

      this.recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        this.isListening = false;
        resolve(result);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(new Error(event.error));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.languageMap[this.settings.language] || 'en-US';
      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      utterance.volume = this.settings.volume;

      // Try to get the preferred voice with better language matching
      const voices = this.synthesis.getVoices();
      const targetLang = this.languageMap[this.settings.language] || 'en-US';
      
      // First try exact language match with gender preference
      let preferredVoice = voices.find(voice => 
        voice.lang === targetLang && 
        voice.name.toLowerCase().includes(this.settings.voiceGender)
      );
      
      // If not found, try language family match with gender
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
          voice.lang.startsWith(targetLang.split('-')[0]) && 
          voice.name.toLowerCase().includes(this.settings.voiceGender)
        );
      }
      
      // If still not found, try any voice for the language
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
          voice.lang.startsWith(targetLang.split('-')[0])
        );
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(event.error || 'Speech synthesis failed'));

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    this.synthesis.cancel();
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    const targetLang = this.languageMap[this.settings.language] || 'en-US';
    return this.synthesis.getVoices().filter(voice => 
      voice.lang.startsWith(targetLang.split('-')[0])
    );
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window && 
           ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }

  getListeningState(): boolean {
    return this.isListening;
  }
}

export const voiceAssistant = new VoiceAssistantService();
export type { VoiceSettings, VoiceMessage };