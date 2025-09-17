import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: string; name: string; native: string; i18nKey: string }[] = [
    { code: 'en', name: 'English', native: 'English', i18nKey: 'language.english' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी', i18nKey: 'language.hindi' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', i18nKey: 'language.marathi' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', i18nKey: 'language.bengali' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', i18nKey: 'language.tamil' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', i18nKey: 'language.telugu' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', i18nKey: 'language.gujarati' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', i18nKey: 'language.kannada' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', i18nKey: 'language.malayalam' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', i18nKey: 'language.punjabi' },
    { code: 'or', name: 'Odia', native: 'ଓଡିଆ', i18nKey: 'language.odia' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া', i18nKey: 'language.assamese' },
    { code: 'ur', name: 'Urdu', native: 'اُردُو', i18nKey: 'language.urdu' },
    { code: 'ks', name: 'Kashmiri', native: 'कॉशुर', i18nKey: 'language.kashmiri' },
    { code: 'kok', name: 'Konkani', native: 'कोंकणी', i18nKey: 'language.konkani' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي', i18nKey: 'language.sindhi' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', i18nKey: 'language.sanskrit' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली', i18nKey: 'language.nepali' },
    { code: 'mni', name: 'Manipuri', native: 'ꯃꯤꯇꯩ ꯂꯣꯟ', i18nKey: 'language.manipuri' },
    { code: 'mai', name: 'Maithili', native: 'मैथिली', i18nKey: 'language.maithili' },
    { code: 'doi', name: 'Dogri', native: 'डोगरी', i18nKey: 'language.dogri' },
    { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', i18nKey: 'language.santali' },
    { code: 'brx', name: 'Bodo', native: 'बरʼ', i18nKey: 'language.bodo' },
  ];

  const getNative = (i18nKey: string, fallback: string) => {
    const translated = t(i18nKey);
    return translated === i18nKey ? fallback : translated;
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background text-foreground border border-border hover:bg-accent transition-colors">
        <Languages className="w-4 h-4" />
        <span className="text-sm font-medium">
          {(() => { const cur = languages.find(l => l.code === language); return cur ? getNative(cur.i18nKey, cur.native) : 'English'; })()}
        </span>
      </button>
      
      <div className="absolute right-0 top-full mt-1 bg-card text-foreground border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[260px]">
        <div className="p-2">
          <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
            {t('language.title')}
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between gap-3 ${
                language === lang.code
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <div className="font-medium truncate max-w-[60%]">{getNative(lang.i18nKey, lang.native)}</div>
              <div className="text-xs text-muted-foreground truncate max-w-[35%] text-right">{lang.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};