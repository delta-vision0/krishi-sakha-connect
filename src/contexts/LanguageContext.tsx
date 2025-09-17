import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = string;

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
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('farmingAppLanguage', lang);
  };

  const t = (key: string): string => {
    const selected = (translations as any)[language]?.[key];
    if (selected) return selected;
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.select': 'Select',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.set': 'Set',
    'common.useGPS': 'Use GPS',
    'common.searchLocation': 'Search city or village',
    'common.selectLocation': 'Select location',
    'common.about': 'About',
    'common.organicSolutions': 'Organic Solutions',
    'common.chemicalSolutions': 'Chemical Solutions',
    'common.prevention': 'Prevention',
    'common.healthy': 'Healthy',
    'common.diseaseDetected': 'Disease Detected',
    'common.askAI': 'Ask AI for more details',
    'common.scanAnother': 'Scan another plant',
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
    // Dashboard card captions
    'dashboard.cards.crop.caption': 'Find best crops for your land',
    'dashboard.cards.fertilizer.caption': 'Get fertilizer recommendations',
    'dashboard.cards.scanner.caption': 'Detect crop diseases instantly',
    'dashboard.cards.prices.caption': 'Latest crop prices',
    
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
    
    // Voice Assistant
    'voice.title': 'Voice Assistant',
    'voice.listening': 'Listening... Speak now',
    'voice.processing': 'Processing...',
    'voice.speaking': 'Speaking...',
    'voice.toggle': 'Voice Assistant',
    'voice.tooltip': 'Click to talk',
    'voice.notSupported': 'Voice assistant is not supported in this browser',
    'voice.error': 'Sorry, I encountered an error. Please try again.',
    'voice.typeMessage': 'Type your message or use voice...',
    'voice.voiceGender': 'Voice',
    'voice.male': 'Male',
    'voice.female': 'Female',
    'voice.speed': 'Speed',
    'voice.volume': 'Volume',
  },
  pa: {
    'nav.dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'nav.fertilizer': 'ਖਾਦ',
    'nav.scanner': 'ਸਕੈਨਰ',
    'nav.prices': 'ਭਾਵ',
    'nav.ai': 'AI',

    'dashboard.title': 'ਸਮਾਰਟ ਖੇਤੀ ਵਿੱਚ ਸੁਆਗਤ ਹੈ',
    'dashboard.subtitle': 'ਤੁਹਾਡਾ ਸਮਰੱਥ ਖੇਤੀ ਸਾਥੀ',
    'dashboard.cropRecommendation': 'ਫਸਲ ਸਿਫਾਰਸ਼ ਲਵੋ',
    'dashboard.pestDetection': 'ਕੀਟ ਪਹਿਚਾਣ',
    'dashboard.fertilizer': 'ਖਾਦ ਸਲਾਹਕਾਰ',
    'dashboard.marketPrices': 'ਬਾਜ਼ਾਰ ਭਾਵ',
    'dashboard.weather': 'ਮੌਸਮ',
    'dashboard.ai': 'AI ਸਹਾਇਕ',
    'dashboard.cards.crop.caption': 'ਤੁਹਾਡੀ ਜ਼ਮੀਨ ਲਈ ਵਧੀਆ ਫਸਲਾਂ',
    'dashboard.cards.fertilizer.caption': 'ਖਾਦ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ',
    'dashboard.cards.scanner.caption': 'ਫਸਲ ਬਿਮਾਰੀਆਂ ਤੁਰੰਤ ਪਛਾਣੋ',
    'dashboard.cards.prices.caption': 'ਤਾਜ਼ਾ ਬਾਜ਼ਾਰ ਭਾਵ',

    'weather.title': 'ਅੱਜ ਦਾ ਮੌਸਮ',
    'weather.selectLocation': 'ਸਥਾਨ ਚੁਣੋ',
    'weather.humidity': 'ਨਮੀ',
    'weather.wind': 'ਹਵਾ',
    'weather.showForecast': '5 ਦਿਨਾਂ ਦਾ ਅਨੁਮਾਨ ਦਿਖਾਓ',
    'weather.hideForecast': '5 ਦਿਨਾਂ ਦਾ ਅਨੁਮਾਨ ਲੁਕਾਓ',
    'weather.loadingWeather': 'ਮੌਸਮ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'weather.rainWarning': 'ਜਲਦੀ ਤੇਜ਼ ਬਾਰਿਸ਼ ਦੀ ਉਮੀਦ ਹੈ। ਆਪਣੀਆਂ ਫਸਲਾਂ ਨੂੰ ਢੱਕੋ!',

    'common.back': 'ਵਾਪਸ',
    'common.loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'common.error': 'ਗਲਤੀ',
    'common.success': 'ਸਫਲਤਾ',
    'common.select': 'ਚੁਣੋ',
    'common.submit': 'ਜਮ੍ਹਾਂ ਕਰੋ',
    'common.cancel': 'ਰੱਦ ਕਰੋ',
    'common.set': 'ਸੈਟ ਕਰੋ',
    'common.useGPS': 'GPS ਵਰਤੋ',
    'common.searchLocation': 'ਸ਼ਹਿਰ ਜਾਂ ਪਿੰਡ ਖੋਜੋ',
    'common.selectLocation': 'ਸਥਾਨ ਚੁਣੋ',
  },
  gu: {
    'nav.dashboard': 'ડેશબોર્ડ',
    'nav.fertilizer': 'ખાતર',
    'nav.scanner': 'સ્કેનર',
    'nav.prices': 'ભાવ',
    'nav.ai': 'AI',

    'dashboard.title': 'સ્માર્ટ ખેતીમાં આપનું સ્વાગત છે',
    'dashboard.subtitle': 'તમારો બુદ્ધિશાળી ખેતી સાથી',
    'dashboard.cropRecommendation': 'પાકની ભલામણ મેળવો',
    'dashboard.pestDetection': 'કીડની ઓળખ',
    'dashboard.fertilizer': 'ખાતર સલાહકાર',
    'dashboard.marketPrices': 'બજાર ભાવ',
    'dashboard.weather': 'હવામાન',
    'dashboard.ai': 'AI સહાયક',
    'dashboard.cards.crop.caption': 'તમારી જમીન માટે શ્રેષ્ઠ પાકો શોધો',
    'dashboard.cards.fertilizer.caption': 'ખાતર ભલામણ મેળવો',
    'dashboard.cards.scanner.caption': 'પાકના રોગ તરત ઓળખો',
    'dashboard.cards.prices.caption': 'તાજા બજાર ભાવ',

    'weather.title': 'આજનું હવામાન',
    'weather.selectLocation': 'સ્થાન પસંદ કરો',
    'weather.humidity': 'ભેજ',
    'weather.wind': 'પવન',
    'weather.showForecast': '5 દિવસનો અંદાજ બતાવો',
    'weather.hideForecast': '5 દિવસનો અંદાજ છુપાવો',
    'weather.loadingWeather': 'હવામાન લોડ થઈ રહ્યું છે...',
    'weather.rainWarning': 'જલ્દી જ ભારે વરસાદની શક્યતા. તમારી પાકોને ઢાંકી દો!',

    'common.back': 'પાછા',
    'common.loading': 'લોડ થઈ રહ્યું છે...',
    'common.error': 'ભૂલ',
    'common.success': 'સફળતા',
    'common.select': 'પસંદ કરો',
    'common.submit': 'સબમિટ કરો',
    'common.cancel': 'રદ કરો',
    'common.set': 'સેટ કરો',
    'common.useGPS': 'GPS વાપરો',
    'common.searchLocation': 'શહેર અથવા ગામ શોધો',
    'common.selectLocation': 'સ્થાન પસંદ કરો',
  },
  ta: {
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.fertilizer': 'உரம்',
    'nav.scanner': 'ஸ்கேனர்',
    'nav.prices': 'விலை',
    'nav.ai': 'AI',

    'dashboard.title': 'ஸ்மார்ட் விவசாயத்திற்கு வரவேற்கிறோம்',
    'dashboard.subtitle': 'உங்கள் புத்திசாலி விவசாய துணை',
    'dashboard.cropRecommendation': 'பயிர் பரிந்துரை பெறுங்கள்',
    'dashboard.pestDetection': 'தீனியன் கண்டறிதல்',
    'dashboard.fertilizer': 'உரம் ஆலோசகர்',
    'dashboard.marketPrices': 'சந்தை விலை',
    'dashboard.weather': 'வானிலை',
    'dashboard.ai': 'AI உதவியாளர்',
    'dashboard.cards.crop.caption': 'உங்கள் நிலத்திற்கு சிறந்த பயிர்கள்',
    'dashboard.cards.fertilizer.caption': 'உரம் பரிந்துரைகள் பெறுங்கள்',
    'dashboard.cards.scanner.caption': 'பயிர் நோய்கள் உடனே அறிக',
    'dashboard.cards.prices.caption': 'சமீபத்திய சந்தை விலை',

    'weather.title': 'இன்றைய வானிலை',
    'weather.selectLocation': 'இடத்தை தேர்ந்தெடுக்கவும்',
    'weather.humidity': 'ஈரப்பதம்',
    'weather.wind': 'காற்று',
    'weather.showForecast': '5 நாள் கணிப்பு காண்பி',
    'weather.hideForecast': '5 நாள் கணிப்பு மறை',
    'weather.loadingWeather': 'வானிலை ஏற்றப்படுகிறது...',
    'weather.rainWarning': 'விரைவில் கனமழை. உங்கள் பயிர்களை காப்பாற்றவும்!',

    'common.back': 'மீண்டு',
    'common.loading': 'ஏற்றப்படுகிறது...',
    'common.error': 'பிழை',
    'common.success': 'வெற்றி',
    'common.select': 'தேர்வு',
    'common.submit': 'சமர்ப்பிக்க',
    'common.cancel': 'ரத்து',
    'common.set': 'அமை',
    'common.useGPS': 'GPS பயன்படுத்து',
    'common.searchLocation': 'நகரம் அல்லது கிராமம் தேடு',
    'common.selectLocation': 'இடத்தை தேர்வு செய்',
  },
  te: {
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.fertilizer': 'ఎరువు',
    'nav.scanner': 'స్కానర్',
    'nav.prices': 'ధరలు',
    'nav.ai': 'AI',

    'dashboard.title': 'స్మార్ట్ వ్యవసాయానికి స్వాగతం',
    'dashboard.subtitle': 'మీ తెలివైన వ్యవసాయ భాగస్వామి',
    'dashboard.cropRecommendation': 'పంట సిఫార్సు పొందండి',
    'dashboard.pestDetection': 'పురుగు గుర్తింపు',
    'dashboard.fertilizer': 'ఎరువు సలహాదారు',
    'dashboard.marketPrices': 'మార్కెట్ ధరలు',
    'dashboard.weather': 'వాతావరణం',
    'dashboard.ai': 'AI సహాయకుడు',
    'dashboard.cards.crop.caption': 'మీ భూమికి ఉత్తమ పంటలు',
    'dashboard.cards.fertilizer.caption': 'ఎరువు సిఫార్సులు పొందండి',
    'dashboard.cards.scanner.caption': 'పంట వ్యాధులను వెంటనే గుర్తించండి',
    'dashboard.cards.prices.caption': 'తాజా మార్కెట్ ధరలు',

    'weather.title': 'ఈరోజు వాతావరణం',
    'weather.selectLocation': 'స్థానాన్ని ఎంచుకోండి',
    'weather.humidity': 'ఆర్ద్రత',
    'weather.wind': 'గాలి',
    'weather.showForecast': '5-రోజుల అంచనా చూపించు',
    'weather.hideForecast': '5-రోజుల అంచనా దాచు',
    'weather.loadingWeather': 'వాతావరణం లోడ్ అవుతోంది...',
    'weather.rainWarning': 'త్వరలో భారీ వర్షం. మీ పంటలను కాపాడండి!',

    'common.back': 'వెనక్కి',
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.error': 'లోపం',
    'common.success': 'విజయం',
    'common.select': 'ఎంచుకోండి',
    'common.submit': 'సమర్పించు',
    'common.cancel': 'రద్దు',
    'common.set': 'సెట్ చేయి',
    'common.useGPS': 'GPS వాడు',
    'common.searchLocation': 'నగరం లేదా గ్రామం శోధించు',
    'common.selectLocation': 'స్థానాన్ని ఎంచుకోండి',
  },
  bn: {
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.fertilizer': 'সার',
    'nav.scanner': 'স্ক্যানার',
    'nav.prices': 'দাম',
    'nav.ai': 'AI',

    'dashboard.title': 'স্মার্ট চাষে স্বাগতম',
    'dashboard.subtitle': 'আপনার বুদ্ধিমান কৃষি সঙ্গী',
    'dashboard.cropRecommendation': 'ফসলের পরামর্শ নিন',
    'dashboard.pestDetection': 'পোকা শনাক্তকরণ',
    'dashboard.fertilizer': 'সার পরামর্শদাতা',
    'dashboard.marketPrices': 'বাজার দাম',
    'dashboard.weather': 'আবহাওয়া',
    'dashboard.ai': 'AI সহায়ক',
    'dashboard.cards.crop.caption': 'আপনার জমির জন্য সেরা ফসল',
    'dashboard.cards.fertilizer.caption': 'সারের পরামর্শ নিন',
    'dashboard.cards.scanner.caption': 'ফসলের রোগ সাথে সাথেই চিনুন',
    'dashboard.cards.prices.caption': 'সর্বশেষ বাজার দাম',

    'weather.title': 'আজকের আবহাওয়া',
    'weather.selectLocation': 'স্থান নির্বাচন করুন',
    'weather.humidity': 'আর্দ্রতা',
    'weather.wind': 'বাতাস',
    'weather.showForecast': '৫ দিনের পূর্বাভাস দেখান',
    'weather.hideForecast': '৫ দিনের পূর্বাভাস লুকান',
    'weather.loadingWeather': 'আবহাওয়া লোড হচ্ছে...',
    'weather.rainWarning': 'শীঘ্রই ভারী বৃষ্টি হতে পারে। আপনার ফসল ঢেকে রাখুন!',

    'common.back': 'ফিরে যান',
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'ত্রুটি',
    'common.success': 'সফল',
    'common.select': 'নির্বাচন করুন',
    'common.submit': 'জমা দিন',
    'common.cancel': 'বাতিল',
    'common.set': 'সেট',
    'common.useGPS': 'GPS ব্যবহার করুন',
    'common.searchLocation': 'শহর বা গ্রাম খুঁজুন',
    'common.selectLocation': 'স্থান নির্বাচন করুন',
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
    // Dashboard card captions
    'dashboard.cards.crop.caption': 'तुमच्या जमिनीसाठी सर्वोत्तम पिके शोधा',
    'dashboard.cards.fertilizer.caption': 'खतांची शिफारस मिळवा',
    'dashboard.cards.scanner.caption': 'पिकांचे रोग त्वरीत ओळखा',
    'dashboard.cards.prices.caption': 'ताजे बाजार भाव',
    
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
    'common.set': 'सेट करा',
    'common.useGPS': 'GPS वापरा',
    'common.searchLocation': 'शहर किंवा गाव शोधा',
    'common.selectLocation': 'स्थान निवडा',
    'common.about': 'याबद्दल',
    'common.organicSolutions': 'सेंद्रिय उपाय',
    'common.chemicalSolutions': 'रासायनिक उपाय',
    'common.prevention': 'प्रतिबंध',
    'common.healthy': 'निरोगी',
    'common.diseaseDetected': 'रोग आढळला',
    'common.askAI': 'अधिक तपशीलांसाठी AI ला विचारा',
    'common.scanAnother': 'दुसरी वनस्पती स्कॅन करा',
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
    // Dashboard card captions
    'dashboard.cards.crop.caption': 'आपकी जमीन के लिए सर्वोत्तम फसलें चुनें',
    'dashboard.cards.fertilizer.caption': 'उर्वरक सिफारिशें प्राप्त करें',
    'dashboard.cards.scanner.caption': 'फसल रोग तुरंत पहचानें',
    'dashboard.cards.prices.caption': 'ताज़ा बाजार भाव',
    
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
    
    // Voice Assistant
    'voice.title': 'आवाज सहायक',
    'voice.listening': 'सुन रहा है... अब बोलें',
    'voice.processing': 'प्रक्रिया कर रहा है...',
    'voice.speaking': 'बोल रहा है...',
    'voice.toggle': 'आवाज सहायक',
    'voice.tooltip': 'बात करने के लिए क्लिक करें',
    'voice.notSupported': 'इस ब्राउज़र में आवाज सहायक समर्थित नहीं है',
    'voice.error': 'माफ करें, मुझे एक त्रुटि आई है। कृपया फिर से कोशिश करें।',
    'voice.typeMessage': 'अपना संदेश टाइप करें या आवाज का उपयोग करें...',
    'voice.voiceGender': 'आवाज',
    'voice.male': 'पुरुष',
    'voice.female': 'महिला',
    'voice.speed': 'गति',
    'voice.volume': 'आवाज',
    
    // Common
    'common.back': 'वापस',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
    'common.select': 'चुनें',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.set': 'सेट करें',
    'common.useGPS': 'GPS का उपयोग करें',
    'common.searchLocation': 'शहर या गांव खोजें',
    'common.selectLocation': 'स्थान चुनें',
    'common.about': 'के बारे में',
    'common.organicSolutions': 'जैविक समाधान',
    'common.chemicalSolutions': 'रासायनिक समाधान',
    'common.prevention': 'रोकथाम',
    'common.healthy': 'स्वस्थ',
    'common.diseaseDetected': 'बीमारी का पता चला',
    'common.askAI': 'अधिक विवरण के लिए AI से पूछें',
    'common.scanAnother': 'दूसरा पौधा स्कैन करें',
  }
};