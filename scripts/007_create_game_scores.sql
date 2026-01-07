-- Create game_scores table to track user game performance
CREATE TABLE IF NOT EXISTS game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  time_taken INTEGER, -- in milliseconds
  difficulty TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX idx_game_scores_game_name ON game_scores(game_name);
CREATE INDEX idx_game_scores_score ON game_scores(score DESC);

-- Enable RLS
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only view all game scores (for leaderboard)
CREATE POLICY "Anyone can view game scores" ON game_scores
  FOR SELECT
  USING (true);

-- Users can only insert their own scores
CREATE POLICY "Users can insert their own scores" ON game_scores
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own scores
CREATE POLICY "Users can view their own scores" ON game_scores
  FOR SELECT
  USING (auth.uid() = user_id OR true);
