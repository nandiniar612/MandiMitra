import React, { useState } from 'react';
import { Receipt, Printer, RotateCcw, BadgeCheck } from 'lucide-react';
import { CROPS_DATA, CropInfo } from '../data/marketData';
import { LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';

interface ProfitCalculatorProps {
  selectedCrop: CropInfo;
  onSelectCrop: (crop: CropInfo) => void;
  language: LanguageCode;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
  selectedCrop,
  onSelectCrop,
  language,
}) => {
  const t = TRANSLATIONS[language].pages;
  const [unitType, setUnitType] = useState<'quintal' | 'kg' | 'bags'>('quintal');
  const [rawQuantity, setRawQuantity] = useState<number>(50);
  const [sellingPricePerQtl, setSellingPricePerQtl] = useState<number>(selectedCrop.baseModalPrice);
  const [transportCost, setTransportCost] = useState<number>(1800);
  const [loadingCost, setLoadingCost] = useState<number>(750);
  const [mandiCessRate, setMandiCessRate] = useState<number>(1.5);
  const [packagingCostPerBag, setPackagingCostPerBag] = useState<number>(20);
  const [miscellaneousCost, setMiscellaneousCost] = useState<number>(500);

  const quantityQuintals =
    unitType === 'quintal' ? rawQuantity : unitType === 'kg' ? rawQuantity / 100 : rawQuantity * 0.5;
  const totalBags = Math.ceil(quantityQuintals * 2);

  const grossRevenue = Math.round(quantityQuintals * sellingPricePerQtl);
  const totalMandiCess = Math.round(grossRevenue * (mandiCessRate / 100));
  const totalPackaging = totalBags * packagingCostPerBag;
  const totalExpenses = Math.round(
    transportCost + loadingCost + totalMandiCess + totalPackaging + miscellaneousCost
  );
  const netEarnings = grossRevenue - totalExpenses;
  const netEarningsPerQtl = quantityQuintals > 0 ? Math.round(netEarnings / quantityQuintals) : 0;
  const expenseRatio = grossRevenue > 0 ? Math.round((totalExpenses / grossRevenue) * 1000) / 10 : 0;
  const breakEvenPricePerQtl = quantityQuintals > 0 ? Math.round(totalExpenses / quantityQuintals) : 0;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-emerald-400/15">
        <div>
          <span className="text-xs font-semibold text-lime-300 uppercase tracking-wider">
            Agricultural Financial Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            {t.calcTitle}
          </h1>
          <p className="text-sm text-emerald-100/75 mt-1 max-w-2xl">{t.calcSub}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRawQuantity(50);
              setSellingPricePerQtl(selectedCrop.baseModalPrice);
              setTransportCost(1800);
              setLoadingCost(750);
              setMiscellaneousCost(500);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl glass-panel text-emerald-100 hover:bg-emerald-800/50 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-lime-400 hover:bg-lime-300 text-emerald-950 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-400/15">
            <h3 className="text-xs font-bold text-lime-300 uppercase tracking-wider">
              1. Produce & Pricing
            </h3>
            <div className="flex items-center bg-emerald-950/80 p-0.5 rounded-lg border border-emerald-400/20 text-xs font-semibold">
              {(['quintal', 'bags', 'kg'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnitType(u)}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    unitType === u ? 'bg-lime-400 text-emerald-950 font-bold' : 'text-emerald-100/80'
                  }`}
                >
                  {u === 'quintal' ? 'Quintals' : u === 'bags' ? 'Bags (50kg)' : 'Kg'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-emerald-200/80 block mb-1">Crop</label>
              <select
                value={selectedCrop.id}
                onChange={(e) => {
                  const found = CROPS_DATA.find((c) => c.id === e.target.value);
                  if (found) {
                    onSelectCrop(found);
                    setSellingPricePerQtl(found.baseModalPrice);
                  }
                }}
                className="w-full text-xs bg-emerald-950 border border-emerald-400/25 rounded-xl px-3 py-2.5 font-bold text-white cursor-pointer"
              >
                {CROPS_DATA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.kannadaName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs text-emerald-200/80 mb-1">
                <span>Quantity ({unitType})</span>
                <span className="font-mono text-lime-300">{quantityQuintals} Qtl</span>
              </div>
              <input
                type="number"
                min="1"
                value={rawQuantity}
                onChange={(e) => setRawQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full text-sm font-mono font-bold bg-emerald-950/70 border border-emerald-400/25 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-emerald-200/80 block mb-1">Selling Price (₹/qtl)</label>
              <input
                type="number"
                min="100"
                value={sellingPricePerQtl}
                onChange={(e) => setSellingPricePerQtl(Number(e.target.value))}
                className="w-full text-sm font-mono font-bold bg-emerald-950/70 border border-emerald-400/25 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-emerald-200/80 block mb-1">Transport Cost (₹)</label>
              <input
                type="number"
                min="0"
                value={transportCost}
                onChange={(e) => setTransportCost(Number(e.target.value))}
                className="w-full text-sm font-mono bg-emerald-950/70 border border-emerald-400/25 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-emerald-200/80 block mb-1">Loading / Hamali (₹)</label>
              <input
                type="number"
                min="0"
                value={loadingCost}
                onChange={(e) => setLoadingCost(Number(e.target.value))}
                className="w-full text-sm font-mono bg-emerald-950/70 border border-emerald-400/25 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-emerald-200/80 block mb-1">Mandi Cess (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={mandiCessRate}
                onChange={(e) => setMandiCessRate(Number(e.target.value))}
                className="w-full text-sm font-mono bg-emerald-950/70 border border-emerald-400/25 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-emerald-200/80 block mb-1">Packaging / Bag (₹)</label>
              <input
                type="number"
                min="0"
                value={packagingCostPerBag}
                onChange={(e) => setPackagingCostPerBag(Number(e.target.value))}
                className="w-full text-sm font-mono bg-emerald-950/70 border border-emerald-400/25 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-emerald-200/80 block mb-1">Misc Expenses (₹)</label>
              <input
                type="number"
                min="0"
                value={miscellaneousCost}
                onChange={(e) => setMiscellaneousCost(Number(e.target.value))}
                className="w-full text-sm font-mono bg-emerald-950/70 border border-emerald-400/25 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 glass-panel-strong rounded-2xl p-6 space-y-5 border-lime-400/30">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-400/15">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-300">
              Net Earnings Summary
            </span>
            <Receipt className="w-4 h-4 text-lime-300" />
          </div>

          <div>
            <span className="text-xs text-emerald-200/75 block uppercase">Estimated Net Take-Home</span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-300 tabular-nums mt-1">
              ₹{netEarnings.toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-lime-300 flex items-center gap-1 mt-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              ₹{netEarningsPerQtl.toLocaleString('en-IN')} net per quintal
            </span>
          </div>

          <div className="space-y-2 text-xs pt-2">
            <div className="flex justify-between py-1.5 border-b border-emerald-400/15">
              <span className="text-emerald-100">Gross Revenue</span>
              <span className="font-mono font-bold text-white tabular-nums">+₹{grossRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-emerald-400/15">
              <span className="text-emerald-200/75">Freight + Hamali</span>
              <span className="font-mono text-emerald-200 tabular-nums">-₹{(transportCost + loadingCost).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-emerald-400/15">
              <span className="text-emerald-200/75">Mandi Cess + Packaging + Misc</span>
              <span className="font-mono text-emerald-200 tabular-nums">-₹{(totalMandiCess + totalPackaging + miscellaneousCost).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1.5 font-semibold">
              <span className="text-emerald-100">Total Deductions ({expenseRatio}%)</span>
              <span className="font-mono text-rose-300 tabular-nums">-₹{totalExpenses.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/75 border border-emerald-400/20 text-xs">
            <span className="font-bold text-amber-300 block mb-0.5">Break-Even Price Floor</span>
            <p className="text-emerald-100/90">
              Selling above <strong className="font-mono text-white">₹{breakEvenPricePerQtl}/qtl</strong> covers all logistics & mandi costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
