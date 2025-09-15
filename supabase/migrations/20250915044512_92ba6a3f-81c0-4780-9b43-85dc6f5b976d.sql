-- Create revenue_type enum
CREATE TYPE revenue_type AS ENUM ('affiliate', 'payment', 'free', 'mixed');

-- Add revenue_type column to products table
ALTER TABLE public.products 
ADD COLUMN revenue_type revenue_type DEFAULT 'free';

-- Add additional SEO fields for advanced optimization
ALTER TABLE public.products 
ADD COLUMN focus_keyword text,
ADD COLUMN related_keywords text[],
ADD COLUMN content_score integer DEFAULT 0,
ADD COLUMN seo_title text,
ADD COLUMN social_title text,
ADD COLUMN social_description text,
ADD COLUMN twitter_image_url text,
ADD COLUMN structured_data_type text DEFAULT 'Product',
ADD COLUMN faq_data jsonb DEFAULT '[]'::jsonb,
ADD COLUMN howto_data jsonb DEFAULT '[]'::jsonb;

-- Create click_tracking table for analytics
CREATE TABLE public.click_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  click_type text NOT NULL, -- 'affiliate', 'payment', 'view'
  user_id uuid, -- optional, for authenticated users
  ip_address text,
  user_agent text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on click_tracking
ALTER TABLE public.click_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for click_tracking
CREATE POLICY "Admins can view all click tracking data" 
ON public.click_tracking 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert click tracking data" 
ON public.click_tracking 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_click_tracking_product_id ON public.click_tracking(product_id);
CREATE INDEX idx_click_tracking_created_at ON public.click_tracking(created_at);
CREATE INDEX idx_click_tracking_click_type ON public.click_tracking(click_type);