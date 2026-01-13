-- Storage bucket setup for checkinphoto
-- Run this in Supabase SQL Editor after creating the 'checkinphoto' bucket

-- Create storage bucket (if not created via UI)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('checkinphoto', 'checkinphoto', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload photos
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'checkinphoto' 
  AND auth.role() = 'authenticated'
);

-- Allow public access to view photos
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'checkinphoto');

-- Allow users to update their own photos
CREATE POLICY "Allow users to update own photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'checkinphoto' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own photos
CREATE POLICY "Allow users to delete own photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'checkinphoto' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);