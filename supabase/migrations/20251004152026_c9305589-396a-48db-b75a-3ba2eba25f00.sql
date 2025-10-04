-- Keep only embedded free tools in free_tools category
-- These are the 3 tools that should stay in Free Tools
UPDATE products 
SET product_type = 'free_tools'
WHERE name IN ('BMI Calculator', 'Percentage Calculator', 'Resume Builder')
AND is_embedded_tool = true;

-- Move AI-related free tools back to ai_tools
UPDATE products 
SET product_type = 'ai_tools'
WHERE name IN (
  'AI Writing Assistant', 
  'Jasper AI', 
  'Rocket AI', 
  'Emergent AI'
)
AND is_free = true;

-- Move other free tools to software category
UPDATE products 
SET product_type = 'software'
WHERE name IN (
  'QR Code Generator',
  'Password Generator Pro',
  'Color Palette Generator',
  'Free SEO Analyzer',
  'Open Source Code Editor',
  'Text to Speech Tool'
)
AND is_free = true;