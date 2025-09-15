-- Add SEO optimization fields to products table
ALTER TABLE public.products 
ADD COLUMN meta_title TEXT,
ADD COLUMN meta_description TEXT,
ADD COLUMN keywords TEXT[],
ADD COLUMN canonical_url TEXT,
ADD COLUMN og_image_url TEXT,
ADD COLUMN alt_text TEXT,
ADD COLUMN schema_markup JSONB DEFAULT '{}'::jsonb;