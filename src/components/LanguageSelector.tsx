import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: string; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: t('language.english') || 'English' },
    { code: 'hi', name: 'Hindi', nativeName: t('language.hindi') || 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: t('language.marathi') || 'मराठी' },
    { code: 'bn', name: 'Bengali', nativeName: t('language.bengali') || 'বাংলা' },
    { code: 'ta', name: 'Tamil', nativeName: t('language.tamil') || 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: t('language.telugu') || 'తెలుగు' },
    { code: 'gu', name: 'Gujarati', nativeName: t('language.gujarati') || 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: t('language.kannada') || 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: t('language.malayalam') || 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: t('language.punjabi') || 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', nativeName: t('language.odia') || 'ଓଡିଆ' },
    { code: 'as', name: 'Assamese', nativeName: t('language.assamese') || 'অসমীয়া' },
    { code: 'ur', name: 'Urdu', nativeName: t('language.urdu') || 'اُردُو' },
    { code: 'ks', name: 'Kashmiri', nativeName: t('language.kashmiri') || 'कॉशुर' },
    { code: 'kok', name: 'Konkani', nativeName: t('language.konkani') || 'कोंकणी' },
    { code: 'sd', name: 'Sindhi', nativeName: t('language.sindhi') || 'سنڌي' },
    { code: 'sa', name: 'Sanskrit', nativeName: t('language.sanskrit') || 'संस्कृतम्' },
    { code: 'ne', name: 'Nepali', nativeName: t('language.nepali') || 'नेपाली' },
    { code: 'mni', name: 'Manipuri', nativeName: t('language.manipuri') || 'ꯃꯤꯇꯩ ꯂꯣꯟ' },
    { code: 'mai', name: 'Maithili', nativeName: t('language.maithili') || 'मैथिली' },
    { code: 'doi', name: 'Dogri', nativeName: t('language.dogri') || 'डोगरी' },
    { code: 'sat', name: 'Santali', nativeName: t('language.santali') || 'ᱥᱟᱱᱛᱟᱲᱤ' },
    { code: 'brx', name: 'Bodo', nativeName: t('language.bodo') || 'बरʼ' },
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