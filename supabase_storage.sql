-- Create buckets for products and categories if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for 'products' bucket
-- Allow public read access
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

-- Allow authenticated admins to upload/update/delete
CREATE POLICY "Admin Write Access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Admin Update Access" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'products' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Admin Delete Access" ON storage.objects
FOR DELETE USING (
  bucket_id = 'products' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- Set up RLS for 'categories' bucket
-- Allow public read access
CREATE POLICY "Categories Public Read" ON storage.objects
FOR SELECT USING (bucket_id = 'categories');

-- Allow authenticated admins to upload/update/delete
CREATE POLICY "Categories Admin Write" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'categories' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Categories Admin Update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'categories' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Categories Admin Delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'categories' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);
