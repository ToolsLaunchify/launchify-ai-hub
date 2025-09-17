import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Rocket, ExternalLink, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { usePages } from '@/hooks/usePages';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import { useNewsletterSubscribe } from '@/hooks/useNewsletter';
import logo from '@/assets/tools-launchify-logo.png';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();
  
  const { data: siteSettings = {} } = useSiteSettings();
  const { data: pages = [] } = usePages();
  const { data: categories = [] } = useCategoryStats();
  const subscribeNewsletter = useNewsletterSubscribe();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        await subscribeNewsletter.mutateAsync(email);
        setEmail('');
      } catch (error) {
        console.error('Newsletter subscription failed:', error);
      }
    }
  };

  // Footer settings with defaults
  const footerSettings = {
    companyName: siteSettings.companyName || 'Tools Launchify',
    description: siteSettings.description || 'Your ultimate directory for discovering the best AI tools and software solutions.',
    email: siteSettings.email || 'contact@toolslaunchify.com',
    phone: siteSettings.phone || '',
    address: siteSettings.address || '',
    showNewsletter: siteSettings.showNewsletter ?? true,
    socialLinks: siteSettings.socialLinks || {},
    sections: siteSettings.sections || [],
    ...siteSettings
  };

  // Debug logs
  console.log('Footer - footerSettings:', footerSettings);
  console.log('Footer - pages available:', pages?.length || 0);
  console.log('Footer - sections:', footerSettings.sections?.length || 0);

  // Create social links array
  const socialLinks = Object.entries(footerSettings.socialLinks || {})
    .filter(([_, url]) => url && typeof url === 'string' && url.trim() !== '')
    .map(([platform, url]) => ({ platform, url: url as string }));

  // Filter pages for company info (common pages)
  const companyPages = pages.filter(page => 
    ['about', 'contact', 'privacy', 'terms', 'careers', 'help', 'faq'].includes(page.slug)
  );

  const topCategories = categories.slice(0, 6);

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border-t border-border/40">
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Tools Launchify" className="h-10 w-10" />
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {footerSettings.companyName}
              </span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-md">
              {footerSettings.description}
            </p>
            
            {/* Newsletter Signup */}
            {footerSettings.showNewsletter && (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Stay Updated</h4>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={subscribeNewsletter.isPending}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </form>
              </div>
            )}
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map(({ platform, url }) => (
                  <Button
                    key={platform}
                    variant="outline"
                    size="icon"
                    asChild
                    className="hover:bg-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {platform === 'twitter' && <Twitter className="h-4 w-4" />}
                      {platform === 'github' && <Github className="h-4 w-4" />}
                      {platform === 'linkedin' && <Linkedin className="h-4 w-4" />}
                      {platform === 'youtube' && <Youtube className="h-4 w-4" />}
                      {platform === 'email' && <Mail className="h-4 w-4" />}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {/* Show message if no sections configured */}
          {(!footerSettings.sections || footerSettings.sections.length === 0) && (
            <div className="lg:col-span-3 space-y-6">
              <div className="text-center p-8 border-2 border-dashed border-primary/20 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>No footer sections configured.</strong><br />
                  Go to Admin Dashboard → Footer Management to add links to pages, categories, tool types, blog posts, and products.
                </p>
              </div>
            </div>
          )}
          
          {/* Dynamic Footer Sections */}
          {footerSettings.sections?.map((section, index) => (
            <div key={index} className="space-y-6">
              <h4 className="font-semibold text-lg">{section.title}</h4>
              <ul className="space-y-3">
                {section.links?.map((link, linkIndex) => {
                  // Determine if link is external based on URL pattern
                  const isExternal = (link.url as string).startsWith('http') || (link.url as string).startsWith('https') || (link.url as string).startsWith('mailto');
                  
                  return (
                    <li key={linkIndex}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors group flex items-center gap-2"
                      >
                        {link.text}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          
          {/* Browse/Resources - Always show as fallback */}
          {(!footerSettings.sections || footerSettings.sections.length < 2) && (
            <div className="space-y-6">
              <h4 className="font-semibold text-lg">Browse</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/browse" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors group flex items-center gap-2">
                    All Tools
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="/blog" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors group flex items-center gap-2">
                    Blog
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                {companyPages.slice(0, 2).map((page) => (
                  <li key={page.id}>
                    <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors group flex items-center gap-2">
                      {page.title}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-border/40 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © {currentYear} {footerSettings.companyName}. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Made with ❤️ for the AI community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;