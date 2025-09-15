-- Fix the revenue_type enum issue by handling the default value properly
-- First, remove the default value temporarily
ALTER TABLE products ALTER COLUMN revenue_type DROP DEFAULT;

-- Update revenue_type enum to remove 'mixed' and keep only essential options
ALTER TYPE revenue_type RENAME TO revenue_type_old;

CREATE TYPE revenue_type AS ENUM ('affiliate', 'payment', 'free');

-- Update the products table to use the new enum
ALTER TABLE products ALTER COLUMN revenue_type TYPE revenue_type USING 
  CASE 
    WHEN revenue_type::text = 'mixed' THEN 'payment'::revenue_type
    ELSE revenue_type::text::revenue_type 
  END;

-- Set the default value back
ALTER TABLE products ALTER COLUMN revenue_type SET DEFAULT 'free'::revenue_type;

-- Drop the old enum
DROP TYPE revenue_type_old;

-- Add indexes for better analytics performance
CREATE INDEX IF NOT EXISTS idx_click_tracking_created_at ON click_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_click_tracking_utm_source ON click_tracking(utm_source);
CREATE INDEX IF NOT EXISTS idx_click_tracking_product_id ON click_tracking(product_id);
CREATE INDEX IF NOT EXISTS idx_click_tracking_click_type ON click_tracking(click_type);

-- Add a conversion tracking table for sales/conversions
CREATE TABLE IF NOT EXISTS conversions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id),
  user_id uuid,
  click_tracking_id uuid REFERENCES click_tracking(id),
  conversion_type text NOT NULL CHECK (conversion_type IN ('sale', 'signup', 'download')),
  revenue_amount numeric(10,2),
  currency text DEFAULT 'USD',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on conversions table
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- Create policies for conversions
CREATE POLICY "Admins can view all conversions" 
ON conversions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert conversions" 
ON conversions 
FOR INSERT 
WITH CHECK (true);

-- Add indexes for conversions
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at);
CREATE INDEX IF NOT EXISTS idx_conversions_product_id ON conversions(product_id);
CREATE INDEX IF NOT EXISTS idx_conversions_utm_source ON conversions(utm_source);