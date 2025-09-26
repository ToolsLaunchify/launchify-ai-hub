-- Update Resume Builder pricing to show in Paid Tools section
UPDATE products 
SET 
  original_price = 29.99,
  discounted_price = 24.99
WHERE slug = 'resume-builder';