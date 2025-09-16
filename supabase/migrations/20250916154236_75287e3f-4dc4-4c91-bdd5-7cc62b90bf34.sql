-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Create policies for blog images
CREATE POLICY "Blog images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Add additional SEO fields to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'Admin',
ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_image_url TEXT,
ADD COLUMN IF NOT EXISTS structured_data JSONB DEFAULT '{}'::jsonb;

-- Insert some sample blog posts for demonstration
INSERT INTO blog_posts (title, slug, content, excerpt, is_published, is_featured, author_name, tags, meta_title, meta_description, published_at) VALUES 
(
  'Top 10 AI Tools for Productivity in 2024', 
  'top-10-ai-tools-productivity-2024', 
  '<h1>Top 10 AI Tools for Productivity in 2024</h1><p>Artificial Intelligence has revolutionized the way we work, making us more productive than ever before. In this comprehensive guide, we''ll explore the top 10 AI tools that are transforming productivity across various industries.</p><h2>1. ChatGPT for Content Creation</h2><p>ChatGPT has become an indispensable tool for content creators, marketers, and writers. Its ability to generate high-quality text, brainstorm ideas, and provide detailed explanations makes it a must-have productivity tool.</p><h2>2. Notion AI for Note-Taking</h2><p>Notion AI combines the power of artificial intelligence with Notion''s robust organizational features, making it perfect for managing projects, taking notes, and collaborating with teams.</p><h2>3. Grammarly for Writing Enhancement</h2><p>Grammarly uses AI to help improve your writing by checking grammar, spelling, and style. It''s essential for anyone who writes professionally.</p><p>These tools represent just the beginning of the AI revolution in productivity. As AI continues to evolve, we can expect even more powerful tools to emerge.</p>', 
  'Discover the most powerful AI tools that can supercharge your productivity in 2024. From content creation to project management, these tools will transform your workflow.', 
  true, 
  true, 
  'Sarah Johnson', 
  ARRAY['AI', 'Productivity', 'Tools', 'Technology'], 
  'Top 10 AI Tools for Productivity in 2024 | Boost Your Efficiency', 
  'Explore the best AI productivity tools for 2024. Comprehensive guide featuring ChatGPT, Notion AI, Grammarly and more to enhance your workflow and efficiency.', 
  '2024-01-15T10:00:00Z'
),
(
  'The Complete Guide to Software Development in 2024', 
  'complete-guide-software-development-2024', 
  '<h1>The Complete Guide to Software Development in 2024</h1><p>Software development continues to evolve rapidly, with new frameworks, tools, and methodologies emerging regularly. This comprehensive guide covers everything you need to know about modern software development practices.</p><h2>Modern Development Frameworks</h2><p>React, Vue.js, and Angular continue to dominate the frontend landscape, while Node.js, Python, and Go are popular choices for backend development.</p><h2>DevOps and CI/CD</h2><p>Continuous integration and continuous deployment have become essential practices for modern development teams. Tools like GitHub Actions, GitLab CI, and Jenkins make automated deployment pipelines accessible to teams of all sizes.</p><h2>Cloud-First Development</h2><p>Cloud platforms like AWS, Google Cloud, and Azure provide scalable infrastructure and services that enable developers to build robust, scalable applications without managing physical servers.</p>', 
  'A comprehensive guide to software development in 2024, covering modern frameworks, DevOps practices, cloud development, and industry best practices.', 
  true, 
  false, 
  'Mike Chen', 
  ARRAY['Software Development', 'Programming', 'DevOps', 'Cloud'], 
  'Complete Software Development Guide 2024 | Modern Practices & Tools', 
  'Master software development in 2024 with our complete guide covering frameworks, DevOps, cloud computing, and best practices for developers.', 
  '2024-01-10T14:30:00Z'
),
(
  'Best Free Tools for Startups and Small Business', 
  'best-free-tools-startups-small-business', 
  '<h1>Best Free Tools for Startups and Small Business</h1><p>Starting a business doesn''t have to break the bank. There are numerous high-quality free tools available that can help startups and small businesses operate efficiently without spending a fortune on software.</p><h2>Project Management</h2><p>Trello and Asana offer robust free tiers that are perfect for small teams to manage projects, assign tasks, and track progress.</p><h2>Communication</h2><p>Slack provides excellent team communication features in its free plan, while Zoom offers free video conferencing for small teams.</p><h2>Marketing</h2><p>Mailchimp''s free tier allows you to send emails to up to 2,000 contacts, while Canva provides professional design tools for creating marketing materials.</p><h2>Analytics</h2><p>Google Analytics and Google Search Console are essential free tools for understanding your website''s performance and optimizing for search engines.</p>', 
  'Discover the best free tools that can help startups and small businesses operate efficiently without breaking the bank. Complete list with recommendations.', 
  true, 
  false, 
  'Emma Rodriguez', 
  ARRAY['Free Tools', 'Startup', 'Small Business', 'Productivity'], 
  'Best Free Tools for Startups 2024 | Save Money & Boost Productivity', 
  'Comprehensive list of the best free tools for startups and small businesses. Project management, marketing, analytics tools that won''t cost you a penny.', 
  '2024-01-08T09:15:00Z'
);