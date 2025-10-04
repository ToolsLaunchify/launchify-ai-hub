-- Fix Resume Builder to remove conflicting pricing data
UPDATE products 
SET 
  original_price = NULL,
  discounted_price = NULL,
  currency = NULL
WHERE slug = 'resume-builder';