-- Add more sample products for better coverage
INSERT INTO public.products (
  name, 
  slug, 
  description, 
  rich_description,
  image_url,
  category_id,
  product_type,
  is_free,
  is_featured,
  is_newly_launched,
  is_popular,
  is_trending,
  is_editors_choice,
  original_price,
  discounted_price,
  currency,
  affiliate_link,
  payment_link,
  cta_button_text,
  views_count,
  saves_count
) VALUES 
-- More AI Tools
('AI Image Generator', 'ai-image-gen', 'Create stunning images with AI technology', '<p>Generate professional quality images using advanced AI models. Perfect for marketing, social media, and creative projects.</p>', 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=500', (SELECT id FROM categories WHERE name ILIKE '%AI%' LIMIT 1), 'ai_tools', false, false, true, false, true, false, 29.99, 19.99, 'USD', 'https://example.com/ai-image', null, 'Generate Images', 890, 67),

-- More Free Tools  
('Free SEO Analyzer', 'free-seo-tool', 'Analyze your website SEO for free', '<p>Complete SEO analysis tool that helps optimize your website for search engines. Get detailed reports and recommendations.</p>', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', (SELECT id FROM categories WHERE name ILIKE '%marketing%' LIMIT 1), 'free_tools', true, false, false, true, false, false, null, null, 'USD', 'https://example.com/seo-tool', null, 'Analyze Free', 2340, 145),

-- More Software
('Video Editing Suite', 'video-editor-pro', 'Professional video editing software', '<p>Complete video editing solution with advanced features for professionals and content creators.</p>', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500', (SELECT id FROM categories WHERE name ILIKE '%design%' LIMIT 1), 'software', false, true, false, false, false, true, 199.99, 149.99, 'USD', 'https://example.com/video-editor', null, 'Buy Now', 1567, 98),

-- More Digital Products
('Marketing Templates Pack', 'marketing-templates', 'Complete marketing templates collection', '<p>Professional marketing templates for social media, email campaigns, and presentations. Boost your marketing efforts.</p>', 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=500', (SELECT id FROM categories WHERE name ILIKE '%marketing%' LIMIT 1), 'digital_products', false, false, false, true, false, false, 79.99, 59.99, 'USD', 'https://example.com/templates', null, 'Download Now', 987, 76);