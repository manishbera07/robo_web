-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'organizer'));

-- Create organizers table with fixed credentials
CREATE TABLE IF NOT EXISTS organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on organizers table
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;

-- Organizer policies (organizers can only see their own data)
CREATE POLICY "organizers_select_own" ON organizers FOR SELECT USING (auth.uid()::text = id::text);

-- Update events to track who created it
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES organizers(id) ON DELETE SET NULL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;

-- Update merch_products to track who created it
ALTER TABLE merch_products ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES organizers(id) ON DELETE SET NULL;
ALTER TABLE merch_products ADD COLUMN IF NOT EXISTS image_storage_path TEXT;
ALTER TABLE merch_products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;

-- Update events policy to allow organizers to manage
CREATE POLICY "events_insert_organizer" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_update_own" ON events FOR UPDATE USING (created_by IS NOT NULL);
CREATE POLICY "events_delete_own" ON events FOR DELETE USING (created_by IS NOT NULL);

-- Update merch_products policy to allow organizers to manage
CREATE POLICY "products_insert_organizer" ON merch_products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update_own" ON merch_products FOR UPDATE USING (created_by IS NOT NULL);
CREATE POLICY "products_delete_own" ON merch_products FOR DELETE USING (created_by IS NOT NULL);
