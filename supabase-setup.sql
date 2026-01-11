-- =============================================
-- Dua & Blogs Database Setup Script
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT DEFAULT 'Dua & Blogs',
  phone_number TEXT,
  whatsapp_number TEXT,
  announcement TEXT,
  announcement_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('blog', 'dua')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create duas table
CREATE TABLE IF NOT EXISTS duas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  arabic_text TEXT,
  transliteration TEXT,
  translation TEXT NOT NULL,
  reference TEXT,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Insert default admin user (password: admin123)
-- IMPORTANT: Change this password after first login!
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$10$EFig3g0ZJb.HoUxF92M1luByHKgQTsBoAS5oKSokceHj/yW/RpyLm')
ON CONFLICT (username) DO UPDATE 
SET password_hash = '$2b$10$EFig3g0ZJb.HoUxF92M1luByHKgQTsBoAS5oKSokceHj/yW/RpyLm';

-- 8. Insert default site settings
INSERT INTO site_settings (site_title)
VALUES ('Dua & Blogs')
ON CONFLICT DO NOTHING;

-- 9. Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE duas ENABLE ROW LEVEL SECURITY;

-- 10. Create policies for public read access
CREATE POLICY "Allow public read on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on published blogs" ON blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read on published duas" ON duas FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read on site_settings" ON site_settings FOR SELECT USING (true);

-- 11. Create policies for authenticated access (all operations)
-- For admin operations, you'll use the service_role key or create additional policies
CREATE POLICY "Allow all operations for service role on blogs" ON blogs FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on duas" ON duas FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on site_settings" ON site_settings FOR ALL USING (true);

-- 12. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_created ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_duas_slug ON duas(slug);
CREATE INDEX IF NOT EXISTS idx_duas_published ON duas(is_published);
CREATE INDEX IF NOT EXISTS idx_duas_created ON duas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);

-- =============================================
-- STORAGE SETUP
-- =============================================
-- You also need to create a storage bucket in Supabase:
-- 1. Go to Storage in Supabase dashboard
-- 2. Create a new bucket called "images"
-- 3. Make it public (or configure policies for public access)
-- 4. Set file size limit as needed (e.g., 5MB)

-- Done! Your database is ready.
-- 
-- Default admin credentials:
-- Username: admin
-- Password: admin123
-- 
-- IMPORTANT: Update the password after first login!
