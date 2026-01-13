-- Fix infinite recursion in profiles RLS policies
-- Run this in Supabase SQL Editor

-- Drop ALL existing policies on profiles
DROP POLICY IF EXISTS "Coordinators can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create a function to check if user is coordinator (bypasses RLS)
CREATE OR REPLACE FUNCTION is_coordinator(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'coordinator'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies without recursion
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Coordinators can view all profiles" ON profiles
  FOR SELECT USING (is_coordinator(auth.uid()));
