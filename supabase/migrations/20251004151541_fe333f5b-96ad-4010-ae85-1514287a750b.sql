-- Fix product_type inconsistencies for free tools
-- Any product that is free with no pricing should be marked as 'free_tools'
UPDATE products 
SET product_type = 'free_tools' 
WHERE is_free = true 
AND revenue_type = 'free'
AND (original_price IS NULL OR original_price = 0)
AND (discounted_price IS NULL OR discounted_price = 0)
AND product_type != 'free_tools';

-- Ensure all products have a valid revenue_type
UPDATE products
SET revenue_type = 'free'::revenue_type
WHERE is_free = true 
AND (original_price IS NULL OR original_price = 0)
AND (discounted_price IS NULL OR discounted_price = 0)
AND (revenue_type IS NULL OR revenue_type != 'free'::revenue_type);

-- Set revenue_type for paid products
UPDATE products
SET revenue_type = CASE
  WHEN affiliate_link IS NOT NULL AND payment_link IS NOT NULL THEN 'affiliate'::revenue_type
  WHEN affiliate_link IS NOT NULL THEN 'affiliate'::revenue_type
  WHEN payment_link IS NOT NULL THEN 'payment'::revenue_type
  ELSE 'paid'::revenue_type
END
WHERE (original_price > 0 OR discounted_price > 0)
AND revenue_type = 'free'::revenue_type;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_revenue_type ON products(revenue_type);
CREATE INDEX IF NOT EXISTS idx_products_is_free ON products(is_free);
CREATE INDEX IF NOT EXISTS idx_products_category_created ON products(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_type_created ON products(product_type, created_at DESC);