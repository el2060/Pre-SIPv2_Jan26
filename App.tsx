
import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, LayoutTemplate } from 'lucide-react';
import { AppStage, Role, Scenario, Message, FeedbackData, Language } from './types';
import RoleSelector from './components/RoleSelector';
import ScenarioSelector from './components/ScenarioSelector';
import ChatPanel from './components/ChatPanel';
import FeedbackPanel from './components/FeedbackPanel';
import { callGeminiText, callGeminiVoice, generateFeedback } from './services/geminiService';

const App: React.FC = () => {
  // State Machine
  const [stage, setStage] = useState<AppStage>(AppStage.ROLE_SELECTION);
  
  // Data State
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  
  // UI State
  const [isProcessing, setIsProcessing] = useState(false);

  // Navigation Handlers
  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setStage(AppStage.SCENARIO_SELECTION);
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setMessages([]); // Reset chat
    
    // Check if scenario has options (like T1 VSLD scenario)
    let initialOptions: string[] | undefined = undefined;
    if (scenario.id === 't1') {
       initialOptions = [
         "A: Tell him to stop crying and build it again.",
         "B: Acknowledge his frustration: 'It is frustrating when it falls. Let's see why.'",
         "C: Build it for him so he feels successful."
       ];
    }

    // Only add initial message if the scenario has one defined
    if (scenario.initialMessage || initialOptions) {
        const initialText = scenario.initialMessage || scenario.context;
        const initialMsg: Message = {
        id: 'init-1',
        sender: 'ai',
        text: initialText,
        mode: 'text',
        options: initialOptions,
        timestamp: Date.now()
        };
        setMessages([initialMsg]);
    }
    
    setStage(AppStage.INTERACTION);
  };

  const handleBack = () => {
    if (stage === AppStage.SCENARIO_SELECTION) {
      setSelectedRole(null);
      setStage(AppStage.ROLE_SELECTION);
    } else if (stage === AppStage.INTERACTION) {
      setStage(AppStage.SCENARIO_SELECTION);
    } else if (stage === AppStage.FEEDBACK) {
      setStage(AppStage.SCENARIO_SELECTION);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setFeedback(null);
    setSelectedScenario(null);
    setSelectedRole(null);
    setStage(AppStage.ROLE_SELECTION);
  };

  // Interaction Logic
  const handleSendMessage = async (text: string, mode: 'text' | 'voice' | 'selection', language: Language) => {
    if (!selectedScenario) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      mode: mode,
      timestamp: Date.now()
    };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsProcessing(true);

    try {
      // 2. Route to appropriate Gemini Service
      let responseData: { text: string; options?: string[] } = { text: '' };
      
      if (mode === 'voice') {
        const voiceText = await callGeminiVoice(updatedHistory, selectedScenario, language);
        responseData = { text: voiceText };
      } else {
        responseData = await callGeminiText(text, updatedHistory, selectedScenario, language);
      }

      // 3. Add AI Response
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseData.text,
        options: responseData.options,
        mode: mode === 'selection' ? 'text' : mode, 
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error("Gemini Service Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: language === 'en' ? "System: Connection interruption. Please try again." : "系统：连接中断，请重试。",
        mode: 'text',
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndSession = async () => {
    if (!selectedScenario) return;
    setStage(AppStage.FEEDBACK);
    setIsProcessing(true);
    
    try {
      const feedbackData = await generateFeedback(messages, selectedScenario);
      setFeedback(feedbackData);
    } catch (error) {
      console.error("Feedback generation error", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to render steps
  const renderStep = (num: number, label: string, currentStage: AppStage) => {
    let isActive = false;
    let isCompleted = false;

    // Determine state based on stage enum
    if (num === 1) { // Role
        isActive = currentStage === AppStage.ROLE_SELECTION;
        isCompleted = currentStage !== AppStage.ROLE_SELECTION;
    } else if (num === 2) { // Scenario
        isActive = currentStage === AppStage.SCENARIO_SELECTION;
        isCompleted = currentStage === AppStage.INTERACTION || currentStage === AppStage.FEEDBACK;
    } else if (num === 3) { // Interaction
        isActive = currentStage === AppStage.INTERACTION;
        isCompleted = currentStage === AppStage.FEEDBACK;
    } else if (num === 4) { // Feedback
        isActive = currentStage === AppStage.FEEDBACK;
    }

    return (
        <div className="flex items-center">
            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-colors duration-300 shadow-sm
                ${isActive ? 'bg-orange-500 text-white shadow-orange-200' : isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}
            `}>
                {num}
            </div>
            <span className={`hidden sm:block ml-3 text-base font-medium ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                {label}
            </span>
            {num < 4 && (
                <div className={`w-12 h-1 mx-4 rounded-full hidden sm:block ${isCompleted ? 'bg-emerald-200' : 'bg-slate-100'}`} />
            )}
        </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white font-sans text-slate-900">
      
      {/* 1. Header Bar */}
      <header className="h-18 md:h-20 px-4 md:px-8 flex items-center justify-between shrink-0 border-b border-slate-100 bg-white shadow-sm z-20">
        <div className="flex items-center w-24 md:w-64">
           {stage !== AppStage.ROLE_SELECTION && (
            <button onClick={handleBack} className="flex items-center justify-center p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all text-base font-medium">
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="hidden md:inline">Back</span>
            </button>
           )}
        </div>
        
        <div className="flex items-center gap-4 justify-center flex-1">
            {/* Logo */}
            <img 
                src="https://www.moe.gov.sg/-/media/images/school-logos/post-secondary/ngee-ann-polytechnic.jpg?h=353&iar=0&w=1274&hash=6B4291318EB64CB0CD402B37031220D8" 
                alt="Ngee Ann Polytechnic" 
                className="h-8 md:h-12 w-auto object-contain"
            />
            <div className="text-left border-l-2 border-slate-200 pl-4 py-1 hidden lg:block">
                <h1 className="text-lg font-bold text-slate-900 leading-none">Pre-SIP Practice Lab</h1>
                <p className="text-xs text-slate-500 mt-1 tracking-wide font-medium">实习前沟通练习 · NEL Framework</p>
            </div>
        </div>

        <div className="flex items-center justify-end w-24 md:w-64 gap-2">
            <div className="hidden xl:flex items-center px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <LayoutTemplate className="w-4 h-4 text-slate-400 mr-2" />
                <span className="text-xs text-slate-500 font-medium">v2.1</span>
            </div>
            {stage !== AppStage.ROLE_SELECTION && (
                <button 
                  onClick={handleRestart} 
                  className="flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  title="Restart Session"
                >
                  <RefreshCw className="w-5 h-5 md:mr-2" />
                  <span className="hidden md:inline font-medium">Restart</span>
                </button>
            )}
        </div>
      </header>

      {/* 2. Progress Bar - Scrollable on mobile */}
      <div className="h-16 border-b border-slate-50 bg-white flex items-center justify-center px-4 overflow-x-auto shrink-0 no-scrollbar">
         <div className="flex items-center min-w-max px-2">
            {renderStep(1, "Role", stage)}
            {renderStep(2, "Scenario", stage)}
            {renderStep(3, "Interaction", stage)}
            {renderStep(4, "Feedback", stage)}
         </div>
      </div>

      {/* 3. Main Content */}
      <main className="flex-1 overflow-hidden relative bg-slate-50/30">
        {isProcessing && (
           <div className="absolute top-0 left-0 w-full z-50">
             <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-subtle-progress" />
           </div>
        )}

        <div className="relative z-10 h-full w-full overflow-y-auto">
          {stage === AppStage.ROLE_SELECTION && (
            <RoleSelector onSelectRole={handleSelectRole} />
          )}

          {stage === AppStage.SCENARIO_SELECTION && selectedRole && (
            <ScenarioSelector 
              role={selectedRole} 
              onSelectScenario={handleSelectScenario}
              onBack={handleBack}
            />
          )}

          {stage === AppStage.INTERACTION && selectedScenario && (
            <div className="h-full w-full max-w-5xl mx-auto bg-white shadow-xl shadow-slate-200/50 border-x border-slate-100">
               <ChatPanel 
                scenario={selectedScenario}
                messages={messages}
                isProcessing={isProcessing}
                onSendMessage={handleSendMessage}
                onEndSession={handleEndSession}
              />
            </div>
          )}

          {stage === AppStage.FEEDBACK && (
            <div className="h-full w-full max-w-5xl mx-auto bg-white shadow-xl shadow-slate-200/50 border-x border-slate-100">
               <FeedbackPanel 
                 data={feedback} 
                 isLoading={isProcessing}
                 onReset={handleRestart}
               />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
