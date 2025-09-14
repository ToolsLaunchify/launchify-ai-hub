-- Add sort_order column to categories table
ALTER TABLE public.categories 
ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Update existing categories with default sort order based on common priority
UPDATE public.categories 
SET sort_order = CASE 
  WHEN name ILIKE '%ai%' OR name ILIKE '%artificial%' THEN 1
  WHEN name ILIKE '%software%' THEN 2
  WHEN name ILIKE '%free%' THEN 3
  WHEN name ILIKE '%digital%' THEN 4
  ELSE 5
END;

-- Create index for better performance on ordering queries
CREATE INDEX idx_categories_sort_order ON public.categories(sort_order);