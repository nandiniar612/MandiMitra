import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { CROPS_DATA } from './src/data/marketData.ts';
import {
  detectCropFromQuery,
  formatStockSummaryText,
  getAllCropSnapshots,
  getCropStockSnapshot,
} from './src/services/stockAnalysis.ts';
import type { LanguageCode } from './src/types/farmer.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MandiMitra-AI Market Engine',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Crops catalogue API
app.get('/api/crops', (req, res) => {
  res.json({
    crops: CROPS_DATA.map((c) => ({
      id: c.id,
      name: c.name,
      kannadaName: c.kannadaName,
      hindiName: c.hindiName,
      category: c.category,
      baseModalPrice: c.baseModalPrice,
      mspPrice: c.mspPrice,
      mandisCount: c.mandis.length,
    })),
  });
});

// Build concise real-time market table for prompt context
function buildMarketContextString(farmerPlace = 'Dharwad'): string {
  const snapshots = getAllCropSnapshots(farmerPlace);
  return snapshots
    .map((s) => {
      const sign24 = s.dayChangePercent >= 0 ? '+' : '';
      const sign7 = s.forecast7DayChangePct >= 0 ? '+' : '';
      const verdict = s.shouldSellNow ? 'SELL NOW' : 'HOLD (3-5 days)';
      return `- ${s.crop.name} (${s.crop.kannadaName} / ${s.crop.hindiName}): BestPrice ₹${s.currentBestPrice}/qtl at ${s.bestGrossMandi.mandiName}, 24hChange ${sign24}${s.dayChangePercent}%, 7DayForecast ₹${s.forecast7DayPrice}/qtl (${sign7}${s.forecast7DayChangePct}%), Verdict: ${verdict}, MostProfitableMandiAfterFreight: ${s.bestProfitMandi.mandiName} (Net ₹${s.bestNetPricePerQtl}/qtl), Perishability: ${s.crop.perishability}`;
    })
    .join('\n');
}

// Fallback response generator if Gemini key is missing or quota reached
function getFallbackAssistantResponse(
  message: string,
  language: LanguageCode = 'en',
  farmerName = 'Farmer',
  farmerPlace = 'Karnataka',
  activeCropId = 'onion'
): { reply: string; snapshot?: ReturnType<typeof getCropStockSnapshot> } {
  const detectedCrop =
    detectCropFromQuery(message) ||
    CROPS_DATA.find((c) => c.id === activeCropId) ||
    CROPS_DATA[0];

  const snapshot = getCropStockSnapshot(detectedCrop, farmerPlace);
  const reply = formatStockSummaryText(snapshot, language, farmerName);
  return { reply, snapshot };
}

// AI Farmer Assistant endpoint
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const {
      message,
      language = 'en',
      cropContext = '',
      activeCropId = 'onion',
      farmerProfile = null,
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const lang: LanguageCode =
      language === 'kn' || language === 'hi' ? language : 'en';
    const farmerName = farmerProfile?.name || 'Farmer';
    const farmerPlace = farmerProfile?.place || 'Karnataka';
    const farmerLocality = farmerProfile?.locality || '';

    const detectedCrop =
      detectCropFromQuery(message) ||
      CROPS_DATA.find((c) => c.id === activeCropId) ||
      CROPS_DATA[0];
    const snapshot = getCropStockSnapshot(detectedCrop, farmerPlace);

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is missing, return accurate computed stock-market response
    if (!apiKey) {
      const fallback = getFallbackAssistantResponse(
        message,
        lang,
        farmerName,
        farmerPlace,
        activeCropId
      );
      return res.json({
        reply: fallback.reply,
        snapshot: fallback.snapshot,
        source: 'local_mandi_intelligence',
        language: lang,
      });
    }

    const liveMarketMatrix = buildMarketContextString(farmerPlace);

    const systemPrompt = `You are "MandiMitra AI", a farmer-friendly Stock-Market Style Agricultural Price Analyst helping Indian farmers decide WHEN and WHERE to sell their crops for maximum net profit.

Farmer Profile:
- Name: ${farmerName}
- Location: ${farmerLocality ? `${farmerLocality}, ` : ''}${farmerPlace}
- Active Website Language: ${lang === 'kn' ? 'Kannada (ಕನ್ನಡ)' : lang === 'hi' ? 'Hindi (हिंदी)' : 'English'}

Live Computed Mandi & ML Forecast Data (use these exact figures):
${liveMarketMatrix}

${cropContext ? `User currently viewing: ${cropContext}` : ''}

MANDATORY RESPONSE FORMAT:
Whenever answering about any crop or market prices, clearly cover ALL 5 points concisely:
1. Current Best Price (₹/quintal) and which mandi offers it.
2. Market Rate Movement (Stock-market style: whether it Increased ▲ +X% or Decreased ▼ -X%).
3. Coming Days Prediction: Whether price is predicted to increment or drop in the next 7 days (with expected ₹/qtl and %).
4. Clear Decision: Explicitly state whether to SELL NOW or HOLD (wait 3-5 days) and why.
5. Highest Profit Mandi: Name the specific mandi that yields the maximum net take-home profit after freight costs.

CRITICAL LANGUAGE RULE:
- You MUST respond strictly in ${lang === 'kn' ? 'Kannada (ಕನ್ನಡ script)' : lang === 'hi' ? 'Hindi (Devanagari script)' : 'simple, clear English'}.
- Keep bullet points crisp, easy for a farmer to read on mobile, and never invent contradictory prices.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const reply =
      response.text ||
      formatStockSummaryText(snapshot, lang, farmerName);

    return res.json({
      reply,
      snapshot,
      source: 'gemini_3.8_flash',
      language: lang,
    });
  } catch (error) {
    console.error('Gemini Assistant Error:', error);
    const lang: LanguageCode =
      req.body?.language === 'kn' || req.body?.language === 'hi'
        ? req.body.language
        : 'en';
    const fallback = getFallbackAssistantResponse(
      req.body?.message || '',
      lang,
      req.body?.farmerProfile?.name || 'Farmer',
      req.body?.farmerProfile?.place || 'Karnataka',
      req.body?.activeCropId || 'onion'
    );
    return res.json({
      reply: fallback.reply,
      snapshot: fallback.snapshot,
      source: 'local_fallback',
      warning: 'Live AI network unavailable, using computed market intelligence.',
    });
  }
});

// Setup Vite in development or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MandiMitra-AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
