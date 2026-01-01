
import React, { useState, useRef, useEffect } from 'react';
import { Send, Globe, MessageSquare, Target, Info } from 'lucide-react';
import { Message, Scenario, Language } from '../types';
import Button from './Button';

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
  // Split by asterisks: "Hello *smiles*" -> ["Hello ", "*smiles*", ""]
  const parts = text.split(/(\*[^*]+\*)/g);

  return (
    <p>
      {parts.map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          // Remove asterisks and style
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputText.trim() && !isProcessing) {
      onSendMessage(inputText, 'text', language);
      setInputText('');
    }
  };

  const handleOptionClick = (optionText: string) => {
    onSendMessage(optionText, 'selection', language);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* Chat Header with Language Toggle */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm h-20">
        <div className="flex flex-col justify-center">
           <h3 className="font-bold text-slate-900 text-base md:text-lg leading-tight">{scenario.title}</h3>
           <p className="text-sm text-slate-500 font-medium">{scenario.titleZh}</p>
        </div>
        
        <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onEndSession} className="hidden lg:flex bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-4 h-9">
                End Session
            </Button>
            <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <Globe className="w-4 h-4 text-slate-500 mx-2 hidden sm:block" />
                <button 
                    onClick={() => onLanguageChange('zh')}
                    className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                        language === 'zh' 
                        ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-black/5' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    中文
                </button>
                <button 
                    onClick={() => onLanguageChange('en')}
                    className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                        language === 'en' 
                        ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-black/5' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    English
                </button>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pt-24 p-6 md:p-8 space-y-8 relative scroll-smooth" ref={scrollContainerRef}>
        
        {/* Mission Briefing Card - Always Visible */}
        <div className="w-full max-w-[90%] md:max-w-[75%] mx-auto mb-8 animate-fade-in-down">
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-[1.5rem] p-6 shadow-sm relative overflow-hidden">
                {/* Decorative background element */}
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
                    
                    <div className="mt-4 pt-4 border-t border-indigo-200/30 flex items-center gap-2">
                         <Info className="w-4 h-4 text-indigo-400" />
                         <span className="text-sm font-semibold text-indigo-600">
                             {language === 'en' ? 'Tip: Focus on ' : '提示：关注 '}
                             {scenario.tags.join(language === 'en' ? ', ' : '、')}
                         </span>
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
            {/* Sender Name */}
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
            
            {/* Render Options if available (MCQ) */}
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
      <div className="p-4 md:p-6 shrink-0 bg-white border-t border-slate-100 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3 md:gap-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-200 p-2 md:p-3 shadow-sm focus-within:ring-4 focus-within:ring-slate-100 transition-all">
            
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
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                  NEL Framework Active · {scenario.roleId === 'children' ? 'Focus on Positive Guidance' : 'Focus on Professional Communication'}
              </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
