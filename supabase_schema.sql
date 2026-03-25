-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    image_url TEXT,
    gender TEXT NOT NULL CHECK (gender IN ('men', 'women', 'kids')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    offer_price NUMERIC,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    gender TEXT NOT NULL CHECK (gender IN ('men', 'women', 'kids')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_sale BOOLEAN DEFAULT FALSE,
    stock INTEGER DEFAULT 0,
    images JSONB DEFAULT '[]',
    sizes JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homepage content table
CREATE TABLE homepage_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key TEXT UNIQUE NOT NULL,
    title TEXT,
    title_bold TEXT, -- Added for dual-style hero
    subtitle TEXT,
    image_url TEXT,
    cta_text TEXT,
    cta_link TEXT,
    cta_secondary_text TEXT, -- Added for dual-button hero
    cta_secondary_link TEXT, -- Added for dual-button hero
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Categories
DROP POLICY IF EXISTS "Allow all for anon on categories" ON categories;
CREATE POLICY "Public Read Categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin All Categories" ON categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products
DROP POLICY IF EXISTS "Allow all for anon on products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin All Products" ON products FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Homepage Content
DROP POLICY IF EXISTS "Allow all for anon on homepage_content" ON homepage_content;
CREATE POLICY "Public Read Homepage" ON homepage_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin All Homepage" ON homepage_content FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert initial homepage content
INSERT INTO homepage_content (section_key, title, subtitle, image_url, cta_text, cta_link)
VALUES 
('main_hero', 'THE ART OF MODERN ELEGANCE', 'WINTER 2024 COLLECTION', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop', 'SHOP COLLECTION', '/all'),
('men_hero', 'MODERN MASCULINITY', 'CLEAN LINES & PREMIUM FABRICS', 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2066&auto=format&fit=crop', 'SHOP MEN', '/men'),
('women_hero', 'EFFORTLESS SOPHISTICATION', 'CONTEMPORARY CLASSICS', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop', 'SHOP WOMEN', '/women'),
('kids_hero', 'PLAYFUL ADVENTURES', 'DURABLE & STYLISH', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1924&auto=format&fit=crop', 'SHOP KIDS', '/kids');
