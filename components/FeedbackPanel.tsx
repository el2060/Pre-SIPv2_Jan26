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
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
        <h3 className="text-xl font-bold text-slate-900">Evaluating Performance...</h3>
        <p className="text-slate-500 mt-2">Checking against NEL Framework & Chinese Proficiency.</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="max-w-3xl mx-auto w-full p-6 space-y-8">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Session Review</h2>
          <p className="text-slate-500">Performance Analysis</p>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chinese Proficiency */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-indigo-900">Chinese Proficiency</h3>
            </div>
            <div className="text-3xl font-bold text-indigo-700 mb-2">{data.languageProficiency.score}/100</div>
            <p className="text-sm text-indigo-800 leading-relaxed">{data.languageProficiency.comment}</p>
          </div>

          {/* NEL Alignment */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-amber-900">NEL Framework</h3>
            </div>
            <div className="text-3xl font-bold text-amber-700 mb-2">{data.nelAlignment.score}/5</div>
            <p className="text-sm text-amber-800 leading-relaxed">{data.nelAlignment.comment}</p>
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-bold text-slate-900">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-emerald-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-slate-900">Areas for Growth</h3>
          </div>
          <ul className="space-y-3">
            {data.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-amber-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 pb-12 text-center">
          <Button onClick={onReset} size="lg" className="min-w-[200px]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Start New Practice
          </Button>
        </div>

      </div>
    </div>
  );
};

export default FeedbackPanel;