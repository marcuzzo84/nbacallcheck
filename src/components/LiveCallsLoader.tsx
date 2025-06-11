import React, { useState, useEffect } from 'react';
import { Loader2, Database, AlertCircle } from 'lucide-react';
import { callsService } from '../lib/supabaseClient';
import { CallData } from '../lib/supabase';

interface LiveCallsLoaderProps {
  isConnected: boolean;
  fallbackCalls: CallData[];
  onCallsLoaded: (calls: CallData[]) => void;
  onError: (error: string) => void;
}

const LiveCallsLoader: React.FC<LiveCallsLoaderProps> = ({
  isConnected,
  fallbackCalls,
  onCallsLoaded,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) {
      onCallsLoaded(fallbackCalls);
      return;
    }

    const loadCalls = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await callsService.getCalls();
        
        // Transform Supabase data to match our CallData interface
        const transformedCalls: CallData[] = data.map((call: any) => ({
          id: call.id,
          type: call.call_type,
          description: call.description,
          confidence: call.confidence_score,
          timestamp: `Q${call.quarter} ${call.time_remaining}`,
          game_id: call.game_id,
          quarter: call.quarter,
          time_remaining: call.time_remaining,
          players: {
            fouler: call.fouler?.name || 'Unknown Player',
            victim: call.victim?.name || 'N/A'
          },
          referee: {
            name: call.referees?.name || 'Unknown Referee',
            accuracy: call.referees?.accuracy_rating || 85.0,
            totalCalls: call.referees?.total_calls || 0
          },
          created_at: call.created_at
        }));

        onCallsLoaded(transformedCalls);
      } catch (err: any) {
        console.error('Failed to load calls:', err);
        const errorMessage = 'Failed to load live data. Using demo mode.';
        setError(errorMessage);
        onError(errorMessage);
        onCallsLoaded(fallbackCalls);
      } finally {
        setLoading(false);
      }
    };

    loadCalls();
  }, [isConnected, fallbackCalls, onCallsLoaded, onError]);

  if (!isConnected) return null;

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-4">
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <div className="text-slate-300">
            <div className="font-medium">Loading live data...</div>
            <div className="text-xs text-slate-500">Connecting to Supabase</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div className="text-red-300">
            <div className="font-medium">Connection Error</div>
            <div className="text-xs text-red-400">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-900 border border-green-700 rounded-lg p-3 mb-4">
      <div className="flex items-center space-x-3">
        <Database className="w-4 h-4 text-green-400" />
        <div className="text-green-300 text-sm">
          <span className="font-medium">Live data loaded successfully</span>
        </div>
      </div>
    </div>
  );
};

export default LiveCallsLoader;