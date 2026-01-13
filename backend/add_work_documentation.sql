-- Add work_documentation column to attendance table
-- Run this in Supabase SQL Editor if table already exists

ALTER TABLE attendance 
ADD COLUMN IF NOT EXISTS work_documentation TEXT;
