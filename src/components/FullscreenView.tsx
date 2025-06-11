import React, { useState, useEffect } from 'react';
import { X, Minimize2, Settings, Database, Wifi, WifiOff, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import CallSelector from './CallSelector';
import EnhancedReplayCard from './EnhancedReplayCard';
import LiveVotePanel from './LiveVotePanel';
import EnhancedStatsPanel from './EnhancedStatsPanel';
import SettingsPanel from './SettingsPanel';
import AnalyticsModal from './AnalyticsModal';
import { CallData } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface FullscreenViewProps {
  isOpen: boolean;
  onClose: () => void;
  calls: CallData[];
  currentCallIndex: number;
  onCallChange: (index: number) => void;
  isConnected: boolean;
  onToggleConnection: () => void;
  mockVotesData: any;
  mockPlayerStats: any;
}

const FullscreenView: React.FC<FullscreenViewProps> = ({
  isOpen,
  onClose,
  calls,
  currentCallIndex,
  onCallChange,
  isConnected,
  onToggleConnection,
  mockVotesData,
  mockPlayerStats
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'sidebar'>('grid');
  const { hasFeatureAccess } = useAuth();

  const currentCall = calls[currentCallIndex];
  const currentVotes = mockVotesData[currentCall?.id as keyof typeof mockVotesData] || { correct: 0, incorrect: 0, unclear: 0 };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !currentCall) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">🏀</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NBA CallCheck - Fullscreen</h1>
              <p className="text-sm text-slate-400">Advanced Referee Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Layout Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLayout('grid')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  layout === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setLayout('sidebar')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  layout === 'sidebar' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Sidebar
              </button>
            </div>

            {/* Connection Status */}
            <div className={`flex items-center px-3 py-2 rounded-lg ${
              isConnected ? 'bg-green-800 text-green-300' : 'bg-yellow-800 text-yellow-300'
            }`}>
              {isConnected ? <Wifi className="w-4 h-4 mr-2" /> : <WifiOff className="w-4 h-4 mr-2" />}
              <span className="text-sm font-medium">
                {isConnected ? 'Live Data' : 'Demo Mode'}
              </span>
            </div>

            {/* Action Buttons */}
            <button
              onClick={onToggleConnection}
              className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              title="Toggle Connection"
            >
              <Database className="w-5 h-5 text-slate-300" />
            </button>

            <button
              onClick={() => setShowAnalytics(true)}
              className={`p-3 rounded-lg transition-colors ${
                hasFeatureAccess('advanced_analytics')
                  ? 'bg-purple-700 hover:bg-purple-600 text-purple-300'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
              }`}
              title="Advanced Analytics"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-slate-300" />
            </button>
            
            <button
              onClick={onClose}
              className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              title="Exit Fullscreen"
            >
              <Minimize2 className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {layout === 'grid' ? (
          <div className="h-full p-6">
            <div className="grid grid-cols-12 gap-6 h-full">
              {/* Call Selector - Full Width */}
              <div className="col-span-12">
                <CallSelector 
                  calls={calls}
                  currentIndex={currentCallIndex}
                  onCallChange={onCallChange}
                />
              </div>

              {/* Video/Replay Section */}
              <div className="col-span-8">
                <EnhancedReplayCard {...currentCall} />
              </div>

              {/* Voting Panel */}
              <div className="col-span-4">
                <LiveVotePanel 
                  callId={currentCall.id}
                  isConnected={isConnected}
                  fallbackVotes={currentVotes}
                />
              </div>

              {/* Statistics Panel - Full Width */}
              <div className="col-span-12">
                <EnhancedStatsPanel 
                  referee={currentCall.referee}
                  playerStats={mockPlayerStats}
                  players={currentCall.players}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            {/* Main Content */}
            <div className="flex-1 p-6 space-y-6">
              <CallSelector 
                calls={calls}
                currentIndex={currentCallIndex}
                onCallChange={onCallChange}
              />
              <EnhancedReplayCard {...currentCall} />
            </div>

            {/* Sidebar */}
            <div className="w-96 bg-slate-800 border-l border-slate-700 p-6 space-y-6 overflow-y-auto">
              <LiveVotePanel 
                callId={currentCall.id}
                isConnected={isConnected}
                fallbackVotes={currentVotes}
              />
              <EnhancedStatsPanel 
                referee={currentCall.referee}
                playerStats={mockPlayerStats}
                players={currentCall.players}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Overlay */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4 bg-slate-800 rounded-lg p-3 border border-slate-700">
          <button
            onClick={() => onCallChange(Math.max(0, currentCallIndex - 1))}
            disabled={currentCallIndex === 0}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-300" />
          </button>
          
          <div className="text-slate-300 text-sm font-medium">
            {currentCallIndex + 1} of {calls.length}
          </div>
          
          <button
            onClick={() => onCallChange(Math.min(calls.length - 1, currentCallIndex + 1))}
            disabled={currentCallIndex === calls.length - 1}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AnalyticsModal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isConnected={isConnected}
        onToggleConnection={onToggleConnection}
        isFullscreen={true}
        onToggleFullscreen={onClose}
      />
    </div>
  );
};

export default FullscreenView;