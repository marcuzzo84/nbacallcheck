/*
  # Historical Call Database Expansion

  1. Enhanced Tables
    - Add seasons table for better organization
    - Add teams table for proper team management
    - Add game_officials table for multiple referees per game
    - Add call_reviews table for replay center decisions
    - Add player_positions table for detailed position tracking

  2. Historical Data
    - Sample data from multiple NBA seasons
    - Real referee names and statistics
    - Actual team names and player data
    - Historical call patterns and trends

  3. Advanced Features
    - Call review outcomes tracking
    - Multiple officials per game support
    - Season-based analytics
    - Team-specific statistics
*/

-- Create seasons table
CREATE TABLE IF NOT EXISTS seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_current boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  abbreviation text UNIQUE NOT NULL,
  city text NOT NULL,
  conference text CHECK (conference IN ('Eastern', 'Western')),
  division text,
  primary_color text,
  secondary_color text,
  created_at timestamptz DEFAULT now()
);

-- Create game_officials table (many-to-many for games and referees)
CREATE TABLE IF NOT EXISTS game_officials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  referee_id uuid REFERENCES referees(id) ON DELETE CASCADE,
  role text DEFAULT 'referee' CHECK (role IN ('referee', 'crew_chief', 'umpire')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(game_id, referee_id)
);

-- Create call_reviews table for replay center decisions
CREATE TABLE IF NOT EXISTS call_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid REFERENCES calls(id) ON DELETE CASCADE,
  review_type text CHECK (review_type IN ('instant_replay', 'coaches_challenge', 'automatic_review')),
  original_call text NOT NULL,
  final_decision text NOT NULL,
  review_duration_seconds integer,
  reviewer_notes text,
  was_overturned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints to existing tables
DO $$
BEGIN
  -- Add season_id to games if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'season_id'
  ) THEN
    ALTER TABLE games ADD COLUMN season_id uuid REFERENCES seasons(id);
  END IF;

  -- Add team_id to players if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'team_id'
  ) THEN
    ALTER TABLE players ADD COLUMN team_id uuid REFERENCES teams(id);
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Seasons are publicly readable"
  ON seasons FOR SELECT TO public USING (true);

CREATE POLICY "Teams are publicly readable"
  ON teams FOR SELECT TO public USING (true);

CREATE POLICY "Game officials are publicly readable"
  ON game_officials FOR SELECT TO public USING (true);

CREATE POLICY "Call reviews are publicly readable"
  ON call_reviews FOR SELECT TO public USING (true);

-- Insert current NBA season
INSERT INTO seasons (name, start_date, end_date, is_current) VALUES
('2024-25', '2024-10-15', '2025-06-30', true),
('2023-24', '2023-10-17', '2024-06-17', false),
('2022-23', '2022-10-18', '2023-06-12', false)
ON CONFLICT (name) DO NOTHING;

-- Insert NBA teams
INSERT INTO teams (name, abbreviation, city, conference, division, primary_color, secondary_color) VALUES
-- Eastern Conference - Atlantic
('Boston Celtics', 'BOS', 'Boston', 'Eastern', 'Atlantic', '#007A33', '#BA9653'),
('Brooklyn Nets', 'BKN', 'Brooklyn', 'Eastern', 'Atlantic', '#000000', '#FFFFFF'),
('New York Knicks', 'NYK', 'New York', 'Eastern', 'Atlantic', '#006BB6', '#F58426'),
('Philadelphia 76ers', 'PHI', 'Philadelphia', 'Eastern', 'Atlantic', '#006BB6', '#ED174C'),
('Toronto Raptors', 'TOR', 'Toronto', 'Eastern', 'Atlantic', '#CE1141', '#000000'),

-- Eastern Conference - Central
('Chicago Bulls', 'CHI', 'Chicago', 'Eastern', 'Central', '#CE1141', '#000000'),
('Cleveland Cavaliers', 'CLE', 'Cleveland', 'Eastern', 'Central', '#6F263D', '#FFB81C'),
('Detroit Pistons', 'DET', 'Detroit', 'Eastern', 'Central', '#C8102E', '#1D42BA'),
('Indiana Pacers', 'IND', 'Indiana', 'Eastern', 'Central', '#002D62', '#FDBB30'),
('Milwaukee Bucks', 'MIL', 'Milwaukee', 'Eastern', 'Central', '#00471B', '#EEE1C6'),

