import React, { useState } from 'react';
import { Play, Clock, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { CallData } from '../lib/supabase';

interface EnhancedReplayCardProps extends CallData {}

const EnhancedReplayCard: React.FC<EnhancedReplayCardProps> = ({
  type,
  description,
  confidence,
  timestamp,
  players,
  quarter,
  time_remaining
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    if (confidence >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConfidenceBackground = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-500';
    if (confidence >= 70) return 'bg-yellow-500';
    if (confidence >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 85) return 'High Confidence';
    if (confidence >= 70) return 'Moderate Confidence';
    if (confidence >= 50) return 'Low Confidence';
    return 'Very Low Confidence';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-lg">{type}</h2>
        <div className="flex items-center text-slate-400 text-sm space-x-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Q{quarter} {time_remaining}
          </div>
        </div>
      </div>
      
      {/* Enhanced Video Placeholder */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg mb-4 h-40 flex items-center justify-center border border-slate-600 overflow-hidden">
        {/* Mock court background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-600" />
        </div>
        
        <div className="relative z-10 text-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center mb-3 mx-auto transition-colors"
          >
            <Play className="w-6 h-6 text-white ml-1" />
          </button>
          <div className="text-slate-300 text-sm font-medium">
            {players.fouler} vs {players.victim}
          </div>
          <div className="text-slate-500 text-xs mt-1">
            Click to view replay
          </div>
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              LIVE
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
            >
              {isMuted ? 
                <VolumeX className="w-4 h-4 text-white" /> : 
                <Volume2 className="w-4 h-4 text-white" />
              }
            </button>
            <button className="p-1 rounded bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors">
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      {/* Enhanced AI Confidence */}
      <div className="bg-slate-900 rounded-lg p-3 border border-slate-600">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-400 text-sm font-medium">
            AI Analysis Confidence
          </div>
          <div className="text-xs text-slate-500">
            {getConfidenceLabel(confidence)}
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-1 bg-slate-700 rounded-full h-3 mr-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getConfidenceBackground(confidence)}`}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className={`font-bold text-xl ${getConfidenceColor(confidence)}`}>
            {confidence}%
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Based on contact analysis, player positioning, and historical data
        </div>
      </div>
    </div>
  );
};

export default EnhancedReplayCard;