import React, { useState, useCallback } from 'react';
import { Settings, ExternalLink, Database, Wifi, WifiOff, Maximize2 } from 'lucide-react';
import CallSelector from './components/CallSelector';
import EnhancedReplayCard from './components/EnhancedReplayCard';
import LiveVotePanel from './components/LiveVotePanel';
import EnhancedStatsPanel from './components/EnhancedStatsPanel';
import LiveCallsLoader from './components/LiveCallsLoader';
import SettingsPanel from './components/SettingsPanel';
import FullscreenView from './components/FullscreenView';
import { mockCallsData, mockVotesData, mockPlayerStats } from './data/enhancedMockData';
import { CallData } from './lib/supabase';

function App() {
  const [currentCallIndex, setCurrentCallIndex] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [calls, setCalls] = useState<CallData[]>(mockCallsData);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const currentCall = calls[currentCallIndex];
  const currentVotes = mockVotesData[currentCall.id as keyof typeof mockVotesData] || { correct: 0, incorrect: 0, unclear: 0 };

  const handleCallChange = (index: number) => {
    setCurrentCallIndex(index);
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    setConnectionError(null);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleCallsLoaded = useCallback((loadedCalls: CallData[]) => {
    setCalls(loadedCalls);
    setCurrentCallIndex(0); // Reset to first call when new data loads
  }, []);

  const handleConnectionError = useCallback((error: string) => {
    setConnectionError(error);
    setIsConnected(false); // Fall back to demo mode
  }, []);

  return (
    <>
      <div className="w-[400px] h-[600px] bg-slate-900 text-white overflow-y-auto">
        {/* Enhanced Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">🏀</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">NBA CallCheck</h1>
                <p className="text-xs text-slate-400">Advanced Referee Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleFullscreen}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                title="Enter Fullscreen"
              >
                <Maximize2 className="w-4 h-4 text-slate-400" />
              </button>
              <button 
                onClick={toggleConnection}
                className={`p-2 rounded-lg transition-colors ${
                  isConnected 
                    ? 'bg-green-800 hover:bg-green-700 text-green-300' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                }`}
                title={isConnected ? 'Connected to live data' : 'Using mock data'}
              >
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              </button>
              <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <Database className="w-4 h-4 text-slate-400" />
              </button>
              <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="mt-2 flex items-center justify-between text-xs">
            <div className={`flex items-center ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`} />
              {isConnected ? 'Live Data Connected' : 'Demo Mode - Mock Data'}
            </div>
            <div className="text-slate-500">
              v0.3.0
            </div>
          </div>

          {connectionError && (
            <div className="mt-2 text-xs text-red-400">
              {connectionError}
            </div>
          )}
        </div>

        {/* Live Data Loader */}
        <div className="p-4 pb-0">
          <LiveCallsLoader
            isConnected={isConnected}
            fallbackCalls={mockCallsData}
            onCallsLoaded={handleCallsLoaded}
            onError={handleConnectionError}
          />
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          <CallSelector 
            calls={calls}
            currentIndex={currentCallIndex}
            onCallChange={handleCallChange}
          />
          
          <EnhancedReplayCard {...currentCall} />
          
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

        {/* Enhanced Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="text-center mb-2">
            <p className="text-xs text-slate-500">
              Not affiliated with the NBA. Made by fans, for fans.
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Open source • Community driven • Transparent
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-white font-semibold text-sm">{calls.length}</div>
              <div className="text-slate-400 text-xs">Calls</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-white font-semibold text-sm">
                {Object.values(mockVotesData).reduce((acc, votes) => acc + votes.correct + votes.incorrect + votes.unclear, 0).toLocaleString()}
              </div>
              <div className="text-slate-400 text-xs">Votes</div>
            </div>
            <div className="bg-slate-800 rounded p-2 text-center">
              <div className="text-white font-semibold text-sm">
                {isConnected ? 'Live' : '87%'}
              </div>
              <div className="text-slate-400 text-xs">
                {isConnected ? 'Data' : 'Accuracy'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isConnected={isConnected}
        onToggleConnection={toggleConnection}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Fullscreen View */}
      <FullscreenView
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        calls={calls}
        currentCallIndex={currentCallIndex}
        onCallChange={handleCallChange}
        isConnected={isConnected}
        onToggleConnection={toggleConnection}
        mockVotesData={mockVotesData}
        mockPlayerStats={mockPlayerStats}
      />
    </>
  );
}

export default App;