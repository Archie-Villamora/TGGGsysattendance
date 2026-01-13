-- Profile picture bucket policies
-- Run this in Supabase SQL Editor after creating the 'profilepicture' bucket

-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Allow users to upload own profile" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profilepicture' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to view profile pictures
CREATE POLICY "Allow public profile access" ON storage.objects
FOR SELECT USING (bucket_id = 'profilepicture');

-- Allow users to update their own profile pictures
CREATE POLICY "Allow users to update own profile" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profilepicture' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own profile pictures
CREATE POLICY "Allow users to delete own profile" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profilepicture' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);