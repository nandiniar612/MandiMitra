import { LanguageCode } from '../types/farmer';

export interface TranslationBundle {
  brand: string;
  nav: {
    dashboard: string;
    explorer: string;
    comparison: string;
    prediction: string;
    recommendation: string;
    calculator: string;
    about: string;
    aiCardTitle: string;
    aiCardDesc: string;
    askAiBtn: string;
  };
  topbar: {
    searchPlaceholder: string;
    noResults: string;
    farmerRole: string;
    logout: string;
  };
  login: {
    badge: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    placeLabel: string;
    placePlaceholder: string;
    localityLabel: string;
    localityPlaceholder: string;
    languageLabel: string;
    submitBtn: string;
    demoBtn: string;
    errorRequired: string;
    errorPhone: string;
    feature1: string;
    feature2: string;
    feature3: string;
  };
  dashboard: {
    welcomePrefix: string;
    subtitle: string;
    kpiCrops: string;
    kpiCropsSub: string;
    kpiAvgRate: string;
    kpiAvgRateSub: string;
    kpiBestMandi: string;
    kpiTrend: string;
    kpiTrendSub: string;
    tickerTitle: string;
    tickerSub: string;
    colCrop: string;
    colBestPrice: string;
    colChange24h: string;
    colForecast7d: string;
    colDecision: string;
    colBestMandi: string;
    sellNow: string;
    holdPeak: string;
    fieldMapTitle: string;
    fieldMapSub: string;
    distributionTitle: string;
    distributionSub: string;
    topGainersTitle: string;
    bulletinsTitle: string;
    weatherTitle: string;
    viewAll: string;
    analyzeInBot: string;
  };
  chatbot: {
    title: string;
    subtitle: string;
    launcherLabel: string;
    placeholder: string;
    send: string;
    quickPromptLabel: string;
    greeting: (farmerName: string, place: string) => string;
    currentBestPrice: string;
    marketChange: string;
    next7Days: string;
    decisionLabel: string;
    bestProfitMandi: string;
    increased: string;
    decreased: string;
    sellAdvice: string;
    holdAdvice: string;
    listen: string;
    stopAudio: string;
  };
  pages: {
    explorerTitle: string;
    explorerSub: string;
    compareTitle: string;
    compareSub: string;
    predictionTitle: string;
    predictionSub: string;
    sellingTitle: string;
    sellingSub: string;
    calcTitle: string;
    calcSub: string;
    aboutTitle: string;
    aboutSub: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationBundle> = {
  en: {
    brand: 'MandiMitra',
    nav: {
      dashboard: 'Dashboard',
      explorer: 'Price Explorer',
      comparison: 'Mandi Compare',
      prediction: 'AI Prediction',
      recommendation: 'Smart Selling',
      calculator: 'Profit Calc',
      about: 'About Platform',
      aiCardTitle: 'AI Price Assistant',
      aiCardDesc: 'Ask for stock-style price analysis, forecasts & best profit mandi.',
      askAiBtn: 'Ask AI Assistant',
    },
    topbar: {
      searchPlaceholder: 'Search crops, mandis, prices...',
      noResults: 'No matching crops or mandis found',
      farmerRole: 'Registered Farmer',
      logout: 'Logout',
    },
    login: {
      badge: 'Agriculture & Rural Innovation',
      title: 'Farmer Sign In to MandiMitra AI',
      subtitle: 'Get real-time mandi rates, stock-market price trends, AI forecasts, and profitable selling advice in your language.',
      nameLabel: 'Farmer Full Name',
      namePlaceholder: 'e.g. Ramesh Gowda',
      phoneLabel: 'Mobile Phone Number',
      phonePlaceholder: '10-digit mobile number',
      placeLabel: 'Place / District',
      placePlaceholder: 'e.g. Dharwad, Kolar, Mysuru',
      localityLabel: 'Locality / Village / Hobli',
      localityPlaceholder: 'e.g. Kundgol Village',
      languageLabel: 'Preferred Language',
      submitBtn: 'Enter MandiMitra Dashboard',
      demoBtn: 'Quick Fill Demo Farmer',
      errorRequired: 'Please fill in your name, phone number, place, and locality.',
      errorPhone: 'Please enter a valid 10-digit phone number.',
      feature1: 'Live APMC Stock-Style Ticker & % Rate Tracking',
      feature2: '7-Day & 30-Day AI Price Increment Forecasting',
      feature3: 'Multilingual AI Chatbot in English, ಕನ್ನಡ & हिन्दी',
    },
    dashboard: {
      welcomePrefix: 'Welcome back,',
      subtitle: 'Live market prices, AI forecasts, and profit alerts tailored for',
      kpiCrops: 'Tracked Crops',
      kpiCropsSub: 'Active APMC Commodities',
      kpiAvgRate: 'Average Market Rate',
      kpiAvgRateSub: 'Across regional mandis',
      kpiBestMandi: 'Highest Paying Mandi',
      kpiTrend: '7-Day AI Outlook',
      kpiTrendSub: 'Projected market momentum',
      tickerTitle: 'Live Crop Price Ticker & Sell/Hold Signals',
      tickerSub: 'Stock-market style rate movements, 7-day AI increment forecast & best profit mandi',
      colCrop: 'Commodity',
      colBestPrice: 'Best Price',
      colChange24h: '24h Change',
      colForecast7d: '7-Day Forecast',
      colDecision: 'AI Verdict',
      colBestMandi: 'Best Profit Mandi',
      sellNow: 'SELL NOW',
      holdPeak: 'HOLD (3–5d)',
      fieldMapTitle: 'Regional Mandi Price Radar',
      fieldMapSub: 'Live APMC hub rates around your farming belt',
      distributionTitle: 'Market Share by Arrivals',
      distributionSub: 'Current mandi arrival volume distribution',
      topGainersTitle: 'Top Gaining Commodities',
      bulletinsTitle: 'Agricultural Market Bulletins',
      weatherTitle: 'Harvest & Storage Outlook',
      viewAll: 'Open Explorer',
      analyzeInBot: 'AI Analyze',
    },
    chatbot: {
      title: 'MandiMitra AI Price Analyst',
      subtitle: 'Live Stock-Style Market & Sell Advisor',
      launcherLabel: 'AI Price Chatbot',
      placeholder: 'Ask about any crop price, forecast, or best mandi...',
      send: 'Send',
      quickPromptLabel: 'Analyze Crop:',
      greeting: (name, place) =>
        `Namaste ${name}! I am tracking live APMC prices near ${place}. Tap any crop below or ask me for current best price, % rise/drop, 7-day forecast, and which mandi gives the highest net profit.`,
      currentBestPrice: 'Current Best Price',
      marketChange: 'Market Rate Change',
      next7Days: 'Next 7-Day AI Prediction',
      decisionLabel: 'AI Recommendation',
      bestProfitMandi: 'Highest Profit Mandi',
      increased: 'Increased',
      decreased: 'Decreased',
      sellAdvice: 'SELL NOW — Prices are at a local peak or crop is perishable.',
      holdAdvice: 'HOLD (3–5 Days) — Prices are projected to rise further.',
      listen: 'Listen',
      stopAudio: 'Stop',
    },
    pages: {
      explorerTitle: 'Crop Price Explorer',
      explorerSub: 'Explore daily mandi trading rates, Minimum, Maximum & Modal prices across India.',
      compareTitle: 'Mandi Price Comparison',
      compareSub: 'Compare gross rates vs net pocket return after transport deductions.',
      predictionTitle: 'AI Crop Price Forecasting',
      predictionSub: '7-day and 30-day predictive analytics powered by ensemble ML models.',
      sellingTitle: 'Smart Selling Recommendation',
      sellingSub: 'Calculate optimal mandi destination and selling window for your harvest.',
      calcTitle: 'Farmer Profit & Revenue Calculator',
      calcSub: 'Compute gross revenue, freight, labor, APMC cess & break-even floor.',
      aboutTitle: 'About MandiMitra-AI',
      aboutSub: 'Empowering rural agriculture with transparent market intelligence.',
    },
  },
  kn: {
    brand: 'ಮಂಡಿಮಿತ್ರ',
    nav: {
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      explorer: 'ಬೆಲೆ ಅನ್ವೇಷಕ',
      comparison: 'ಮಂಡಿ ಹೋಲಿಕೆ',
      prediction: 'AI ಮುನ್ಸೂಚನೆ',
      recommendation: 'ಸ್ಮಾರ್ಟ್ ಮಾರಾಟ',
      calculator: 'ಲಾಭ ಲೆಕ್ಕಾಚಾರ',
      about: 'ನಮ್ಮ ಬಗ್ಗೆ',
      aiCardTitle: 'AI ಬೆಲೆ ಸಹಾಯಕ',
      aiCardDesc: 'ಬೆಲೆ ಏರಿಳಿತ, ಮುನ್ಸೂಚನೆ ಮತ್ತು ಗರಿಷ್ಠ ಲಾಭದ ಮಂಡಿ ಮಾಹಿತಿ ಪಡೆಯಿರಿ.',
      askAiBtn: 'AI ಸಹಾಯ ಕೇಳಿ',
    },
    topbar: {
      searchPlaceholder: 'ಬೆಳೆ, ಮಂಡಿ ಅಥವಾ ಬೆಲೆ ಹುಡುಕಿ...',
      noResults: 'ಯಾವುದೇ ಬೆಳೆ ಅಥವಾ ಮಂಡಿ ಕಂಡುಬಂದಿಲ್ಲ',
      farmerRole: 'ನೋಂದಾಯಿತ ರೈತರು',
      logout: 'ಲಾಗ್ ಔಟ್',
    },
    login: {
      badge: 'ಕೃಷಿ ಮತ್ತು ಗ್ರಾಮೀಣ ನಾವೀನ್ಯತೆ',
      title: 'ಮಂಡಿಮಿತ್ರ AI ರೈತ ಲಾಗಿನ್',
      subtitle: 'ತಾಜಾ ಮಂಡಿ ದರಗಳು, ಷೇರು ಮಾರುಕಟ್ಟೆ ಮಾದರಿಯ ಬೆಲೆ ಏರಿಳಿತ, AI ಮುನ್ಸೂಚನೆ ಮತ್ತು ಹೆಚ್ಚಿನ ಲಾಭದ ಸಲಹೆ ಪಡೆಯಿರಿ.',
      nameLabel: 'ರೈತರ ಪೂರ್ಣ ಹೆಸರು',
      namePlaceholder: 'ಉದಾ: ರಮೇಶ್ ಗೌಡ',
      phoneLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      phonePlaceholder: '10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      placeLabel: 'ಸ್ಥಳ / ಜಿಲ್ಲೆ',
      placePlaceholder: 'ಉದಾ: ಧಾರವಾಡ, ಕೋಲಾರ, ಮೈಸೂರು',
      localityLabel: 'ಗ್ರಾಮ / ಹೋಬಳಿ / ತಾಲೂಕು',
      localityPlaceholder: 'ಉದಾ: ಕುಂದಗೋಳ ಗ್ರಾಮ',
      languageLabel: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
      submitBtn: 'ಮಂಡಿಮಿತ್ರ ಪ್ರವೇಶಿಸಿ',
      demoBtn: 'ಡೆಮೋ ರೈತ ಮಾಹಿತಿ ತುಂಬಿ',
      errorRequired: 'ದಯವಿಟ್ಟು ಹೆಸರು, ಫೋನ್ ಸಂಖ್ಯೆ, ಸ್ಥಳ ಮತ್ತು ಗ್ರಾಮವನ್ನು ನಮೂದಿಸಿ.',
      errorPhone: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10 ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
      feature1: 'ಲೈವ್ ಎಪಿಎಂಸಿ ಬೆಲೆ ಏರಿಳಿತ (%) ಟ್ರ್ಯಾಕಿಂಗ್',
      feature2: '7 ಮತ್ತು 30 ದಿನಗಳ AI ಬೆಲೆ ಮುನ್ಸೂಚನೆ',
      feature3: 'ಕನ್ನಡ, ಹಿಂದಿ ಮತ್ತು ಇಂಗ್ಲಿಷ್ AI ಚಾಟ್‌ಬಾಟ್',
    },
    dashboard: {
      welcomePrefix: 'ಸ್ವಾಗತ,',
      subtitle: 'ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರಗಳು, AI ಮುನ್ಸೂಚನೆ ಮತ್ತು ಲಾಭದ ಮಾಹಿತಿ:',
      kpiCrops: 'ಲಭ್ಯವಿರುವ ಬೆಳೆಗಳು',
      kpiCropsSub: 'ಸಕ್ರಿಯ ಎಪಿಎಂಸಿ ಬೆಳೆಗಳು',
      kpiAvgRate: 'ಸರಾಸರಿ ಮಂಡಿ ದರ',
      kpiAvgRateSub: 'ಪ್ರಾದೇಶಿಕ ಮಾರುಕಟ್ಟೆಗಳಲ್ಲಿ',
      kpiBestMandi: 'ಅತ್ಯಧಿಕ ದರದ ಮಂಡಿ',
      kpiTrend: '7 ದಿನಗಳ AI ಪ್ರವೃತ್ತಿ',
      kpiTrendSub: 'ಮುಂಬರುವ ಬೆಲೆ ಅಂದಾಜು',
      tickerTitle: 'ಲೈವ್ ಬೆಳೆ ದರ ಸೂಚ್ಯಂಕ & ಮಾರಾಟ ಸಲಹೆ',
      tickerSub: 'ಷೇರು ಮಾರುಕಟ್ಟೆ ಮಾದರಿಯ ಬೆಲೆ ಏರಿಳಿತ, 7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಲಾಭದಾಯಕ ಮಂಡಿ',
      colCrop: 'ಬೆಳೆ',
      colBestPrice: 'ಗರಿಷ್ಠ ಬೆಲೆ',
      colChange24h: '24 ಗಂಟೆ ಬದಲಾವಣೆ',
      colForecast7d: '7 ದಿನಗಳ ಅಂದಾಜು',
      colDecision: 'AI ನಿರ್ಧಾರ',
      colBestMandi: 'ಹೆಚ್ಚು ಲಾಭದ ಮಂಡಿ',
      sellNow: 'ಈಗಲೇ ಮಾರಿ',
      holdPeak: 'ಕಾಯಿರಿ (3–5 ದಿನ)',
      fieldMapTitle: 'ಪ್ರಾದೇಶಿಕ ಮಂಡಿ ದರ ನಕ್ಷೆ',
      fieldMapSub: 'ನಿಮ್ಮ ಸುತ್ತಮುತ್ತಲಿನ ಪ್ರಮುಖ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಗಳು',
      distributionTitle: 'ಮಾರುಕಟ್ಟೆ ಆವಕ ಹಂಚಿಕೆ',
      distributionSub: 'ಪ್ರಸ್ತುತ ಮಂಡಿಗಳಲ್ಲಿ ಬೆಳೆಗಳ ಪಾಲು',
      topGainersTitle: 'ಇಂದಿನ ಗರಿಷ್ಠ ಏರಿಕೆಯ ಬೆಳೆಗಳು',
      bulletinsTitle: 'ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಪ್ರಕಟಣೆಗಳು',
      weatherTitle: 'ಬೆಳೆ ಸಂಗ್ರಹಣೆ ಮಾಹಿತಿ',
      viewAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
      analyzeInBot: 'AI ವಿಶ್ಲೇಷಣೆ',
    },
    chatbot: {
      title: 'ಮಂಡಿಮಿತ್ರ AI ಬೆಲೆ ವಿಶ್ಲೇಷಕ',
      subtitle: 'ಲೈವ್ ಮಾರುಕಟ್ಟೆ ದರ ಮತ್ತು ಮಾರಾಟ ಸಲಹೆಗಾರ',
      launcherLabel: 'AI ಬೆಲೆ ಚಾಟ್‌ಬಾಟ್',
      placeholder: 'ಯಾವುದೇ ಬೆಳೆಯ ದರ, ಮುನ್ಸೂಚನೆ ಅಥವಾ ಮಂಡಿ ಬಗ್ಗೆ ಕೇಳಿ...',
      send: 'ಕಳುಹಿಸಿ',
      quickPromptLabel: 'ಬೆಳೆ ಆಯ್ಕೆ:',
      greeting: (name, place) =>
        `ನಮಸ್ಕಾರ ${name}! ${place} ಸುತ್ತಮುತ್ತಲಿನ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ನಾನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದ್ದೇನೆ. ಕೆಳಗಿನ ಬೆಳೆಗಳನ್ನು ಒತ್ತಿ ಅಥವಾ ಇಂದಿನ ಬೆಲೆ, ಶೇಕಡಾವಾರು ಏರಿಳಿತ (%), ಮುಂದಿನ 7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಹೆಚ್ಚು ಲಾಭದ ಮಂಡಿಯ ಬಗ್ಗೆ ಕೇಳಿ.`,
      currentBestPrice: 'ಪ್ರಸ್ತುತ ಉತ್ತಮ ಬೆಲೆ',
      marketChange: 'ಮಾರುಕಟ್ಟೆ ದರ ಬದಲಾವಣೆ',
      next7Days: 'ಮುಂದಿನ 7 ದಿನಗಳ AI ಅಂದಾಜು',
      decisionLabel: 'AI ಮಾರಾಟ ಸಲಹೆ',
      bestProfitMandi: 'ಅತ್ಯಧಿಕ ಲಾಭದ ಮಂಡಿ',
      increased: 'ಏರಿಕೆಯಾಗಿದೆ',
      decreased: 'ಇಳಿಕೆಯಾಗಿದೆ',
      sellAdvice: 'ಈಗಲೇ ಮಾರಿ — ಬೆಲೆ ಗರಿಷ್ಠ ಮಟ್ಟದಲ್ಲಿದೆ ಅಥವಾ ಬೆಳೆ ಬೇಗ ಹಾಳಾಗುತ್ತದೆ.',
      holdAdvice: 'ಕಾಯಿರಿ (3–5 ದಿನ) — ಮುಂದಿನ ದಿನಗಳಲ್ಲಿ ಬೆಲೆ ಇನ್ನಷ್ಟು ಏರಿಕೆಯಾಗಲಿದೆ.',
      listen: 'ಕೇಳಿ',
      stopAudio: 'ನಿಲ್ಲಿಸಿ',
    },
    pages: {
      explorerTitle: 'ಬೆಳೆ ಬೆಲೆ ಅನ್ವೇಷಕ',
      explorerSub: 'ಕನಿಷ್ಠ, ಗರಿಷ್ಠ ಮತ್ತು ಮಾದರಿ ಎಪಿಎಂಸಿ ದರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
      compareTitle: 'ಮಂಡಿ ಬೆಲೆ ಹೋಲಿಕೆ',
      compareSub: 'ಸಾಗಣೆ ವೆಚ್ಚ ಕಳೆದು ನಿವ್ವಳ ಲಾಭವನ್ನು ಹೋಲಿಸಿ.',
      predictionTitle: 'AI ಬೆಲೆ ಮುನ್ಸೂಚನೆ',
      predictionSub: 'ಮಷೀನ್ ಲರ್ನಿಂಗ್ ಆಧಾರಿತ 7 ಮತ್ತು 30 ದಿನಗಳ ದರ ಅಂದಾಜು.',
      sellingTitle: 'ಸ್ಮಾರ್ಟ್ ಮಾರಾಟ ಸಲಹೆ',
      sellingSub: 'ನಿಮ್ಮ ಬೆಳೆಗೆ ಸೂಕ್ತ ಮಂಡಿ ಮತ್ತು ಮಾರಾಟದ ಸಮಯವನ್ನು ತಿಳಿಯಿರಿ.',
      calcTitle: 'ರೈತ ಲಾಭ ಲೆಕ್ಕಾಚಾರ',
      calcSub: 'ಒಟ್ಟು ಆದಾಯ, ಸಾಗಣೆ, ಹಮಾಲಿ ಮತ್ತು ನಿವ್ವಳ ಉಳಿತಾಯವನ್ನು ಲೆಕ್ಕಹಾಕಿ.',
      aboutTitle: 'ಮಂಡಿಮಿತ್ರ-AI ಬಗ್ಗೆ',
      aboutSub: 'ರೈತರ ಆರ್ಥಿಕ ಸಬಲೀಕರಣಕ್ಕಾಗಿ ಪಾರದರ್ಶಕ ಮಾರುಕಟ್ಟೆ ತಂತ್ರಜ್ಞಾನ.',
    },
  },
  hi: {
    brand: 'मंडीमित्र',
    nav: {
      dashboard: 'डैशबोर्ड',
      explorer: 'भाव खोजें',
      comparison: 'मंडी तुलना',
      prediction: 'AI पूर्वानुमान',
      recommendation: 'स्मार्ट बिक्री',
      calculator: 'मुनाफा कैलकुलेटर',
      about: 'हमारे बारे में',
      aiCardTitle: 'AI मूल्य सहायक',
      aiCardDesc: 'ताजा भाव, % उतार-चढ़ाव और सबसे मुनाफे वाली मंडी की जानकारी पाएं।',
      askAiBtn: 'AI से पूछें',
    },
    topbar: {
      searchPlaceholder: 'फसल, मंडी या भाव खोजें...',
      noResults: 'कोई फसल या मंडी नहीं मिली',
      farmerRole: 'पंजीकृत किसान',
      logout: 'लॉग आउट',
    },
    login: {
      badge: 'कृषि एवं ग्रामीण नवाचार मंच',
      title: 'मंडीमित्र AI किसान लॉगिन',
      subtitle: 'अपनी भाषा में लाइव मंडी भाव, शेयर बाजार जैसा प्रतिशत विश्लेषण, AI पूर्वानुमान और सही बिक्री सलाह पाएं।',
      nameLabel: 'किसान का पूरा नाम',
      namePlaceholder: 'जैसे: रमेश गौड़ा',
      phoneLabel: 'मोबाइल नंबर',
      phonePlaceholder: '10 अंकों का मोबाइल नंबर',
      placeLabel: 'स्थान / जिला',
      placePlaceholder: 'जैसे: धारवाड़, कोलार, इंदौर',
      localityLabel: 'गांव / क्षेत्र / तहसील',
      localityPlaceholder: 'जैसे: कुंदगोल गांव',
      languageLabel: 'पसंदीदा भाषा',
      submitBtn: 'मंडीमित्र डैशबोर्ड खोलें',
      demoBtn: 'डेमो किसान जानकारी भरें',
      errorRequired: 'कृपया नाम, फोन नंबर, जिला और गांव का नाम भरें।',
      errorPhone: 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।',
      feature1: 'लाइव APMC शेयर-बाजार जैसा भाव और % बदलाव',
      feature2: '7 और 30 दिनों का AI मूल्य पूर्वानुमान',
      feature3: 'हिंदी, कन्नड़ और अंग्रेजी में AI चैटबॉट',
    },
    dashboard: {
      welcomePrefix: 'स्वागत है,',
      subtitle: 'ताजा मंडी भाव, AI पूर्वानुमान और मुनाफा सलाह — स्थान:',
      kpiCrops: 'प्रमुख फसलें',
      kpiCropsSub: 'सक्रिय एपीएमसी फसलें',
      kpiAvgRate: 'औसत मंडी भाव',
      kpiAvgRateSub: 'क्षेत्रीय मंडियों का औसत',
      kpiBestMandi: 'सर्वोच्च भाव मंडी',
      kpiTrend: '7-दिवसीय AI रुझान',
      kpiTrendSub: 'आगामी बाजार गति',
      tickerTitle: 'लाइव फसल भाव टिकर और बेचें/रोकें संकेत',
      tickerSub: 'शेयर बाजार जैसा उतार-चढ़ाव, 7-दिन का पूर्वानुमान और सर्वाधिक मुनाफे वाली मंडी',
      colCrop: 'फसल',
      colBestPrice: 'सर्वोत्तम भाव',
      colChange24h: '24 घंटे बदलाव',
      colForecast7d: '7-दिन अनुमान',
      colDecision: 'AI सलाह',
      colBestMandi: 'सर्वाधिक मुनाफा मंडी',
      sellNow: 'अभी बेचें',
      holdPeak: 'रुकें (3–5 दिन)',
      fieldMapTitle: 'क्षेत्रीय मंडी भाव रडार',
      fieldMapSub: 'आपके क्षेत्र की प्रमुख मंडियों के ताजा भाव',
      distributionTitle: 'मंडी आवक हिस्सेदारी',
      distributionSub: 'प्रमुख फसलों की मंडी आवक का अनुपात',
      topGainersTitle: 'आज की शीर्ष बढ़ती फसलें',
      bulletinsTitle: 'कृषि बाजार बुलेटिन',
      weatherTitle: 'फसल भंडारण स्थिति',
      viewAll: 'सभी देखें',
      analyzeInBot: 'AI विश्लेषण',
    },
    chatbot: {
      title: 'मंडीमित्र AI मूल्य विश्लेषक',
      subtitle: 'लाइव मंडी भाव एवं बिक्री सलाहकार',
      launcherLabel: 'AI भाव चैटबॉट',
      placeholder: 'किसी फसल का भाव, पूर्वानुमान या मंडी पूछें...',
      send: 'भेजें',
      quickPromptLabel: 'फसल चुनें:',
      greeting: (name, place) =>
        `नमस्ते ${name}! मैं ${place} के आसपास की मंडियों के ताजा भाव ट्रैक कर रहा हूँ। किसी फसल पर क्लिक करें या पूछें कि आज सबसे अच्छा भाव क्या है, कितना % बढ़ा या घटा है, आगे भाव बढ़ेगा या नहीं, और किस मंडी में सबसे ज्यादा मुनाफा मिलेगा।`,
      currentBestPrice: 'वर्तमान सर्वोत्तम भाव',
      marketChange: 'बाजार भाव में बदलाव',
      next7Days: 'अगले 7 दिनों का AI अनुमान',
      decisionLabel: 'AI बिक्री सलाह',
      bestProfitMandi: 'सर्वाधिक मुनाफे वाली मंडी',
      increased: 'बढ़ा है',
      decreased: 'घटा है',
      sellAdvice: 'अभी बेचें — कीमतें उच्च स्तर पर हैं या फसल जल्दी खराब होने वाली है।',
      holdAdvice: 'रुकें (3–5 दिन) — आने वाले दिनों में भाव और बढ़ने की संभावना है।',
      listen: 'सुनें',
      stopAudio: 'रोकें',
    },
    pages: {
      explorerTitle: 'फसल भाव एक्सप्लोरर',
      explorerSub: 'न्यूनतम, अधिकतम और मॉडल मंडी भाव देखें।',
      compareTitle: 'मंडी भाव तुलना',
      compareSub: 'ढुलाई खर्च घटाकर शुद्ध मुनाफे की तुलना करें।',
      predictionTitle: 'AI फसल मूल्य पूर्वानुमान',
      predictionSub: 'मशीन लर्निंग द्वारा 7 और 30 दिनों का भाव अनुमान।',
      sellingTitle: 'स्मार्ट बिक्री सलाह',
      sellingSub: 'अपनी उपज के लिए सबसे लाभदायक मंडी और समय चुनें।',
      calcTitle: 'किसान मुनाफा कैलकुलेटर',
      calcSub: 'कुल आय, भाड़ा, हमाली और शुद्ध बचत की गणना करें।',
      aboutTitle: 'मंडीमित्र-AI के बारे में',
      aboutSub: 'पारदर्शी बाजार जानकारी के साथ भारतीय किसानों का सशक्तिकरण।',
    },
  },
};
