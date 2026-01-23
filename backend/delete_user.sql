-- SQL Script to Delete a User and All Related Data
-- Replace 'USER_ID_HERE' with the actual user ID you want to delete

-- Step 1: Delete overtime requests
DELETE FROM "public"."overtime_requests" 
WHERE "user_id" = 'USER_ID_HERE';

-- Step 2: Delete attendance records
DELETE FROM "public"."attendance" 
WHERE "user_id" = 'USER_ID_HERE';

-- Step 3: Delete the profile
DELETE FROM "public"."profiles" 
WHERE "id" = 'USER_ID_HERE';

-- Step 4: Delete the auth user
DELETE FROM auth.users 
WHERE id = 'USER_ID_HERE';

-- Example usage:
-- Replace 'USER_ID_HERE' with actual UUID like '9afdd5cb-285b-4510-af7d-5eb3d7f3cbab'
