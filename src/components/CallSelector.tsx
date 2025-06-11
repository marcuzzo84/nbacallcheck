import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CallData } from '../lib/supabase';
import { getCallTypeColor } from '../data/callTypes';

interface CallSelectorProps {
  calls: CallData[];
  currentIndex: number;
  onCallChange: (index: number) => void;
}

const CallSelector: React.FC<CallSelectorProps> = ({ calls, currentIndex, onCallChange }) => {
  const currentCall = calls[currentIndex];
  
  const getSeverity = (type: string): string => {
    if (type.includes('Technical') || type.includes('Flagrant')) return 'major';
    if (type.includes('Personal') || type.includes('Offensive') || type.includes('Charging')) return 'moderate';
    return 'minor';
  };

  const severity = getSeverity(currentCall.type);
  const colorClasses = getCallTypeColor(severity);

  return (
    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 mb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onCallChange(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-300" />
        </button>

        <div className="flex-1 mx-4 text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClasses.replace('bg-', 'bg-opacity-20 bg-')}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${colorClasses.split(' ')[1]}`} />
            {currentCall.type}
          </div>
          <div className="text-slate-400 text-xs mt-1">
            Call {currentIndex + 1} of {calls.length} • {currentCall.timestamp}
          </div>
        </div>

        <button
          onClick={() => onCallChange(Math.min(calls.length - 1, currentIndex + 1))}
          disabled={currentIndex === calls.length - 1}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </div>
  );
};

export default CallSelector;