import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'mr' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('farmingAppLanguage') as Language;
    if (savedLanguage && ['en', 'mr', 'hi'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('farmingAppLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.fertilizer': 'Fertilizer',
    'nav.scanner': 'Scanner',
    'nav.prices': 'Prices',
    'nav.ai': 'AI',
    
    // Dashboard
    'dashboard.title': 'Welcome to Smart Farming',
    'dashboard.subtitle': 'Your intelligent farming companion',
    'dashboard.cropRecommendation': 'Get Crop Recommendation',
    'dashboard.pestDetection': 'Pest Detection',
    'dashboard.fertilizer': 'Fertilizer Advisor',
    'dashboard.marketPrices': 'Market Prices',
    'dashboard.weather': 'Weather',
    'dashboard.ai': 'AI Assistant',
    
    // Weather
    'weather.title': "Today's Weather",
    'weather.selectLocation': 'Select location',
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind',
    'weather.showForecast': 'Show 5-day forecast',
    'weather.hideForecast': 'Hide 5-day forecast',
    'weather.loadingWeather': 'Loading weather...',
    'weather.rainWarning': 'Heavy rain expected soon. Cover your crops!',
    
    // Crop Recommendation
    'crop.title': 'Crop Recommendation',
    'crop.subtitle': 'Get personalized crop recommendations based on your soil and climate conditions',
    'crop.location': 'Location',
    'crop.soilType': 'Soil Type',
    'crop.soilType.clay': 'Clay',
    'crop.soilType.sandy': 'Sandy',
    'crop.soilType.loamy': 'Loamy',
    'crop.soilType.silt': 'Silt',
    'crop.season': 'Season',
    'crop.season.kharif': 'Kharif (Monsoon)',
    'crop.season.rabi': 'Rabi (Winter)',
    'crop.season.zaid': 'Zaid (Summer)',
    'crop.getRecommendation': 'Get Recommendation',
    'crop.loading': 'Getting recommendations...',
    'crop.back': 'Back to Dashboard',
    
    // Pest Detection
    'pest.title': 'Pest & Disease Detection',
    'pest.subtitle': 'Upload an image to detect pests and diseases',
    'pest.uploadImage': 'Upload Plant Image',
    'pest.plantName': 'Plant Name',
    'pest.plantNamePlaceholder': 'e.g., Tomato, Wheat, Rice',
    'pest.analyze': 'Analyze Image',
    'pest.analyzing': 'Analyzing image...',
    'pest.dragDrop': 'Drag & drop an image here, or click to select',
    'pest.fileTypes': 'PNG, JPG, GIF up to 5MB',
    
    // Language Selector
    'language.title': 'Select Language',
    'language.english': 'English',
    'language.marathi': 'मराठी',
    'language.hindi': 'हिंदी',
    
    // Common
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.select': 'Select',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
  },
  mr: {
    // Navigation
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.fertilizer': 'खत',
    'nav.scanner': 'स्कॅनर',
    'nav.prices': 'भाव',
    'nav.ai': 'एआय',
    
    // Dashboard
    'dashboard.title': 'स्मार्ट शेतीमध्ये आपले स्वागत',
    'dashboard.subtitle': 'आपला बुद्धिमान शेती सहकारी',
    'dashboard.cropRecommendation': 'पीक शिफारस मिळवा',
    'dashboard.pestDetection': 'कीड ओळख',
    'dashboard.fertilizer': 'खत सल्लागार',
    'dashboard.marketPrices': 'बाजार भाव',
    'dashboard.weather': 'हवामान',
    'dashboard.ai': 'एआय सहाय्यक',
    
    // Weather
    'weather.title': 'आजचे हवामान',
    'weather.selectLocation': 'स्थान निवडा',
    'weather.humidity': 'आर्द्रता',
    'weather.wind': 'वारा',
    'weather.showForecast': '५ दिवसांचा अंदाज दाखवा',
    'weather.hideForecast': '५ दिवसांचा अंदाज लपवा',
    'weather.loadingWeather': 'हवामान लोड होत आहे...',
    'weather.rainWarning': 'लवकरच मुसळधार पाऊस अपेक्षित आहे. आपली पिके झाकून ठेवा!',
    
    // Crop Recommendation
    'crop.title': 'पीक शिफारस',
    'crop.subtitle': 'आपल्या माती आणि हवामान परिस्थितीनुसार वैयक्तिक पीक शिफारसी मिळवा',
    'crop.location': 'स्थान',
    'crop.soilType': 'मातीचा प्रकार',
    'crop.soilType.clay': 'चिकणमाती',
    'crop.soilType.sandy': 'वालुकामय',
    'crop.soilType.loamy': 'दोमट',
    'crop.soilType.silt': 'गाळमाती',
    'crop.season': 'हंगाम',
    'crop.season.kharif': 'खरीप (पावसाळी)',
    'crop.season.rabi': 'रब्बी (हिवाळी)',
    'crop.season.zaid': 'झायद (उन्हाळी)',
    'crop.getRecommendation': 'शिफारस मिळवा',
    'crop.loading': 'शिफारसी मिळवत आहे...',
    'crop.back': 'डॅशबोर्डवर परत',
    
    // Pest Detection
    'pest.title': 'कीड आणि रोग ओळख',
    'pest.subtitle': 'कीड आणि रोग ओळखण्यासाठी प्रतिमा अपलोड करा',
    'pest.uploadImage': 'वनस्पतीची प्रतिमा अपलोड करा',
    'pest.plantName': 'वनस्पतीचे नाव',
    'pest.plantNamePlaceholder': 'उदा., टोमॅटो, गहू, तांदूळ',
    'pest.analyze': 'प्रतिमेचे विश्लेषण करा',
    'pest.analyzing': 'प्रतिमेचे विश्लेषण करत आहे...',
    'pest.dragDrop': 'येथे प्रतिमा ड्रॅग आणि ड्रॉप करा, किंवा निवडण्यासाठी क्लिक करा',
    'pest.fileTypes': 'PNG, JPG, GIF ५MB पर्यंत',
    
    // Language Selector
    'language.title': 'भाषा निवडा',
    'language.english': 'English',
    'language.marathi': 'मराठी',
    'language.hindi': 'हिंदी',
    
    // Common
    'common.back': 'मागे',
    'common.loading': 'लोड होत आहे...',
    'common.error': 'त्रुटी',
    'common.success': 'यशस्वी',
    'common.select': 'निवडा',
    'common.submit': 'सबमिट करा',
    'common.cancel': 'रद्द करा',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.fertilizer': 'उर्वरक',
    'nav.scanner': 'स्कैनर',
    'nav.prices': 'भाव',
    'nav.ai': 'एआई',
    
    // Dashboard
    'dashboard.title': 'स्मार्ट खेती में आपका स्वागत',
    'dashboard.subtitle': 'आपका बुद्धिमान खेती साथी',
    'dashboard.cropRecommendation': 'फसल सिफारिश प्राप्त करें',
    'dashboard.pestDetection': 'कीट पहचान',
    'dashboard.fertilizer': 'उर्वरक सलाहकार',
    'dashboard.marketPrices': 'बाजार भाव',
    'dashboard.weather': 'मौसम',
    'dashboard.ai': 'एआई सहायक',
    
    // Weather
    'weather.title': 'आज का मौसम',
    'weather.selectLocation': 'स्थान चुनें',
    'weather.humidity': 'नमी',
    'weather.wind': 'हवा',
    'weather.showForecast': '५ दिन का पूर्वानुमान दिखाएं',
    'weather.hideForecast': '५ दिन का पूर्वानुमान छुपाएं',
    'weather.loadingWeather': 'मौसम लोड हो रहा है...',
    'weather.rainWarning': 'जल्द ही तेज बारिश की उम्मीद है। अपनी फसलों को ढक दें!',
    
    // Crop Recommendation
    'crop.title': 'फसल सिफारिश',
    'crop.subtitle': 'अपनी मिट्टी और जलवायु की स्थिति के आधार पर व्यक्तिगत फसल सिफारिशें प्राप्त करें',
    'crop.location': 'स्थान',
    'crop.soilType': 'मिट्टी का प्रकार',
    'crop.soilType.clay': 'चिकनी मिट्टी',
    'crop.soilType.sandy': 'रेतीली',
    'crop.soilType.loamy': 'दोमट',
    'crop.soilType.silt': 'गाद मिट्टी',
    'crop.season': 'मौसम',
    'crop.season.kharif': 'खरीफ (मानसून)',
    'crop.season.rabi': 'रबी (सर्दी)',
    'crop.season.zaid': 'जायद (गर्मी)',
    'crop.getRecommendation': 'सिफारिश प्राप्त करें',
    'crop.loading': 'सिफारिशें प्राप्त कर रहे हैं...',
    'crop.back': 'डैशबोर्ड पर वापस',
    
    // Pest Detection
    'pest.title': 'कीट और रोग पहचान',
    'pest.subtitle': 'कीटों और बीमारियों की पहचान के लिए एक छवि अपलोड करें',
    'pest.uploadImage': 'पौधे की छवि अपलोड करें',
    'pest.plantName': 'पौधे का नाम',
    'pest.plantNamePlaceholder': 'जैसे, टमाटर, गेहूं, चावल',
    'pest.analyze': 'छवि का विश्लेषण करें',
    'pest.analyzing': 'छवि का विश्लेषण कर रहे हैं...',
    'pest.dragDrop': 'यहां एक छवि खींचें और छोड़ें, या चुनने के लिए क्लिक करें',
    'pest.fileTypes': 'PNG, JPG, GIF 5MB तक',
    
    // Language Selector
    'language.title': 'भाषा चुनें',
    'language.english': 'English',
    'language.marathi': 'मराठी',
    'language.hindi': 'हिंदी',
    
    // Common
    'common.back': 'वापस',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
    'common.select': 'चुनें',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
  }
};