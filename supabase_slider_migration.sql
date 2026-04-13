-- Slider images table
CREATE TABLE slider_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    title TEXT,
    subtitle TEXT,
    link TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE slider_images ENABLE ROW LEVEL SECURITY;

-- Sliders Policies
DROP POLICY IF EXISTS "Allow all for anon on slider_images" ON slider_images;
CREATE POLICY "Public Read Sliders" ON slider_images FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin All Sliders" ON slider_images FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert a placeholder slider for visual testing (you can delete it later via admin)
INSERT INTO slider_images (image_url, title, subtitle, link, order_index, is_active)
VALUES ('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop', 'NEW SEASON RELEASES', 'DISCOVER OUR LATEST COLLECTION', '/all', 0, true);