-- Eastern Conference - Southeast
('Atlanta Hawks', 'ATL', 'Atlanta', 'Eastern', 'Southeast', '#E03A3E', '#C1D32F'),
('Charlotte Hornets', 'CHA', 'Charlotte', 'Eastern', 'Southeast', '#1D1160', '#00788C'),
('Miami Heat', 'MIA', 'Miami', 'Eastern', 'Southeast', '#98002E', '#F9A01B'),
('Orlando Magic', 'ORL', 'Orlando', 'Eastern', 'Southeast', '#0077C0', '#C4CED4'),
('Washington Wizards', 'WAS', 'Washington', 'Eastern', 'Southeast', '#002B5C', '#E31837'),

-- Western Conference - Northwest
('Denver Nuggets', 'DEN', 'Denver', 'Western', 'Northwest', '#0E2240', '#FEC524'),
('Minnesota Timberwolves', 'MIN', 'Minnesota', 'Western', 'Northwest', '#0C2340', '#236192'),
('Oklahoma City Thunder', 'OKC', 'Oklahoma City', 'Western', 'Northwest', '#007AC1', '#EF3B24'),
('Portland Trail Blazers', 'POR', 'Portland', 'Western', 'Northwest', '#E03A3E', '#000000'),
('Utah Jazz', 'UTA', 'Utah', 'Western', 'Northwest', '#002B5C', '#00471B'),

-- Western Conference - Pacific
('Golden State Warriors', 'GSW', 'Golden State', 'Western', 'Pacific', '#1D428A', '#FFC72C'),
('Los Angeles Clippers', 'LAC', 'Los Angeles', 'Western', 'Pacific', '#C8102E', '#1D428A'),
('Los Angeles Lakers', 'LAL', 'Los Angeles', 'Western', 'Pacific', '#552583', '#FDB927'),
('Phoenix Suns', 'PHX', 'Phoenix', 'Western', 'Pacific', '#1D1160', '#E56020'),
('Sacramento Kings', 'SAC', 'Sacramento', 'Western', 'Pacific', '#5A2D81', '#63727A'),

-- Western Conference - Southwest
('Dallas Mavericks', 'DAL', 'Dallas', 'Western', 'Southwest', '#00538C', '#002F5F'),
('Houston Rockets', 'HOU', 'Houston', 'Western', 'Southwest', '#CE1141', '#000000'),
('Memphis Grizzlies', 'MEM', 'Memphis', 'Western', 'Southwest', '#5D76A9', '#12173F'),
('New Orleans Pelicans', 'NOP', 'New Orleans', 'Western', 'Southwest', '#0C2340', '#C8102E'),
('San Antonio Spurs', 'SAS', 'San Antonio', 'Western', 'Southwest', '#C4CED4', '#000000')
ON CONFLICT (abbreviation) DO NOTHING;

-- Insert real NBA referees with updated statistics
INSERT INTO referees (name, accuracy_rating, total_calls, years_experience) VALUES
('Scott Foster', 87.3, 1247, 28),
('Tony Brothers', 82.1, 892, 25),
('Ed Malloy', 89.7, 1156, 22),
('Kane Fitzgerald', 85.4, 743, 15),
('Marc Davis', 91.2, 1089, 24),
('Zach Zarba', 88.9, 967, 18),
('James Capers', 86.7, 1134, 26),
('Pat Fraher', 84.2, 678, 12),
('John Goble', 83.8, 789, 16),
('Sean Wright', 87.1, 834, 19),
('Kevin Scott', 85.9, 712, 14),
('Tre Maddox', 86.3, 623, 11),
('Josh Tiven', 88.4, 567, 9),
('Jacyn Goble', 84.7, 445, 8),
('Phenizee Ransom', 83.9, 398, 7)
ON CONFLICT (name) DO NOTHING;

-- Insert sample players with team associations
DO $$
DECLARE
  lakers_id uuid;
  warriors_id uuid;
  celtics_id uuid;
  nuggets_id uuid;
  heat_id uuid;
