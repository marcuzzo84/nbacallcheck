import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';

interface VotePanelProps {
  votes: {
    correct: number;
    incorrect: number;
    unclear: number;
  };
}

const VotePanel: React.FC<VotePanelProps> = ({ votes }) => {
  const [userVote, setUserVote] = useState<string | null>(null);
  
  const total = votes.correct + votes.incorrect + votes.unclear;
  const percentages = {
    correct: Math.round((votes.correct / total) * 100),
    incorrect: Math.round((votes.incorrect / total) * 100),
    unclear: Math.round((votes.unclear / total) * 100)
  };

  const handleVote = (voteType: string) => {
    setUserVote(voteType);
    // In a real app, this would send the vote to the backend
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">Fan Vote</h3>
      <p className="text-slate-300 text-sm mb-4">Was this the correct call?</p>
      
      <div className="space-y-3">
        {/* Correct Button */}
        <button
          onClick={() => handleVote('correct')}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
            userVote === 'correct' 
              ? 'bg-green-600 border-green-500 text-white' 
              : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <div className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-2" />
            <span className="font-medium">Correct Decision</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-2">{percentages.correct}%</span>
            <div className="w-16 bg-slate-600 rounded-full h-2">
              <div 
                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${percentages.correct}%` }}
              />
            </div>
          </div>
        </button>

        {/* Incorrect Button */}
        <button
          onClick={() => handleVote('incorrect')}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
            userVote === 'incorrect' 
              ? 'bg-red-600 border-red-500 text-white' 
              : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <div className="flex items-center">
            <ThumbsDown className="w-4 h-4 mr-2" />
            <span className="font-medium">Incorrect Decision</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-2">{percentages.incorrect}%</span>
            <div className="w-16 bg-slate-600 rounded-full h-2">
              <div 
                className="h-2 bg-red-500 rounded-full transition-all duration-300"
                style={{ width: `${percentages.incorrect}%` }}
              />
            </div>
          </div>
        </button>

        {/* Unclear Button */}
        <button
          onClick={() => handleVote('unclear')}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
            userVote === 'unclear' 
              ? 'bg-yellow-600 border-yellow-500 text-white' 
              : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <div className="flex items-center">
            <HelpCircle className="w-4 h-4 mr-2" />
            <span className="font-medium">Unclear</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-2">{percentages.unclear}%</span>
            <div className="w-16 bg-slate-600 rounded-full h-2">
              <div 
                className="h-2 bg-yellow-500 rounded-full transition-all duration-300"
                style={{ width: `${percentages.unclear}%` }}
              />
            </div>
          </div>
        </button>
      </div>

      <div className="mt-4 text-center text-slate-400 text-xs">
        {total.toLocaleString()} total votes
      </div>
    </div>
  );
};

export default VotePanel;