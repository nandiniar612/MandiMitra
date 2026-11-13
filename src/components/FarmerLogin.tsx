import React, { useState } from 'react';
import {
  Sprout,
  User,
  Phone,
  MapPin,
  Navigation,
  Languages,
  ArrowRight,
  TrendingUp,
  Cpu,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { FarmerProfile, LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';

interface FarmerLoginProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onLoginSuccess: (profile: FarmerProfile) => void;
}

export const FarmerLogin: React.FC<FarmerLoginProps> = ({
  language,
  setLanguage,
  onLoginSuccess,
}) => {
  const t = TRANSLATIONS[language].login;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [place, setPlace] = useState('');
  const [locality, setLocality] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanPlace = place.trim();
    const cleanLocality = locality.trim();

    if (!cleanName || !cleanPhone || !cleanPlace || !cleanLocality) {
      setError(t.errorRequired);
      return;
    }

    if (cleanPhone.length < 10) {
      setError(t.errorPhone);
      return;
    }

    onLoginSuccess({
      name: cleanName,
      phone: cleanPhone,
      place: cleanPlace,
      locality: cleanLocality,
      language,
      loggedInAt: new Date().toISOString(),
    });
  };

  const handleDemoFill = () => {
    setError(null);
    setName(language === 'kn' ? 'ರಮೇಶ್ ಗೌಡ' : language === 'hi' ? 'रमेश गौड़ा' : 'Ramesh Gowda');
    setPhone('9845012345');
    setPlace(language === 'kn' ? 'ಧಾರವಾಡ' : language === 'hi' ? 'धारवाड़' : 'Dharwad');
    setLocality(language === 'kn' ? 'ಕುಂದಗೋಳ ಗ್ರಾಮ' : language === 'hi' ? 'कुंदगोल गांव' : 'Kundgol Hobli');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-[#07160d]">
      {/* Scenic Agricultural Background Layer */}
      <div className="fixed inset-0 pointer-events-none">
        <img
          src="/src/assets/images/farmer_smart_tech_1794498775168.jpg"
          alt="Lush green agricultural fields"
          className="w-full h-full object-cover opacity-35 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#06140c]/95 via-[#0a2314]/80 to-[#06140c]/95" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Informational Panel */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-lime-300 shadow-sm">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white font-display">
                  MandiMitra<span className="text-amber-400">AI</span>
                </span>
                <p className="text-xs text-emerald-300/90 font-medium">{t.badge}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-display">
                {t.title}
              </h1>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/50 border border-emerald-400/10">
                <TrendingUp className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                <span className="text-xs text-emerald-50/90 leading-relaxed">{t.feature1}</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/50 border border-emerald-400/10">
                <Cpu className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span className="text-xs text-emerald-50/90 leading-relaxed">{t.feature2}</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/50 border border-emerald-400/10">
                <MessageSquare className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span className="text-xs text-emerald-50/90 leading-relaxed">{t.feature3}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-400/15 flex items-center justify-between text-xs text-emerald-200/70">
            <span>Agmarknet · eNAM Ready</span>
            <span>2026 Season</span>
          </div>
        </div>

        {/* Right Farmer Login Form */}
        <div className="lg:col-span-7 glass-panel-strong rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Language Switcher Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-400/15">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                <Languages className="w-4 h-4 text-amber-300" />
                <span>{t.languageLabel}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-950/70 p-1 rounded-xl border border-emerald-400/20">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    language === 'en'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-200/80 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('kn')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    language === 'kn'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-200/80 hover:text-white'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    language === 'hi'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-200/80 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Farmer Name */}
              <div>
                <label className="text-xs font-semibold text-emerald-100 block mb-1.5">
                  {t.nameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-300/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-emerald-950/60 border border-emerald-400/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:ring-2 focus:ring-lime-400/60"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-xs font-semibold text-emerald-100 block mb-1.5">
                  {t.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-300/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono bg-emerald-950/60 border border-emerald-400/20 rounded-xl text-white placeholder:text-emerald-200/40 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-lime-400/60"
                  />
                </div>
              </div>

              {/* Place / District */}
              <div>
                <label className="text-xs font-semibold text-emerald-100 block mb-1.5">
                  {t.placeLabel}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-300/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder={t.placePlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-emerald-950/60 border border-emerald-400/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:ring-2 focus:ring-lime-400/60"
                  />
                </div>
              </div>

              {/* Locality / Village */}
              <div>
                <label className="text-xs font-semibold text-emerald-100 block mb-1.5">
                  {t.localityLabel}
                </label>
                <div className="relative">
                  <Navigation className="w-4 h-4 text-emerald-300/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder={t.localityPlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-emerald-950/60 border border-emerald-400/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:ring-2 focus:ring-lime-400/60"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-emerald-950 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>{t.submitBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDemoFill}
                className="py-3 px-4 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-100 border border-emerald-400/25 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                {t.demoBtn}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
