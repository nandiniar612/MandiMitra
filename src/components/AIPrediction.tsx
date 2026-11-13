import React, { useState, useMemo } from 'react';
import {
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CROPS_DATA, CropInfo } from '../data/marketData';
import { generateCropForecast, ForecastResult } from '../services/mlForecasting';
import { LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';

interface AIPredictionProps {
  selectedCrop: CropInfo;
  onSelectCrop: (crop: CropInfo) => void;
  onNavigate: (tabId: string) => void;
  language: LanguageCode;
}

export const AIPrediction: React.FC<AIPredictionProps> = ({
  selectedCrop,
  onSelectCrop,
  onNavigate,
  language,
}) => {
  const t = TRANSLATIONS[language].pages;
  const [horizon, setHorizon] = useState<7 | 30>(7);
  const [activeHoverPoint, setActiveHoverPoint] = useState<{
    dayLabel: string;
    price: number;
    isPredicted: boolean;
    lower?: number;
    upper?: number;
  } | null>(null);

  const forecastResult: ForecastResult = useMemo(() => {
    return generateCropForecast(selectedCrop, horizon);
  }, [selectedCrop, horizon]);

  const past14 = forecastResult.historicalSeries.slice(-14);
  const futurePoints = forecastResult.forecastPoints;

  const allPrices = [
    ...past14.map((p) => p.modalPrice),
    ...futurePoints.map((p) => p.predictedPrice),
    ...futurePoints.map((p) => p.upperConfidence),
    ...futurePoints.map((p) => p.lowerConfidence),
  ];

  const minPrice = Math.floor(Math.min(...allPrices) * 0.95);
  const maxPrice = Math.ceil(Math.max(...allPrices) * 1.05);
  const priceRange = Math.max(1, maxPrice - minPrice);

  const chartWidth = 800;
  const chartHeight = 320;
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const stepX = innerWidth / (past14.length + futurePoints.length - 1);

  const pastCoords = past14.map((pt, idx) => ({
    ...pt,
    x: paddingLeft + idx * stepX,
    y: paddingTop + innerHeight - ((pt.modalPrice - minPrice) / priceRange) * innerHeight,
  }));

  const todayPoint = pastCoords[pastCoords.length - 1];

  const futureCoords = futurePoints.map((pt, idx) => ({
    ...pt,
    x: paddingLeft + (past14.length + idx) * stepX,
    y: paddingTop + innerHeight - ((pt.predictedPrice - minPrice) / priceRange) * innerHeight,
    yUpper: paddingTop + innerHeight - ((pt.upperConfidence - minPrice) / priceRange) * innerHeight,
    yLower: paddingTop + innerHeight - ((pt.lowerConfidence - minPrice) / priceRange) * innerHeight,
  }));

  const pastPath = pastCoords.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );
  const futurePath = [todayPoint, ...futureCoords].reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  const confidenceAreaPoints = [
    `${todayPoint.x},${todayPoint.y}`,
    ...futureCoords.map((pt) => `${pt.x},${pt.yUpper}`),
    ...[...futureCoords].reverse().map((pt) => `${pt.x},${pt.yLower}`),
  ].join(' ');

  const yTicks = [0, 0.33, 0.66, 1].map((pct) => ({
    val: Math.round(minPrice + pct * priceRange),
    y: paddingTop + innerHeight - pct * innerHeight,
  }));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-emerald-400/15">
        <div>
          <span className="text-xs font-semibold text-lime-300 uppercase tracking-wider">
            Machine Learning Predictive Analytics · Ensemble Random Forest & SAR-OLS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            {t.predictionTitle}
          </h1>
          <p className="text-sm text-emerald-100/75 mt-1 max-w-2xl">{t.predictionSub}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-emerald-950/80 p-1 rounded-xl border border-emerald-400/20 text-xs font-semibold">
            <button
              onClick={() => setHorizon(7)}
              className={`px-3.5 py-1.5 rounded-lg cursor-pointer ${
                horizon === 7 ? 'bg-lime-400 text-emerald-950 font-bold' : 'text-emerald-100/80'
              }`}
            >
              7-Day Forecast
            </button>
            <button
              onClick={() => setHorizon(30)}
              className={`px-3.5 py-1.5 rounded-lg cursor-pointer ${
                horizon === 30 ? 'bg-lime-400 text-emerald-950 font-bold' : 'text-emerald-100/80'
              }`}
            >
              30-Day Outlook
            </button>
          </div>

          <button
            onClick={() => onNavigate('recommendation')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{TRANSLATIONS[language].nav.recommendation}</span>
          </button>
        </div>
      </div>

      {/* Crop Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CROPS_DATA.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCrop(c)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap cursor-pointer ${
              c.id === selectedCrop.id
                ? 'bg-lime-400 text-emerald-950 font-bold'
                : 'glass-panel text-emerald-100 hover:bg-emerald-800/50'
            }`}
          >
            {language === 'kn' ? c.kannadaName.split(' ')[0] : language === 'hi' ? c.hindiName.split(' ')[0] : c.name}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between text-xs text-lime-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              {forecastResult.metrics.algorithm}
            </span>
            <span className="bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-400/25">
              Confidence: {forecastResult.metrics.confidenceScorePercent}%
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-6">
            <div>
              <span className="text-xs text-emerald-200/70 block">Current Spot Price</span>
              <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                ₹{forecastResult.currentModalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-emerald-200/70 ml-1">/qtl</span>
            </div>

            <div className="text-lime-400 font-bold text-xl">➔</div>

            <div>
              <span className="text-xs text-emerald-200/70 block">
                Predicted ({futurePoints[futurePoints.length - 1].dayLabel})
              </span>
              <span className="text-3xl font-extrabold font-mono text-amber-300 tabular-nums">
                ₹{futurePoints[futurePoints.length - 1].predictedPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-amber-200/80 ml-1">/qtl</span>
            </div>

            <div className="sm:ml-auto">
              <span
                className={`inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-lg font-mono tabular-nums ${
                  forecastResult.priceDeltaPredicted >= 0
                    ? 'bg-emerald-500/25 text-lime-300 border border-lime-400/35'
                    : 'bg-rose-500/25 text-rose-300 border border-rose-400/35'
                }`}
              >
                {forecastResult.priceDeltaPredicted >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {forecastResult.priceDeltaPredicted >= 0
                  ? `+₹${forecastResult.priceDeltaPredicted}`
                  : `-₹${Math.abs(forecastResult.priceDeltaPredicted)}`}
                <span>({forecastResult.percentageDeltaPredicted >= 0 ? `+${forecastResult.percentageDeltaPredicted}%` : `${forecastResult.percentageDeltaPredicted}%`})</span>
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-400/15 text-xs text-emerald-100/90 leading-relaxed">
            <strong>Model Verdict:</strong> {forecastResult.metrics.recommendationSummary}
          </div>
        </div>

        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 space-y-3">
          <h3 className="text-xs font-bold text-lime-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Model Validation Metrics
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between pb-2 border-b border-emerald-400/15">
              <span className="text-emerald-200/75">R² Fit Score:</span>
              <span className="font-mono font-bold text-white">{forecastResult.metrics.rSquared}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-emerald-400/15">
              <span className="text-emerald-200/75">MAPE Error:</span>
              <span className="font-mono font-bold text-white">{forecastResult.metrics.mape}%</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-emerald-400/15">
              <span className="text-emerald-200/75">RMSE:</span>
              <span className="font-mono font-bold text-white">±₹{forecastResult.metrics.rmse}/qtl</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-200/75">Classification:</span>
              <span className="font-bold text-lime-300">{forecastResult.metrics.trendClassification}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Historical Price & AI Forecast Trajectory
            </h3>
            <span className="text-xs text-emerald-200/70">
              Solid White/Mint = Past 14 Days · Dashed Lime = {horizon}-Day AI Forecast · Shaded = 95% Confidence
            </span>
          </div>

          {activeHoverPoint && (
            <div className="text-xs font-semibold px-3 py-1.5 bg-emerald-950/80 text-white rounded-lg border border-lime-400/35">
              {activeHoverPoint.dayLabel} ({activeHoverPoint.isPredicted ? 'Forecast' : 'Actual'}):{' '}
              <strong className="font-mono text-lime-300">₹{activeHoverPoint.price}/qtl</strong>
            </div>
          )}
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto max-h-[360px] select-none">
            <defs>
              <linearGradient id="confidenceGradDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#84cc16" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#84cc16" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={tick.y}
                  x2={chartWidth - paddingRight}
                  y2={tick.y}
                  stroke="rgba(167,243,208,0.12)"
                  strokeDasharray="4 4"
                />
                <text x={paddingLeft - 10} y={tick.y + 4} textAnchor="end" className="text-[11px] fill-emerald-200/70 font-mono">
                  ₹{tick.val}
                </text>
              </g>
            ))}

            <line
              x1={todayPoint.x}
              y1={paddingTop}
              x2={todayPoint.x}
              y2={chartHeight - paddingBottom}
              stroke="rgba(250,204,21,0.5)"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
            <text x={todayPoint.x} y={paddingTop - 10} textAnchor="middle" className="text-[11px] font-bold fill-amber-300 uppercase">
              Today
            </text>

            <polygon points={confidenceAreaPoints} fill="url(#confidenceGradDark)" />
            <path d={pastPath} fill="none" stroke="#d1fae5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={futurePath} fill="none" stroke="#a3e635" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" />

            {pastCoords.map((pt, i) => (
              <circle
                key={`past-${i}`}
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#07160d"
                stroke="#d1fae5"
                strokeWidth="2"
                className="cursor-pointer"
                onMouseEnter={() =>
                  setActiveHoverPoint({ dayLabel: pt.day, price: pt.modalPrice, isPredicted: false })
                }
              />
            ))}

            <circle cx={todayPoint.x} cy={todayPoint.y} r="5" fill="#fbbf24" stroke="#07160d" strokeWidth="2.5" />

            {futureCoords.map((pt, i) => (
              <circle
                key={`fut-${i}`}
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#a3e635"
                stroke="#07160d"
                strokeWidth="2"
                className="cursor-pointer"
                onMouseEnter={() =>
                  setActiveHoverPoint({
                    dayLabel: pt.dayLabel,
                    price: pt.predictedPrice,
                    isPredicted: true,
                    lower: pt.lowerConfidence,
                    upper: pt.upperConfidence,
                  })
                }
              />
            ))}

            {pastCoords
              .filter((_, idx) => idx % 4 === 0)
              .map((pt, i) => (
                <text key={`xt-p-${i}`} x={pt.x} y={chartHeight - paddingBottom + 18} textAnchor="middle" className="text-[10px] fill-emerald-200/70">
                  {pt.day}
                </text>
              ))}

            {futureCoords
              .filter((_, idx) => (horizon === 30 ? idx % 6 === 0 : idx % 2 === 0))
              .map((pt, i) => (
                <text key={`xt-f-${i}`} x={pt.x} y={chartHeight - paddingBottom + 18} textAnchor="middle" className="text-[10px] fill-lime-300 font-bold">
                  {pt.dayLabel}
                </text>
              ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
