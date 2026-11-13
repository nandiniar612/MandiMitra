import { CROPS_DATA, CropInfo, MandiPrice } from '../data/marketData';
import { generateCropForecast } from './mlForecasting';
import { generateSmartSellingRecommendation } from './recommendationEngine';
import { LanguageCode } from '../types/farmer';

export interface CropStockSnapshot {
  crop: CropInfo;
  currentBestPrice: number;
  bestGrossMandi: MandiPrice;
  bestProfitMandi: MandiPrice;
  bestNetPricePerQtl: number;
  dayChangePercent: number;
  dayChangeInr: number;
  isIncreased: boolean;
  forecast7DayPrice: number;
  forecast7DayChangePct: number;
  willIncrement: boolean;
  shouldSellNow: boolean;
  suggestedWindow: string;
  confidencePercent: number;
}

export function getCropStockSnapshot(crop: CropInfo, farmerDistrict = 'Dharwad'): CropStockSnapshot {
  const sortedByPrice = [...crop.mandis].sort((a, b) => b.modalPrice - a.modalPrice);
  const bestGrossMandi = sortedByPrice[0];

  const forecast7 = generateCropForecast(crop, 7);
  const endPoint = forecast7.forecastPoints[forecast7.forecastPoints.length - 1];

  const recommendation = generateSmartSellingRecommendation({
    crop,
    quantityQuintals: 40,
    farmerDistrict,
    storageType: 'ventilated',
  });

  const bestProfitEval =
    recommendation.mandiEvaluations.find((e) => e.isBestNet) || recommendation.mandiEvaluations[0];

  const dayChangePercent = bestGrossMandi.dayChangePercent;
  const dayChangeInr = Math.round(
    (bestGrossMandi.modalPrice * dayChangePercent) / (100 + dayChangePercent)
  );

  const shouldSellNow = recommendation.suggestedAction === 'Sell Immediately';

  return {
    crop,
    currentBestPrice: bestGrossMandi.modalPrice,
    bestGrossMandi,
    bestProfitMandi: recommendation.recommendedMandi,
    bestNetPricePerQtl: bestProfitEval.netRealizationPerQtl,
    dayChangePercent,
    dayChangeInr,
    isIncreased: dayChangePercent >= 0,
    forecast7DayPrice: endPoint.predictedPrice,
    forecast7DayChangePct: forecast7.percentageDeltaPredicted,
    willIncrement: forecast7.percentageDeltaPredicted > 0,
    shouldSellNow,
    suggestedWindow: recommendation.suggestedSellingPeriod,
    confidencePercent: forecast7.metrics.confidenceScorePercent,
  };
}

export function getAllCropSnapshots(farmerDistrict = 'Dharwad'): CropStockSnapshot[] {
  return CROPS_DATA.map((crop) => getCropStockSnapshot(crop, farmerDistrict));
}

export function detectCropFromQuery(query: string): CropInfo | null {
  const q = query.toLowerCase();
  for (const crop of CROPS_DATA) {
    const englishRoot = crop.name.split(' ')[0].toLowerCase();
    if (
      q.includes(crop.id) ||
      q.includes(englishRoot) ||
      q.includes(crop.kannadaName.split(' ')[0]) ||
      q.includes(crop.hindiName.split(' ')[0])
    ) {
      return crop;
    }
  }
  // Common synonyms
  if (q.includes('pyaj') || q.includes('pyaaz') || q.includes('eerulli') || q.includes('ಈರುಳ್ಳಿ')) {
    return CROPS_DATA.find((c) => c.id === 'onion') || null;
  }
  if (q.includes('gehu') || q.includes('godhi') || q.includes('ಗೋಧಿ')) {
    return CROPS_DATA.find((c) => c.id === 'wheat') || null;
  }
  if (q.includes('tamatar') || q.includes('ಟೊಮೆಟೊ')) {
    return CROPS_DATA.find((c) => c.id === 'tomato') || null;
  }
  if (q.includes('kapas') || q.includes('hatti') || q.includes('ಹತ್ತಿ')) {
    return CROPS_DATA.find((c) => c.id === 'cotton') || null;
  }
  if (q.includes('rice') || q.includes('dhan') || q.includes('bhatta') || q.includes('ಭತ್ತ')) {
    return CROPS_DATA.find((c) => c.id === 'paddy') || null;
  }
  if (q.includes('corn') || q.includes('makka') || q.includes('mekkejola') || q.includes('ಮೆಕ್ಕೆಜೋಳ')) {
    return CROPS_DATA.find((c) => c.id === 'maize') || null;
  }
  if (q.includes('haldi') || q.includes('arishina') || q.includes('ಅರಿಶಿನ')) {
    return CROPS_DATA.find((c) => c.id === 'turmeric') || null;
  }
  if (q.includes('aloo') || q.includes('alugadde') || q.includes('ಆಲೂಗಡ್ಡೆ')) {
    return CROPS_DATA.find((c) => c.id === 'potato') || null;
  }
  return null;
}

