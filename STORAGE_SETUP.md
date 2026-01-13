# Supabase Storage Bucket Setup Guide

## Step 1: Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Click "Create a new bucket"
3. Fill in the details:
   - **Bucket name**: `checkinphoto`
   - **Public bucket**: ✅ Checked (Allow anyone to read objects)
   - **File size limit**: 5 MB (5242880 bytes)
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/jpg`, `image/webp`

## Step 2: Set Storage Policies

Go to Storage → checkinphoto → Policies and run these SQL commands:

```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'checkinphoto' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to all photos
CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'checkinphoto');

-- Allow users to update their own photos
CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'checkinphoto' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'checkinphoto' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 3: Update Backend to Use Supabase Storage

Your backend will now upload photos to Supabase Storage instead of local filesystem.

## Bucket Configuration Summary

- **Name**: checkinphoto
- **Public**: Yes (read-only)
- **Max file size**: 5 MB
- **Allowed types**: JPEG, PNG, JPG, WEBP
- **Upload path format**: `{user_id}/{timestamp}.{ext}`

## Testing

After setup, test by:
1. Login as intern
2. Upload photo during check-in
3. Verify photo appears in Storage → checkinphoto
4. Verify photo displays in attendance table
