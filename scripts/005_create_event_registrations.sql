-- Create event_registrations table to track user event registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    college_id TEXT,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own registrations
CREATE POLICY "Users can view own registrations" ON public.event_registrations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to register for events
CREATE POLICY "Users can register for events" ON public.event_registrations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own registrations
CREATE POLICY "Users can delete own registrations" ON public.event_registrations
    FOR DELETE
    USING (auth.uid() = user_id);

-- Allow public to see registration counts (optional)
CREATE POLICY "Public can view registration counts" ON public.event_registrations
    FOR SELECT
    USING (true);
