import React, { useState, useMemo } from 'react';
import { Calendar, BadgeCheck, Volume2, VolumeX } from 'lucide-react';
import { CROPS_DATA, STATES_DISTRICTS, CropInfo } from '../data/marketData';
import { generateSmartSellingRecommendation, SellingRecommendation } from '../services/recommendationEngine';
import { LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';

interface SmartRecommendationProps {
  selectedCrop: CropInfo;
  onSelectCrop: (crop: CropInfo) => void;
  onNavigate: (tabId: string) => void;
  language: LanguageCode;
  defaultDistrict?: string;
}

export const SmartRecommendation: React.FC<SmartRecommendationProps> = ({
  selectedCrop,
  onSelectCrop,
  language,
  defaultDistrict = 'Dharwad',
}) => {
  const t = TRANSLATIONS[language].pages;
  const [quantity, setQuantity] = useState<number>(45);
  const [farmerDistrict, setFarmerDistrict] = useState<string>(defaultDistrict);
  const [storageType, setStorageType] = useState<'ambient' | 'ventilated' | 'cold_storage'>('ventilated');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const recommendation: SellingRecommendation = useMemo(() => {
    return generateSmartSellingRecommendation({
      crop: selectedCrop,
      quantityQuintals: quantity,
      farmerDistrict,
      storageType,
    });
  }, [selectedCrop, quantity, farmerDistrict, storageType]);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak =
      language === 'kn'
        ? recommendation.kannadaExplanation
        : language === 'hi'
        ? recommendation.hindiExplanation
        : `Recommended selling strategy for ${selectedCrop.name}: Sell at ${recommendation.recommendedMandi.mandiName}. Window: ${recommendation.suggestedSellingPeriod}. Net take-home earnings: ₹${recommendation.expectedNetRevenue.toLocaleString('en-IN')}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-emerald-400/15">
        <div>
          <span className="text-xs font-semibold text-lime-300 uppercase tracking-wider">
            Automated Market Arbitrage · Freight & Storage Aware
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            {t.sellingTitle}
          </h1>
          <p className="text-sm text-emerald-100/75 mt-1 max-w-2xl">{t.sellingSub}</p>
        </div>

        <button
          onClick={handleToggleSpeech}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
            isSpeaking
              ? 'bg-amber-400 text-emerald-950 border-amber-300'
              : 'glass-panel text-emerald-100 hover:bg-emerald-800/50'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-lime-300" />}
          <span>{isSpeaking ? TRANSLATIONS[language].chatbot.stopAudio : TRANSLATIONS[language].chatbot.listen}</span>
        </button>
      </div>

      {/* Inputs */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-emerald-200/80 block mb-1">Crop</label>
            <select
              value={selectedCrop.id}
              onChange={(e) => {
                const found = CROPS_DATA.find((c) => c.id === e.target.value);
                if (found) onSelectCrop(found);
              }}
              className="w-full text-xs bg-emerald-950 border border-emerald-400/25 rounded-xl px-3 py-2 font-semibold text-white cursor-pointer"
            >
              {CROPS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.kannadaName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs text-emerald-200/80 mb-1">
              <span>Harvest Volume</span>
              <span className="font-mono font-bold text-lime-300">{quantity} Qtl</span>
            </div>
            <input
              type="range"
              min="5"
              max="300"
              step="5"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-lime-400 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-emerald-200/80 block mb-1">District</label>
            <select
              value={farmerDistrict}
              onChange={(e) => setFarmerDistrict(e.target.value)}
              className="w-full text-xs bg-emerald-950 border border-emerald-400/25 rounded-xl px-3 py-2 font-semibold text-white cursor-pointer"
            >
              {STATES_DISTRICTS['Karnataka'].map((d) => (
                <option key={d} value={d}>{d} (Karnataka)</option>
              ))}
              {STATES_DISTRICTS['Maharashtra'].map((d) => (
                <option key={d} value={d}>{d} (Maharashtra)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-emerald-200/80 block mb-1">Storage Available</label>
            <select
              value={storageType}
              onChange={(e) => setStorageType(e.target.value as 'ambient' | 'ventilated' | 'cold_storage')}
              className="w-full text-xs bg-emerald-950 border border-emerald-400/25 rounded-xl px-3 py-2 font-semibold text-white cursor-pointer"
            >
              <option value="ambient">Open Yard (0-3 days)</option>
              <option value="ventilated">Ventilated Shed (3-15 days)</option>
              <option value="cold_storage">Cold Storage (15-60 days)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Verdict Card */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-emerald-800/45 via-[#0b2416]/90 to-[#07160d] border border-lime-400/35 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-400/15">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-lime-300 uppercase tracking-wider">
              <BadgeCheck className="w-4 h-4" />
              <span>AI Optimized Decision · {selectedCrop.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Sell at {recommendation.recommendedMandi.mandiName}
            </h2>
            <p className="text-sm text-emerald-100/90 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>{recommendation.suggestedSellingPeriod}</span>
            </p>
          </div>

          <div className="bg-amber-400 text-emerald-950 p-4 rounded-xl shadow-md shrink-0">
            <span className="text-xs font-bold uppercase block">Additional Profit Gained</span>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums">
              +₹{recommendation.additionalProfitGained.toLocaleString('en-IN')}
            </div>
            <span className="text-xs font-semibold block">
              +{recommendation.profitGainPercent}% over local sale
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-emerald-400/15">
          <div>
            <span className="text-xs text-emerald-200/70 block">Gross Revenue</span>
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              ₹{recommendation.expectedGrossRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-xs text-emerald-200/70 block">Freight Cost</span>
            <span className="text-xl font-bold font-mono text-emerald-200 tabular-nums">
              -₹{recommendation.estimatedTotalTransportCost.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-xs text-emerald-200/70 block">Mandi Fee & Labor</span>
            <span className="text-xl font-bold font-mono text-emerald-200 tabular-nums">
              -₹{recommendation.estimatedTotalMandiExpenses.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-xs text-lime-300 font-semibold block">Net Take-Home</span>
            <span className="text-xl font-extrabold font-mono text-lime-300 tabular-nums">
              ₹{recommendation.expectedNetRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-emerald-100/90">
          {recommendation.reasoningSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/25 border border-lime-400/35 text-lime-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/75 border border-emerald-400/20 text-xs text-emerald-100 leading-relaxed">
          <strong className="text-amber-300 block mb-1">
            {language === 'hi' ? 'हिंदी सारांश:' : 'ಕನ್ನಡದಲ್ಲಿ ಸಲಹೆ (Kannada Summary):'}
          </strong>
          {language === 'hi' ? recommendation.hindiExplanation : recommendation.kannadaExplanation}
        </div>
      </div>
    </div>
  );
};
