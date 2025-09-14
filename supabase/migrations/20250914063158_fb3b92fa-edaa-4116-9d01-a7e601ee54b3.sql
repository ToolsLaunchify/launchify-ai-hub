-- Create function to update category orders
CREATE OR REPLACE FUNCTION public.update_category_orders(category_updates jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    category_update jsonb;
BEGIN
    FOR category_update IN SELECT * FROM jsonb_array_elements(category_updates)
    LOOP
        UPDATE categories
        SET sort_order = (category_update->>'sort_order')::integer
        WHERE id = (category_update->>'id')::uuid;
    END LOOP;
END;
$$;