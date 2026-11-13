import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Store,
  Layers,
  BadgeCheck,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BellRing,
  ChevronRight,
  Sun,
  Droplets,
  Wind,
} from 'lucide-react';
import { CROPS_DATA, MARKET_BULLETINS, CropInfo } from '../data/marketData';
import { FarmerProfile, LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';
import { getAllCropSnapshots, CropStockSnapshot } from '../services/stockAnalysis';

interface HomeDashboardProps {
  farmer: FarmerProfile;
  onSelectCrop: (crop: CropInfo) => void;
  onNavigate: (tabId: string) => void;
  onAskBotAboutCrop: (crop: CropInfo) => void;
  language: LanguageCode;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  farmer,
  onSelectCrop,
  onNavigate,
  onAskBotAboutCrop,
  language,
}) => {
  const t = TRANSLATIONS[language].dashboard;
  const snapshots: CropStockSnapshot[] = getAllCropSnapshots(farmer.place);

  const totalCrops = CROPS_DATA.length;
  const avgModalPrice = Math.round(
    CROPS_DATA.reduce((acc, c) => acc + c.baseModalPrice, 0) / totalCrops
  );

  // Highest paying mandi snapshot
  const highestSnapshot = [...snapshots].sort(
    (a, b) => b.currentBestPrice - a.currentBestPrice
  )[0];

  // Top 4 gainers
  const topGainers = [...snapshots]
    .sort((a, b) => b.dayChangePercent - a.dayChangePercent)
    .slice(0, 4);

  // Crop arrival distribution (top 4 categories for SVG donut)
  const categoryTotals = CROPS_DATA.reduce<Record<string, number>>((acc, c) => {
    const sumArrivals = c.mandis.reduce((s, m) => s + m.arrivalsTonnes, 0);
    acc[c.category] = (acc[c.category] || 0) + sumArrivals;
    return acc;
  }, {});
  const totalArrivals = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const distributionColors = ['#84cc16', '#facc15', '#34d399', '#2dd4bf', '#a3e635', '#fbbf24'];
  const distributionEntries = Object.entries(categoryTotals).slice(0, 4);

  const getCropDisplayName = (c: CropInfo) =>
    language === 'kn' ? c.kannadaName : language === 'hi' ? c.hindiName : c.name;

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Row (Matches Reference Screenshot Header) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            {t.welcomePrefix} {farmer.name}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/75 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
            <span>
              {t.subtitle} <strong className="text-white">{farmer.locality}, {farmer.place}</strong>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('explorer')}
            className="px-4 py-2 rounded-xl glass-panel hover:bg-emerald-800/50 text-xs font-semibold text-emerald-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            {t.viewAll}
          </button>
          <button
            onClick={() => onAskBotAboutCrop(CROPS_DATA[0])}
            className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.analyzeInBot}</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Glass Cards + Regional Weather Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-200/80">
            <span className="text-xs font-semibold">{t.kpiCrops}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/25 flex items-center justify-center text-lime-300">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
            {totalCrops}
          </div>
          <div className="text-[11px] text-emerald-200/70">{t.kpiCropsSub}</div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-200/80">
            <span className="text-xs font-semibold">{t.kpiAvgRate}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/25 flex items-center justify-center text-lime-300">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
            ₹{avgModalPrice.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-emerald-200/70 ml-1">/qtl</span>
          </div>
          <div className="text-[11px] text-emerald-200/70">{t.kpiAvgRateSub}</div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-200/80">
            <span className="text-xs font-semibold">{t.kpiBestMandi}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <BadgeCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white truncate">
            {highestSnapshot.bestGrossMandi.mandiName}
          </div>
          <div className="text-[11px] text-lime-300 font-semibold font-mono tabular-nums">
            ₹{highestSnapshot.currentBestPrice.toLocaleString('en-IN')}/qtl · {getCropDisplayName(highestSnapshot.crop)}
          </div>
        </div>

        {/* KPI 4: Regional Harvest Weather & Trend */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-200/80">
            <span className="text-xs font-semibold">{t.weatherTitle}</span>
            <Sun className="w-5 h-5 text-amber-300" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
              26°C
            </span>
            <span className="text-xs font-semibold text-lime-300">+5.4% AI Trend</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-emerald-200/75">
            <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-emerald-300" /> 48%</span>
            <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-emerald-300" /> 9 km/h</span>
            <span className="truncate">{farmer.place}</span>
          </div>
        </div>
      </div>

      {/* Stock-Market Style Crop Price Ticker & Sell/Hold Signals Table */}
      <section className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-400/15">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              {t.tickerTitle}
            </h2>
            <p className="text-xs text-emerald-100/70 mt-0.5">{t.tickerSub}</p>
          </div>
          <span className="text-xs font-mono text-lime-300 whitespace-nowrap">
            Agmarknet Live · 10 Commodities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-emerald-400/15 text-emerald-200/70 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">{t.colCrop}</th>
                <th className="py-3 px-3 text-right">{t.colBestPrice}</th>
                <th className="py-3 px-3 text-right">{t.colChange24h}</th>
                <th className="py-3 px-3 text-right">{t.colForecast7d}</th>
                <th className="py-3 px-3 text-center">{t.colDecision}</th>
                <th className="py-3 px-3">{t.colBestMandi}</th>
                <th className="py-3 px-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-400/10">
              {snapshots.slice(0, 7).map((snap) => (
                <tr
                  key={snap.crop.id}
                  onClick={() => {
                    onSelectCrop(snap.crop);
                    onNavigate('prediction');
                  }}
                  className="hover:bg-emerald-800/30 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{getCropDisplayName(snap.crop)}</div>
                    <div className="text-[11px] text-emerald-200/60">{snap.crop.category}</div>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                    ₹{snap.currentBestPrice.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    <span
                      className={`inline-flex items-center justify-end gap-0.5 font-bold ${
                        snap.isIncreased ? 'text-lime-400' : 'text-rose-400'
                      }`}
                    >
                      {snap.isIncreased ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {snap.dayChangePercent >= 0 ? `+${snap.dayChangePercent}%` : `${snap.dayChangePercent}%`}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    <div className="font-semibold text-emerald-50">
                      ₹{snap.forecast7DayPrice.toLocaleString('en-IN')}
                    </div>
                    <div
                      className={`text-[11px] font-bold ${
                        snap.willIncrement ? 'text-lime-300' : 'text-amber-300'
                      }`}
                    >
                      {snap.forecast7DayChangePct >= 0
                        ? `+${snap.forecast7DayChangePct}%`
                        : `${snap.forecast7DayChangePct}%`}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
                        snap.shouldSellNow
                          ? 'bg-amber-400 text-emerald-950'
                          : 'bg-emerald-500/25 text-lime-300 border border-lime-400/35'
                      }`}
                    >
                      {snap.shouldSellNow ? t.sellNow : t.holdPeak}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-emerald-50 truncate max-w-[170px]">
                      {snap.bestProfitMandi.mandiName}
                    </div>
                    <div className="text-[11px] text-lime-300/90 font-mono tabular-nums">
                      Net ₹{snap.bestNetPricePerQtl.toLocaleString('en-IN')}/qtl
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskBotAboutCrop(snap.crop);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-700/60 hover:bg-lime-400 hover:text-emerald-950 text-emerald-100 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {t.analyzeInBot}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom 3-Column Bento Grid (Inspired by Reference Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Top Gaining Commodities */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-400/15">
            <h3 className="text-sm font-bold text-white font-display">{t.topGainersTitle}</h3>
            <TrendingUp className="w-4 h-4 text-lime-400" />
          </div>
          <div className="space-y-2.5">
            {topGainers.map((snap) => (
              <button
                key={snap.crop.id}
                onClick={() => {
                  onSelectCrop(snap.crop);
                  onNavigate('explorer');
                }}
                className="w-full p-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-400/15 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {getCropDisplayName(snap.crop)}
                  </div>
                  <div className="text-[11px] text-emerald-200/70 truncate">
                    {snap.bestGrossMandi.mandiName}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-xs font-mono font-bold text-white tabular-nums">
                    ₹{snap.currentBestPrice}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-lime-400 tabular-nums">
                    +{snap.dayChangePercent}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Regional Mandi Arrival Distribution Donut */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-display">{t.distributionTitle}</h3>
            <p className="text-[11px] text-emerald-200/70 mt-0.5">{t.distributionSub}</p>
          </div>

          <div className="flex items-center gap-5 py-2">
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  const r = 38;
                  const c = 2 * Math.PI * r;
                  return distributionEntries.map(([cat, val], idx) => {
                    const pct = val / totalArrivals;
                    const dash = pct * c;
                    const el = (
                      <circle
                        key={cat}
                        cx="50"
                        cy="50"
                        r={r}
                        fill="none"
                        stroke={distributionColors[idx % distributionColors.length]}
                        strokeWidth="12"
                        strokeDasharray={`${dash} ${c - dash}`}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += dash;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-extrabold font-mono text-white tabular-nums">
                  {totalArrivals.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-200/70">Tonnes</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-xs">
              {distributionEntries.map(([cat, val], idx) => {
                const pct = Math.round((val / totalArrivals) * 100);
                return (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-emerald-100 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: distributionColors[idx % distributionColors.length] }}
                      />
                      <span className="truncate">{cat}</span>
                    </span>
                    <span className="font-mono font-bold text-white tabular-nums">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigate('comparison')}
            className="w-full py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/70 border border-emerald-400/20 text-xs font-semibold text-emerald-100 flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <span>{TRANSLATIONS[language].nav.comparison}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Live Bulletins */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-400/15">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-amber-300" />
              <span>{t.bulletinsTitle}</span>
            </h3>
          </div>

          <div className="space-y-2.5">
            {MARKET_BULLETINS.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-400/10 space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-lime-300">{b.category}</span>
                  <span className="text-emerald-200/60">{b.timestamp}</span>
                </div>
                <p className="text-xs text-emerald-50/90 leading-relaxed">{b.headline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
