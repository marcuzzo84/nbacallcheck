/*
  # Seed Sample Data for NBA CallCheck

  1. Sample Data
    - Insert sample games, referees, players
    - Insert sample calls with realistic scenarios
    - Insert sample votes to demonstrate functionality

  2. Data Quality
    - Realistic NBA player names and stats
    - Actual referee names from NBA
    - Diverse call types and scenarios
*/

-- Insert sample games
INSERT INTO games (id, home_team, away_team, game_date, season, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Los Angeles Lakers', 'Golden State Warriors', '2024-01-15', '2024-25', 'completed'),
('550e8400-e29b-41d4-a716-446655440002', 'Boston Celtics', 'Miami Heat', '2024-01-16', '2024-25', 'completed'),
('550e8400-e29b-41d4-a716-446655440003', 'Denver Nuggets', 'Phoenix Suns', '2024-01-17', '2024-25', 'completed');

-- Insert sample referees
INSERT INTO referees (id, name, accuracy_rating, total_calls, years_experience) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Scott Foster', 87.3, 1247, 28),
('660e8400-e29b-41d4-a716-446655440002', 'Tony Brothers', 82.1, 892, 25),
('660e8400-e29b-41d4-a716-446655440003', 'Ed Malloy', 89.7, 1156, 22),
('660e8400-e29b-41d4-a716-446655440004', 'Marc Davis', 85.4, 1089, 24),
('660e8400-e29b-41d4-a716-446655440005', 'Kane Fitzgerald', 88.2, 756, 18);

-- Insert sample players
INSERT INTO players (id, name, team, position, fouls_per_game, fouls_drawn_per_game, technical_fouls, flagrant_fouls, free_throw_attempts) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'LeBron James', 'Los Angeles Lakers', 'F', 1.8, 4.2, 1, 0, 5.8),
('770e8400-e29b-41d4-a716-446655440002', 'Stephen Curry', 'Golden State Warriors', 'G', 1.9, 3.2, 1, 0, 4.8),
('770e8400-e29b-41d4-a716-446655440003', 'Jayson Tatum', 'Boston Celtics', 'F', 2.1, 3.8, 2, 0, 6.2),
('770e8400-e29b-41d4-a716-446655440004', 'Jimmy Butler', 'Miami Heat', 'F', 2.3, 4.5, 3, 1, 7.1),
('770e8400-e29b-41d4-a716-446655440005', 'Nikola Jokic', 'Denver Nuggets', 'C', 2.8, 2.9, 4, 0, 4.3),
('770e8400-e29b-41d4-a716-446655440006', 'Devin Booker', 'Phoenix Suns', 'G', 2.2, 3.6, 2, 0, 5.9),
('770e8400-e29b-41d4-a716-446655440007', 'Draymond Green', 'Golden State Warriors', 'F', 4.1, 2.1, 12, 2, 1.8),
('770e8400-e29b-41d4-a716-446655440008', 'Anthony Davis', 'Los Angeles Lakers', 'F/C', 3.2, 3.4, 1, 0, 6.8);

-- Insert sample calls
INSERT INTO calls (id, game_id, referee_id, call_type, description, confidence_score, quarter, time_remaining, fouler_id, victim_id) VALUES
('880e8400-e29b-41d4-a716-446655440001', 
 '550e8400-e29b-41d4-a716-446655440001', 
 '660e8400-e29b-41d4-a716-446655440001', 
 'Personal Foul', 
 'Defender bumps the ball handler with the body and halts his progress on the drive. Contact initiated by defender''s hip check.', 
 73, 2, '8:47', 
 '770e8400-e29b-41d4-a716-446655440007', 
 '770e8400-e29b-41d4-a716-446655440001'),

('880e8400-e29b-41d4-a716-446655440002', 
 '550e8400-e29b-41d4-a716-446655440001', 
 '660e8400-e29b-41d4-a716-446655440002', 
 'Technical Foul', 
 'Player argues excessively with referee after no-call on previous possession. Unsportsmanlike conduct.', 
 91, 3, '4:23', 
 '770e8400-e29b-41d4-a716-446655440007', 
 NULL),

('880e8400-e29b-41d4-a716-446655440003', 
 '550e8400-e29b-41d4-a716-446655440001', 
 '660e8400-e29b-41d4-a716-446655440003', 
 'Flagrant Foul', 
 'Excessive contact to the head and neck area during shooting motion. Unnecessary and excessive force applied.', 
 95, 4, '2:15', 
 '770e8400-e29b-41d4-a716-446655440008', 
 '770e8400-e29b-41d4-a716-446655440002'),

('880e8400-e29b-41d4-a716-446655440004', 
 '550e8400-e29b-41d4-a716-446655440002', 
 '660e8400-e29b-41d4-a716-446655440004', 
 'Charging Foul', 
 'Offensive player lowers shoulder and initiates contact with defender who had established position.', 
 68, 1, '11:32', 
 '770e8400-e29b-41d4-a716-446655440003', 
 '770e8400-e29b-41d4-a716-446655440004'),

('880e8400-e29b-41d4-a716-446655440005', 
 '550e8400-e29b-41d4-a716-446655440003', 
 '660e8400-e29b-41d4-a716-446655440005', 
 'Blocking Foul', 
 'Defender slides into path of driving player without establishing legal guarding position.', 
 82, 2, '6:18', 
 '770e8400-e29b-41d4-a716-446655440005', 
 '770e8400-e29b-41d4-a716-446655440006');

-- Insert sample votes to demonstrate functionality
INSERT INTO votes (call_id, vote_type, ip_address) VALUES
-- Call 1 votes
('880e8400-e29b-41d4-a716-446655440001', 'correct', '192.168.1.1'),
('880e8400-e29b-41d4-a716-446655440001', 'correct', '192.168.1.2'),
('880e8400-e29b-41d4-a716-446655440001', 'incorrect', '192.168.1.3'),
('880e8400-e29b-41d4-a716-446655440001', 'unclear', '192.168.1.4'),

-- Call 2 votes
('880e8400-e29b-41d4-a716-446655440002', 'correct', '192.168.1.5'),
('880e8400-e29b-41d4-a716-446655440002', 'correct', '192.168.1.6'),
('880e8400-e29b-41d4-a716-446655440002', 'correct', '192.168.1.7'),
('880e8400-e29b-41d4-a716-446655440002', 'incorrect', '192.168.1.8'),

-- Call 3 votes
('880e8400-e29b-41d4-a716-446655440003', 'correct', '192.168.1.9'),
('880e8400-e29b-41d4-a716-446655440003', 'correct', '192.168.1.10'),
('880e8400-e29b-41d4-a716-446655440003', 'correct', '192.168.1.11'),
('880e8400-e29b-41d4-a716-446655440003', 'correct', '192.168.1.12'),
('880e8400-e29b-41d4-a716-446655440003', 'incorrect', '192.168.1.13');