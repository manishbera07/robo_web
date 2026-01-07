-- Drop existing tables if they exist (for clean recreation)
DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS achievements;

-- Achievements/Badges table (for games, events, and activities)
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  category TEXT NOT NULL, -- 'game', 'event', 'activity', 'milestone'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User achievements (junction table)
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view achievements
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT
  USING (true);

-- Anyone can view user achievements
CREATE POLICY "Anyone can view user achievements" ON user_achievements
  FOR SELECT
  USING (true);

-- Users can insert their own achievements
CREATE POLICY "Users can earn achievements" ON user_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO achievements (name, description, badge_icon, category) VALUES
  -- Game Achievements
  ('First Steps', 'Play your first game', '🎮', 'game'),
  ('Quick Reflexes', 'Score 50+ on Reaction Test', '⚡', 'game'),
  ('Memory Master', 'Score 100+ on Memory Matrix', '🧠', 'game'),
  ('Pattern Wizard', 'Score 75+ on Pattern Pulse', '🎵', 'game'),
  ('Binary Expert', 'Score 80+ on Binary Breaker', '💻', 'game'),
  ('Game Addict', 'Play 10 games', '🕹️', 'milestone'),
  ('Top Performer', 'Score 100+ on any game', '🏆', 'milestone'),
  
  -- Event Achievements
  ('Club Member', 'Register for your first event', '🎯', 'event'),
  ('Event Enthusiast', 'Register for 3+ events', '📅', 'event'),
  ('Event Champion', 'Register for 5+ events', '🌟', 'event'),
  ('All-In', 'Attend all upcoming events in a month', '🔥', 'event'),
  
  -- Activity Achievements
  ('Explorer', 'Visit all main sections (Events, Merch, Team, Arcade)', '🗺️', 'activity'),
  ('Team Player', 'View team members profiles', '👥', 'activity'),
  ('Shopper', 'Browse merchandise catalog', '🛍️', 'activity'),
  ('Profile Master', 'Complete your profile (College ID + Full Name)', '⚙️', 'activity'),
  ('Collector', 'Register for an event AND play a game', '🎁', 'milestone'),
  ('Legend', 'Unlock 10+ achievements', '👑', 'milestone')
ON CONFLICT (name) DO NOTHING;
