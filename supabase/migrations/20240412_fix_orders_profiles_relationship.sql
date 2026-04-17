-- ==========================================
-- 🛠️ FIX ORDERS-PROFILES RELATIONSHIP AMBIGUITY
-- ==========================================

-- This migration adds an explicit foreign key from the public.orders table 
-- to the public.profiles table. This resolves the PostgREST ambiguity where
-- it couldn't decide how to join them (via auth.users or directly).

ALTER TABLE public.orders
-- Drop existing constraints to auth.users if we want to replace them with profile references
-- Or just add the new one. Usually, pointing to profiles is better for PostgREST.
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

ALTER TABLE public.orders
ADD CONSTRAINT orders_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- If shipping_addresses also has ambiguity, we can fix it too.
-- But let's start with orders.