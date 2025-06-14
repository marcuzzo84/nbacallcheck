import React, { useState, useEffect, useRef } from 'react';
import { ThumbsUp, ThumbsDown, HelpCircle, TrendingUp, Users, Wifi, WifiOff, Lock } from 'lucide-react';
import { votesService, getUserIP, supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

interface LiveVotePanelProps {
  callId: string;
  isConnected: boolean;
  fallbackVotes?: {
    correct: number;
    incorrect: number;
    unclear: number;
  };
}

const LiveVotePanel: React.FC<LiveVotePanelProps> = ({ 
  callId, 
  isConnected, 
  fallbackVotes = { correct: 0, incorrect: 0, unclear: 0 }
}) => {
  const { user, hasFeatureAccess } = useAuth();
  const [userVote, setUserVote] = useState<string | null>(null);
  const [votes, setVotes] = useState(fallbackVotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalVoters, setTotalVoters] = useState(0);
  const [dailyVoteCount, setDailyVoteCount] = useState(0);
  
  // Use ref to store channel instance to prevent multiple subscriptions
  const channelRef = useRef<any>(null);
  
  const total = votes.correct + votes.incorrect + votes.unclear;
  const percentages = {
    correct: total > 0 ? Math.round((votes.correct / total) * 100) : 0,
    incorrect: total > 0 ? Math.round((votes.incorrect / total) * 100) : 0,
    unclear: total > 0 ? Math.round((votes.unclear / total) * 100) : 0
  };

  const canVote = hasFeatureAccess('unlimited_votes') || dailyVoteCount < 10;

  useEffect(() => {
    setTotalVoters(total);
  }, [total]);

  useEffect(() => {
    // Clean up any existing channel first
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (!isConnected) {
      return;
    }

    // Load initial vote data
    const loadVotes = async () => {
      try {
        const voteData = await votesService.getVoteAggregates(callId);
        if (voteData) {
          setVotes({
            correct: voteData.correct_votes,
            incorrect: voteData.incorrect_votes,
            unclear: voteData.unclear_votes
          });
        }

        // Load user's existing vote if authenticated
        if (user) {
          const existingVote = await votesService.getUserVote(callId, user.id);
          setUserVote(existingVote);
        }
      } catch (err) {
        console.error('Failed to load votes:', err);
        setError('Failed to load voting data');
      }
    };

    loadVotes();

    // Create and subscribe to new channel
    try {
      channelRef.current = votesService.getVoteChannel(callId, (payload) => {
        if (payload.new) {
          setVotes({
            correct: payload.new.correct_votes,
            incorrect: payload.new.incorrect_votes,
            unclear: payload.new.unclear_votes
          });
        }
      });
      
      // Only subscribe if the channel is not already joined or joining
      if (channelRef.current && channelRef.current.state !== 'joined' && channelRef.current.state !== 'joining') {
        channelRef.current.subscribe();
      }
    } catch (err) {
      console.error('Failed to setup subscription:', err);
    }

    // Cleanup function
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [callId, isConnected, user]);

  const handleVote = async (voteType: 'correct' | 'incorrect' | 'unclear') => {
    if (isSubmitting || userVote === voteType) return;
    
    // Check voting limits for free users
    if (!canVote) {
      setError('Daily vote limit reached. Upgrade to Pro for unlimited voting.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isConnected) {
        // Real Supabase voting
        const ipAddress = await getUserIP();
        await votesService.submitVote(callId, voteType, ipAddress, user?.id);
        
        // Update daily vote count for free users
        if (!hasFeatureAccess('unlimited_votes')) {
          setDailyVoteCount(prev => prev + 1);
        }
      } else {
        // Mock voting for demo mode
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newVotes = { ...votes };
        if (userVote) {
          newVotes[userVote as keyof typeof newVotes]--;
        }
        newVotes[voteType]++;
        setVotes(newVotes);
      }
      
      setUserVote(voteType);
    } catch (err: any) {
      console.error('Error submitting vote:', err);
      if (err.message?.includes('duplicate key')) {
        setError('You have already voted on this call');
      } else if (err.message?.includes('row-level security')) {
        setError('Unable to process vote. Please try again later.');
      } else {
        setError('Failed to submit vote. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVoteButtonClass = (voteType: string, baseColor: string) => {
    const isSelected = userVote === voteType;
    const isDisabled = isSubmitting || !canVote;
    
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
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-slate-400 text-sm">
            <Users className="w-4 h-4 mr-1" />
            {totalVoters.toLocaleString()} voters
          </div>
          <div className={`flex items-center text-xs ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
            {isConnected ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
            {isConnected ? 'Live' : 'Demo'}
          </div>
        </div>
      </div>
      
      <p className="text-slate-300 text-sm mb-4">Was this the correct call?</p>
      
      {/* Vote Limit Warning for Free Users */}
      {!hasFeatureAccess('unlimited_votes') && (
        <div className="mb-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
          <div className="flex items-center text-yellow-300 text-sm">
            <Lock className="w-4 h-4 mr-2" />
            <span>Free Plan: {10 - dailyVoteCount} votes remaining today</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-3">
        {/* Correct Button */}
        <button
          onClick={() => handleVote('correct')}
          disabled={isSubmitting || !canVote}
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
          disabled={isSubmitting || !canVote}
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
          disabled={isSubmitting || !canVote}
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
        {isConnected ? 'Real-time community voting • Updates live' : 'Demo mode • Simulated voting data'}
      </div>
    </div>
  );
};

export default LiveVotePanel;