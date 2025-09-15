-- Fix security definer view issue by recreating product_stats view without SECURITY DEFINER
DROP VIEW IF EXISTS public.product_stats;

CREATE VIEW public.product_stats AS 
SELECT 
  product_type,
  count(*) AS count
FROM public.products
GROUP BY product_type;