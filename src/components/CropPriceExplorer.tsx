import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  GitCompare,
  LineChart,
  BadgeCheck,
} from 'lucide-react';
import { CROPS_DATA, STATES_DISTRICTS, CropInfo } from '../data/marketData';
import { LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';

interface CropPriceExplorerProps {
  selectedCrop: CropInfo;
  onSelectCrop: (crop: CropInfo) => void;
  onNavigate: (tabId: string) => void;
  language: LanguageCode;
}

export const CropPriceExplorer: React.FC<CropPriceExplorerProps> = ({
  selectedCrop,
  onSelectCrop,
  onNavigate,
  language,
}) => {
  const t = TRANSLATIONS[language].pages;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  const categories = ['All', 'Cereals', 'Vegetables', 'Pulses', 'Cash Crops', 'Oilseeds', 'Spices'];

  const filteredCrops = useMemo(() => {
    return CROPS_DATA.filter((crop) => {
      const matchesSearch =
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.kannadaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.hindiName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const availableDistricts = useMemo(() => {
    if (selectedState === 'All') return [];
    return STATES_DISTRICTS[selectedState] || [];
  }, [selectedState]);

  const filteredMandis = useMemo(() => {
    return selectedCrop.mandis.filter((m) => {
      const matchState = selectedState === 'All' || m.state === selectedState;
      const matchDistrict = selectedDistrict === 'All' || m.district === selectedDistrict;
      return matchState && matchDistrict;
    });
  }, [selectedCrop, selectedState, selectedDistrict]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-emerald-400/15">
        <div>
          <span className="text-xs font-semibold text-lime-300 uppercase tracking-wider">
            Agmarknet & eNAM Unified Data · Live APMC Arrivals
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            {t.explorerTitle}
          </h1>
          <p className="text-sm text-emerald-100/75 mt-1 max-w-2xl">{t.explorerSub}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('comparison')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl glass-panel hover:bg-emerald-800/60 text-emerald-100 transition-colors cursor-pointer"
          >
            <GitCompare className="w-3.5 h-3.5 text-lime-300" />
            <span>{TRANSLATIONS[language].nav.comparison}</span>
          </button>
          <button
            onClick={() => onNavigate('prediction')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-lime-400 hover:bg-lime-300 text-emerald-950 shadow-xs transition-colors cursor-pointer"
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>{TRANSLATIONS[language].nav.prediction}</span>
          </button>
        </div>
      </div>

      {/* Search & Category Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={TRANSLATIONS[language].topbar.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-sm bg-emerald-950/60 border border-emerald-400/20 rounded-xl text-white placeholder:text-emerald-200/45 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-emerald-950 font-bold'
                    : 'bg-emerald-950/60 text-emerald-100/80 border border-emerald-400/15 hover:bg-emerald-900/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Crop Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {filteredCrops.map((crop) => {
            const isSelected = crop.id === selectedCrop.id;
            return (
              <button
                key={crop.id}
                onClick={() => onSelectCrop(crop)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-600/35 text-white border-lime-400/60 shadow-lg'
                    : 'glass-panel text-emerald-50 hover:border-emerald-400/35'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold uppercase ${isSelected ? 'text-lime-300' : 'text-emerald-200/65'}`}>
                      {crop.category}
                    </span>
                    {crop.mspPrice > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/70 text-amber-300 font-mono">
                        MSP
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm mt-1 truncate">
                    {language === 'kn' ? crop.kannadaName : language === 'hi' ? crop.hindiName : crop.name}
                  </h4>
                  <p className="text-[11px] text-emerald-200/70 truncate">
                    {crop.kannadaName}
                  </p>
                </div>
                <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-emerald-400/15">
                  <span className="text-xs font-mono font-bold text-white tabular-nums">
                    ₹{crop.baseModalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-200/60">/qtl</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Crop Details Panel */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-400/15">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-lime-300">
              <span>{selectedCrop.category}</span>
              <span>·</span>
              <span className="text-emerald-200/80">Perishability: <strong>{selectedCrop.perishability}</strong></span>
              <span>·</span>
              <span className="text-emerald-200/80">Shelf Life: <strong>{selectedCrop.shelfLifeDays} days</strong></span>
            </div>

            <h2 className="text-2xl font-extrabold text-white flex flex-wrap items-center gap-2.5">
              <span>{selectedCrop.name}</span>
              <span className="text-sm font-normal text-emerald-200/80">
                ({selectedCrop.kannadaName} / {selectedCrop.hindiName})
              </span>
            </h2>

            <p className="text-xs text-emerald-100/80 max-w-xl">
              {language === 'kn' ? selectedCrop.marketInsights.kannadaInsight : selectedCrop.marketInsights.seasonalTrend}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 bg-emerald-950/65 p-4 rounded-xl border border-emerald-400/20">
            <div>
              <span className="text-xs text-emerald-200/70 block">Avg Modal Price</span>
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                ₹{selectedCrop.baseModalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-300/60 block">per {selectedCrop.unit}</span>
            </div>

            <div className="w-px h-10 bg-emerald-400/20 hidden sm:block" />

            <div>
              <span className="text-xs text-emerald-200/70 block">Government MSP</span>
              {selectedCrop.mspPrice > 0 ? (
                <>
                  <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                    ₹{selectedCrop.mspPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-lime-300 font-semibold flex items-center gap-0.5">
                    <BadgeCheck className="w-3 h-3 inline" /> +₹{selectedCrop.baseModalPrice - selectedCrop.mspPrice} above MSP
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-emerald-100/80">Open Market</span>
                  <span className="text-[11px] text-emerald-200/50 block">No MSP floor</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Geography Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-400/15">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-100">
            <Filter className="w-4 h-4 text-lime-300" />
            <span>Filter Mandis:</span>
          </div>

          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict('All');
            }}
            className="text-xs bg-emerald-950 border border-emerald-400/25 rounded-lg px-2.5 py-1.5 text-white cursor-pointer"
          >
            <option value="All">All States ({selectedCrop.mandis.length})</option>
            {Object.keys(STATES_DISTRICTS).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {availableDistricts.length > 0 && (
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs bg-emerald-950 border border-emerald-400/25 rounded-lg px-2.5 py-1.5 text-white cursor-pointer"
            >
              <option value="All">All Districts</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}

          {(selectedState !== 'All' || selectedDistrict !== 'All') && (
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedDistrict('All');
              }}
              className="text-xs text-lime-300 hover:underline font-semibold cursor-pointer ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Table */}
        {filteredMandis.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-emerald-400/25 rounded-xl text-sm text-emerald-200/75">
            No mandis found matching selected geography.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-emerald-400/20 text-emerald-200/70 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Mandi & Location</th>
                  <th className="py-3 px-3">Variety / Grade</th>
                  <th className="py-3 px-3 text-right">Min Price</th>
                  <th className="py-3 px-3 text-right">Max Price</th>
                  <th className="py-3 px-4 text-right">Modal Price</th>
                  <th className="py-3 px-4">Range</th>
                  <th className="py-3 px-3 text-right">Arrivals</th>
                  <th className="py-3 px-3 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-400/10">
                {filteredMandis.map((m) => {
                  const range = Math.max(1, m.maxPrice - m.minPrice);
                  const pct = Math.min(100, Math.max(0, ((m.modalPrice - m.minPrice) / range) * 100));
                  return (
                    <tr key={m.mandiId} className="hover:bg-emerald-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{m.mandiName}</div>
                        <div className="text-xs text-emerald-200/70 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-lime-300" />
                          <span>{m.district}, {m.state} · {m.distanceKm} km</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-xs font-medium text-emerald-50">{m.variety}</div>
                        <div className="text-[11px] text-emerald-200/60">{m.grade}</div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-emerald-100/80 tabular-nums">
                        ₹{m.minPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-emerald-100/80 tabular-nums">
                        ₹{m.maxPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-base text-lime-300 tabular-nums">
                        ₹{m.modalPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 min-w-[130px]">
                        <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden">
                          <div className="h-full bg-lime-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-emerald-200/60 font-mono mt-1">
                          <span>₹{m.minPrice}</span>
                          <span>₹{m.maxPrice}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-emerald-100 tabular-nums">
                        {m.arrivalsTonnes} T
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono tabular-nums ${
                            m.trend === 'up' ? 'text-lime-400' : m.trend === 'down' ? 'text-rose-400' : 'text-emerald-200'
                          }`}
                        >
                          {m.trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                          {m.trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                          {m.trend === 'stable' && <Minus className="w-3.5 h-3.5" />}
                          {m.dayChangePercent > 0 ? `+${m.dayChangePercent}%` : `${m.dayChangePercent}%`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
