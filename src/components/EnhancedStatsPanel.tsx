import React, { useState } from 'react';
import { User, Castle, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EnhancedStatsPanelProps {
  referee: {
    name: string;
    accuracy: number;
    totalCalls: number;
  };
  playerStats: {
    [playerName: string]: {
      foulsPerGame: number;
      technicalFouls: number;
      flagrantFouls: number;
      foulsDrawnPerGame: number;
      freeThrowAttempts: number;
    };
  };
  players: {
    fouler: string;
    victim: string;
  };
}

const EnhancedStatsPanel: React.FC<EnhancedStatsPanelProps> = ({ referee, playerStats, players }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getStatTrend = (value: number, average: number) => {
    if (value > average * 1.2) return { icon: TrendingUp, color: 'text-red-400', label: 'Above Average' };
    if (value < average * 0.8) return { icon: TrendingDown, color: 'text-green-400', label: 'Below Average' };
    return { icon: Minus, color: 'text-yellow-400', label: 'Average' };
  };

  const foulerStats = playerStats[players.fouler];
  const victimStats = playerStats[players.victim];

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">Advanced Statistics</h3>
      
      {/* Referee Stats */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('referee')}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <div className="flex items-center">
            <Castle className="w-4 h-4 mr-2 text-slate-400" />
            <div className="text-left">
              <span className="text-white font-medium block">{referee.name}</span>
              <span className="text-slate-400 text-xs">Referee</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-3">
              <div className="text-white font-semibold text-sm">{referee.accuracy}%</div>
              <div className="text-slate-400 text-xs">Accuracy</div>
            </div>
            {expandedSection === 'referee' ? 
              <ChevronUp className="w-4 h-4 text-slate-400" /> : 
              <ChevronDown className="w-4 h-4 text-slate-400" />
            }
          </div>
        </button>
        
        {expandedSection === 'referee' && (
          <div className="mt-2 p-4 bg-slate-900 rounded-lg border border-slate-600">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-800 p-3 rounded-lg">
                <div className="text-slate-400 mb-1">Call Accuracy</div>
                <div className="text-white font-semibold text-lg">{referee.accuracy}%</div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${referee.accuracy}%` }}
                  />
                </div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg">
                <div className="text-slate-400 mb-1">Total Calls</div>
                <div className="text-white font-semibold text-lg">{referee.totalCalls.toLocaleString()}</div>
                <div className="text-slate-500 text-xs mt-1">This season</div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-slate-800 rounded-lg">
              <div className="text-slate-400 text-xs mb-2">Recent Performance Trend</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Last 10 games</span>
                <span className="text-green-400 font-medium">↗ +2.3% accuracy</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Player Stats */}
      <div className="space-y-3">
        {/* Fouler Stats */}
        {foulerStats && (
          <div>
            <button
              onClick={() => toggleSection('fouler')}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-400" />
                <div className="text-left">
                  <span className="text-white font-medium block">{players.fouler}</span>
                  <span className="text-slate-400 text-xs">Fouler</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-right mr-3">
                  <div className="text-white font-semibold text-sm">{foulerStats.foulsPerGame}</div>
                  <div className="text-slate-400 text-xs">Fouls/Game</div>
                </div>
                {expandedSection === 'fouler' ? 
                  <ChevronUp className="w-4 h-4 text-slate-400" /> : 
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                }
              </div>
            </button>
            
            {expandedSection === 'fouler' && (
              <div className="mt-2 p-4 bg-slate-900 rounded-lg border border-slate-600">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Fouls per Game</span>
                    <div className="flex items-center">
                      <span className="text-white font-semibold mr-2">{foulerStats.foulsPerGame}</span>
                      {React.createElement(getStatTrend(foulerStats.foulsPerGame, 2.5).icon, {
                        className: `w-4 h-4 ${getStatTrend(foulerStats.foulsPerGame, 2.5).color}`
                      })}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Technical Fouls</span>
                    <span className="text-white font-semibold">{foulerStats.technicalFouls}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Flagrant Fouls</span>
                    <span className="text-white font-semibold">{foulerStats.flagrantFouls}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Victim Stats */}
        {victimStats && players.victim !== 'N/A' && (
          <div>
            <button
              onClick={() => toggleSection('victim')}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-400" />
                <div className="text-left">
                  <span className="text-white font-medium block">{players.victim}</span>
                  <span className="text-slate-400 text-xs">Victim</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-right mr-3">
                  <div className="text-white font-semibold text-sm">{victimStats.foulsDrawnPerGame}</div>
                  <div className="text-slate-400 text-xs">Drawn/Game</div>
                </div>
                {expandedSection === 'victim' ? 
                  <ChevronUp className="w-4 h-4 text-slate-400" /> : 
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                }
              </div>
            </button>
            
            {expandedSection === 'victim' && (
              <div className="mt-2 p-4 bg-slate-900 rounded-lg border border-slate-600">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Fouls Drawn/Game</span>
                    <div className="flex items-center">
                      <span className="text-white font-semibold mr-2">{victimStats.foulsDrawnPerGame}</span>
                      {React.createElement(getStatTrend(victimStats.foulsDrawnPerGame, 3.0).icon, {
                        className: `w-4 h-4 ${getStatTrend(victimStats.foulsDrawnPerGame, 3.0).color}`
                      })}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">FT Attempts/Game</span>
                    <span className="text-white font-semibold">{victimStats.freeThrowAttempts}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedStatsPanel;