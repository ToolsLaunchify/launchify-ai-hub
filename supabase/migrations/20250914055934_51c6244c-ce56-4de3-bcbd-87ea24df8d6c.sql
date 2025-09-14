-- Insert sample products for testing
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
-- AI Tools
('ChatGPT Pro', 'chatgpt-pro', 'Advanced AI conversational model with enhanced capabilities', '<p>ChatGPT Pro offers advanced AI conversations, enhanced reasoning, and professional features for businesses and individuals.</p><h3>Key Features:</h3><ul><li>Advanced language processing</li><li>Professional support</li><li>Priority access</li></ul>', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500', (SELECT id FROM categories WHERE name ILIKE '%AI%' LIMIT 1), 'ai_tools', false, true, true, true, false, false, 20.00, 15.00, 'USD', 'https://openai.com/chatgpt', null, 'Try ChatGPT Pro', 1250, 89),

('Canva AI', 'canva-ai', 'AI-powered design tool for creating stunning graphics', '<p>Create professional designs with AI assistance. Perfect for social media, presentations, and marketing materials.</p><h3>Features:</h3><ul><li>AI design suggestions</li><li>Template library</li><li>Collaboration tools</li></ul>', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500', (SELECT id FROM categories WHERE name ILIKE '%design%' LIMIT 1), 'ai_tools', false, true, false, true, true, true, 12.99, 9.99, 'USD', 'https://canva.com', null, 'Start Designing', 2100, 156),

-- Free Tools
('Open Source Code Editor', 'vs-code-free', 'Free, powerful code editor with extensions', '<p>A completely free code editor with powerful features for developers. Supports multiple languages and has thousands of extensions.</p><h3>Features:</h3><ul><li>Syntax highlighting</li><li>Extension marketplace</li><li>Integrated terminal</li></ul>', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500', (SELECT id FROM categories WHERE name ILIKE '%development%' OR name ILIKE '%developer%' LIMIT 1), 'free_tools', true, false, false, true, false, false, null, null, 'USD', 'https://code.visualstudio.com', null, 'Download Free', 5670, 234),

('AI Writing Assistant', 'ai-writer-free', 'Free AI-powered writing assistant for content creation', '<p>Generate high-quality content with this free AI writing tool. Perfect for blogs, emails, and social media posts.</p><h3>Features:</h3><ul><li>Content generation</li><li>Grammar checking</li><li>Style suggestions</li></ul>', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500', (SELECT id FROM categories WHERE name ILIKE '%writing%' OR name ILIKE '%AI%' LIMIT 1), 'free_tools', true, true, true, false, true, false, null, null, 'USD', 'https://example.com/ai-writer', null, 'Try Free', 890, 67),

-- Software
('Project Management Pro', 'project-manager-pro', 'Professional project management software for teams', '<p>Comprehensive project management solution with advanced features for team collaboration, time tracking, and resource management.</p><h3>Features:</h3><ul><li>Gantt charts</li><li>Team collaboration</li><li>Time tracking</li><li>Resource management</li></ul>', 'https://images.unsplash.com/photo-1553028826-f4804151e596?w=500', (SELECT id FROM categories WHERE name ILIKE '%productivity%' LIMIT 1), 'software', false, false, false, false, false, true, 49.99, 39.99, 'USD', 'https://example.com/project-manager', null, 'Get Started', 1890, 123),

-- Digital Products
('UI Design System', 'ui-design-system', 'Complete UI design system with components and templates', '<p>Professional UI design system including components, templates, and design guidelines. Perfect for designers and developers building consistent user interfaces.</p><h3>Includes:</h3><ul><li>200+ Components</li><li>Design templates</li><li>Style guide</li><li>Figma files</li></ul>', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500', (SELECT id FROM categories WHERE name ILIKE '%design%' LIMIT 1), 'digital_products', false, true, false, false, false, false, 99.00, 79.00, 'USD', 'https://example.com/ui-system', null, 'Buy Now', 567, 45);