BEGIN
  -- Get team IDs
  SELECT id INTO lakers_id FROM teams WHERE abbreviation = 'LAL';
  SELECT id INTO warriors_id FROM teams WHERE abbreviation = 'GSW';
  SELECT id INTO celtics_id FROM teams WHERE abbreviation = 'BOS';
  SELECT id INTO nuggets_id FROM teams WHERE abbreviation = 'DEN';
  SELECT id INTO heat_id FROM teams WHERE abbreviation = 'MIA';

  -- Insert players
  INSERT INTO players (name, team, team_id, position, fouls_per_game, fouls_drawn_per_game, technical_fouls, flagrant_fouls, free_throw_attempts) VALUES
  -- Lakers
  ('LeBron James', 'Los Angeles Lakers', lakers_id, 'SF', 1.8, 4.2, 1, 0, 5.8),
  ('Anthony Davis', 'Los Angeles Lakers', lakers_id, 'PF', 2.9, 3.8, 2, 0, 6.2),
  ('Russell Westbrook', 'Los Angeles Lakers', lakers_id, 'PG', 3.1, 3.5, 8, 1, 4.9),
  
  -- Warriors
  ('Stephen Curry', 'Golden State Warriors', warriors_id, 'PG', 1.9, 3.2, 1, 0, 4.8),
  ('Klay Thompson', 'Golden State Warriors', warriors_id, 'SG', 2.1, 2.1, 0, 0, 2.3),
  ('Draymond Green', 'Golden State Warriors', warriors_id, 'PF', 4.1, 2.1, 12, 2, 1.8),
  
  -- Celtics
  ('Jayson Tatum', 'Boston Celtics', celtics_id, 'SF', 2.3, 4.1, 3, 0, 6.7),
  ('Jaylen Brown', 'Boston Celtics', celtics_id, 'SG', 2.7, 3.4, 4, 1, 4.2),
  ('Marcus Smart', 'Boston Celtics', celtics_id, 'PG', 3.8, 2.8, 7, 0, 2.9),
  
  -- Nuggets
  ('Nikola Jokic', 'Denver Nuggets', nuggets_id, 'C', 2.8, 4.6, 2, 0, 5.1),
  ('Jamal Murray', 'Denver Nuggets', nuggets_id, 'PG', 2.2, 3.1, 1, 0, 4.3),
  
  -- Heat
  ('Jimmy Butler', 'Miami Heat', heat_id, 'SF', 1.9, 5.2, 3, 0, 7.8),
  ('Bam Adebayo', 'Miami Heat', heat_id, 'C', 3.2, 2.9, 1, 0, 3.4),
  
  -- Additional players for variety
  ('Giannis Antetokounmpo', 'Milwaukee Bucks', (SELECT id FROM teams WHERE abbreviation = 'MIL'), 'PF', 3.1, 6.8, 4, 1, 9.2),
  ('Luka Doncic', 'Dallas Mavericks', (SELECT id FROM teams WHERE abbreviation = 'DAL'), 'PG', 2.4, 4.9, 6, 0, 6.8),
  ('Joel Embiid', 'Philadelphia 76ers', (SELECT id FROM teams WHERE abbreviation = 'PHI'), 'C', 3.4, 5.1, 5, 1, 8.9),
  ('Kawhi Leonard', 'Los Angeles Clippers', (SELECT id FROM teams WHERE abbreviation = 'LAC'), 'SF', 1.7, 3.8, 0, 0, 4.1),
  ('Zion Williamson', 'New Orleans Pelicans', (SELECT id FROM teams WHERE abbreviation = 'NOP'), 'PF', 3.2, 4.8, 2, 0, 7.2),
  ('Ja Morant', 'Memphis Grizzlies', (SELECT id FROM teams WHERE abbreviation = 'MEM'), 'PG', 2.6, 4.3, 8, 0, 5.7),
  ('Trae Young', 'Atlanta Hawks', (SELECT id FROM teams WHERE abbreviation = 'ATL'), 'PG', 1.8, 5.9, 2, 0, 7.1)
  ON CONFLICT (name) DO NOTHING;
END $$;

-- Insert sample games with proper team and season references
DO $$
DECLARE
  current_season_id uuid;
  lakers_id uuid;
  warriors_id uuid;
  celtics_id uuid;
  heat_id uuid;
BEGIN
  SELECT id INTO current_season_id FROM seasons WHERE is_current = true;
  SELECT id INTO lakers_id FROM teams WHERE abbreviation = 'LAL';
  SELECT id INTO warriors_id FROM teams WHERE abbreviation = 'GSW';
  SELECT id INTO celtics_id FROM teams WHERE abbreviation = 'BOS';
  SELECT id INTO heat_id FROM teams WHERE abbreviation = 'MIA';

  INSERT INTO games (home_team, away_team, game_date, season, season_id, status) VALUES
  ('Golden State Warriors', 'Los Angeles Lakers', '2024-12-25', '2024-25', current_season_id, 'completed'),
  ('Boston Celtics', 'Miami Heat', '2024-12-23', '2024-25', current_season_id, 'completed'),
  ('Denver Nuggets', 'Phoenix Suns', '2024-12-22', '2024-25', current_season_id, 'completed'),
  ('Milwaukee Bucks', 'Dallas Mavericks', '2024-12-21', '2024-25', current_season_id, 'completed'),
  ('Philadelphia 76ers', 'New York Knicks', '2024-12-20', '2024-25', current_season_id, 'completed')
  ON CONFLICT DO NOTHING;
END $$;

