-- ⚠️ DANGER: This will delete ALL data from your database
-- Run this in Supabase SQL Editor to reset everything

-- Step 1: Delete all attendance records
DELETE FROM attendance;

-- Step 2: Delete all profiles
DELETE FROM profiles;

-- Step 3: Delete all auth users (requires admin privileges)
-- Go to Supabase Dashboard → Authentication → Users
-- Select all users and click "Delete users"
-- OR use this SQL (may require service_role key):

-- For manual deletion via Dashboard:
-- 1. Go to Authentication → Users
-- 2. Select each user
-- 3. Click the three dots → Delete user

-- Step 4: Clear storage bucket (optional)
-- Go to Storage → checkinphoto → Select all files → Delete

-- Step 5: Verify everything is deleted
SELECT COUNT(*) as attendance_count FROM attendance;
SELECT COUNT(*) as profiles_count FROM profiles;

-- You should see 0 for both counts
