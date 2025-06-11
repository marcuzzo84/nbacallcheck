/*
  # Authentication and Subscription Schema Setup

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, not null)
      - `username` (text, optional)
      - `avatar_url` (text, optional)
      - `subscription_tier` (text, default 'free')
      - `subscription_status` (text, default 'active')
      - `subscription_expires_at` (timestamptz, optional)
      - `total_votes` (integer, default 0)
      - `accuracy_score` (numeric, optional)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for authenticated users to read/update their own data
    - Add policy for public read access to basic profile info
    - Add trigger function for automatic profile creation on user signup

  3. Enhanced Voting System
    - Update votes table to support user authentication
    - Add foreign key constraint to user_profiles
    - Add trigger to update user vote counts
    - Enhanced vote aggregation with proper security context

  4. Indexes
    - Performance indexes for email, username, and subscription queries
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  username text,
  avatar_url text,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  subscription_expires_at timestamptz,
  total_votes integer DEFAULT 0,
  accuracy_score numeric,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public profiles are readable"
  ON user_profiles
  FOR SELECT
  TO public
  USING (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, username)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update votes table to include user_id foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'votes_user_id_fkey'
  ) THEN
    ALTER TABLE votes 
    ADD CONSTRAINT votes_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enhanced vote aggregation function with proper security
CREATE OR REPLACE FUNCTION update_vote_aggregates()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert or update vote aggregates
  INSERT INTO vote_aggregates (call_id, correct_votes, incorrect_votes, unclear_votes, total_votes)
  VALUES (
    NEW.call_id,
    CASE WHEN NEW.vote_type = 'correct' THEN 1 ELSE 0 END,
    CASE WHEN NEW.vote_type = 'incorrect' THEN 1 ELSE 0 END,
    CASE WHEN NEW.vote_type = 'unclear' THEN 1 ELSE 0 END,
    1
  )
  ON CONFLICT (call_id) DO UPDATE SET
    correct_votes = vote_aggregates.correct_votes + CASE WHEN NEW.vote_type = 'correct' THEN 1 ELSE 0 END,
    incorrect_votes = vote_aggregates.incorrect_votes + CASE WHEN NEW.vote_type = 'incorrect' THEN 1 ELSE 0 END,
    unclear_votes = vote_aggregates.unclear_votes + CASE WHEN NEW.vote_type = 'unclear' THEN 1 ELSE 0 END,
    total_votes = vote_aggregates.total_votes + 1,
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Function to update user vote count
CREATE OR REPLACE FUNCTION update_user_vote_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only update if user_id is provided (authenticated users)
  IF NEW.user_id IS NOT NULL THEN
    UPDATE user_profiles 
    SET total_votes = total_votes + 1
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to update vote count when user votes
DROP TRIGGER IF EXISTS update_user_vote_count_trigger ON votes;
CREATE TRIGGER update_user_vote_count_trigger
  AFTER INSERT ON votes
  FOR EACH ROW 
  EXECUTE FUNCTION update_user_vote_count();

-- Add policies for vote aggregates (needed for trigger operations)
CREATE POLICY "Allow trigger operations for vote aggregates insert"
  ON vote_aggregates
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow trigger operations for vote aggregates update"
  ON vote_aggregates
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(subscription_tier, subscription_status);

-- Add unique constraint for user votes (prevent duplicate voting by same user)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'votes_call_id_user_id_key'
  ) THEN
    ALTER TABLE votes 
    ADD CONSTRAINT votes_call_id_user_id_key 
    UNIQUE (call_id, user_id);
  END IF;
END $$;