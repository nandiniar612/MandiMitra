import React, { useState } from 'react';
import { Trophy, CheckCircle, Truck } from 'lucide-react';
import { CROPS_DATA, CropInfo } from '../data/marketData';
import { LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';

interface MandiComparisonProps {
  selectedCrop: CropInfo;
  onSelectCrop: (crop: CropInfo) => void;
  onNavigate: (tabId: string) => void;
  language: LanguageCode;
}

export const MandiComparison: React.FC<MandiComparisonProps> = ({
  selectedCrop,
  onSelectCrop,
  language,
}) => {
  const t = TRANSLATIONS[language].pages;
  const [metricMode, setMetricMode] = useState<'gross' | 'net'>('gross');
  const [hoveredMandiId, setHoveredMandiId] = useState<string | null>(null);

  const mandis = selectedCrop.mandis;
  const avgPrice = Math.round(mandis.reduce((sum, m) => sum + m.modalPrice, 0) / mandis.length);

  const evaluatedMandis = mandis.map((m) => {
    const transportPerQtl = Math.round(25 + m.distanceKm * 0.38);
    const netPerQtl = m.modalPrice - transportPerQtl;
    const diffFromAvg = m.modalPrice - avgPrice;
    return { ...m, transportPerQtl, netPerQtl, diffFromAvg };
  });

  const highestGross = Math.max(...evaluatedMandis.map((m) => m.modalPrice));
  const highestNet = Math.max(...evaluatedMandis.map((m) => m.netPerQtl));
  const minDistance = Math.min(...evaluatedMandis.map((m) => m.distanceKm));

  const topGrossMandi = evaluatedMandis.find((m) => m.modalPrice === highestGross)!;
  const topNetMandi = evaluatedMandis.find((m) => m.netPerQtl === highestNet)!;
  const closestMandi = evaluatedMandis.find((m) => m.distanceKm === minDistance)!;

  const maxBarValue =
    Math.max(...evaluatedMandis.map((m) => (metricMode === 'gross' ? m.modalPrice : m.netPerQtl))) * 1.15;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-emerald-400/15">
        <div>
          <span className="text-xs font-semibold text-lime-300 uppercase tracking-wider">
            Spatial Price Arbitrage Optimizer · Freight-Aware
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            {t.compareTitle}
          </h1>
          <p className="text-sm text-emerald-100/75 mt-1 max-w-2xl">{t.compareSub}</p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CROPS_DATA.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCrop(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                c.id === selectedCrop.id
                  ? 'bg-lime-400 text-emerald-950 font-bold'
                  : 'glass-panel text-emerald-100 hover:bg-emerald-800/50'
              }`}
            >
              {language === 'kn' ? c.kannadaName.split(' ')[0] : language === 'hi' ? c.hindiName.split(' ')[0] : c.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 space-y-2 border-amber-400/30">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" /> Highest Gross Market
          </span>
          <h3 className="text-lg font-extrabold text-white">{topGrossMandi.mandiName}</h3>
          <p className="text-xs text-emerald-200/70">{topGrossMandi.district}, {topGrossMandi.state} ({topGrossMandi.distanceKm} km)</p>
          <div className="pt-3 border-t border-emerald-400/15 flex items-baseline justify-between">
            <span className="text-xs text-emerald-200/70">Gross Price</span>
            <span className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
              ₹{topGrossMandi.modalPrice.toLocaleString('en-IN')}/qtl
            </span>
          </div>
        </div>

        <div className="rounded-2xl p-5 space-y-2 bg-gradient-to-br from-emerald-600/35 to-emerald-950/90 border border-lime-400/45 shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider text-lime-300 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Recommended (Best Net Profit)
          </span>
          <h3 className="text-lg font-extrabold text-white">{topNetMandi.mandiName}</h3>
          <p className="text-xs text-emerald-100/80">{topNetMandi.district}, {topNetMandi.state} ({topNetMandi.distanceKm} km freight)</p>
          <div className="pt-3 border-t border-emerald-400/20 flex items-baseline justify-between">
            <span className="text-xs text-emerald-100/80">Net Take-Home</span>
            <span className="text-2xl font-bold font-mono text-lime-300 tabular-nums">
              ₹{topNetMandi.netPerQtl.toLocaleString('en-IN')}/qtl
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-300" /> Nearest Mandi
          </span>
          <h3 className="text-lg font-extrabold text-white">{closestMandi.mandiName}</h3>
          <p className="text-xs text-emerald-200/70">{closestMandi.district}, {closestMandi.state} ({closestMandi.distanceKm} km)</p>
          <div className="pt-3 border-t border-emerald-400/15 flex items-baseline justify-between">
            <span className="text-xs text-emerald-200/70">Net Return</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              ₹{closestMandi.netPerQtl.toLocaleString('en-IN')}/qtl
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-400/15">
          <div>
            <h3 className="text-base font-bold text-white font-display">Comparative Price Breakdown</h3>
            <span className="text-xs text-emerald-200/70">Toggle between Gross Mandi Price and Net Return after freight.</span>
          </div>
          <div className="flex items-center bg-emerald-950/80 p-1 rounded-xl border border-emerald-400/20 text-xs font-semibold">
            <button
              onClick={() => setMetricMode('gross')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                metricMode === 'gross' ? 'bg-lime-400 text-emerald-950 font-bold' : 'text-emerald-100/80'
              }`}
            >
              Gross Price (₹)
            </button>
            <button
              onClick={() => setMetricMode('net')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                metricMode === 'net' ? 'bg-lime-400 text-emerald-950 font-bold' : 'text-emerald-100/80'
              }`}
            >
              Net Return (₹ - Freight)
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {evaluatedMandis.map((m) => {
            const displayVal = metricMode === 'gross' ? m.modalPrice : m.netPerQtl;
            const barWidthPercent = Math.min(100, Math.max(15, (displayVal / maxBarValue) * 100));
            const isTopGross = m.modalPrice === highestGross;
            const isTopNet = m.netPerQtl === highestNet;
            const isHovered = hoveredMandiId === m.mandiId;

            return (
              <div
                key={m.mandiId}
                onMouseEnter={() => setHoveredMandiId(m.mandiId)}
                onMouseLeave={() => setHoveredMandiId(null)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isHovered ? 'bg-emerald-800/40 border border-emerald-400/30' : 'border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{m.mandiName}</span>
                    <span className="text-emerald-200/70">({m.district})</span>
                    {isTopNet && metricMode === 'net' && (
                      <span className="text-[10px] font-bold bg-lime-400 text-emerald-950 px-2 py-0.5 rounded">Best Net</span>
                    )}
                    {isTopGross && metricMode === 'gross' && (
                      <span className="text-[10px] font-bold bg-amber-400 text-emerald-950 px-2 py-0.5 rounded">Highest Gross</span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-base text-white tabular-nums">
                    ₹{displayVal.toLocaleString('en-IN')}/qtl
                  </span>
                </div>

                <div className="w-full h-6 bg-emerald-950/80 rounded-lg overflow-hidden">
                  <div
                    className={`h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3 text-xs font-mono font-bold ${
                      isTopNet && metricMode === 'net'
                        ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-emerald-950'
                        : isTopGross && metricMode === 'gross'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-300 text-emerald-950'
                        : 'bg-emerald-600/80 text-white'
                    }`}
                    style={{ width: `${barWidthPercent}%` }}
                  >
                    ₹{displayVal}
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-emerald-200/65 mt-1">
                  <span>Distance: {m.distanceKm} km · Est. Freight: ₹{m.transportPerQtl}/qtl</span>
                  <span>
                    Vs Avg:{' '}
                    <strong className={m.diffFromAvg >= 0 ? 'text-lime-300' : 'text-rose-400'}>
                      {m.diffFromAvg >= 0 ? `+₹${m.diffFromAvg}` : `-₹${Math.abs(m.diffFromAvg)}`}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
