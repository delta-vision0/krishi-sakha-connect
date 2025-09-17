import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceAssistantToggleProps {
  onToggle: () => void;
  isActive?: boolean;
}

export const VoiceAssistantToggle: React.FC<VoiceAssistantToggleProps> = ({ 
  onToggle, 
  isActive = false 
}) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <Button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          w-14 h-14 rounded-full shadow-lg border-2 transition-all duration-300
          ${isActive 
            ? 'bg-primary text-primary-foreground border-primary animate-pulse' 
            : 'bg-background text-foreground border-border hover:bg-accent'
          }
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}
        title={t('voice.toggle') || 'Voice Assistant'}
      >
        {isActive ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </Button>

      {/* Ripple effect for active state */}
      {isActive && (
        <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-primary animate-ping opacity-75" />
      )}

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-16 right-0 bg-background border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
          <p className="text-sm">{t('voice.tooltip') || 'Click to talk'}</p>
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-background border-r border-b border-border transform rotate-45" />
        </div>
      )}
    </div>
  );
};