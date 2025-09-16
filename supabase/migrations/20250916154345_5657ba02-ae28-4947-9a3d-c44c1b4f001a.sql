-- Fix the security definer view issue if it exists
-- The product_stats view needs to be recreated without SECURITY DEFINER if it has it
DROP VIEW IF EXISTS product_stats;

CREATE VIEW product_stats AS
SELECT 
    product_type,
    COUNT(*) as count
FROM products 
WHERE product_type IS NOT NULL
GROUP BY product_type;

-- Enable leaked password protection
-- Note: This is typically done through the Supabase Dashboard under Authentication > Settings
-- but we can try to enable it here if the function exists
DO $$
BEGIN
    -- This is a placeholder - leaked password protection is typically configured through the dashboard
    RAISE NOTICE 'Leaked password protection should be enabled through the Supabase Dashboard under Authentication > Settings';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Please enable leaked password protection in Supabase Dashboard';
END $$;