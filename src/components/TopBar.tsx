import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Languages,
  LogOut,
  Menu,
  User,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { CROPS_DATA, CropInfo } from '../data/marketData';
import { FarmerProfile, LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';

interface TopBarProps {
  farmer: FarmerProfile;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onSelectCropAndGo: (crop: CropInfo, tabId?: string) => void;
  onLogout: () => void;
  onOpenMobileNav: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  farmer,
  language,
  setLanguage,
  onSelectCropAndGo,
  onLogout,
  onOpenMobileNav,
}) => {
  const t = TRANSLATIONS[language].topbar;
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CROPS_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.kannadaName.toLowerCase().includes(q) ||
        c.hindiName.toLowerCase().includes(q) ||
        c.mandis.some(
          (m) =>
            m.mandiName.toLowerCase().includes(q) ||
            m.district.toLowerCase().includes(q)
        )
    ).slice(0, 6);
  }, [query]);

  return (
    <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between gap-4 border-b border-emerald-400/12 bg-[#08190f]/75 backdrop-blur-md">
      {/* Left: Mobile drawer button + Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl bg-emerald-950/70 border border-emerald-400/20 text-emerald-100 hover:bg-emerald-900/70 cursor-pointer shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div ref={searchRef} className="relative flex-1">
          <Search className="w-4 h-4 text-emerald-200/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onFocus={() => setDropdownOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setDropdownOpen(true);
            }}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-emerald-950/55 border border-emerald-400/20 rounded-full text-white placeholder:text-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
          />

          {dropdownOpen && query.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-2 rounded-2xl glass-panel-strong shadow-2xl overflow-hidden z-50">
              {searchResults.length === 0 ? (
                <div className="p-4 text-xs text-emerald-200/70 text-center">
                  {t.noResults}
                </div>
              ) : (
                <div className="divide-y divide-emerald-400/10">
                  {searchResults.map((crop) => (
                    <button
                      key={crop.id}
                      onClick={() => {
                        onSelectCropAndGo(crop, 'explorer');
                        setQuery('');
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-emerald-800/40 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">
                          {language === 'kn'
                            ? crop.kannadaName
                            : language === 'hi'
                            ? crop.hindiName
                            : crop.name}
                        </div>
                        <div className="text-[11px] text-emerald-200/70">
                          {crop.mandis[0]?.mandiName} · {crop.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-lime-300">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>₹{crop.baseModalPrice}/qtl</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Language Switcher + Farmer Profile + Logout */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Language Toggle */}
        <div className="flex items-center bg-emerald-950/75 rounded-xl p-0.5 border border-emerald-400/20">
          <Languages className="w-3.5 h-3.5 text-emerald-300 ml-1.5 mr-1 hidden sm:block" />
          {(['en', 'kn', 'hi'] as LanguageCode[]).map((code) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                language === code
                  ? 'bg-emerald-500 text-emerald-950 font-bold shadow-xs'
                  : 'text-emerald-100/80 hover:text-white'
              }`}
            >
              {code === 'en' ? 'EN' : code === 'kn' ? 'ಕನ್ನಡ' : 'हिन्दी'}
            </button>
          ))}
        </div>

        {/* Farmer Profile Pill */}
        <div className="hidden md:flex items-center gap-2.5 pl-2.5 pr-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/20">
          <div className="w-7 h-7 rounded-full bg-emerald-500/25 border border-lime-400/40 flex items-center justify-center text-lime-300 font-bold text-xs">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="leading-tight max-w-[140px]">
            <div className="text-xs font-bold text-white truncate">{farmer.name}</div>
            <div className="text-[10px] text-emerald-200/75 flex items-center gap-0.5 truncate">
              <MapPin className="w-2.5 h-2.5 shrink-0 text-lime-300" />
              <span className="truncate">{farmer.locality}, {farmer.place}</span>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          title={t.logout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-rose-950/70 border border-emerald-400/20 hover:border-rose-400/40 text-xs font-medium text-emerald-100 hover:text-rose-200 transition-colors cursor-pointer whitespace-nowrap"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.logout}</span>
        </button>
      </div>
    </header>
  );
};
