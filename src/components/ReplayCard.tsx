import React from 'react';
import { Play, Clock } from 'lucide-react';

interface ReplayCardProps {
  type: string;
  description: string;
  confidence: number;
  timestamp: string;
  players: {
    fouler: string;
    victim: string;
  };
}

const ReplayCard: React.FC<ReplayCardProps> = ({
  type,
  description,
  confidence,
  timestamp,
  players
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBackground = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-lg">{type}</h2>
        <div className="flex items-center text-slate-400 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {timestamp}
        </div>
      </div>
      
      {/* Mock Video Placeholder */}
      <div className="relative bg-slate-900 rounded-lg mb-4 h-32 flex items-center justify-center border border-slate-600">
        <div className="text-center">
          <Play className="w-8 h-8 text-white mx-auto mb-2" />
          <div className="text-slate-400 text-sm">
            {players.fouler} vs {players.victim}
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
          LIVE
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center justify-between">
        <div className="text-slate-400 text-sm">
          AI Confidence Score
        </div>
        <div className="flex items-center">
          <div className="w-20 bg-slate-700 rounded-full h-2 mr-3">
            <div 
              className={`h-2 rounded-full ${getConfidenceBackground(confidence)}`}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className={`font-bold text-lg ${getConfidenceColor(confidence)}`}>
            {confidence}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReplayCard;