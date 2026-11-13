import { CropInfo, MandiPrice } from '../data/marketData';
import { generateCropForecast } from './mlForecasting';

export interface RecommendationInputs {
  crop: CropInfo;
  quantityQuintals: number;
  farmerDistrict: string;
  storageType: 'ambient' | 'ventilated' | 'cold_storage';
  transportRatePerKmPerQtl?: number; // default ₹0.40
}

export interface MandiEvaluation {
  mandi: MandiPrice;
  grossPricePerQtl: number;
  distanceKm: number;
  estimatedTransportPerQtl: number;
  mandiCessAndLaborPerQtl: number;
  netRealizationPerQtl: number;
  totalNetRevenue: number;
  isHighestGross: boolean;
  isBestNet: boolean;
}

export interface SellingRecommendation {
  crop: CropInfo;
  quantityQuintals: number;
  recommendedMandi: MandiPrice;
  suggestedSellingPeriod: string;
  suggestedAction: 'Sell Immediately' | 'Hold for 3-5 Days' | 'Hold for 7-10 Days';
  expectedGrossRevenue: number;
  estimatedTotalTransportCost: number;
  estimatedTotalMandiExpenses: number;
  expectedNetRevenue: number;
  baseLocalRevenue: number;
  additionalProfitGained: number;
  profitGainPercent: number;
  mandiEvaluations: MandiEvaluation[];
  predictedPricePeak: number;
  predictedPeakDay: string;
  reasoningSteps: string[];
  kannadaExplanation: string;
  hindiExplanation: string;
}

