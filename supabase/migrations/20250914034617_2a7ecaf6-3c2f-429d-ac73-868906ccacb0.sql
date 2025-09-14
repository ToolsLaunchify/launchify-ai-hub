-- Add missing columns to products table for enhanced functionality
ALTER TABLE public.products 
ADD COLUMN custom_permalink text,
ADD COLUMN file_attachments jsonb DEFAULT '[]'::jsonb,
ADD COLUMN video_courses jsonb DEFAULT '[]'::jsonb,
ADD COLUMN custom_code text;

-- Add file upload functionality to storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-files', 'product-files', false);

-- Create storage policies for product files
CREATE POLICY "Admins can upload product files"
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view product files"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Everyone can view public product files"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-files');

-- Create product images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Create storage policies for product images  
CREATE POLICY "Admins can upload product images"
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Everyone can view product images"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');