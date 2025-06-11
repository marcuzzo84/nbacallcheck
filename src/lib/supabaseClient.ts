import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          home_team: string;
          away_team: string;
          game_date: string;
          season: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_team: string;
          away_team: string;
          game_date: string;
          season?: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_team?: string;
          away_team?: string;
          game_date?: string;
          season?: string;
          status?: string;
          created_at?: string;
        };
      };
      referees: {
        Row: {
          id: string;
          name: string;
          accuracy_rating: number;
          total_calls: number;
          years_experience: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          accuracy_rating?: number;
          total_calls?: number;
          years_experience?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          accuracy_rating?: number;
          total_calls?: number;
          years_experience?: number;
          created_at?: string;
        };
      };
      players: {
        Row: {
          id: string;
          name: string;
          team: string;
          position: string;
          fouls_per_game: number;
          fouls_drawn_per_game: number;
          technical_fouls: number;
          flagrant_fouls: number;
          free_throw_attempts: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          team: string;
          position?: string;
          fouls_per_game?: number;
          fouls_drawn_per_game?: number;
          technical_fouls?: number;
          flagrant_fouls?: number;
          free_throw_attempts?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          team?: string;
          position?: string;
          fouls_per_game?: number;
          fouls_drawn_per_game?: number;
          technical_fouls?: number;
          flagrant_fouls?: number;
          free_throw_attempts?: number;
          created_at?: string;
        };
      };
      calls: {
        Row: {
          id: string;
          game_id: string;
          referee_id: string;
          call_type: string;
          description: string;
          confidence_score: number;
          quarter: number;
          time_remaining: string;
          fouler_id: string;
          victim_id: string | null;
          video_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          referee_id: string;
          call_type: string;
          description: string;
          confidence_score?: number;
          quarter: number;
          time_remaining: string;
          fouler_id: string;
          victim_id?: string | null;
          video_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          referee_id?: string;
          call_type?: string;
          description?: string;
          confidence_score?: number;
          quarter?: number;
          time_remaining?: string;
          fouler_id?: string;
          victim_id?: string | null;
          video_url?: string | null;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          call_id: string;
          user_id: string | null;
          vote_type: 'correct' | 'incorrect' | 'unclear';
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          call_id: string;
          user_id?: string | null;
          vote_type: 'correct' | 'incorrect' | 'unclear';
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          call_id?: string;
          user_id?: string | null;
          vote_type?: 'correct' | 'incorrect' | 'unclear';
          ip_address?: string | null;
          created_at?: string;
        };
      };
      vote_aggregates: {
        Row: {
          call_id: string;
          correct_votes: number;
          incorrect_votes: number;
          unclear_votes: number;
          total_votes: number;
          updated_at: string;
        };
        Insert: {
          call_id: string;
          correct_votes?: number;
          incorrect_votes?: number;
          unclear_votes?: number;
          total_votes?: number;
          updated_at?: string;
        };
        Update: {
          call_id?: string;
          correct_votes?: number;
          incorrect_votes?: number;
          unclear_votes?: number;
          total_votes?: number;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'pro' | 'premium';
          subscription_status: 'active' | 'inactive' | 'cancelled';
          subscription_expires_at: string | null;
          total_votes: number;
          accuracy_score: number | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'premium';
          subscription_status?: 'active' | 'inactive' | 'cancelled';
          subscription_expires_at?: string | null;
          total_votes?: number;
          accuracy_score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'premium';
          subscription_status?: 'active' | 'inactive' | 'cancelled';
          subscription_expires_at?: string | null;
          total_votes?: number;
          accuracy_score?: number | null;
          created_at?: string;
        };
      };
    };
  };
}

// Helper functions for database operations
export const callsService = {
  // Get all calls with related data
  async getCalls() {
    const { data, error } = await supabase
      .from('calls')
      .select(`
        *,
        games(home_team, away_team, game_date),
        referees(name, accuracy_rating, total_calls),
        fouler:players!calls_fouler_id_fkey(name, team, fouls_per_game, technical_fouls, flagrant_fouls),
        victim:players!calls_victim_id_fkey(name, team, fouls_drawn_per_game, free_throw_attempts),
        vote_aggregates(correct_votes, incorrect_votes, unclear_votes, total_votes)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a specific call by ID
  async getCall(callId: string) {
    const { data, error } = await supabase
      .from('calls')
      .select(`
        *,
        games(home_team, away_team, game_date),
        referees(name, accuracy_rating, total_calls),
        fouler:players!calls_fouler_id_fkey(name, team, fouls_per_game, technical_fouls, flagrant_fouls),
        victim:players!calls_victim_id_fkey(name, team, fouls_drawn_per_game, free_throw_attempts),
        vote_aggregates(correct_votes, incorrect_votes, unclear_votes, total_votes)
      `)
      .eq('id', callId)
      .single();

    if (error) throw error;
    return data;
  }
};

export const votesService = {
  // Submit a vote (with user authentication support)
  async submitVote(callId: string, voteType: 'correct' | 'incorrect' | 'unclear', ipAddress?: string, userId?: string) {
    const { data, error } = await supabase
      .from('votes')
      .insert({
        call_id: callId,
        vote_type: voteType,
        ip_address: ipAddress,
        user_id: userId
      });

    if (error) throw error;
    return data;
  },

  // Get vote aggregates for a call
  async getVoteAggregates(callId: string) {
    const { data, error } = await supabase
      .from('vote_aggregates')
      .select('*')
      .eq('call_id', callId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Get user's vote for a specific call
  async getUserVote(callId: string, userId: string) {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('call_id', callId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data?.vote_type || null;
  },

  // Get vote channel (without subscribing)
  getVoteChannel(callId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`vote_aggregates:call_id=eq.${callId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'vote_aggregates',
          filter: `call_id=eq.${callId}`
        }, 
        callback
      );
  }
};

// Get user's IP address (for anonymous voting)
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return Math.random().toString(36).substring(7); // Fallback to random string
  }
};