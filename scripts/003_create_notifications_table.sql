-- Create notifications table for event and merch subscription
CREATE TABLE IF NOT EXISTS event_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  notification_type VARCHAR(50) NOT NULL,
  is_confirmed BOOLEAN DEFAULT FALSE,
  confirmation_token VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_event_notifications_email ON event_notifications(email);

-- Create RLS policy for public insert (anyone can submit notification)
ALTER TABLE event_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert notifications" ON event_notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to select their own notifications" ON event_notifications
  FOR SELECT USING (true);