export function generateSmartSellingRecommendation(inputs: RecommendationInputs): SellingRecommendation {
  const { crop, quantityQuintals, storageType, transportRatePerKmPerQtl = 0.38 } = inputs;
  
  // Forecast next 7 days
  const forecast7 = generateCropForecast(crop, 7);
  const currentAvgPrice = crop.baseModalPrice;

  // Evaluate each Mandi for net realization
  const mandiEvals: MandiEvaluation[] = crop.mandis.map((m) => {
    // Transport cost = base handling ₹25/qtl + distance * rate
    const transportPerQtl = Math.round(25 + m.distanceKm * transportRatePerKmPerQtl);
    // Mandi fee / weighing / loading ~ 1.5% of gross
    const cessAndLabor = Math.round(m.modalPrice * 0.015 + 15);
    const netPerQtl = m.modalPrice - transportPerQtl - cessAndLabor;
    const totalNet = netPerQtl * quantityQuintals;

    return {
      mandi: m,
      grossPricePerQtl: m.modalPrice,
      distanceKm: m.distanceKm,
      estimatedTransportPerQtl: transportPerQtl,
      mandiCessAndLaborPerQtl: cessAndLabor,
      netRealizationPerQtl: netPerQtl,
      totalNetRevenue: totalNet,
      isHighestGross: false,
      isBestNet: false,
    };
  });

  // Find max gross and max net
  const highestGross = Math.max(...mandiEvals.map((e) => e.grossPricePerQtl));
  const highestNet = Math.max(...mandiEvals.map((e) => e.netRealizationPerQtl));

  mandiEvals.forEach((e) => {
    if (e.grossPricePerQtl === highestGross) e.isHighestGross = true;
    if (e.netRealizationPerQtl === highestNet) e.isBestNet = true;
  });

  const bestMandiEval = mandiEvals.find((e) => e.isBestNet) || mandiEvals[0];
  
  // Baseline: closest mandi without price optimization
  const closestMandiEval = [...mandiEvals].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  const baseLocalRevenue = closestMandiEval.netRealizationPerQtl * quantityQuintals;

  // Temporal analysis: Compare selling now vs holding
  const highestForecast = [...forecast7.forecastPoints].sort((a, b) => b.predictedPrice - a.predictedPrice)[0];
  const priceGainFromHolding = highestForecast.predictedPrice - forecast7.currentModalPrice;

  let suggestedAction: SellingRecommendation['suggestedAction'] = 'Sell Immediately';
  let suggestedSellingPeriod = 'Within next 24 to 48 hours';
  let reasoningSteps: string[] = [];

  // Perishability rule: Tomatoes cannot hold; Onions can hold if ventilated; Grains easily hold
  if (crop.perishability === 'High') {
    suggestedAction = 'Sell Immediately';
    suggestedSellingPeriod = 'Immediate harvest dispatch (Next 24-36 hrs)';
    reasoningSteps.push(`Horticultural perishability is HIGH. Holding risks 5-10% post-harvest spoilage exceeding potential market gains.`);
    reasoningSteps.push(`Dispatch to ${bestMandiEval.mandi.mandiName} yields highest net return of ₹${bestMandiEval.netRealizationPerQtl}/qtl after accounting for ₹${bestMandiEval.estimatedTransportPerQtl}/qtl freight.`);
  } else if (priceGainFromHolding > 60 && storageType !== 'ambient') {
    suggestedAction = 'Hold for 3-5 Days';
    suggestedSellingPeriod = `Target window: ${highestForecast.dayLabel} (Peak price ₹${highestForecast.predictedPrice}/qtl)`;
    reasoningSteps.push(`AI predictive model projects a +₹${priceGainFromHolding}/qtl price surge by ${highestForecast.dayLabel} due to lower expected market arrivals.`);
    reasoningSteps.push(`Storage cost for ${crop.name} under ${storageType} condition is only ₹${Math.round(quantityQuintals * 3.5)} total, well below the forecasted gain of ₹${Math.round(priceGainFromHolding * quantityQuintals)}.`);
    reasoningSteps.push(`Selling at ${bestMandiEval.mandi.mandiName} remains the most cost-efficient freight route.`);
  } else if (priceGainFromHolding > 120 && crop.perishability === 'Low') {
    suggestedAction = 'Hold for 7-10 Days';
    suggestedSellingPeriod = `Holding period: 7 to 10 days for peak arrivals cycle`;
    reasoningSteps.push(`Cereal/Cash crop durability is high. Strong institutional buying demand will lift prices above current baseline.`);
    reasoningSteps.push(`Recommended destination: ${bestMandiEval.mandi.mandiName} (${bestMandiEval.mandi.district}).`);
  } else {
    suggestedAction = 'Sell Immediately';
    suggestedSellingPeriod = 'Within 1 to 2 days';
    reasoningSteps.push(`Current spot prices are at a plateau. Holding offers marginal upside (+₹${Math.max(0, priceGainFromHolding)}/qtl) with inventory risk.`);
    reasoningSteps.push(`Choosing ${bestMandiEval.mandi.mandiName} secures +₹${bestMandiEval.netRealizationPerQtl - closestMandiEval.netRealizationPerQtl}/qtl more than local village distress rate.`);
  }

  const expectedGross = bestMandiEval.grossPricePerQtl * quantityQuintals;
  const totalTransport = bestMandiEval.estimatedTransportPerQtl * quantityQuintals;
  const totalMandiFee = bestMandiEval.mandiCessAndLaborPerQtl * quantityQuintals;
  const expectedNet = bestMandiEval.totalNetRevenue;
  const additionalGain = Math.max(0, expectedNet - baseLocalRevenue);
  const profitGainPercent = baseLocalRevenue > 0 ? Math.round((additionalGain / baseLocalRevenue) * 1000) / 10 : 0;

  const kannadaExplanation = `${bestMandiEval.mandi.mandiName} ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹${bestMandiEval.grossPricePerQtl} ದರ ಲಭ್ಯವಿದೆ. ಸಾಗಣೆ ವೆಚ್ಚ (₹${bestMandiEval.estimatedTransportPerQtl}) ಕಳೆದ ನಂತರ ನಿವ್ವಳ ₹${bestMandiEval.netRealizationPerQtl}/ಕ್ವಿಂಟಾಲ್ ಉಳಿಯುತ್ತದೆ. ಸ್ಥಳೀಯ ಮಾರಾಟಕ್ಕಿಂತ ₹${additionalGain.toLocaleString('en-IN')} ಹೆಚ್ಚುವರಿ ಲಾಭ ಗಳಿಸಬಹುದು.`;

  const hindiExplanation = `${bestMandiEval.mandi.mandiName} मंडी में ₹${bestMandiEval.grossPricePerQtl}/क्विंटल का भाव मिल रहा है। ढुलाई खर्च (₹${bestMandiEval.estimatedTransportPerQtl}) घटाने के बाद शुद्ध लाभ ₹${bestMandiEval.netRealizationPerQtl}/क्विंटल रहेगा। स्थानीय बिक्री की तुलना में ₹${additionalGain.toLocaleString('en-IN')} का अतिरिक्त मुनाफा होगा।`;

  return {
    crop,
    quantityQuintals,
    recommendedMandi: bestMandiEval.mandi,
    suggestedSellingPeriod,
    suggestedAction,
    expectedGrossRevenue: expectedGross,
    estimatedTotalTransportCost: totalTransport,
    estimatedTotalMandiExpenses: totalMandiFee,
    expectedNetRevenue: expectedNet,
    baseLocalRevenue,
    additionalProfitGained: additionalGain,
    profitGainPercent,
    mandiEvaluations: mandiEvals,
    predictedPricePeak: highestForecast.predictedPrice,
    predictedPeakDay: highestForecast.dayLabel,
    reasoningSteps,
    kannadaExplanation,
    hindiExplanation,
  };
}
