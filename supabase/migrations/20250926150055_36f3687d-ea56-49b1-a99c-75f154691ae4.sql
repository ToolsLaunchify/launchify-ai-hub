-- Fix product categorization based on user requirements
-- Move AI-related tools to ai_tools category
UPDATE products 
SET product_type = 'ai_tools', is_free = false
WHERE name IN ('AI Image Generator', 'AI Writing Assistant', 'Text to Speech Tool')
  AND product_type = 'free_tools';

-- Move utility/software tools to software category  
UPDATE products 
SET product_type = 'software', is_free = false
WHERE name IN ('Color Palette Generator', 'Free SEO Analyzer', 'Free Task Organizer', 
               'Open Source Code Editor', 'Password Generator Pro', 'QR Code Generator')
  AND product_type = 'free_tools';

-- Any remaining tools in free_tools that aren't the static calculators should be software
UPDATE products 
SET product_type = 'software', is_free = false
WHERE product_type = 'free_tools';

-- Update any products that should be paid_tools (those with pricing)
UPDATE products 
SET product_type = 'paid_tools'
WHERE (original_price > 0 OR discounted_price > 0 OR purchase_price > 0)
  AND product_type IN ('ai_tools', 'software');