-- Fix existing products: Update calculators and resume builder to be free tools with proper flags
-- Update products that should be marked as free but aren't
UPDATE products 
SET 
  is_free = true,
  original_price = NULL,
  discounted_price = NULL
WHERE (original_price = 0 OR original_price IS NULL) 
  AND (discounted_price = 0 OR discounted_price IS NULL)
  AND is_free = false;

-- Ensure all free_tools product_type items are marked as free
UPDATE products
SET is_free = true
WHERE product_type = 'free_tools' AND is_free = false;

-- Ensure all paid_tools product_type items have pricing
UPDATE products
SET is_free = false
WHERE product_type = 'paid_tools' 
  AND (original_price IS NULL OR original_price = 0)
  AND (discounted_price IS NULL OR discounted_price = 0);