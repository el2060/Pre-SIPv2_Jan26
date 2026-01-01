
import React from 'react';
import { CheckCircle, Lightbulb, PenTool, RefreshCw, BookOpen, Languages } from 'lucide-react';
import { FeedbackData } from '../types';
import Button from './Button';

interface FeedbackPanelProps {
  data: FeedbackData | null;
  isLoading: boolean;
  onReset: () => void;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ data, isLoading, onReset }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
        <h3 className="text-2xl font-bold text-slate-900">Evaluating Performance...</h3>
        <p className="text-lg text-slate-500 mt-2">Checking against NEL Framework & Chinese Proficiency.</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50/50">
      <div className="max-w-4xl mx-auto w-full p-6 md:p-10 space-y-8">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Session Review</h2>
          <p className="text-lg text-slate-500 font-medium">Performance Analysis</p>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chinese Proficiency */}
          <div className="bg-white border border-indigo-100 rounded-[2rem] p-8 shadow-xl shadow-indigo-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                 <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-indigo-900">Chinese Proficiency</h3>
            </div>
            <div className="flex items-baseline gap-2 mb-4 relative z-10">
                <span className="text-5xl md:text-6xl font-bold text-indigo-600 tracking-tight">{data.languageProficiency.score}</span>
                <span className="text-xl text-indigo-300 font-medium">/100</span>
            </div>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">{data.languageProficiency.comment}</p>
          </div>

          {/* NEL Alignment */}
          <div className="bg-white border border-amber-100 rounded-[2rem] p-8 shadow-xl shadow-amber-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 opacity-50" />
             <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                 <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-amber-900">NEL Framework</h3>
            </div>
            <div className="flex items-baseline gap-2 mb-4 relative z-10">
                <span className="text-5xl md:text-6xl font-bold text-amber-500 tracking-tight">{data.nelAlignment.score}</span>
                <span className="text-xl text-amber-300 font-medium">/5</span>
            </div>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">{data.nelAlignment.comment}</p>
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
               <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Strengths</h3>
          </div>
          <ul className="space-y-4">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-4 text-slate-700 text-lg">
                <span className="block w-2 h-2 mt-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Areas for Growth</h3>
          </div>
          <ul className="space-y-4">
            {data.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-4 text-slate-700 text-lg">
                <span className="block w-2 h-2 mt-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-8 pb-12 text-center">
          <Button 
            onClick={onReset} 
            size="lg" 
            className="h-16 px-10 rounded-2xl text-lg font-bold bg-slate-900 hover:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <RefreshCw className="w-5 h-5 mr-3" />
            Start New Practice
          </Button>
        </div>

      </div>
    </div>
  );
};

export default FeedbackPanel;
