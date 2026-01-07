-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  student_id TEXT UNIQUE,
  department TEXT,
  year_of_study INTEGER,
  xp_points INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  capacity INTEGER,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Create merch_products table
CREATE TABLE IF NOT EXISTS merch_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  sizes TEXT[], -- Available sizes
  colors TEXT[], -- Available colors
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES merch_products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_scores table for leaderboard
CREATE TABLE IF NOT EXISTS game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  game_type TEXT DEFAULT 'circuit_breaker',
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Events policies (everyone can view events)
CREATE POLICY "events_select_all" ON events FOR SELECT TO authenticated USING (true);

-- Event registrations policies
CREATE POLICY "registrations_select_own" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "registrations_insert_own" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "registrations_delete_own" ON event_registrations FOR DELETE USING (auth.uid() = user_id);

-- Merch products policies (everyone can view)
CREATE POLICY "products_select_all" ON merch_products FOR SELECT TO authenticated USING (true);

-- Orders policies
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Game scores policies
CREATE POLICY "scores_select_all" ON game_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "scores_insert_own" ON game_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
