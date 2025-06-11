import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced Database Types
export interface Database {
  public: {
    Tables: {
      seasons: {
        Row: {
          id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_current: boolean;
          created_at: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          abbreviation: string;
          city: string;
          conference: 'Eastern' | 'Western';
          division: string;
          primary_color: string;
          secondary_color: string;
          created_at: string;
        };
      };
      games: {
        Row: {
          id: string;
          home_team: string;
          away_team: string;
          game_date: string;
          season: string;
          season_id: string;
          status: string;
          created_at: string;
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
      };
      players: {
        Row: {
          id: string;
          name: string;
          team: string;
          team_id: string;
          position: string;
          fouls_per_game: number;
          fouls_drawn_per_game: number;
          technical_fouls: number;
          flagrant_fouls: number;
          free_throw_attempts: number;
          created_at: string;
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
      };
      call_reviews: {
        Row: {
          id: string;
          call_id: string;
          review_type: 'instant_replay' | 'coaches_challenge' | 'automatic_review';
          original_call: string;
          final_decision: string;
          review_duration_seconds: number;
          reviewer_notes: string;
          was_overturned: boolean;
          created_at: string;
        };
      };
      game_officials: {
        Row: {
          id: string;
          game_id: string;
          referee_id: string;
          role: 'referee' | 'crew_chief' | 'umpire';
          created_at: string;
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
      };
    };
    Views: {
      enhanced_calls_view: {
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
          home_team: string;
          away_team: string;
          game_date: string;
          season_name: string;
          referee_name: string;
          referee_accuracy: number;
          referee_total_calls: number;
          fouler_name: string;
          fouler_team: string;
          fouler_position: string;
          victim_name: string | null;
          victim_team: string | null;
          victim_position: string | null;
          correct_votes: number;
          incorrect_votes: number;
          unclear_votes: number;
          total_votes: number;
          was_overturned: boolean | null;
          review_type: string | null;
        };
      };
    };
    Functions: {
      get_referee_season_stats: {
        Args: {
          referee_name: string;
          season_name?: string;
        };
        Returns: {
          total_calls: number;
          avg_confidence: number;
          controversial_calls: number;
          overturned_calls: number;
          accuracy_rating: number;
        }[];
      };
      get_team_foul_stats: {
        Args: {
          team_abbr: string;
          season_name?: string;
        };
        Returns: {
          team_name: string;
          total_fouls: number;
          fouls_drawn: number;
          technical_fouls: number;
          flagrant_fouls: number;
          avg_fouls_per_game: number;
        }[];
      };
    };
  };
}

// Enhanced service functions
export const callsService = {
  // Get all calls using the enhanced view
  async getCalls(limit = 50) {
    const { data, error } = await supabase
      .from('enhanced_calls_view')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get calls by season
  async getCallsBySeason(seasonName: string, limit = 50) {
    const { data, error } = await supabase
      .from('enhanced_calls_view')
      .select('*')
      .eq('season_name', seasonName)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get calls by team
  async getCallsByTeam(teamName: string, limit = 50) {
    const { data, error } = await supabase
      .from('enhanced_calls_view')
      .select('*')
      .or(`fouler_team.eq.${teamName},victim_team.eq.${teamName}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get calls by referee
  async getCallsByReferee(refereeName: string, limit = 50) {
    const { data, error } = await supabase
      .from('enhanced_calls_view')
      .select('*')
      .eq('referee_name', refereeName)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get controversial calls (high vote count with significant disagreement)
  async getControversialCalls(limit = 20) {
    const { data, error } = await supabase
      .from('enhanced_calls_view')
      .select('*')
      .gte('total_votes', 50)
      .order('total_votes', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // Filter for controversial calls (where incorrect votes > 30% of total)
    return data?.filter(call => 
      call.total_votes > 0 && 
      (call.incorrect_votes / call.total_votes) > 0.3
    ) || [];
  },

  // Get a specific call by ID
  async getCall(callId: string) {
    const { data, error } = await supabase
      .from('enhanced_calls_view')
      .select('*')
      .eq('id', callId)
      .single();

    if (error) throw error;
    return data;
  }
};

export const analyticsService = {
  // Get referee performance statistics
  async getRefereeStats(refereeName?: string, seasonName?: string) {
    if (refereeName) {
      const { data, error } = await supabase.rpc('get_referee_season_stats', {
        referee_name: refereeName,
        season_name: seasonName
      });
      if (error) throw error;
      return data;
    }

    // Get all referees with basic stats
    const { data, error } = await supabase
      .from('referees')
      .select('*')
      .order('accuracy_rating', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get team statistics
  async getTeamStats(teamAbbr?: string, seasonName?: string) {
    if (teamAbbr) {
      const { data, error } = await supabase.rpc('get_team_foul_stats', {
        team_abbr: teamAbbr,
        season_name: seasonName
      });
      if (error) throw error;
      return data;
    }

    // Get all teams
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get call type distribution
  async getCallTypeDistribution(seasonName?: string) {
    let query = supabase
      .from('enhanced_calls_view')
      .select('call_type, correct_votes, incorrect_votes, unclear_votes, total_votes');

    if (seasonName) {
      query = query.eq('season_name', seasonName);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Aggregate by call type
    const distribution = data?.reduce((acc: any, call) => {
      const type = call.call_type;
      if (!acc[type]) {
        acc[type] = {
          type,
          count: 0,
          total_votes: 0,
          correct_votes: 0,
          incorrect_votes: 0,
          unclear_votes: 0
        };
      }
      acc[type].count++;
      acc[type].total_votes += call.total_votes || 0;
      acc[type].correct_votes += call.correct_votes || 0;
      acc[type].incorrect_votes += call.incorrect_votes || 0;
      acc[type].unclear_votes += call.unclear_votes || 0;
      return acc;
    }, {});

    return Object.values(distribution || {}).map((item: any) => ({
      ...item,
      accuracy: item.total_votes > 0 ? 
        Math.round((item.correct_votes / item.total_votes) * 100) : 0
    }));
  },

  // Get voting trends over time
  async getVotingTrends(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('enhanced_calls_view')
      .select('created_at, correct_votes, incorrect_votes, unclear_votes')
      .gte('created_at', startDate.toISOString())
      .order('created_at');

    if (error) throw error;

    // Group by date
    const trends = data?.reduce((acc: any, call) => {
      const date = call.created_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          correct: 0,
          incorrect: 0,
          unclear: 0
        };
      }
      acc[date].correct += call.correct_votes || 0;
      acc[date].incorrect += call.incorrect_votes || 0;
      acc[date].unclear += call.unclear_votes || 0;
      return acc;
    }, {});

    return Object.values(trends || {});
  },

  // Get quarter analysis
  async getQuarterAnalysis(seasonName?: string) {
    let query = supabase
      .from('enhanced_calls_view')
      .select('quarter, correct_votes, incorrect_votes, unclear_votes, total_votes');

    if (seasonName) {
      query = query.eq('season_name', seasonName);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Group by quarter
    const quarterStats = data?.reduce((acc: any, call) => {
      const quarter = call.quarter;
      if (!acc[quarter]) {
        acc[quarter] = {
          quarter,
          callCount: 0,
          totalVotes: 0,
          correctVotes: 0
        };
      }
      acc[quarter].callCount++;
      acc[quarter].totalVotes += call.total_votes || 0;
      acc[quarter].correctVotes += call.correct_votes || 0;
      return acc;
    }, {});

    return Object.values(quarterStats || {}).map((item: any) => ({
      quarter: item.quarter,
      callCount: item.callCount,
      accuracy: item.totalVotes > 0 ? 
        Math.round((item.correctVotes / item.totalVotes) * 100) : 0
    }));
  }
};

export const teamsService = {
  // Get all teams
  async getTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get teams by conference
  async getTeamsByConference(conference: 'Eastern' | 'Western') {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('conference', conference)
      .order('name');

    if (error) throw error;
    return data;
  }
};

export const seasonsService = {
  // Get all seasons
  async getSeasons() {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get current season
  async getCurrentSeason() {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('is_current', true)
      .single();

    if (error) throw error;
    return data;
  }
};

// Keep existing services for backward compatibility
export const votesService = {
  // Submit a vote (with user authentication support)
  async submitVote(callId: string, voteType: 'correct' | 'incorrect' | 'unclear', ipAddress?: string, userId?: string) {
    // Use upsert to handle both new votes and vote updates
    const { data, error } = await supabase
      .from('votes')
      .upsert({
        call_id: callId,
        vote_type: voteType,
        ip_address: ipAddress,
        user_id: userId
      }, {
        // Set the conflict resolution based on whether we have a user_id or ip_address
        onConflict: userId ? 'call_id,user_id' : 'call_id,ip_address'
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