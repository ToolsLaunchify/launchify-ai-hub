-- First, drop the existing check constraint completely
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_product_type_check;

-- Update digital_products to paid_tools as requested by user
UPDATE products 
SET product_type = 'paid_tools' 
WHERE product_type = 'digital_products';

-- Add the new constraint with the correct values including paid_tools
ALTER TABLE products ADD CONSTRAINT products_product_type_check 
CHECK (product_type IN ('ai_tools', 'software', 'free_tools', 'paid_tools'));