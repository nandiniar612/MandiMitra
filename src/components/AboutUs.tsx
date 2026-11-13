import React from 'react';
import { Sprout, Target, Cpu } from 'lucide-react';
import { LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';

interface AboutUsProps {
  onNavigate: (tabId: string) => void;
  language: LanguageCode;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onNavigate, language }) => {
  const t = TRANSLATIONS[language].pages;

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-lime-300 uppercase tracking-wider bg-emerald-950/75 px-3 py-1 rounded-full border border-emerald-400/25">
          <Sprout className="w-3.5 h-3.5" />
          <span>{t.aboutTitle}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Empowering Indian Farmers Through Transparent Market Intelligence
        </h1>
        <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">{t.aboutSub}</p>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-emerald-400/25">
        <img
          src="/src/assets/images/farmer_smart_tech_1794498775168.jpg"
          alt="Indian farmer using MandiMitra AI"
          className="w-full h-72 sm:h-88 object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06140c]/95 via-[#06140c]/45 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
          <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Our Mission</span>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">
            Eliminating Distress Sales with Predictive Mandi Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/85 max-w-2xl mt-1 leading-relaxed">
            By combining live APMC price rates, stock-style % change indicators, freight optimization, and multilingual AI assistance, farmers capture peak value for every harvest.
          </p>
        </div>
      </div>

      <section className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>The Problem</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/15 space-y-1.5">
            <h4 className="font-bold text-sm text-white">01. Information Asymmetry</h4>
            <p className="text-xs text-emerald-100/75 leading-relaxed">
              Farmers often rely on local intermediaries without visibility into higher prices at nearby mandis.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/15 space-y-1.5">
            <h4 className="font-bold text-sm text-white">02. Harvest Gluts</h4>
            <p className="text-xs text-emerald-100/75 leading-relaxed">
              Simultaneous post-harvest dumping depresses prices sharply within 48 hours of harvest peaks.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/15 space-y-1.5">
            <h4 className="font-bold text-sm text-white">03. Freight Uncertainty</h4>
            <p className="text-xs text-emerald-100/75 leading-relaxed">
              Without freight-adjusted net calculations, farmers cannot tell if a distant mandi is actually more profitable.
            </p>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2 text-lime-300 font-bold text-xs uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>4-Layer Technology Stack</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/15">
            <span className="text-2xl font-extrabold font-mono text-amber-300">+14–22%</span>
            <span className="text-xs font-bold text-white block mt-1">Higher Realization</span>
            <p className="text-[11px] text-emerald-200/70 mt-1">Optimal mandi & peak window timing.</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/15">
            <span className="text-2xl font-extrabold font-mono text-lime-300">7 & 30d</span>
            <span className="text-xs font-bold text-white block mt-1">ML Price Forecasting</span>
            <p className="text-[11px] text-emerald-200/70 mt-1">Seasonal ARMA + OLS regression.</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/15">
            <span className="text-2xl font-extrabold font-mono text-amber-300">3 Langs</span>
            <span className="text-xs font-bold text-white block mt-1">Multilingual UX</span>
            <p className="text-[11px] text-emerald-200/70 mt-1">English, Kannada (ಕನ್ನಡ) & Hindi.</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/15">
            <span className="text-2xl font-extrabold font-mono text-lime-300">Voice</span>
            <span className="text-xs font-bold text-white block mt-1">Speech Inclusive</span>
            <p className="text-[11px] text-emerald-200/70 mt-1">Hands-free voice input & readout.</p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('explorer')}
            className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-xs rounded-xl cursor-pointer"
          >
            {TRANSLATIONS[language].nav.explorer}
          </button>
          <button
            onClick={() => onNavigate('prediction')}
            className="px-4 py-2 glass-panel text-white text-xs font-semibold rounded-xl hover:bg-emerald-800/50 cursor-pointer"
          >
            {TRANSLATIONS[language].nav.prediction}
          </button>
        </div>
      </section>
    </div>
  );
};
