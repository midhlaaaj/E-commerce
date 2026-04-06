-- Add birthday column to profiles table
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS birthday DATE;

-- Update the schema cache (standard for Supabase/PostgREST)
NOTIFY pgrst, 'reload schema';
