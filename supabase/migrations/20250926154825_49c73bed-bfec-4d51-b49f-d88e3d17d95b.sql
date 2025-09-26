-- Update Resume Builder to be a paid tool with proper pricing
UPDATE products 
SET 
  original_price = 29.99,
  discounted_price = 24.99,
  is_free = false,
  revenue_type = 'paid',
  currency = 'USD'
WHERE slug = 'resume-builder';