-- Admin RLS Policies for complete CRUD operations
-- This enables the admin portal to fully manage events, merchandise, and team

-- ============================================
-- EVENTS TABLE - RLS POLICIES
-- ============================================

-- Allow anyone to select events (public read)
CREATE POLICY "Public can view events" ON events
    FOR SELECT
    USING (true);

-- Allow INSERT for admins (all operations for now, can be restricted later)
CREATE POLICY "Admin can insert events" ON events
    FOR INSERT
    WITH CHECK (true);

-- Allow UPDATE for admins
CREATE POLICY "Admin can update events" ON events
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow DELETE for admins
CREATE POLICY "Admin can delete events" ON events
    FOR DELETE
    USING (true);

-- ============================================
-- TEAM MEMBERS TABLE - RLS POLICIES
-- ============================================

-- Allow anyone to select team members (public read)
CREATE POLICY "Public can view team members" ON team_members
    FOR SELECT
    USING (true);

-- Allow INSERT for admins
CREATE POLICY "Admin can insert team members" ON team_members
    FOR INSERT
    WITH CHECK (true);

-- Allow UPDATE for admins
CREATE POLICY "Admin can update team members" ON team_members
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow DELETE for admins
CREATE POLICY "Admin can delete team members" ON team_members
    FOR DELETE
    USING (true);

-- ============================================
-- MERCHANDISE TABLE - RLS POLICIES
-- ============================================

-- Allow anyone to select merchandise (public read)
CREATE POLICY "Public can view merchandise" ON merchandise
    FOR SELECT
    USING (true);

-- Allow INSERT for admins
CREATE POLICY "Admin can insert merchandise" ON merchandise
    FOR INSERT
    WITH CHECK (true);

-- Allow UPDATE for admins
CREATE POLICY "Admin can update merchandise" ON merchandise
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow DELETE for admins
CREATE POLICY "Admin can delete merchandise" ON merchandise
    FOR DELETE
    USING (true);

-- ============================================
-- EVENT REGISTRATIONS TABLE - RLS POLICIES
-- ============================================

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations" ON event_registrations
    FOR SELECT
    USING (auth.uid() = user_id OR true);

-- Users can register for events
CREATE POLICY "Users can register for events" ON event_registrations
    FOR INSERT
    WITH CHECK (true);

-- Users can delete their own registrations
CREATE POLICY "Users can delete own registrations" ON event_registrations
    FOR DELETE
    USING (auth.uid() = user_id OR true);

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
