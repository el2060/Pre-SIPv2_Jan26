
import React, { useState, useRef, useEffect } from 'react';
import { Send, Globe, Target, Info, Lightbulb, X, Sparkles, ClipboardCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Message, Scenario, Language } from '../types';
import Button from './Button';
import { getCoachingTip } from '../services/geminiService';

interface ChatPanelProps {
  scenario: Scenario;
  messages: Message[];
  isProcessing: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onSendMessage: (text: string, mode: 'text', language: Language) => void;
  onEndSession: () => void;
}

// Helper to format text with *actions* in italics
const FormattedText: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <p>
      {parts.map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          const content = part.slice(1, -1);
          return (
            <span 
              key={index} 
              className={`italic ${isUser ? 'text-slate-200' : 'text-slate-500'} text-[0.95em]`}
            >
              {content}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
};

const ChatPanel: React.FC<ChatPanelProps> = ({
  scenario,
  messages,
  isProcessing,
  language,
  onLanguageChange,
  onSendMessage,
  onEndSession
}) => {
  const [inputText, setInputText] = useState('');
  const [coachingTip, setCoachingTip] = useState<string | null>(null);
  const [isGettingTip, setIsGettingTip] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, coachingTip]);

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputText.trim() && !isProcessing) {
      onSendMessage(inputText, 'text', language);
      setInputText('');
      setCoachingTip(null); // Clear tip on send
    }
  };

  const handleOptionClick = (optionText: string) => {
    onSendMessage(optionText, 'selection', language);
    setCoachingTip(null);
  };

  const handleGetTip = async () => {
    if (isGettingTip) return;
    setIsGettingTip(true);
    try {
        const tip = await getCoachingTip(messages, scenario, language);
        setCoachingTip(tip);
    } catch (err) {
        console.error(err);
    } finally {
        setIsGettingTip(false);
    }
  };

  // Helper to parse the structured tip from Gemini
  const renderStructuredTip = (text: string) => {
    if (text.includes('Observation:') || text.includes('NEL Link:') || text.includes('Coach Tip:')) {
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        return (
            <div className="space-y-3 mt-1">
                {lines.map((line, idx) => {
                    const separatorIndex = line.indexOf(':');
                    if (separatorIndex > -1) {
                        const label = line.substring(0, separatorIndex).trim();
                        const content = line.substring(separatorIndex + 1).trim();
                        
                        let icon = null;
                        let labelColor = "text-amber-900";
                        let bgColor = "bg-transparent";

                        if (label.includes('Observation')) icon = "👀";
                        if (label.includes('NEL Link')) icon = "📘";
                        if (label.includes('Coach Tip')) {
                            icon = "💡";
                            bgColor = "bg-amber-100/50 p-2 rounded-lg -mx-2";
                        }

                        return (
                            <div key={idx} className={`flex flex-col gap-1 ${bgColor}`}>
                                <span className={`text-[11px] uppercase tracking-wider font-bold ${labelColor} flex items-center gap-1.5 opacity-70`}>
                                   {icon} {label}
                                </span>
                                <span className="text-slate-800 font-medium text-[15px] leading-snug">
                                    {content}
                                </span>
                            </div>
                        );
                    }
                    return <p key={idx} className="text-amber-900 text-sm">{line}</p>;
                })}
            </div>
        );
    }
    // Fallback for simple text
    return <p className="text-amber-900 text-base leading-relaxed font-medium">{text}</p>;
  };

  // Determine if we should show the "Stuck?" tooltip
  const showCoachMark = messages.filter(m => m.sender === 'user').length === 0 && !coachingTip;

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowHelp(false)}>
           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowHelp(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                    <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">How to use Practice Lab</h3>
              </div>
              
              <div className="space-y-5">
                 <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">1</div>
                    <div>
                        <h4 className="font-bold text-slate-900">Roleplay naturally</h4>
                        <p className="text-sm text-slate-500 mt-1">Chat as if you are the teacher. The AI character will react to your tone and words.</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-600">2</div>
                    <div>
                        <h4 className="font-bold text-slate-900">Get Coaching Tips</h4>
                        <p className="text-sm text-slate-500 mt-1">Stuck? Tap the <span className="inline-flex items-center justify-center bg-slate-100 rounded px-1.5 py-0.5 mx-1"><Lightbulb className="w-3 h-3 mr-1 text-amber-500"/> Bulb</span> icon for real-time advice based on the NEL framework.</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-600">3</div>
                    <div>
                        <h4 className="font-bold text-slate-900">Review your Score</h4>
                        <p className="text-sm text-slate-500 mt-1">When you feel the conversation is done, click <strong>"Finish & Review"</strong> to get your detailed performance scorecard.</p>
                    </div>
                 </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                 <Button onClick={() => setShowHelp(false)} fullWidth>Got it!</Button>
              </div>
           </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm h-20">
        <div className="flex flex-col justify-center">
           <h3 className="font-bold text-slate-900 text-base md:text-lg leading-tight">{scenario.title}</h3>
           <p className="text-sm text-slate-500 font-medium">{scenario.titleZh}</p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
             <button 
                onClick={() => setShowHelp(true)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                title="How to use"
             >
                <HelpCircle className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <Button 
                variant="primary" 
                size="sm" 
                onClick={onEndSession} 
                className="hidden lg:flex bg-slate-900 text-white hover:bg-slate-800 font-medium px-4 h-9 shadow-sm"
            >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Finish & Review
            </Button>
            
            {/* Mobile Finish Button (Icon only) */}
             <Button 
                variant="primary" 
                size="sm" 
                onClick={onEndSession} 
                className="lg:hidden bg-slate-900 text-white hover:bg-slate-800 font-medium w-9 h-9 p-0 flex items-center justify-center rounded-xl"
                title="Finish & Review"
            >
                <ClipboardCheck className="w-4 h-4" />
            </Button>

            <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 ml-1">
                <Globe className="w-4 h-4 text-slate-500 mx-2 hidden sm:block" />
                <button 
                    onClick={() => onLanguageChange('zh')}
                    className={`px-3 md:px-4 py-1.5 text-xs md:text-sm font-bold rounded-lg transition-all duration-200 ${
                        language === 'zh' 
                        ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-black/5' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    中文
                </button>
                <button 
                    onClick={() => onLanguageChange('en')}
                    className={`px-3 md:px-4 py-1.5 text-xs md:text-sm font-bold rounded-lg transition-all duration-200 ${
                        language === 'en' 
                        ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-black/5' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    EN
                </button>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pt-24 p-6 md:p-8 space-y-8 relative scroll-smooth" ref={scrollContainerRef}>
        
        {/* Mission Briefing Card */}
        <div className="w-full max-w-[90%] md:max-w-[75%] mx-auto mb-8 animate-fade-in-down">
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-[1.5rem] p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/50 rounded-bl-full -mr-4 -mt-4" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
                            <Target className="w-4 h-4" />
                        </div>
                        <span className="text-indigo-900 font-bold text-xs uppercase tracking-wider">
                            {language === 'en' ? 'Your Mission' : '任务目标'}
                        </span>
                    </div>
                    <p className="text-slate-800 text-lg leading-relaxed font-medium">
                        {language === 'en' ? scenario.context : (scenario.contextZh || scenario.context)}
                    </p>
                    <div className="mt-4 pt-4 border-t border-indigo-200/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-600">
                                {language === 'en' ? 'Focus: ' : '重点：'}
                                {scenario.tags.join(language === 'en' ? ', ' : '、')}
                            </span>
                         </div>
                         <div className="flex items-center gap-1.5 text-indigo-800 text-xs font-bold bg-white/50 px-3 py-1.5 rounded-lg border border-indigo-100/50">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {language === 'en' ? "Done? Click 'Finish & Review'" : "完成后点击 'Finish & Review'"}
                         </div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-center mt-6 mb-2">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] bg-white px-3 relative z-10">
                    Interaction Started
                </span>
                <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-100 -z-0"></div>
            </div>
        </div>

        {/* Message List */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col w-full ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className={`text-xs font-bold text-slate-400 mb-2 px-2 uppercase tracking-wide ${msg.sender === 'user' ? 'mr-1' : 'ml-1'}`}>
               {msg.sender === 'user' 
                  ? (language === 'en' ? 'YOU' : '你') 
                  : (scenario.roleId === 'children' 
                      ? (language === 'en' ? 'CHILD' : '孩子') 
                      : scenario.roleId === 'parents' 
                        ? (language === 'en' ? 'PARENT' : '家长') 
                        : (language === 'en' ? 'TEACHER' : '老师')
                    )
               }
            </span>

            <div
              className={`max-w-[90%] md:max-w-[75%] p-6 rounded-[1.5rem] text-[17px] md:text-[18px] leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-br-none'
                  : 'bg-white border-2 border-slate-100 text-slate-800 rounded-bl-none'
              }`}
            >
              <FormattedText text={msg.text} isUser={msg.sender === 'user'} />
            </div>
            
            {msg.options && msg.options.length > 0 && (
              <div className="mt-5 space-y-4 flex flex-col items-start w-full max-w-[90%] md:max-w-[75%] animate-fade-in-up">
                {msg.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    disabled={isProcessing}
                    className="w-full text-left p-5 text-base md:text-lg font-medium bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5 text-slate-700 transition-all duration-200"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start w-full animate-fade-in-up">
            <div className="bg-white border border-slate-200 px-6 py-5 rounded-[1.5rem] rounded-bl-none shadow-sm flex items-center gap-2">
              <span className="text-sm font-medium text-slate-400 mr-2">{language === 'en' ? 'Typing' : '正在输入'}</span>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 shrink-0 bg-white border-t border-slate-100 z-10 relative">
        
        {/* Mentor Tip Card (Slides up when active) */}
        {coachingTip && (
            <div className="absolute bottom-full left-0 right-0 p-4 md:p-6 pb-2 animate-fade-in-up z-20">
                <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border border-amber-200 rounded-2xl p-5 shadow-xl shadow-amber-100/50 flex items-start gap-4 relative ring-1 ring-amber-100">
                    <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
                         <div className="p-2 bg-amber-100 rounded-xl text-amber-600 shadow-sm">
                            <Lightbulb className="w-5 h-5 fill-current" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Mentor Feedback</h4>
                            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100 font-semibold">NIEC Aligned</span>
                        </div>
                        {renderStructuredTip(coachingTip)}
                    </div>
                    <button 
                        onClick={() => setCoachingTip(null)}
                        className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors -mr-2 -mt-2"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        )}

        <div className="max-w-4xl mx-auto relative"> {/* Added relative for tooltip positioning */}
          
          {/* New User Coach Mark / Tooltip */}
          {showCoachMark && (
             <div className="absolute -top-12 left-0 md:left-2 animate-bounce z-30 pointer-events-none">
                 <div className="bg-indigo-600 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                     <span>Stuck? Get a Hint!</span>
                     <div className="absolute -bottom-1 left-6 w-3 h-3 bg-indigo-600 rotate-45"></div>
                 </div>
             </div>
          )}

          <div className="flex items-end gap-3 md:gap-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-200 p-2 md:p-3 shadow-sm focus-within:ring-4 focus-within:ring-slate-100 transition-all">
            
            {/* Coach Me Button */}
            <Button
                variant="ghost"
                className={`h-12 w-12 md:h-14 md:w-14 rounded-2xl border border-slate-200 bg-white ${isGettingTip ? 'animate-pulse' : ''}`}
                onClick={handleGetTip}
                disabled={isProcessing || isGettingTip}
                title="Get Coaching Tip"
            >
                {isGettingTip ? <Sparkles className="w-5 h-5 text-indigo-500" /> : <Lightbulb className="w-5 h-5 text-amber-500" />}
            </Button>

            <form className="flex-1 flex gap-2 md:gap-3 items-end" onSubmit={handleTextSubmit}>
              <textarea
                rows={1}
                className="flex-1 bg-transparent text-slate-900 text-base md:text-lg placeholder:text-slate-400 resize-none py-3 px-4 outline-none"
                placeholder={language === 'en' ? "Type your response..." : "用中文输入你的回应..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isProcessing}
                style={{ minHeight: '52px' }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleTextSubmit();
                    }
                }}
              />
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className={`h-12 w-12 md:h-14 md:w-14 rounded-2xl border-none transition-all duration-300 ${inputText.trim() ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-400'}`}
                disabled={!inputText.trim() || isProcessing}
              >
                <Send className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </form>
          </div>
          <div className="text-center mt-4">
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 flex items-center justify-center gap-2 inline-flex">
                  <span>NEL Framework Active</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-indigo-500 flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors" onClick={handleGetTip}>
                      Tap <Lightbulb className="w-3 h-3 fill-current" /> for hints
                  </span>
              </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
