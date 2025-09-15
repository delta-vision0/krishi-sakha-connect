import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border hover:bg-accent transition-colors">
        <Languages className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languages.find(l => l.code === language)?.nativeName}
        </span>
      </button>
      
      <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[150px]">
        <div className="p-2">
          <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
            {t('language.title')}
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                language === lang.code
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <div className="font-medium">{lang.nativeName}</div>
              <div className="text-xs opacity-70">{lang.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};