import React from 'react';
import { Sprout, MessageSquare, Sparkles, Languages } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'en' | 'kn' | 'hi';
  setLanguage: (lang: 'en' | 'kn' | 'hi') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'explorer', label: 'Price Explorer' },
    { id: 'comparison', label: 'Mandi Compare' },
    { id: 'prediction', label: 'AI Prediction' },
    { id: 'recommendation', label: 'Smart Selling' },
    { id: 'calculator', label: 'Profit Calc' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FCFDF9]/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left text-emerald-950 hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 shadow-sm group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-emerald-950 font-display flex items-center gap-1.5">
              MandiMitra<span className="text-amber-600 font-black">AI</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Concise navigation links (single line) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 font-medium cursor-pointer ${
                activeTab === item.id
                  ? 'text-emerald-900 border-emerald-700 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 border-transparent hover:border-stone-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Language Selector & Primary CTA Button */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
            <Languages className="w-3.5 h-3.5 text-stone-500 ml-1.5 mr-0.5" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('kn')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                language === 'kn'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="ಕನ್ನಡ (Kannada)"
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                language === 'hi'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="हिंदी (Hindi)"
            >
              हिन्दी
            </button>
          </div>

          {/* Primary Action Button: Ask Assistant */}
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs ${
              activeTab === 'assistant'
                ? 'bg-emerald-900 text-white ring-2 ring-emerald-600 ring-offset-1'
                : 'bg-emerald-800 hover:bg-emerald-900 text-amber-200 hover:text-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Assistant</span>
          </button>
        </div>

      </div>

      {/* Mobile navigation tab strip */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 overflow-x-auto border-t border-stone-200/60 bg-[#FCFDF9] text-xs font-medium scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === item.id
                ? 'bg-emerald-800 text-white font-semibold'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
