-- Update Resume Builder: remove pricing, make free, assign to Productivity Apps category
UPDATE products 
SET 
  original_price = NULL,
  discounted_price = NULL,
  purchase_price = NULL,
  is_free = true,
  revenue_type = 'free',
  product_type = 'free_tools',
  category_id = 'a3f55a64-e095-4cb8-a4d4-1dbc703051d2'
WHERE slug = 'resume-builder';