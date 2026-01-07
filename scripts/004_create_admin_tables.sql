-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  image_url VARCHAR(500),
  event_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  department VARCHAR(255),
  bio TEXT,
  image_url VARCHAR(500),
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  email VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create merchandise table
CREATE TABLE IF NOT EXISTS merchandise (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10, 2),
  image_url VARCHAR(500),
  available BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public to read events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public to read team members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Allow public to read merchandise" ON merchandise FOR SELECT USING (true);

-- Create indexes for faster queries
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_team_members_order ON team_members(display_order);
CREATE INDEX idx_merchandise_category ON merchandise(category);
