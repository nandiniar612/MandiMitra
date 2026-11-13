import React from 'react';
import { Sprout } from 'lucide-react';
import { LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';

interface FooterProps {
  onNavigate: (tabId: string) => void;
  language: LanguageCode;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="border-t border-emerald-400/15 bg-[#06140c]/85 backdrop-blur-md text-emerald-100/75 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-lime-400" />
          <span className="font-bold text-white">{t.brand} AI</span>
          <span className="text-emerald-200/50">·</span>
          <span>Agmarknet & eNAM Market Intelligence</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-lime-300 cursor-pointer">
            {t.nav.dashboard}
          </button>
          <button onClick={() => onNavigate('explorer')} className="hover:text-lime-300 cursor-pointer">
            {t.nav.explorer}
          </button>
          <button onClick={() => onNavigate('prediction')} className="hover:text-lime-300 cursor-pointer">
            {t.nav.prediction}
          </button>
          <button onClick={() => onNavigate('calculator')} className="hover:text-lime-300 cursor-pointer">
            {t.nav.calculator}
          </button>
          <button onClick={() => onNavigate('about')} className="hover:text-lime-300 cursor-pointer">
            {t.nav.about}
          </button>
        </div>
      </div>
    </footer>
  );
};
