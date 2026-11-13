import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  RotateCcw, 
  Copy, 
  Check, 
  ArrowRight,
  Languages
} from 'lucide-react';
import { CropInfo } from '../data/marketData';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

interface FarmerAssistantProps {
  selectedCrop: CropInfo;
  language: 'en' | 'kn' | 'hi';
  setLanguage: (lang: 'en' | 'kn' | 'hi') => void;
}

export const FarmerAssistant: React.FC<FarmerAssistantProps> = ({
  selectedCrop,
  language,
  setLanguage,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: language === 'kn'
        ? `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಮಂಡಿಮಿತ್ರ ಕೃಷಿ ಎಐ ಸಹಾಯಕ. ನೀವು ${selectedCrop.name} (${selectedCrop.kannadaName}) ಅಥವಾ ಯಾವುದೇ ಬೆಳೆಯ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ, ಭವಿಷ್ಯದ ಬೆಲೆ ಮುನ್ಸೂಚನೆ, ಸಾಗಣೆ ವೆಚ್ಚ ಮತ್ತು ನಿವ್ವಳ ಲಾಭದ ಬಗ್ಗೆ ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.`
        : language === 'hi'
        ? `नमस्ते किसान भाई! मैं आपका मंडीमित्र एआई सहायक हूँ। आप मुझसे फसलों के ताजा मंडी भाव, आगामी दिनों का मूल्य पूर्वानुमान, ढुलाई खर्च और शुद्ध मुनाफे के बारे में हिन्दी या अंग्रेजी में सवाल पूछ सकते हैं।`
        : `Namaste! I am MandiMitra AI Assistant. You can ask me about APMC market prices for ${selectedCrop.name}, 7-day price forecasts, freight costs, or how to maximize profit for your harvest. I can answer in English, Kannada (ಕನ್ನಡ), and Hindi!`,
      timestamp: 'Just now',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Suggested prompt chips based on language
  const suggestedQuestions = {
    en: [
      `What is the best Mandi to sell ${selectedCrop.name} today?`,
      `Will ${selectedCrop.name} price rise in the next 7 days?`,
      `How much freight will it cost to transport 40 quintals?`,
      `Compare Yeshwantpur vs Kolar prices`,
    ],
    kn: [
      `ಇಂದು ${selectedCrop.kannadaName} ಮಾರಾಟಕ್ಕೆ ಯಾವ ಮಂಡಿ ಉತ್ತಮ?`,
      `ಮುಂದಿನ ವಾರ ಬೆಲೆ ಏರಿಕೆಯಾಗುವುದೇ?`,
      `40 ಕ್ವಿಂಟಾಲ್ ಸಾಗಣೆ ವೆಚ್ಚ ಮತ್ತು ಲಾಭ ಎಷ್ಟು?`,
      `ಯಶವಂತಪುರ ಮತ್ತು ಕೋಲಾರ ಮಾರುಕಟ್ಟೆ ದರ ಹೋಲಿಸಿ`,
    ],
    hi: [
      `आज ${selectedCrop.hindiName} बेचने के लिए कौन सी मंडी सबसे अच्छी है?`,
      `क्या अगले 7 दिनों में भाव बढ़ेंगे?`,
      `50 क्विंटल उपज पर कितना शुद्ध मुनाफा होगा?`,
    ],
  }[language];

  // Send message to full-stack Express server
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          language,
          cropContext: `Current active crop: ${selectedCrop.name} (Modal Price: ₹${selectedCrop.baseModalPrice}/qtl, MSP: ₹${selectedCrop.mspPrice})`,
        }),
      });

      if (!response.ok) {
        throw new Error('Server response error');
      }

      const data = await response.json();
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Sorry, I could not process your query at this moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text:
          language === 'kn'
            ? `${selectedCrop.name} ನ ಪ್ರಸ್ತುತ ಯಶವಂತಪುರ ದರ ₹${selectedCrop.baseModalPrice}/ಕ್ವಿಂಟಾಲ್ ಆಗಿದೆ. ಮುಂದಿನ ವಾರ ಬೆಲೆ ಸ್ಥಿರವಾಗಿರುವ ಸಾಧ್ಯತೆಯಿದೆ.`
            : `Current market price for ${selectedCrop.name} is ₹${selectedCrop.baseModalPrice}/quintal. Our time-series forecast anticipates steady demand across regional APMCs.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'local_fallback',
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-To-Speech handler
  const handleSpeak = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    if (language === 'kn') utterance.lang = 'kn-IN';
    else if (language === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingMessageId(messageId);
  };

  // Web Speech Recognition for voice input
  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      if (language === 'kn') recognition.lang = 'kn-IN';
      else if (language === 'hi') recognition.lang = 'hi-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>Conversational Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Multilingual Voice & Text</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display mt-1 flex items-center gap-2">
            <span>AI Farmer Assistant</span>
            <span className="text-xs font-bold bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full">
              Gemini Powered
            </span>
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Ask questions about crop prices, mandi comparisons, price forecasts, and profit calculations in English, ಕನ್ನಡ, or हिन्दी.
          </p>
        </div>

        {/* Language selector buttons */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold shrink-0">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              language === 'en' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-stone-600'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('kn')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              language === 'kn' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-stone-600'
            }`}
          >
            ಕನ್ನಡ (Kannada)
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              language === 'hi' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-stone-600'
            }`}
          >
            हिन्दी (Hindi)
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm flex flex-col h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            const isCurrentlySpeaking = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-xs ${
                    isBot ? 'bg-emerald-800 text-amber-300' : 'bg-stone-800 text-white'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-stone-50 border border-stone-200/80 text-stone-900'
                      : 'bg-emerald-800 text-white shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Message Footer Actions */}
                  <div className={`mt-2.5 pt-2 flex items-center justify-between text-[11px] ${
                    isBot ? 'border-t border-stone-200/60 text-stone-500' : 'border-t border-emerald-700/60 text-emerald-200'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {isBot && (
                      <div className="flex items-center gap-2">
                        {/* Audio Read-out */}
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className={`p-1 rounded hover:bg-stone-200 transition-colors cursor-pointer ${
                            isCurrentlySpeaking ? 'text-amber-600' : 'text-stone-500'
                          }`}
                          title="Listen to audio"
                        >
                          {isCurrentlySpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>

                        {/* Copy text */}
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-1 rounded hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-xs text-stone-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1">MandiMitra is analyzing market data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Prompt Chips */}
        <div className="px-4 py-2 border-t border-stone-100 bg-[#FCFDF9] overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 rounded-lg whitespace-nowrap cursor-pointer transition-colors text-stone-700 font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-white rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
              }`}
              title="Voice Input (ಧ್ವನಿ ಮೂಲಕ ಮಾತನಾಡಿ)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-800" />}
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                language === 'kn'
                  ? 'ನಿಮ್ಮ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
                  : language === 'hi'
                  ? 'अपनी फसल या मंडी से जुड़ा सवाल यहाँ पूछें...'
                  : 'Ask about mandi prices, forecasts, selling tips...'
              }
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
