-- Fix the product_stats view to remove SECURITY DEFINER
DROP VIEW IF EXISTS product_stats;

CREATE VIEW product_stats AS
SELECT 
  product_type,
  COUNT(*) AS count
FROM products
GROUP BY product_type;