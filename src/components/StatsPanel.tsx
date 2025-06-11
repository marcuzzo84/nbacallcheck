import React, { useState } from 'react';
import { User, Castle, ChevronDown, ChevronUp } from 'lucide-react';

interface StatsPanelProps {
  referee: {
    name: string;
    accuracy: number;
    totalCalls: number;
  };
  playerStats: {
    fouler: {
      name: string;
      foulsPerGame: number;
      technicalFouls: number;
      flagrantFouls: number;
    };
    victim: {
      name: string;
      foulsDrawnPerGame: number;
      freeThrowAttempts: number;
    };
  };
}

const StatsPanel: React.FC<StatsPanelProps> = ({ referee, playerStats }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">Statistics</h3>
      
      {/* Referee Stats */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('referee')}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <div className="flex items-center">
            <Castle className="w-4 h-4 mr-2 text-slate-400" />
            <span className="text-white font-medium">{referee.name}</span>
          </div>
          {expandedSection === 'referee' ? 
            <ChevronUp className="w-4 h-4 text-slate-400" /> : 
            <ChevronDown className="w-4 h-4 text-slate-400" />
          }
        </button>
        
        {expandedSection === 'referee' && (
          <div className="mt-2 p-3 bg-slate-900 rounded-lg border border-slate-600">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-slate-400">Call Accuracy</div>
                <div className="text-white font-semibold">{referee.accuracy}%</div>
              </div>
              <div>
                <div className="text-slate-400">Total Calls</div>
                <div className="text-white font-semibold">{referee.totalCalls.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Player Stats */}
      <div className="space-y-3">
        {/* Fouler Stats */}
        <div>
          <button
            onClick={() => toggleSection('fouler')}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-slate-400" />
              <span className="text-white font-medium">{playerStats.fouler.name}</span>
            </div>
            {expandedSection === 'fouler' ? 
              <ChevronUp className="w-4 h-4 text-slate-400" /> : 
              <ChevronDown className="w-4 h-4 text-slate-400" />
            }
          </button>
          
          {expandedSection === 'fouler' && (
            <div className="mt-2 p-3 bg-slate-900 rounded-lg border border-slate-600">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Fouls/Game</span>
                  <span className="text-white font-semibold">{playerStats.fouler.foulsPerGame}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Technical Fouls</span>
                  <span className="text-white font-semibold">{playerStats.fouler.technicalFouls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Flagrant Fouls</span>
                  <span className="text-white font-semibold">{playerStats.fouler.flagrantFouls}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Victim Stats */}
        <div>
          <button
            onClick={() => toggleSection('victim')}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-slate-400" />
              <span className="text-white font-medium">{playerStats.victim.name}</span>
            </div>
            {expandedSection === 'victim' ? 
              <ChevronUp className="w-4 h-4 text-slate-400" /> : 
              <ChevronDown className="w-4 h-4 text-slate-400" />
            }
          </button>
          
          {expandedSection === 'victim' && (
            <div className="mt-2 p-3 bg-slate-900 rounded-lg border border-slate-600">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Fouls Drawn/Game</span>
                  <span className="text-white font-semibold">{playerStats.victim.foulsDrawnPerGame}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">FT Attempts/Game</span>
                  <span className="text-white font-semibold">{playerStats.victim.freeThrowAttempts}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;