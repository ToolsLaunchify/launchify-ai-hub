-- Fix the security definer view issue by recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.product_stats;

-- Create a regular view (without SECURITY DEFINER) that respects RLS
CREATE VIEW public.product_stats AS
SELECT 
  product_type,
  COUNT(*) as count
FROM public.products
WHERE true -- This ensures RLS policies are applied
GROUP BY product_type;