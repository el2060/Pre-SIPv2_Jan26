
import React from 'react';
import { ChevronRight, MessageSquare, Mic, Text as TextIcon, Lightbulb } from 'lucide-react';
import { Role, Scenario, DifficultyLevel } from '../types';
import { SCENARIOS } from '../constants';

interface ScenarioSelectorProps {
  role: Role;
  onSelectScenario: (scenario: Scenario) => void;
  onBack: () => void;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ role, onSelectScenario }) => {
  const filteredScenarios = SCENARIOS.filter(s => s.roleId === role.id);

  const getDifficultyColor = (level: DifficultyLevel) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Challenging': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="flex flex-col items-center min-h-full py-12 px-4 md:px-6">
      
      {/* Context Tag */}
      <div className="mb-8">
        <span className="inline-flex items-center px-5 py-2 rounded-full bg-white shadow-sm text-sky-700 text-sm md:text-base font-bold border border-slate-200">
           Practicing with {role.title} · {role.titleZh}
        </span>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Choose a Scenario</h2>
        <p className="text-lg md:text-xl text-slate-500 font-medium">选择一个练习情境</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {filteredScenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            onClick={() => onSelectScenario(scenario)}
            className="w-full flex flex-col md:flex-row bg-white border-2 border-slate-100 rounded-[2rem] p-6 md:p-8 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group text-left relative overflow-hidden"
          >
            {/* Number Bubble & Top Row Mobile */}
            <div className="flex items-start justify-between w-full md:w-auto md:block mb-4 md:mb-0 md:mr-8 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                </div>
                {/* Mobile Chevron */}
                <ChevronRight className="w-6 h-6 text-slate-300 md:hidden" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 md:pr-12">
               <div className="flex flex-wrap items-center gap-3 mb-3">
                   <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{scenario.title}</h3>
                   {/* Difficulty Badge */}
                   <span className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider ${getDifficultyColor(scenario.difficulty)} flex items-center gap-1.5`}>
                       {scenario.difficulty === 'Beginner' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                       {scenario.difficulty === 'Intermediate' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                       {scenario.difficulty === 'Challenging' && <Lightbulb className="w-3 h-3" />}
                       {scenario.difficulty}
                   </span>
               </div>
               
               <p className="text-slate-500 font-semibold text-base mb-4">{scenario.titleZh}</p>
               <p className="text-slate-600 leading-relaxed mb-6 text-base md:text-lg">
                   {scenario.description}
               </p>

               {/* Tags footer */}
               <div className="flex flex-wrap items-center gap-3 mt-auto">
                   <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200">
                      {scenario.mode === 'voice' ? <Mic className="w-4 h-4 mr-2 text-indigo-500" /> : <TextIcon className="w-4 h-4 mr-2 text-indigo-500" />}
                      {scenario.mode === 'voice' ? 'Voice Interaction' : 'Text Interaction'}
                   </div>
                   {scenario.tags.map(tag => (
                       <span key={tag} className="text-sm bg-orange-50 text-orange-800 px-3 py-1.5 rounded-lg border border-orange-100 font-medium">
                           {tag}
                       </span>
                   ))}
               </div>
            </div>

            {/* Desktop Action Icon */}
            <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 bg-slate-50 p-2 rounded-full group-hover:bg-indigo-600 transition-colors duration-300">
               <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-16 bg-sky-50 border border-sky-100 text-sky-800 px-8 py-4 rounded-2xl text-base font-medium flex items-center gap-3 max-w-2xl text-center md:text-left shadow-sm">
         <Lightbulb className="w-6 h-6 text-sky-600 fill-current shrink-0" />
         Tip: Start with beginner scenarios to build confidence, then progress to challenging ones.
      </div>
    </div>
  );
};

export default ScenarioSelector;
