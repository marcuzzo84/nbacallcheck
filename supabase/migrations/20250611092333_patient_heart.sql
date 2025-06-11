/*
  # Fix vote aggregates RLS policies

  1. Security Updates
    - Add INSERT and UPDATE policies for vote_aggregates table
    - Allow trigger functions to bypass RLS for vote_aggregates operations
    - Ensure proper permissions for automated vote counting

  2. Changes
    - Add policy for public INSERT on vote_aggregates (for trigger operations)
    - Add policy for public UPDATE on vote_aggregates (for trigger operations)
    - Update trigger functions to use SECURITY DEFINER if needed
*/

-- Add INSERT policy for vote_aggregates (needed for trigger operations)
CREATE POLICY "Allow trigger operations for vote aggregates insert"
  ON vote_aggregates
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Add UPDATE policy for vote_aggregates (needed for trigger operations)
CREATE POLICY "Allow trigger operations for vote aggregates update"
  ON vote_aggregates
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Ensure the trigger function has proper security context
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

-- Ensure the user vote count function also has proper security context
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