import React, { useState, useEffect } from 'react';
import { Loader2, Database, AlertCircle, Zap } from 'lucide-react';
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
  const [dataSource, setDataSource] = useState<'live' | 'enhanced' | 'fallback'>('fallback');

  useEffect(() => {
    if (!isConnected) {
      onCallsLoaded(fallbackCalls);
      setDataSource('fallback');
      return;
    }

    const loadCalls = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to load enhanced calls data first
        const data = await callsService.getCalls(20);
        
        if (data && data.length > 0) {
          // Transform enhanced Supabase data to match our CallData interface
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
              fouler: call.fouler_name || 'Unknown Player',
              victim: call.victim_name || 'N/A'
            },
            referee: {
              name: call.referee_name || 'Unknown Referee',
              accuracy: call.referee_accuracy || 85.0,
              totalCalls: call.referee_total_calls || 0
            },
            created_at: call.created_at
          }));

          onCallsLoaded(transformedCalls);
          setDataSource('enhanced');
        } else {
          // No enhanced data available, use fallback
          onCallsLoaded(fallbackCalls);
          setDataSource('fallback');
        }
      } catch (err: any) {
        console.error('Failed to load calls:', err);
        const errorMessage = 'Failed to load live data. Using demo mode.';
        setError(errorMessage);
        onError(errorMessage);
        onCallsLoaded(fallbackCalls);
        setDataSource('fallback');
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
            <div className="text-xs text-slate-500">Connecting to enhanced database</div>
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
    <div className={`rounded-lg p-3 mb-4 border ${
      dataSource === 'enhanced' 
        ? 'bg-green-900 border-green-700' 
        : 'bg-blue-900 border-blue-700'
    }`}>
      <div className="flex items-center space-x-3">
        {dataSource === 'enhanced' ? (
          <>
            <Zap className="w-4 h-4 text-green-400" />
            <div className="text-green-300 text-sm">
              <span className="font-medium">Enhanced live data loaded</span>
              <span className="text-green-400 text-xs ml-2">• Real NBA data with full analytics</span>
            </div>
          </>
        ) : (
          <>
            <Database className="w-4 h-4 text-blue-400" />
            <div className="text-blue-300 text-sm">
              <span className="font-medium">Live data loaded successfully</span>
              <span className="text-blue-400 text-xs ml-2">• Basic connection established</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveCallsLoader;