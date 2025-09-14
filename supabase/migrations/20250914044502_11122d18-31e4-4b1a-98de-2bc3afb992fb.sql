-- Add product type and tags to products table
ALTER TABLE public.products 
ADD COLUMN product_type TEXT DEFAULT 'software' CHECK (product_type IN ('ai_tools', 'software', 'free_tools', 'digital_products')),
ADD COLUMN product_tags TEXT[] DEFAULT '{}',
ADD COLUMN is_newly_launched BOOLEAN DEFAULT false,
ADD COLUMN is_popular BOOLEAN DEFAULT false,
ADD COLUMN is_trending BOOLEAN DEFAULT false,
ADD COLUMN is_editors_choice BOOLEAN DEFAULT false;

-- Add index for better performance on product type queries
CREATE INDEX idx_products_type ON public.products(product_type);
CREATE INDEX idx_products_tags ON public.products USING GIN(product_tags);

-- Create a view for product statistics by type
CREATE OR REPLACE VIEW public.product_stats AS
SELECT 
  product_type,
  COUNT(*) as count
FROM public.products
GROUP BY product_type;