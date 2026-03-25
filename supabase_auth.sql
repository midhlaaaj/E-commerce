-- ==========================================
-- 🛡️ ELITEWEAR AUTH & RBAC SYSTEM (Idempotent)
-- ==========================================

-- 0. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone' AND tablename = 'profiles') THEN
        CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- 4. Secure Products, Categories, and Homepage Content
-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Dynamic Policies for Write Access (Admins Only)
DO $$ 
BEGIN
    -- Products
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage products' AND tablename = 'products') THEN
        CREATE POLICY "Admins can manage products" ON public.products FOR ALL 
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable read access for all users' AND tablename = 'products') THEN
        CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (true);
    END IF;

    -- Categories
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage categories' AND tablename = 'categories') THEN
        CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL 
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable read access for all' AND tablename = 'categories') THEN
        CREATE POLICY "Enable read access for all" ON public.categories FOR SELECT USING (true);
    END IF;

    -- Homepage
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage homepage' AND tablename = 'homepage_content') THEN
        CREATE POLICY "Admins can manage homepage" ON public.homepage_content FOR ALL 
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Read access for homepage' AND tablename = 'homepage_content') THEN
        CREATE POLICY "Read access for homepage" ON public.homepage_content FOR SELECT USING (true);
    END IF;
END $$;

-- 5. Auto-Profile Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 🔑 CREATE DEFAULT ADMIN ACCOUNT
-- ==========================================
-- Email: admin@gmail.com
-- Password: Admin123
-- ==========================================

-- 1. Insert into auth.users (Standard Supabase Auth)
-- We use a DO block to avoid primary key conflicts if user already exists
DO $$
DECLARE
  new_user_id UUID := uuid_generate_v4();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, 
      email_confirmed_at, recovery_sent_at, last_sign_in_at, 
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
      confirmation_token, email_change, email_change_token_new, recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'admin@gmail.com',
      crypt('Admin123', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Master Admin"}',
      now(), now(), '', '', '', ''
    );
  END IF;
END $$;

-- 2. Force the admin role in profiles
UPDATE public.profiles 
SET role = 'admin', full_name = 'Master Admin'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');

-- 3. Safety Check: If profile was missed
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Master Admin', 'admin'
FROM auth.users 
WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
