-- Fix security definer view issue
-- The product_stats view may have SECURITY DEFINER property, let's recreate it properly

-- Drop and recreate the product_stats view without SECURITY DEFINER
DROP VIEW IF EXISTS public.product_stats;

CREATE VIEW public.product_stats AS
SELECT 
    product_type,
    count(*) AS count
FROM public.products
WHERE product_type IS NOT NULL
GROUP BY product_type;

-- Grant proper permissions to the view
GRANT SELECT ON public.product_stats TO authenticated;
GRANT SELECT ON public.product_stats TO anon;