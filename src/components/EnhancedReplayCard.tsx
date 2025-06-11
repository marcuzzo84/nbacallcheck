import React, { useState } from 'react';
import { Play, Clock, Maximize2, Volume2, VolumeX, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(15); // Mock 15-second clip

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

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control video playback
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg mb-4 h-48 flex items-center justify-center border border-slate-600 overflow-hidden">
        {/* Mock court background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-600" />
        </div>
        
        <div className="relative z-10 text-center">
          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center mb-3 mx-auto transition-colors shadow-lg"
          >
            {isPlaying ? 
              <Pause className="w-8 h-8 text-white" /> : 
              <Play className="w-8 h-8 text-white ml-1" />
            }
          </button>
          <div className="text-slate-300 text-sm font-medium">
            {players.fouler} vs {players.victim}
          </div>
          <div className="text-slate-500 text-xs mt-1">
            {isPlaying ? 'Playing...' : 'Click to view replay'}
          </div>
        </div>

        {/* Enhanced Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div 
                className="h-1.5 bg-red-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors">
                <SkipBack className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={togglePlay}
                className="p-2 rounded bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
              >
                {isPlaying ? 
                  <Pause className="w-4 h-4 text-white" /> : 
                  <Play className="w-4 h-4 text-white" />
                }
              </button>
              <button className="p-2 rounded bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors">
                <SkipForward className="w-4 h-4 text-white" />
              </button>
              <button className="p-2 rounded bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors">
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                LIVE
              </div>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
              >
                {isMuted ? 
                  <VolumeX className="w-4 h-4 text-white" /> : 
                  <Volume2 className="w-4 h-4 text-white" />
                }
              </button>
              <button className="p-2 rounded bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors">
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      {/* Enhanced AI Confidence */}
      <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
        <div className="flex items-center justify-between mb-3">
          <div className="text-slate-400 text-sm font-medium">
            AI Analysis Confidence
          </div>
          <div className="text-xs text-slate-500">
            {getConfidenceLabel(confidence)}
          </div>
        </div>
        <div className="flex items-center mb-3">
          <div className="flex-1 bg-slate-700 rounded-full h-4 mr-3 overflow-hidden">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${getConfidenceBackground(confidence)}`}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className={`font-bold text-2xl ${getConfidenceColor(confidence)}`}>
            {confidence}%
          </span>
        </div>
        <div className="text-xs text-slate-500">
          Based on contact analysis, player positioning, and historical data
        </div>
        
        {/* Additional Analysis Details */}
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="text-slate-400">Contact</div>
              <div className="text-white font-semibold">Clear</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400">Position</div>
              <div className="text-white font-semibold">Legal</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400">Intent</div>
              <div className="text-white font-semibold">Unclear</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedReplayCard;