import React from 'react';
import {
  LayoutDashboard,
  Search,
  GitCompare,
  LineChart,
  BadgeCheck,
  Calculator,
  Info,
  Sprout,
  Bot,
  ChevronRight,
  X,
} from 'lucide-react';
import { LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tabId: string) => void;
  language: LanguageCode;
  onOpenChatbot: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  language,
  onOpenChatbot,
  mobileOpen,
  onCloseMobile,
}) => {
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'explorer', label: t.nav.explorer, icon: Search },
    { id: 'comparison', label: t.nav.comparison, icon: GitCompare },
    { id: 'prediction', label: t.nav.prediction, icon: LineChart },
    { id: 'recommendation', label: t.nav.recommendation, icon: BadgeCheck },
    { id: 'calculator', label: t.nav.calculator, icon: Calculator },
    { id: 'about', label: t.nav.about, icon: Info },
  ];

  const handleClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen w-64 glass-sidebar flex flex-col justify-between p-4 transition-transform duration-200 shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <button
              onClick={() => handleClick('dashboard')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/35 flex items-center justify-center text-lime-300 shadow-xs group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white font-display whitespace-nowrap">
                {t.brand} <span className="text-lime-400">AI</span>
              </span>
            </button>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:bg-emerald-900/50 cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/30 via-emerald-500/15 to-transparent text-white border border-emerald-400/30 shadow-xs font-semibold'
                      : 'text-emerald-100/75 hover:text-white hover:bg-emerald-900/40 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-lime-300' : 'text-emerald-300/70'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom AI Assistant Promo Card (Matching Reference Screenshot) */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-emerald-900/70 via-[#0e2a19]/90 to-[#081a0f] border border-emerald-400/20 shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-lime-400/20 border border-lime-400/30 flex items-center justify-center text-lime-300">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white font-display">
              {t.nav.aiCardTitle}
            </span>
          </div>

          <p className="text-xs text-emerald-100/80 leading-relaxed">
            {t.nav.aiCardDesc}
          </p>

          <button
            onClick={() => {
              onOpenChatbot();
              onCloseMobile();
            }}
            className="w-full py-2 px-3 rounded-xl bg-emerald-700/70 hover:bg-emerald-600/80 text-white text-xs font-semibold border border-emerald-400/30 transition-all flex items-center justify-between cursor-pointer"
          >
            <span>{t.nav.askAiBtn}</span>
            <ChevronRight className="w-3.5 h-3.5 text-lime-300" />
          </button>
        </div>
      </aside>
    </>
  );
};
