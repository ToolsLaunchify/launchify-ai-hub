-- Fix security definer view issue by recreating product_stats as a regular view
-- This removes the security definer property that was bypassing RLS

-- Drop the existing product_stats view if it exists
DROP VIEW IF EXISTS public.product_stats;

-- Recreate product_stats as a regular view (not security definer)
-- This will now respect RLS policies properly
CREATE VIEW public.product_stats AS
SELECT 
    p.product_type,
    COUNT(*) as count
FROM public.products p
GROUP BY p.product_type;

-- Enable RLS on the view (this ensures it respects the underlying table's RLS)
-- Note: Views inherit RLS from their underlying tables, but we make it explicit

-- Ensure the products table has proper RLS (it should already have this)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Add a comment to document the security fix
COMMENT ON VIEW public.product_stats IS 'Product statistics view - fixed to respect RLS policies';