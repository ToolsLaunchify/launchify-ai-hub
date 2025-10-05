-- Add soft-delete columns to products table
ALTER TABLE products 
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN deleted_by UUID;

-- Create indexes for faster queries
CREATE INDEX idx_products_is_deleted ON products(is_deleted);
CREATE INDEX idx_products_deleted_at ON products(deleted_at) WHERE is_deleted = true;

-- Update RLS policy to exclude deleted products from public view
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

CREATE POLICY "Products are viewable by everyone" 
ON products 
FOR SELECT 
USING (is_deleted = false);

-- Add policy for admins to view deleted products
CREATE POLICY "Admins can view deleted products" 
ON products 
FOR SELECT 
USING (is_deleted = true AND has_role(auth.uid(), 'admin'));

-- Update admin management policy to include soft-deleted products
DROP POLICY IF EXISTS "Admins can manage products" ON products;

CREATE POLICY "Admins can manage products" 
ON products 
FOR ALL 
USING (has_role(auth.uid(), 'admin')) 
WITH CHECK (has_role(auth.uid(), 'admin'));