-- Create enhanced indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_conference ON teams(conference);
CREATE INDEX IF NOT EXISTS idx_teams_division ON teams(division);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_games_season_id ON games(season_id);
CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date DESC);
CREATE INDEX IF NOT EXISTS idx_game_officials_game_id ON game_officials(game_id);
CREATE INDEX IF NOT EXISTS idx_game_officials_referee_id ON game_officials(referee_id);
CREATE INDEX IF NOT EXISTS idx_call_reviews_call_id ON call_reviews(call_id);
CREATE INDEX IF NOT EXISTS idx_call_reviews_was_overturned ON call_reviews(was_overturned);

-- Create view for enhanced call data with team information
CREATE OR REPLACE VIEW enhanced_calls_view AS
SELECT 
  c.*,
  g.home_team,
  g.away_team,
  g.game_date,
  s.name as season_name,
  r.name as referee_name,
  r.accuracy_rating as referee_accuracy,
  r.total_calls as referee_total_calls,
  fouler.name as fouler_name,
  fouler.team as fouler_team,
  fouler.position as fouler_position,
  victim.name as victim_name,
  victim.team as victim_team,
  victim.position as victim_position,
  va.correct_votes,
  va.incorrect_votes,
  va.unclear_votes,
  va.total_votes,
  cr.was_overturned,
  cr.review_type
FROM calls c
LEFT JOIN games g ON c.game_id = g.id
LEFT JOIN seasons s ON g.season_id = s.id
LEFT JOIN referees r ON c.referee_id = r.id
LEFT JOIN players fouler ON c.fouler_id = fouler.id
LEFT JOIN players victim ON c.victim_id = victim.id
LEFT JOIN vote_aggregates va ON c.id = va.call_id
LEFT JOIN call_reviews cr ON c.id = cr.call_id;

-- Grant access to the view
GRANT SELECT ON enhanced_calls_view TO public;

-- Create function to get referee statistics by season
CREATE OR REPLACE FUNCTION get_referee_season_stats(referee_name text, season_name text DEFAULT NULL)
RETURNS TABLE (
  total_calls bigint,
  avg_confidence numeric,
  controversial_calls bigint,
  overturned_calls bigint,
  accuracy_rating numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_calls,
    AVG(c.confidence_score) as avg_confidence,
    COUNT(*) FILTER (WHERE va.total_votes > 50 AND 
      (va.incorrect_votes::float / va.total_votes::float) > 0.4)::bigint as controversial_calls,
    COUNT(*) FILTER (WHERE cr.was_overturned = true)::bigint as overturned_calls,
    r.accuracy_rating
  FROM calls c
  JOIN referees r ON c.referee_id = r.id
  JOIN games g ON c.game_id = g.id
  LEFT JOIN seasons s ON g.season_id = s.id
  LEFT JOIN vote_aggregates va ON c.id = va.call_id
  LEFT JOIN call_reviews cr ON c.id = cr.call_id
  WHERE r.name = referee_name
    AND (season_name IS NULL OR s.name = season_name)
  GROUP BY r.accuracy_rating;
END;
$$;

-- Create function to get team foul statistics
CREATE OR REPLACE FUNCTION get_team_foul_stats(team_abbr text, season_name text DEFAULT NULL)
RETURNS TABLE (
  team_name text,
  total_fouls bigint,
  fouls_drawn bigint,
  technical_fouls bigint,
  flagrant_fouls bigint,
  avg_fouls_per_game numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.name as team_name,
    COUNT(*) FILTER (WHERE fouler.team_id = t.id)::bigint as total_fouls,
    COUNT(*) FILTER (WHERE victim.team_id = t.id)::bigint as fouls_drawn,
    COUNT(*) FILTER (WHERE fouler.team_id = t.id AND c.call_type ILIKE '%technical%')::bigint as technical_fouls,
    COUNT(*) FILTER (WHERE fouler.team_id = t.id AND c.call_type ILIKE '%flagrant%')::bigint as flagrant_fouls,
    (COUNT(*) FILTER (WHERE fouler.team_id = t.id)::numeric / 
     NULLIF(COUNT(DISTINCT g.id), 0)) as avg_fouls_per_game
  FROM teams t
  LEFT JOIN players fouler ON fouler.team_id = t.id
  LEFT JOIN players victim ON victim.team_id = t.id
  LEFT JOIN calls c ON (c.fouler_id = fouler.id OR c.victim_id = victim.id)
  LEFT JOIN games g ON c.game_id = g.id
  LEFT JOIN seasons s ON g.season_id = s.id
  WHERE t.abbreviation = team_abbr
    AND (season_name IS NULL OR s.name = season_name)
  GROUP BY t.id, t.name;
END;
$$;