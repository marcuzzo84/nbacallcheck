import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface CallVote {
  id: string;
  call_id: string;
  vote_type: 'correct' | 'incorrect' | 'unclear';
  created_at: string;
}

export interface CallData {
  id: string;
  type: string;
  description: string;
  confidence: number;
  timestamp: string;
  game_id: string;
  quarter: number;
  time_remaining: string;
  players: {
    fouler: string;
    victim: string;
  };
  referee: {
    name: string;
    accuracy: number;
    totalCalls: number;
  };
  created_at: string;
}