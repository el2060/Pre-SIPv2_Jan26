
import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Activity, Globe, MessageSquare } from 'lucide-react';
import { Message, Scenario, Language } from '../types';
import Button from './Button';
import VoiceControls from './VoiceControls';

interface ChatPanelProps {
  scenario: Scenario;
  messages: Message[];
  isProcessing: boolean;
  onSendMessage: (text: string, mode: 'text' | 'voice', language: Language) => void;
  onEndSession: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  scenario,
  messages,
  isProcessing,
  onSendMessage,
  onEndSession
}) => {
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<Language>('en'); // Default to English
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

  const handleVoiceComplete = () => {
    onSendMessage(language === 'en' ? "[Voice Input Recorded]" : "[语音输入已记录]", 'voice', language);
  };

  const handleOptionClick = (optionText: string) => {
    onSendMessage(optionText, 'selection', language);
  };

  const isVoiceMode = scenario.mode === 'voice';

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* Chat Header with Language Toggle */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between bg-white/90 backdrop-blur-sm border-b border-slate-50">
        <div>
           <h3 className="font-bold text-slate-800 text-sm md:text-base">{scenario.title}</h3>
           <p className="text-xs text-slate-500">{scenario.titleZh}</p>
        </div>
        
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <Globe className="w-4 h-4 text-slate-400 mx-2" />
            <button 
                onClick={() => setLanguage('zh')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                    language === 'zh' 
                    ? 'bg-white shadow-sm text-slate-900' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                中文
            </button>
            <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                    language === 'en' 
                    ? 'bg-teal-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                English
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pt-20 p-6 space-y-8 relative" ref={scrollContainerRef}>
        
        {/* Empty State / Initial View */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in-up">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 text-sky-600">
               {isVoiceMode ? <Activity className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
                {language === 'en' ? 'Start Chatting' : '开始对话'}
            </h2>
            <p className="text-slate-400 mb-8">
                {language === 'en' ? 'Type your response in English' : '输入你的中文回应'}
            </p>
            
            <div className="bg-slate-50 px-8 py-6 rounded-3xl max-w-lg border border-slate-100">
               <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scenario: {scenario.title}</span>
               <p className="text-slate-600 leading-relaxed text-sm">
                 {scenario.context}
               </p>
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col w-full ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender Name */}
            <span className={`text-[10px] font-bold text-slate-400 mb-1 px-1 ${msg.sender === 'user' ? 'mr-1' : 'ml-1'}`}>
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
              className={`max-w-[85%] md:max-w-[70%] p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-br-sm'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
              }`}
            >
              <p>{msg.text}</p>
              {msg.mode === 'voice' && (
                <div className="mt-3 flex items-center gap-1.5 text-xs opacity-80 pt-3 border-t border-white/20">
                   <Activity className="w-3 h-3" /> 
                   {language === 'en' ? 'Transcribed from voice' : '语音转文字'}
                </div>
              )}
            </div>
            
            {/* Render Options if available (MCQ) */}
            {msg.options && msg.options.length > 0 && (
              <div className="mt-4 space-y-3 flex flex-col items-start w-full max-w-[85%] md:max-w-[70%] animate-fade-in-up">
                {msg.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    disabled={isProcessing}
                    className="w-full text-left p-4 text-sm font-medium bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 text-slate-700 transition-all duration-200"
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
            <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-400 mr-2">{language === 'en' ? 'Typing' : '正在输入'}</span>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 shrink-0 bg-white border-t border-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3 bg-white rounded-2xl border border-slate-200 p-2 shadow-sm focus-within:ring-2 focus-within:ring-slate-200 transition-all">
            <VoiceControls onRecordingComplete={handleVoiceComplete} disabled={isProcessing} />
            
            <form className="flex-1 flex gap-2" onSubmit={handleTextSubmit}>
              <textarea
                rows={1}
                className="flex-1 bg-transparent text-slate-900 text-sm placeholder:text-slate-400 resize-none py-3 px-2 outline-none"
                placeholder={language === 'en' ? "Type your response..." : "用中文输入你的回应..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isProcessing}
                style={{ minHeight: '44px' }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleTextSubmit();
                    }
                }}
              />
              <Button type="submit" variant="primary" size="md" className="h-10 w-10 p-0 rounded-xl bg-orange-400 hover:bg-orange-500 border-none" disabled={!inputText.trim() || isProcessing}>
                <Send className="w-4 h-4 text-white" />
              </Button>
            </form>
          </div>
          <div className="text-center mt-3">
              <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">
                  NEL Framework Active · {scenario.roleId === 'children' ? 'Focus on Positive Guidance' : 'Focus on Professional Communication'}
              </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
