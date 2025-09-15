-- Create site_settings table for managing social media, newsletter, and footer links
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pages table for static content management
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create newsletter_subscribers table for email capture
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'footer_signup'
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings
CREATE POLICY "Site settings are viewable by everyone" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for pages
CREATE POLICY "Published pages are viewable by everyone" 
ON public.pages 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage all pages" 
ON public.pages 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for newsletter_subscribers
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage all newsletter subscribers" 
ON public.newsletter_subscribers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES
('social_media', '{"twitter": "https://twitter.com/toolslaunchify", "linkedin": "https://linkedin.com/company/toolslaunchify", "github": "https://github.com/toolslaunchify", "email": "hello@toolslaunchify.com"}', 'Social media links'),
('newsletter_settings', '{"enabled": true, "success_message": "Thanks for subscribing! Check your email for confirmation.", "error_message": "Something went wrong. Please try again."}', 'Newsletter configuration'),
('footer_sections', '{"resources": [{"label": "Blog", "href": "/blog"}, {"label": "Free Tools", "href": "/free-tools"}, {"label": "Featured Products", "href": "/featured"}, {"label": "Most Saved", "href": "/most-saved"}]}', 'Footer links configuration');

-- Insert default pages
INSERT INTO public.pages (title, slug, content, meta_title, meta_description) VALUES
('About Us', 'about', '<h1>About Tools Launchify</h1><p>Tools Launchify is your premier destination for discovering the latest AI tools, software launches, and digital products. We curate and showcase the most innovative solutions to help businesses and individuals enhance their productivity and creativity.</p>', 'About Us - Tools Launchify', 'Learn more about Tools Launchify and our mission to help you discover the best AI tools and software.'),
('Contact', 'contact', '<h1>Contact Us</h1><p>Get in touch with our team:</p><p>Email: hello@toolslaunchify.com</p><p>We''d love to hear from you and help you discover the perfect tools for your needs.</p>', 'Contact Us - Tools Launchify', 'Get in touch with Tools Launchify team for support, partnerships, and inquiries.'),
('Privacy Policy', 'privacy', '<h1>Privacy Policy</h1><p>This Privacy Policy describes how Tools Launchify collects, uses, and protects your information when you use our service.</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us.</p>', 'Privacy Policy - Tools Launchify', 'Read our privacy policy to understand how we protect and use your data.'),
('Terms of Service', 'terms', '<h1>Terms of Service</h1><p>By using Tools Launchify, you agree to these terms of service.</p><h2>Use of Service</h2><p>You may use our service to discover and learn about various tools and software products.</p>', 'Terms of Service - Tools Launchify', 'Review our terms of service for using Tools Launchify platform.');