-- Fix uniqueness of category names
-- This allows having the same category name (e.g., 'Shirt') for different genders.

ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_key;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_gender_key;
ALTER TABLE categories ADD CONSTRAINT categories_name_gender_key UNIQUE (name, gender);