export function formatStockSummaryText(
  snap: CropStockSnapshot,
  lang: LanguageCode,
  farmerName = 'Farmer'
): string {
  const sign24h = snap.dayChangePercent >= 0 ? '+' : '';
  const sign7d = snap.forecast7DayChangePct >= 0 ? '+' : '';

  if (lang === 'kn') {
    const dirWord = snap.isIncreased ? 'ಏರಿಕೆಯಾಗಿದೆ ▲' : 'ಇಳಿಕೆಯಾಗಿದೆ ▼';
    const futWord = snap.willIncrement
      ? `ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ${sign7d}${snap.forecast7DayChangePct}% ಏರಿಕೆಯಾಗಿ ₹${snap.forecast7DayPrice}/ಕ್ವಿಂಟಾಲ್ ತಲುಪುವ ಅಂದಾಜಿದೆ.`
      : `ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ${snap.forecast7DayChangePct}% ಇಳಿಕೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ (₹${snap.forecast7DayPrice}/ಕ್ವಿಂಟಾಲ್).`;
    const decisionText = snap.shouldSellNow
      ? 'ಈಗಲೇ ಮಾರಾಟ ಮಾಡಿ (SELL NOW) — ತಾಜಾ ದರ ಉತ್ತಮವಾಗಿದೆ ಮತ್ತು ಶೇಖರಣಾ ನಷ್ಟ ತಪ್ಪಿಸಬಹುದು.'
      : '3–5 ದಿನ ಕಾಯಿರಿ (HOLD) — ಮುಂದಿನ ದಿನಗಳಲ್ಲಿ ದರ ಇನ್ನಷ್ಟು ಹೆಚ್ಚಾಗುವುದರಿಂದ ಹೆಚ್ಚು ಲಾಭ ಸಿಗುತ್ತದೆ.';

    return `ನಮಸ್ಕಾರ ${farmerName}! ${snap.crop.kannadaName} (${snap.crop.name}) ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ:\n• ಪ್ರಸ್ತುತ ಗರಿಷ್ಠ ದರ: ₹${snap.currentBestPrice}/ಕ್ವಿಂಟಾಲ್ (${snap.bestGrossMandi.mandiName})\n• 24 ಗಂಟೆ ಬದಲಾವಣೆ: ${sign24h}${snap.dayChangePercent}% (${dirWord})\n• 7 ದಿನಗಳ AI ಮುನ್ಸೂಚನೆ: ${futWord}\n• AI ಸಲಹೆ: ${decisionText}\n• ಅತ್ಯಧಿಕ ನಿವ್ವಳ ಲಾಭದ ಮಂಡಿ: ${snap.bestProfitMandi.mandiName} (ಸಾಗಣೆ ನಂತರ ₹${snap.bestNetPricePerQtl}/ಕ್ವಿಂಟಾಲ್ ನಿವ್ವಳ ಲಾಭ).`;
  }

  if (lang === 'hi') {
    const dirWord = snap.isIncreased ? 'बढ़ा है ▲' : 'घटा है ▼';
    const futWord = snap.willIncrement
      ? `अगले 7 दिनों में भाव ${sign7d}${snap.forecast7DayChangePct}% बढ़कर ₹${snap.forecast7DayPrice}/क्विंटल तक जाने का अनुमान है।`
      : `अगले 7 दिनों में ${snap.forecast7DayChangePct}% नरमी (₹${snap.forecast7DayPrice}/क्विंटल) संभावित है।`;
    const decisionText = snap.shouldSellNow
      ? 'अभी बेचें (SELL NOW) — वर्तमान भाव मजबूत हैं या फसल जल्दी खराब होने वाली है।'
      : '3–5 दिन रुकें (HOLD) — आगामी दिनों में बेहतर मुनाफा मिलने की संभावना है।';

    return `नमस्ते ${farmerName}! ${snap.crop.hindiName} (${snap.crop.name}) का बाजार विश्लेषण:\n• वर्तमान सर्वोत्तम भाव: ₹${snap.currentBestPrice}/क्विंटल (${snap.bestGrossMandi.mandiName})\n• 24 घंटे का बदलाव: ${sign24h}${snap.dayChangePercent}% (${dirWord})\n• 7-दिवसीय AI अनुमान: ${futWord}\n• AI निर्णय: ${decisionText}\n• सर्वाधिक मुनाफे वाली मंडी: ${snap.bestProfitMandi.mandiName} (भाड़ा घटाकर ₹${snap.bestNetPricePerQtl}/क्विंटल शुद्ध आय)।`;
  }

  const dirWord = snap.isIncreased ? 'Increased ▲' : 'Decreased ▼';
  const futWord = snap.willIncrement
    ? `Projected to rise by ${sign7d}${snap.forecast7DayChangePct}% to ₹${snap.forecast7DayPrice}/qtl in 7 days.`
    : `Projected to soften by ${snap.forecast7DayChangePct}% to ₹${snap.forecast7DayPrice}/qtl in 7 days.`;
  const decisionText = snap.shouldSellNow
    ? 'SELL NOW — Spot price is favorable or perishability risk outweighs holding.'
    : 'HOLD (3–5 Days) — Forecast shows meaningful price upside ahead.';

  return `Hello ${farmerName}! Live Stock-Style Analysis for ${snap.crop.name}:\n• Current Best Price: ₹${snap.currentBestPrice}/qtl at ${snap.bestGrossMandi.mandiName}\n• 24h Market Rate: ${sign24h}${snap.dayChangePercent}% (${dirWord})\n• 7-Day AI Forecast: ${futWord}\n• AI Verdict: ${decisionText}\n• Best Profit Mandi: ${snap.bestProfitMandi.mandiName} (₹${snap.bestNetPricePerQtl}/qtl net after freight).`;
}
