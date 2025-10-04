-- Fix revenue types for free tools that were incorrectly marked
UPDATE products 
SET revenue_type = 'free'
WHERE slug IN ('emergent-ai', 'resume-builder');

-- Create Resume Tools category
INSERT INTO categories (name, slug, description, icon, sort_order)
VALUES (
  'Resume Tools',
  'resume-tools',
  'Professional resume building and career tools',
  'FileText',
  1
);

-- Assign Resume Builder to the Resume Tools category
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'resume-tools')
WHERE slug = 'resume-builder';