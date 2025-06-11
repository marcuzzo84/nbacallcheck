import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, HelpCircle, TrendingUp, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EnhancedVotePanelProps {
  callId: string;
  initialVotes: {
    correct: number;
    incorrect: number;
    unclear: number;
  };
}

const EnhancedVotePanel: React.FC<EnhancedVotePanelProps> = ({ callId, initialVotes }) => {
  const [userVote, setUserVote] = useState<string | null>(null);
  const [votes, setVotes] = useState(initialVotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalVoters, setTotalVoters] = useState(0);
  
  const total = votes.correct + votes.incorrect + votes.unclear;
  const percentages = {
    correct: total > 0 ? Math.round((votes.correct / total) * 100) : 0,
    incorrect: total > 0 ? Math.round((votes.incorrect / total) * 100) : 0,
    unclear: total > 0 ? Math.round((votes.unclear / total) * 100) : 0
  };

  useEffect(() => {
    setTotalVoters(total);
  }, [total]);

  const handleVote = async (voteType: 'correct' | 'incorrect' | 'unclear') => {
    if (isSubmitting || userVote === voteType) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call Supabase
      // For now, we'll simulate the API call and update local state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local vote counts
      const newVotes = { ...votes };
      if (userVote) {
        // Remove previous vote
        newVotes[userVote as keyof typeof newVotes]--;
      }
      // Add new vote
      newVotes[voteType]++;
      
      setVotes(newVotes);
      setUserVote(voteType);
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVoteButtonClass = (voteType: string, baseColor: string) => {
    const isSelected = userVote === voteType;
    const isDisabled = isSubmitting;
    
    if (isSelected) {
      return `bg-${baseColor}-600 border-${baseColor}-500 text-white`;
    }
    if (isDisabled) {
      return 'bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed opacity-50';
    }
    return 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Community Vote</h3>
        <div className="flex items-center text-slate-400 text-sm">
          <Users className="w-4 h-4 mr-1" />
          {totalVoters.toLocaleString()} voters
        </div>
      </div>
      
      <p className="text-slate-300 text-sm mb-4">Was this the correct call?</p>
      
      <div className="space-y-3">
        {/* Correct Button */}
        <button
          onClick={() => handleVote('correct')}
          disabled={isSubmitting}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${getVoteButtonClass('correct', 'green')}`}
        >
          <div className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-2" />
            <span className="font-medium">Correct Decision</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-3 font-semibold">{percentages.correct}%</span>
            <div className="w-20 bg-slate-600 rounded-full h-2.5">
              <div 
                className="h-2.5 bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${percentages.correct}%` }}
              />
            </div>
          </div>
        </button>

        {/* Incorrect Button */}
        <button
          onClick={() => handleVote('incorrect')}
          disabled={isSubmitting}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${getVoteButtonClass('incorrect', 'red')}`}
        >
          <div className="flex items-center">
            <ThumbsDown className="w-4 h-4 mr-2" />
            <span className="font-medium">Incorrect Decision</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-3 font-semibold">{percentages.incorrect}%</span>
            <div className="w-20 bg-slate-600 rounded-full h-2.5">
              <div 
                className="h-2.5 bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${percentages.incorrect}%` }}
              />
            </div>
          </div>
        </button>

        {/* Unclear Button */}
        <button
          onClick={() => handleVote('unclear')}
          disabled={isSubmitting}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${getVoteButtonClass('unclear', 'yellow')}`}
        >
          <div className="flex items-center">
            <HelpCircle className="w-4 h-4 mr-2" />
            <span className="font-medium">Unclear/Close Call</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-3 font-semibold">{percentages.unclear}%</span>
            <div className="w-20 bg-slate-600 rounded-full h-2.5">
              <div 
                className="h-2.5 bg-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${percentages.unclear}%` }}
              />
            </div>
          </div>
        </button>
      </div>

      {userVote && (
        <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-600">
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>Your vote has been recorded. Thank you for participating!</span>
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-slate-400 text-xs">
        Real-time community voting • Updates every few seconds
      </div>
    </div>
  );
};

export default EnhancedVotePanel;