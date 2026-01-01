
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
      case 'Beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Intermediate': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Challenging': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  const getDifficultyIcon = (level: DifficultyLevel) => {
      // You can add distinct icons here if needed, for now using color
      return null;
  }

  return (
    <div className="flex flex-col items-center min-h-full py-10 px-4">
      
      {/* Context Tag */}
      <div className="mb-6">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-sky-50 text-sky-700 text-sm font-bold border border-sky-100">
           Practicing with {role.title} · {role.titleZh}
        </span>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Choose a Scenario</h2>
        <p className="text-slate-400 font-medium">选择一个练习情境</p>
      </div>

      <div className="w-full max-w-3xl space-y-5">
        {filteredScenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            onClick={() => onSelectScenario(scenario)}
            className="w-full flex bg-white border border-slate-200 rounded-3xl p-6 md:p-8 hover:border-slate-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group text-left relative overflow-hidden"
          >
            {/* Number Bubble */}
            <div className="shrink-0 mr-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 font-bold text-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-8">
               <div className="flex flex-wrap items-center gap-3 mb-2">
                   <h3 className="text-lg md:text-xl font-bold text-slate-900 truncate">{scenario.title}</h3>
                   {/* Difficulty Badge */}
                   <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold border ${getDifficultyColor(scenario.difficulty)} flex items-center gap-1`}>
                       {scenario.difficulty === 'Beginner' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                       {scenario.difficulty === 'Intermediate' && <div className="w-2 h-3 -skew-x-12 bg-amber-400" style={{width: '3px'}} />}
                       {scenario.difficulty === 'Challenging' && <Lightbulb className="w-3 h-3" />}
                       {scenario.difficulty}
                   </span>
               </div>
               
               <p className="text-slate-500 font-medium text-sm mb-3">{scenario.titleZh}</p>
               <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                   {scenario.description}
               </p>

               {/* Tags footer */}
               <div className="flex items-center gap-3 mt-auto">
                   <div className="flex items-center text-xs font-medium text-slate-500">
                      {scenario.mode === 'voice' ? <Mic className="w-3.5 h-3.5 mr-1.5" /> : <TextIcon className="w-3.5 h-3.5 mr-1.5" />}
                      {scenario.mode === 'voice' ? 'Voice' : 'Text'}
                   </div>
                   <div className="w-1 h-1 rounded-full bg-slate-300" />
                   {scenario.tags.map(tag => (
                       <span key={tag} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100">
                           {tag}
                       </span>
                   ))}
               </div>
            </div>

            {/* Action Icon */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
               <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-slate-900 transition-colors" />
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-12 bg-sky-50 border border-sky-100 text-sky-700 px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2">
         <Lightbulb className="w-4 h-4 text-sky-500 fill-current" />
         Tip: Start with beginner scenarios to build confidence, then progress to challenging ones.
      </div>
    </div>
  );
};

export default ScenarioSelector;
