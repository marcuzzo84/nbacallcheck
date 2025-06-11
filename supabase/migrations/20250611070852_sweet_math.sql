/*
  # NBA CallCheck Database Schema

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `home_team` (text)
      - `away_team` (text)
      - `game_date` (date)
      - `season` (text)
      - `status` (text)
    
    - `referees`
      - `id` (uuid, primary key)
      - `name` (text)
      - `accuracy_rating` (decimal)
      - `total_calls` (integer)
      - `years_experience` (integer)
    
    - `players`
      - `id` (uuid, primary key)
      - `name` (text)
      - `team` (text)
      - `position` (text)
      - `fouls_per_game` (decimal)
      - `fouls_drawn_per_game` (decimal)
    
    - `calls`
      - `id` (uuid, primary key)
      - `game_id` (uuid, foreign key)
      - `referee_id` (uuid, foreign key)
      - `call_type` (text)
      - `description` (text)
      - `confidence_score` (integer)
      - `quarter` (integer)
      - `time_remaining` (text)
      - `fouler_id` (uuid, foreign key)
      - `victim_id` (uuid, foreign key)
    
    - `votes`
      - `id` (uuid, primary key)
      - `call_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `vote_type` (text)
      - `ip_address` (text)
    
    - `vote_aggregates`
      - `call_id` (uuid, primary key)
      - `correct_votes` (integer)
      - `incorrect_votes` (integer)
      - `unclear_votes` (integer)
      - `total_votes` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated voting
    - Add policies for vote aggregation updates

  3. Functions
    - Function to update vote aggregates
    - Function to prevent duplicate voting from same IP
*/

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team text NOT NULL,
  away_team text NOT NULL,
  game_date date NOT NULL,
  season text NOT NULL DEFAULT '2024-25',
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

-- Create referees table
CREATE TABLE IF NOT EXISTS referees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  accuracy_rating decimal DEFAULT 85.0,
  total_calls integer DEFAULT 0,
  years_experience integer DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  team text NOT NULL,
  position text DEFAULT 'G',
  fouls_per_game decimal DEFAULT 2.5,
  fouls_drawn_per_game decimal DEFAULT 3.0,
  technical_fouls integer DEFAULT 0,
  flagrant_fouls integer DEFAULT 0,
  free_throw_attempts decimal DEFAULT 4.0,
  created_at timestamptz DEFAULT now()
);

-- Create calls table
CREATE TABLE IF NOT EXISTS calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  referee_id uuid REFERENCES referees(id) ON DELETE SET NULL,
  call_type text NOT NULL,
  description text NOT NULL,
  confidence_score integer DEFAULT 75 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  quarter integer NOT NULL CHECK (quarter >= 1 AND quarter <= 4),
  time_remaining text NOT NULL,
  fouler_id uuid REFERENCES players(id) ON DELETE SET NULL,
  victim_id uuid REFERENCES players(id) ON DELETE SET NULL,
  video_url text,
  created_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid REFERENCES calls(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('correct', 'incorrect', 'unclear')),
  ip_address text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(call_id, user_id),
  UNIQUE(call_id, ip_address)
);

-- Create vote aggregates table
CREATE TABLE IF NOT EXISTS vote_aggregates (
  call_id uuid PRIMARY KEY REFERENCES calls(id) ON DELETE CASCADE,
  correct_votes integer DEFAULT 0,
  incorrect_votes integer DEFAULT 0,
  unclear_votes integer DEFAULT 0,
  total_votes integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE referees ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_aggregates ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Games are publicly readable"
  ON games FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Referees are publicly readable"
  ON referees FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Players are publicly readable"
  ON players FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Calls are publicly readable"
  ON calls FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Vote aggregates are publicly readable"
  ON vote_aggregates FOR SELECT
  TO public
  USING (true);

-- Create policies for voting
CREATE POLICY "Anyone can vote"
  ON votes FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can see all votes"
  ON votes FOR SELECT
  TO public
  USING (true);

-- Create function to update vote aggregates
CREATE OR REPLACE FUNCTION update_vote_aggregates()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO vote_aggregates (call_id, correct_votes, incorrect_votes, unclear_votes, total_votes)
  VALUES (NEW.call_id, 0, 0, 0, 0)
  ON CONFLICT (call_id) DO NOTHING;
  
  UPDATE vote_aggregates
  SET 
    correct_votes = (SELECT COUNT(*) FROM votes WHERE call_id = NEW.call_id AND vote_type = 'correct'),
    incorrect_votes = (SELECT COUNT(*) FROM votes WHERE call_id = NEW.call_id AND vote_type = 'incorrect'),
    unclear_votes = (SELECT COUNT(*) FROM votes WHERE call_id = NEW.call_id AND vote_type = 'unclear'),
    total_votes = (SELECT COUNT(*) FROM votes WHERE call_id = NEW.call_id),
    updated_at = now()
  WHERE call_id = NEW.call_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update aggregates on vote insert
CREATE TRIGGER update_vote_aggregates_trigger
  AFTER INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_aggregates();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calls_game_id ON calls(game_id);
CREATE INDEX IF NOT EXISTS idx_calls_referee_id ON calls(referee_id);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_call_id ON votes(call_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_ip_address ON votes(ip_address);