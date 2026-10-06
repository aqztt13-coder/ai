import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2, 
  Search, 
  Globe2, 
  ExternalLink, 
  Compass, 
  RotateCcw,
  Zap,
  BookOpen
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  sources?: { title: string; url: string }[];
  searchQueries?: string[];
  modelUsed?: string;
  grounded?: boolean;
}

interface AiChatbotProps {
  initialPrompt?: string;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({ 
  initialPrompt: propInitialPrompt, 
  isOpenExternal, 
  onCloseExternal 
}) => {
  const { language, isAiChatOpen, setIsAiChatOpen, aiChatInitialPrompt } = useApp();
  const isAr = language === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Sync with context
  useEffect(() => {
    if (isAiChatOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      if (aiChatInitialPrompt) {
        setInput(aiChatInitialPrompt);
      }
    }
  }, [isAiChatOpen, aiChatInitialPrompt]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: isAr
        ? 'مرحباً بك! أنا «مرشد الرافدين» الذكي المدعوم بـ Gemini والبحث المباشر عبر Google. كيف يمكنني مساعدتك في التخطيط لرحلتك أو الإجابة عن معالم العراق وتاريخها؟'
        : 'Welcome! I am the Mesopotamian AI Tourism Guide powered by Gemini and real-time Google Search. How can I assist you with visiting Iraq, planning itineraries, or discovering ancient heritage?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'guide' | 'planner' | 'archaeologist'>('guide');
  const [enableSearch, setEnableSearch] = useState(true);
  const [selectedModel, setSelectedModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-2.5-flash-lite'>('gemini-2.5-flash');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync external open triggers
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  useEffect(() => {
    if (propInitialPrompt && isOpen) {
      setInput(propInitialPrompt);
    }
  }, [propInitialPrompt, isOpen]);

  // Auto-scroll to bottom of thread
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  const quickPrompts = isAr
    ? [
        'اقترح لي خطة لزيارة بغداد في يومين',
        'ما هي مواعيد وأسعار زيارة زقورة أور حالياً؟',
        'أفضل وقت لزيارة أهوار الجبايش وتجربة المشحوف',
        'آداب وقواعد زيارة الروضة الحيدرية والحسينية',
      ]
    : [
        'Suggest a 2-day heritage tour in Baghdad',
        'Current ticket prices and hours for Ziggurat of Ur',
        'Best season to visit the Chibayish Marshes',
        'Visitor etiquette for holy shrines in Iraq',
      ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for multi-turn chat
      const history = [...messages, userMessage].map(m => ({
        role: m.role,
        text: m.text,
      }));

      // Call server endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          enableSearch,
          modelName: selectedModel,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
        searchQueries: data.searchQueries || [],
        modelUsed: data.modelUsed,
        grounded: data.grounded,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chatbot error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: isAr
          ? `عذراً، حدث خطأ أثناء الاتصال بالمرشد الذكي (${err.message || 'يرجى المحاولة ثانية'}).`
          : `Sorry, an error occurred while connecting to the AI guide (${err.message || 'please retry'}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: isAr
          ? 'تم بدء جلسة محادثة جديدة. كيف يمكنني خدمتك اليوم؟'
          : 'Started a fresh conversation session. How can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsAiChatOpen(false);
    if (onCloseExternal) onCloseExternal();
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-20 lg:bottom-6 ${isAr ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} z-40 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-transform hover:scale-105 border border-amber-400/50 group select-none`}
          aria-label={isAr ? 'المرشد السياحي الذكي' : 'AI Tourist Guide'}
        >
          <div className="relative">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-stone-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="hidden sm:inline text-xs font-bold tracking-tight">
            {isAr ? 'مرشد الرافدين الذكي (Gemini)' : 'Mesopotamia AI Guide'}
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed z-50 ${isAr ? 'left-2 sm:left-6' : 'right-2 sm:right-6'} bottom-20 lg:bottom-6 w-[95vw] sm:w-[440px] max-w-[460px] bg-white rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[620px] max-h-[82vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-amber-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 shadow-md">
                <Bot className="w-4 h-4 text-stone-950" />
              </div>
              <div>
                <h3 className="font-heritage text-sm sm:text-base font-bold text-amber-100 flex items-center gap-1.5">
                  <span>{isAr ? 'مرشد الرافدين الذكي' : 'Mesopotamia AI Guide'}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-sans font-medium">
                    {selectedModel.replace('gemini-', '')}
                  </span>
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-stone-400">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{isAr ? 'Gemini 2.5 + بحث Google المباشر' : 'Gemini 2.5 + Live Google Search'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-stone-400">
              <button
                onClick={handleResetChat}
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition"
                title={isAr ? 'بدء محادثة جديدة' : 'Reset chat'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Role & Model Selector Toolbar */}
              <div className="bg-stone-50 border-b border-stone-200 px-3 py-2 flex items-center justify-between text-xs gap-2">
                {/* Role Switcher */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-stone-500 font-medium">
                    {isAr ? 'الدور:' : 'Role:'}
                  </span>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="bg-white border border-stone-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-stone-700 focus:outline-none"
                  >
                    <option value="guide">{isAr ? 'مرشد عام' : 'General Guide'}</option>
                    <option value="planner">{isAr ? 'مخطط رحلات' : 'Trip Planner'}</option>
                    <option value="archaeologist">{isAr ? 'خبير آثار' : 'Archaeologist'}</option>
                  </select>
                </div>

                {/* Search Grounding toggle */}
                <button
                  onClick={() => setEnableSearch(!enableSearch)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    enableSearch
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                  title={isAr ? 'تفعيل البحث المباشر في Google للحصول على أحدث المعلومات' : 'Toggle Google Search grounding'}
                >
                  <Globe2 className="w-3 h-3 text-emerald-600" />
                  <span>{enableSearch ? (isAr ? 'بحث Google نشط' : 'Search ON') : (isAr ? 'بحث معطل' : 'Search OFF')}</span>
                </button>

                {/* Model switcher */}
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value as any)}
                  className="bg-white border border-stone-200 rounded-lg px-1.5 py-1 text-[10px] text-stone-600 focus:outline-none"
                >
                  <option value="gemini-2.5-flash">2.5 Flash</option>
                  <option value="gemini-2.5-pro">2.5 Pro (Deep)</option>
                  <option value="gemini-2.5-flash-lite">2.5 Lite (Fast)</option>
                </select>
              </div>

              {/* Scrollable Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-amber-600 text-white rounded-br-none shadow-sm'
                          : 'bg-stone-100 text-stone-900 rounded-bl-none border border-stone-200/80 shadow-sm'
                      }`}
                    >
                      {/* Text content with whitespace preservation */}
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {/* Google Search Grounding Sources / Citations */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-stone-200/60 text-[11px] space-y-1">
                          <div className="flex items-center gap-1 text-emerald-700 font-bold">
                            <Globe2 className="w-3 h-3" />
                            <span>{isAr ? 'المصادر الموثقة من بحث Google:' : 'Grounded Sources from Google:'}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.map((src, i) => (
                              <a
                                key={i}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-emerald-200 rounded-md text-[10px] text-emerald-900 hover:bg-emerald-50 transition"
                              >
                                <span className="truncate max-w-[150px]">{src.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-stone-400 text-xs py-2">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-100"></span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-200"></span>
                      <span className="text-[11px] text-stone-500 mr-2">
                        {enableSearch 
                          ? (isAr ? 'جاري البحث في Google وتجهيز الإجابة...' : 'Searching Google & generating...')
                          : (isAr ? 'جاري الصياغة...' : 'Thinking...')}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel if message count is low */}
              {messages.length <= 2 && (
                <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto text-[11px]">
                  {quickPrompts.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-600 rounded-full border border-stone-200 shrink-0 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-stone-200 bg-white">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={isAr ? 'اسأل عن أي معلم، خطة رحلة، أو تاريخ...' : 'Ask about any place, itinerary, or history...'}
                    className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-amber-600 transition"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-2xl transition shadow-sm shrink-0"
                  >
                    <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
