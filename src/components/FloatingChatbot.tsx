import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Minimize2,
  TrendingUp,
  TrendingDown,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  BadgeCheck,
  MapPin,
} from 'lucide-react';
import { CROPS_DATA, CropInfo } from '../data/marketData';
import { FarmerProfile, LanguageCode } from '../types/farmer';
import { TRANSLATIONS } from '../i18n/translations';
import {
  CropStockSnapshot,
  detectCropFromQuery,
  formatStockSummaryText,
  getCropStockSnapshot,
} from '../services/stockAnalysis';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  snapshot?: CropStockSnapshot;
}

interface FloatingChatbotProps {
  farmer: FarmerProfile;
  language: LanguageCode;
  selectedCrop: CropInfo;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  farmer,
  language,
  selectedCrop,
  isOpen,
  setIsOpen,
}) => {
  const t = TRANSLATIONS[language].chatbot;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-greeting',
      sender: 'assistant',
      text: t.greeting(farmer.name, farmer.place),
      timestamp: 'Now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync initial greeting automatically when website language or farmer changes
  useEffect(() => {
    setMessages((prev) => {
      const updated = prev.map((m) =>
        m.id === 'init-greeting'
          ? { ...m, text: TRANSLATIONS[language].chatbot.greeting(farmer.name, farmer.place) }
          : m
      );
      return updated;
    });
  }, [language, farmer.name, farmer.place]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const sendMessage = async (customText?: string, forcedCrop?: CropInfo) => {
    const queryText = (customText ?? input).trim();
    if (!queryText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsLoading(true);

    const targetCrop = forcedCrop || detectCropFromQuery(queryText) || selectedCrop;
    const localSnapshot = getCropStockSnapshot(targetCrop, farmer.place);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language,
          activeCropId: targetCrop.id,
          farmerProfile: farmer,
          cropContext: `${targetCrop.name} (Best ₹${localSnapshot.currentBestPrice}/qtl)`,
        }),
      });

      if (!res.ok) throw new Error('Chat request failed');
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || formatStockSummaryText(localSnapshot, language, farmer.name),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          snapshot: data.snapshot || localSnapshot,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'assistant',
          text: formatStockSummaryText(localSnapshot, language, farmer.name),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          snapshot: localSnapshot,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAnalyzeCrop = (crop: CropInfo) => {
    const label =
      language === 'kn'
        ? `${crop.kannadaName} ಬೆಲೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಮಾರಾಟ ಸಲಹೆ ನೀಡಿ`
        : language === 'hi'
        ? `${crop.hindiName} का ताजा भाव, पूर्वानुमान और बेचने की सलाह दें`
        : `Analyze ${crop.name} price, % change, forecast & best mandi to sell`;
    sendMessage(label, crop);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingId(id);
  };

  const handleVoiceMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (isListening) {
      setIsListening(false);
      return;
    }
    try {
      const rec = new SpeechRecognition();
      rec.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      rec.onresult = (ev: any) => {
        const transcript = ev.results?.[0]?.[0]?.transcript;
        if (transcript) sendMessage(transcript);
      };
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Right-Corner Chat Drawer */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[410px] h-[540px] max-h-[78vh] rounded-2xl glass-panel-strong shadow-2xl flex flex-col overflow-hidden border border-emerald-400/25">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-900/90 to-emerald-950/95 border-b border-emerald-400/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-lime-400/20 border border-lime-400/35 flex items-center justify-center text-lime-300 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white truncate font-display">
                  {t.title}
                </div>
                <div className="text-[10px] text-emerald-200/80 truncate">
                  {t.subtitle} · {language === 'kn' ? 'ಕನ್ನಡ' : language === 'hi' ? 'हिन्दी' : 'English'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/50 cursor-pointer"
                aria-label="Minimize chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/50 cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Crop Stock-Analysis Chips */}
          <div className="px-3 py-2 border-b border-emerald-400/15 bg-emerald-950/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-wider shrink-0">
              {t.quickPromptLabel}
            </span>
            {CROPS_DATA.slice(0, 7).map((crop) => (
              <button
                key={crop.id}
                onClick={() => handleQuickAnalyzeCrop(crop)}
                className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-700/70 border border-emerald-400/20 text-[11px] font-semibold text-emerald-50 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              >
                {language === 'kn'
                  ? crop.kannadaName.split(' ')[0]
                  : language === 'hi'
                  ? crop.hindiName.split(' ')[0]
                  : crop.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {messages.map((msg) => {
              const isBot = msg.sender === 'assistant';
              const snap = msg.snapshot;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isBot
                        ? 'bg-emerald-950/80 border border-emerald-400/20 text-emerald-50'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {/* Structured Stock-Market Price Card inside Bot Message */}
                    {isBot && snap && (
                      <div className="mb-2.5 p-2.5 rounded-xl bg-[#07190e]/90 border border-emerald-400/20 space-y-2">
                        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-emerald-400/15">
                          <span className="font-bold text-white text-xs truncate">
                            {language === 'kn'
                              ? snap.crop.kannadaName
                              : language === 'hi'
                              ? snap.crop.hindiName
                              : snap.crop.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide ${
                              snap.shouldSellNow
                                ? 'bg-amber-400 text-emerald-950'
                                : 'bg-lime-400/20 text-lime-300 border border-lime-400/40'
                            }`}
                          >
                            {snap.shouldSellNow ? TRANSLATIONS[language].dashboard.sellNow : TRANSLATIONS[language].dashboard.holdPeak}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-emerald-300/70 block text-[10px]">{t.currentBestPrice}</span>
                            <span className="font-mono font-bold text-sm text-white tabular-nums">
                              ₹{snap.currentBestPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div>
                            <span className="text-emerald-300/70 block text-[10px]">{t.marketChange}</span>
                            <span
                              className={`font-mono font-bold text-xs inline-flex items-center gap-0.5 tabular-nums ${
                                snap.isIncreased ? 'text-lime-400' : 'text-rose-400'
                              }`}
                            >
                              {snap.isIncreased ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {snap.dayChangePercent >= 0 ? `+${snap.dayChangePercent}%` : `${snap.dayChangePercent}%`}
                            </span>
                          </div>
                          <div>
                            <span className="text-emerald-300/70 block text-[10px]">{t.next7Days}</span>
                            <span
                              className={`font-mono font-bold text-xs tabular-nums ${
                                snap.willIncrement ? 'text-lime-300' : 'text-amber-300'
                              }`}
                            >
                              ₹{snap.forecast7DayPrice} ({snap.forecast7DayChangePct >= 0 ? `+${snap.forecast7DayChangePct}%` : `${snap.forecast7DayChangePct}%`})
                            </span>
                          </div>
                          <div>
                            <span className="text-emerald-300/70 block text-[10px]">{t.bestProfitMandi}</span>
                            <span className="font-semibold text-amber-300 flex items-center gap-0.5 truncate">
                              <MapPin className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{snap.bestProfitMandi.mandiName}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    <div className="mt-2 pt-1.5 border-t border-emerald-400/15 flex items-center justify-between text-[10px] text-emerald-200/60">
                      <span>{msg.timestamp}</span>
                      {isBot && (
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className="flex items-center gap-1 hover:text-lime-300 transition-colors cursor-pointer"
                        >
                          {speakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3 h-3 text-amber-300" />
                              <span>{t.stopAudio}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>{t.listen}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-950/75 border border-emerald-400/15 text-xs text-emerald-200 max-w-[80%]">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-bounce [animation-delay:0.3s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 border-t border-emerald-400/20 bg-emerald-950/85 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleVoiceMic}
              className={`p-2 rounded-xl border cursor-pointer transition-colors shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                  : 'bg-emerald-900/60 hover:bg-emerald-800/70 text-emerald-200 border-emerald-400/20'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 bg-emerald-900/40 border border-emerald-400/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-emerald-200/45 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-3 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-emerald-950 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Right-Corner Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white border border-lime-400/40 shadow-2xl transition-all cursor-pointer group"
      >
        <div className="w-7 h-7 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-xs sm:text-sm font-bold whitespace-nowrap">{t.launcherLabel}</span>
      </button>
    </div>
  );
};
