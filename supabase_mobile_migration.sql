-- Run this in your Supabase SQL Editor to support mobile-specific crops
ALTER TABLE public.homepage_content 
ADD COLUMN IF NOT EXISTS mobile_image_url TEXT;
