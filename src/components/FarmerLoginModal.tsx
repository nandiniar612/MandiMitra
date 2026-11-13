import React, { useState } from 'react';
import { Sprout, User, Phone, MapPin, Navigation, Languages, ArrowRight, Sparkles } from 'lucide-react';
import { FarmerProfile, SupportedLanguage } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';
import { STATES_DISTRICTS } from '../data/marketData';

interface FarmerLoginModalProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onCompleteLogin: (profile: FarmerProfile) => void;
  initialProfile?: FarmerProfile | null;
}

export const FarmerLoginModal: React.FC<FarmerLoginModalProps> = ({
  language,
  setLanguage,
  onCompleteLogin,
  initialProfile,
}) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [place, setPlace] = useState(initialProfile?.place || 'Dharwad, Karnataka');
  const [locality, setLocality] = useState(initialProfile?.locality || '');
  const [error, setError] = useState('');

  const t = TRANSLATIONS[language].login;

  // Flatten place options from STATES_DISTRICTS
  const placeOptions = Object.entries(STATES_DISTRICTS).flatMap(([state, districts]) =>
    districts.map((d) => `${d}, ${state}`)
  );

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  const handleQuickFill = () => {
    setName(language === 'kn' ? 'ಬಸವರಾಜ ಪಾಟೀಲ್' : language === 'hi' ? 'रामेश्वर पाटिल' : 'Basavaraj Patil');
    setPhone('9845012345');
    setPlace('Dharwad, Karnataka');
    setLocality(language === 'kn' ? 'ಕಲಘಟಗಿ ಗ್ರಾಮ' : language === 'hi' ? 'कलघटगी ग्राम' : 'Kalghatgi Taluk');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (!name.trim() || !place.trim() || !locality.trim()) {
      setError(t.requiredError);
      return;
    }
    if (cleanPhone.length < 10) {
      setError(t.phoneError);
      return;
    }

    onCompleteLogin({
      name: name.trim(),
      phone: cleanPhone.slice(-10),
      place: place.trim(),
      locality: locality.trim(),
      language,
      loggedInAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6">
      {/* Agricultural Backdrop */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url('/src/assets/images/hero_farmer_mandi_1794498773867.jpg')`,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/85 via-emerald-900/80 to-stone-950/85 backdrop-blur-xs z-0" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-xl bg-[#FCFDF9] rounded-2xl shadow-2xl border border-emerald-200/60 overflow-hidden">
        {/* Top Accent Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 px-6 py-5 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shadow-sm shrink-0">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                {t.badge}
              </span>
              <h1 className="text-xl font-extrabold font-display tracking-tight">
                MandiMitra<span className="text-amber-400">AI</span>
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickFill}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.quickFillBtn}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 font-display">
              {t.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Preferred Language Selector (First-class prominent control) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-800" />
              <span>{t.langLabel}</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'en' as const, label: 'English', native: 'English' },
                { id: 'kn' as const, label: 'Kannada', native: 'ಕನ್ನಡ' },
                { id: 'hi' as const, label: 'Hindi', native: 'हिन्दी' },
              ].map((langOpt) => (
                <button
                  key={langOpt.id}
                  type="button"
                  onClick={() => handleLanguageSelect(langOpt.id)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                    language === langOpt.id
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm font-bold ring-2 ring-emerald-500/40'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300 hover:bg-stone-50 font-medium'
                  }`}
                >
                  <span className="text-sm block">{langOpt.native}</span>
                  <span className={`text-[10px] ${language === langOpt.id ? 'text-amber-300' : 'text-stone-400'}`}>
                    {langOpt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Farmer Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">
                {t.nameLabel} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">
                {t.phoneLabel} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  maxLength={13}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 text-sm font-mono bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Place (District & State) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">
                {t.placeLabel} *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  {placeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Locality / Village */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">
                {t.localityLabel} *
              </label>
              <div className="relative">
                <Navigation className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder={t.localityPlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.submitBtn}</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </form>
      </div>
    </div>
  );
};
