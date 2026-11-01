import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import {
  Bot,
  Send,
  MapPin,
  Sparkles,
  Zap,
  Cpu,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  places?: {
    title: string;
    uri: string;
    placeId?: string;
    reviewSnippets?: string[];
  }[];
}

interface GeminiChatbotProps {
  onNavigate?: (page: string, params?: Record<string, any>) => void;
  initialPrompt?: string;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  onNavigate,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Hello! I am your **RevTech AI Interactive Concierge**. 

I can help you:
- **Evaluate Repair vs Replace** decisions for any smartphone
- **Locate nearby repair shops and parts suppliers** with live Google Maps grounding
- **Compare spare parts pricing** (OEM vs. 3rd-party vs. Refurbished)
- **Review teardown complexity** and diagnostic triage

What device or repair question can I help you with today?`,
      timestamp: 'Just now',
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [isMapsGroundingEnabled, setIsMapsGroundingEnabled] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery('');
    setIsTyping(true);

    try {
      const serverHistory = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await GeminiService.sendChatMessage(
        serverHistory,
        selectedModel,
        isMapsGroundingEnabled
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: res.text || 'I analyzed your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: res.modelUsed || selectedModel,
        places: res.places || [],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: 'I had trouble connecting to the service. Please make sure the server is reachable and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content: 'Conversation history reset. How can I help you explore device repairability or find spare parts today?',
        timestamp: 'Just now',
        modelUsed: selectedModel,
      },
    ]);
  };

  const suggestionChips = [
    'How can I find authorised repair shops near me?',
    'Is replacing a cracked Galaxy S23 display worth ₹11,500?',
    'What is the difference between OEM and 3rd-party OLED screens?',
    'How do Nothing Phone 2 battery pull tabs work?',
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#DCE4DC] shadow-md flex flex-col h-[700px] overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-[#10382D] text-white p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#174C3C]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">RevTech AI Interactive Concierge</h3>
              <span className="text-[10px] font-semibold bg-emerald-900/60 text-emerald-200 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Multi-Turn
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              Answers depend on connected and verified data sources.
            </p>
          </div>
        </div>

        {/* Model Selector & Maps Grounding Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Model Switcher */}
          <div className="flex items-center bg-[#174C3C] p-1 rounded-xl border border-emerald-500/20">
            <button
              onClick={() => setSelectedModel('gemini-3.8-flash')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedModel === 'gemini-3.8-flash'
                  ? 'bg-emerald-500 text-[#10382D] font-bold shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
              title="General Tasks + Google Maps Grounding (Recommended)"
            >
              Flash 3.8 (Maps)
            </button>
            <button
              onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedModel === 'gemini-3.1-flash-lite'
                  ? 'bg-emerald-500 text-[#10382D] font-bold shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
              title="Ultra-fast light responses"
            >
              Lite 3.1
            </button>
            <button
              onClick={() => setSelectedModel('gemini-4-argon')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedModel === 'gemini-4-argon'
                  ? 'bg-emerald-500 text-[#10382D] font-bold shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
              title="Deep complex engineering analysis (Argon 4)"
            >
              Argon 4
            </button>
          </div>

          {/* Maps Grounding Toggle */}
          <button
            onClick={() => setIsMapsGroundingEnabled(!isMapsGroundingEnabled)}
            className={`p-1.5 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1 transition-all ${
              isMapsGroundingEnabled
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-400/40'
                : 'bg-white/10 text-stone-300 border-white/20'
            }`}
            title="Google Maps Grounding Toggle"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Maps Grounding: {isMapsGroundingEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F8FAF7]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 animate-fadeIn`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-[#78857D] px-1">
                {isUser ? (
                  <span>You</span>
                ) : (
                  <span className="flex items-center gap-1 font-semibold text-[#174C3C]">
                    <Bot className="w-3.5 h-3.5 text-[#23734D]" />
                    <span>RevTech AI ({msg.modelUsed || 'Gemini'})</span>
                  </span>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-2xs ${
                  isUser
                    ? 'bg-[#174C3C] text-white rounded-br-xs'
                    : 'bg-white text-[#1B2722] border border-[#DCE4DC] rounded-bl-xs'
                }`}
              >
                {msg.content}

                {/* Google Maps Grounding Links (MANDATORY REQUIREMENT) */}
                {msg.places && msg.places.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#DCE4DC] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#10382D]">
                      <MapPin className="w-3.5 h-3.5 text-[#23734D]" />
                      <span>Google Maps Grounded Places:</span>
                    </div>

                    <div className="space-y-2">
                      {msg.places.map((place, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-[#F0F5F1] border border-[#DCE4DC] flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#10382D] block">
                              {place.title}
                            </span>
                            {place.reviewSnippets && place.reviewSnippets.length > 0 && (
                              <p className="text-[11px] text-[#5D6B63] italic line-clamp-1 mt-0.5">
                                "{place.reviewSnippets[0]}"
                              </p>
                            )}
                          </div>

                          <a
                            href={place.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1 px-2.5 rounded-lg bg-[#174C3C] text-white text-[11px] font-semibold flex items-center gap-1 hover:bg-[#10382D] transition-colors flex-shrink-0"
                          >
                            <span>Open Map</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#5D6B63] bg-white p-3 rounded-2xl border border-[#DCE4DC] max-w-xs animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#23734D]" />
            <span>RevTech AI is researching & formulating answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 bg-[#EFF3EE] border-t border-[#DCE4DC] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className="text-[11px] font-bold text-[#78857D] whitespace-nowrap">Try asking:</span>
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-[#DCE9DF] text-[#174C3C] border border-[#DCE4DC] text-[11px] transition-colors shadow-2xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white border-t border-[#DCE4DC] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask anything about smartphone repairs, spare parts, or nearby repair shops..."
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC] text-xs sm:text-sm text-[#1B2722] focus:outline-hidden focus:border-[#23734D] focus:ring-2 focus:ring-[#23734D]/15"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="py-2.5 px-5 rounded-xl bg-[#174C3C] hover:bg-[#10382D] disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
